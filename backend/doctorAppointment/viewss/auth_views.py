from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User, LoginInfo, Log
from ..serializers import UserSerializer, RegisterSerializer

class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            # Get client info for login tracking
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Log registration as login info (synchronously)
            try:
                LoginInfo.objects.create(
                    user=user,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    login_type='registration'
                )
                Log.objects.create(
                    level='INFO',
                    message=f'User {user.username} registration logged at {ip_address}',
                    user=user
                )
            except Exception as e:
                Log.objects.create(
                    level='ERROR',
                    message=f'Failed to log registration info for user {user.id}: {e}'
                )
            
            # Determine display name based on role/profile if available
            display_name = user.username
            try:
                if hasattr(user, 'doctor_profile') and user.doctor_profile and user.doctor_profile.name:
                    display_name = user.doctor_profile.name
                elif hasattr(user, 'patient_profile') and user.patient_profile and user.patient_profile.name:
                    display_name = user.patient_profile.name
                elif user.get_full_name():
                    display_name = user.get_full_name()
            except Exception:
                pass

            return Response({
                'access_token': str(refresh.access_token),
                'role': user.role,
                'name': display_name
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Extract client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            
            # Get client info for login tracking
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Log login info (synchronously)
            try:
                LoginInfo.objects.create(
                    user=user,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    login_type='login'
                )
                Log.objects.create(
                    level='INFO',
                    message=f'User {user.username} login logged at {ip_address}',
                    user=user
                )
            except Exception as e:
                Log.objects.create(
                    level='ERROR',
                    message=f'Failed to log login info for user {user.id}: {e}'
                )

            # Determine display name based on role/profile if available
            display_name = user.username
            try:
                if hasattr(user, 'doctor_profile') and user.doctor_profile and user.doctor_profile.name:
                    display_name = user.doctor_profile.name
                elif hasattr(user, 'patient_profile') and user.patient_profile and user.patient_profile.name:
                    display_name = user.patient_profile.name
                elif user.get_full_name():
                    display_name = user.get_full_name()
            except Exception:
                pass

            return Response({
                'access_token': str(refresh.access_token),
                'role': user.role,
                'name': display_name
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    def get_client_ip(self, request):
        """Extract client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
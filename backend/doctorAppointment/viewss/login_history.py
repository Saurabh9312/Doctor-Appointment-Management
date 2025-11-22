from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import LoginInfo, User
from django.shortcuts import get_object_or_404

class LoginHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Admin can view all login history, users can view their own
        if request.user.role == 'admin':
            user_id = request.query_params.get('user_id')
            if user_id:
                user = get_object_or_404(User, id=user_id)
                login_history = LoginInfo.objects.filter(user=user)
            else:
                login_history = LoginInfo.objects.all()
        else:
            login_history = LoginInfo.objects.filter(user=request.user)
        
        data = [{
            'id': info.id,
            'username': info.user.username,
            'login_type': info.login_type,
            'login_time': info.login_time,
            'ip_address': info.ip_address,
            'user_agent': info.user_agent
        } for info in login_history]
        
        return Response(data, status=status.HTTP_200_OK)

class UserLoginStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Admin only view for login statistics
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
        total_logins = LoginInfo.objects.filter(login_type='login').count()
        total_registrations = LoginInfo.objects.filter(login_type='registration').count()
        unique_users = LoginInfo.objects.values('user').distinct().count()
        
        return Response({
            'total_logins': total_logins,
            'total_registrations': total_registrations,
            'unique_users': unique_users
        }, status=status.HTTP_200_OK)

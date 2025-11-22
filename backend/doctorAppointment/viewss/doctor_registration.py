from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import Doctor
from ..serializers import DoctorSerializer
from ..tasks import send_welcome_email_and_log_registration

class DoctorCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only users with doctor role can create doctor profile'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if hasattr(request.user, 'doctor_profile'):
            return Response({'error': 'Doctor profile already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        doctor = Doctor.objects.create(
            user=request.user,
            name=request.data.get('name', ''),
            specialization=request.data.get('specialization', '')
        )
        send_welcome_email_and_log_registration.delay(request.user.id)
        return Response({'message': 'Doctor profile created'}, status=status.HTTP_201_CREATED)

class DoctorListView(APIView):
    def get(self, request):
        doctors = Doctor.objects.select_related('user').all()
        data = [{
            'id': doctor.id,
            'name': doctor.name,
            'specialization': doctor.specialization
        } for doctor in doctors]
        return Response(data)

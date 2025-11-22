from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import Patient
from ..serializers import PatientSerializer
from ..tasks import send_welcome_email_and_log_registration

class PatientCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only users with patient role can create patient profile'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if hasattr(request.user, 'patient_profile'):
            return Response({'error': 'Patient profile already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        patient = Patient.objects.create(
            user=request.user,
            name=request.data.get('name', ''),
            phone_number=request.data.get('phone_number', '')
        )
        send_welcome_email_and_log_registration.delay(request.user.id)
        return Response({'message': 'Patient profile created'}, status=status.HTTP_201_CREATED)

class PatientListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        patients = Patient.objects.select_related('user').all()
        data = [{
            'id': patient.id,
            'name': patient.name,
            'phone_number': patient.phone_number
        } for patient in patients]
        return Response(data)

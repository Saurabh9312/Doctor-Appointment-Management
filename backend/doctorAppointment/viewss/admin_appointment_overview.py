from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import Appointment

class AdminAppointmentOverviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can view appointment overview'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        appointments = Appointment.objects.all().select_related('patient__user', 'doctor__user')
        data = [{
            'id': appointment.id,
            'patient': appointment.patient.name,
            'doctor': appointment.doctor.name,
            'date': appointment.appointment_date,
            'time': f"{appointment.start_time}-{appointment.end_time}",
            'status': appointment.status
        } for appointment in appointments]
        
        return Response(data)
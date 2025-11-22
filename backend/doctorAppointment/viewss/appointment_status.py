from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import Appointment

class UpdateAppointmentStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, appointment_id):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can update appointment status'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            doctor = request.user.doctor_profile
            appointment = Appointment.objects.get(id=appointment_id, doctor=doctor)
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found or not authorized'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get('status')
        if new_status not in ['Booked', 'Visited']:
            return Response({'error': 'Invalid status. Must be "Booked" or "Visited"'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = new_status
        appointment.save()
        
        return Response({'message': 'Status updated'})

class DoctorAppointmentStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can view their appointments'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            doctor = request.user.doctor_profile
            appointments = Appointment.objects.filter(doctor=doctor).select_related('patient__user')
            data = [{
                'id': appointment.id,
                'patient': appointment.patient.name,
                'date': appointment.appointment_date,
                'time': f"{appointment.start_time}-{appointment.end_time}",
                'status': appointment.status
            } for appointment in appointments]
            return Response(data)
        except:
            return Response({'error': 'Doctor profile not found'}, 
                          status=status.HTTP_400_BAD_REQUEST)
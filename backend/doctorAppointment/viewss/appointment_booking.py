from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import Appointment, Patient, AppointmentSlot
from ..serializers import AppointmentSerializer

class AppointmentBookView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can book appointments'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            patient = request.user.patient_profile
        except Patient.DoesNotExist:
            return Response({'error': 'Patient profile not found. Please create patient profile first using /patient/create/ endpoint'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        slot_id = request.data.get('slot_id')
        try:
            slot = AppointmentSlot.objects.get(id=slot_id, is_booked=False)
        except AppointmentSlot.DoesNotExist:
            return Response({'error': 'Slot not available'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        Appointment.objects.create(
            patient=patient,
            doctor=slot.doctor,
            slot=slot,
            appointment_date=slot.date,
            start_time=slot.start_time,
            end_time=slot.end_time
        )
        slot.is_booked = True
        slot.save()
        return Response({'message': 'Appointment booked'}, status=status.HTTP_201_CREATED)

class PatientAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can view their appointments'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            patient = request.user.patient_profile
            appointments = Appointment.objects.filter(patient=patient).select_related('doctor__user')
            data = [{
                'id': appointment.id,
                'doctor_name': appointment.doctor.name,
                'date': appointment.appointment_date,
                'time': f"{appointment.start_time}-{appointment.end_time}",
                'status': appointment.status
            } for appointment in appointments]
            return Response(data)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient profile not found'}, 
                          status=status.HTTP_400_BAD_REQUEST)

class DoctorAppointmentsView(APIView):
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
                'patient_name': appointment.patient.name,
                'date': appointment.appointment_date,
                'time': f"{appointment.start_time}-{appointment.end_time}",
                'status': appointment.status
            } for appointment in appointments]
            return Response(data)
        except:
            return Response({'error': 'Doctor profile not found'}, 
                          status=status.HTTP_400_BAD_REQUEST)


class CancelAppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, appointment_id):
        # Only patients can cancel their own appointments if not visited
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can cancel appointments'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            patient = request.user.patient_profile
        except Patient.DoesNotExist:
            return Response({'error': 'Patient profile not found'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            appointment = Appointment.objects.select_related('slot').get(id=appointment_id, patient=patient)
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

        # Only allow cancellation if not visited (status must be 'Booked')
        if appointment.status != 'Booked':
            return Response({'error': 'Only non-visited (Booked) appointments can be canceled'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Free the slot and delete the appointment (since no Canceled status is defined)
        slot = appointment.slot
        appointment.delete()
        slot.is_booked = False
        slot.save()

        return Response({'message': 'Appointment canceled'}, status=status.HTTP_200_OK)
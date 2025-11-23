from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from ..models import AppointmentSlot, Doctor
from ..serializers import AppointmentSlotSerializer


class SlotCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can create slots'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            doctor = request.user.doctor_profile
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor profile not found'},
                            status=status.HTTP_400_BAD_REQUEST)

        AppointmentSlot.objects.create(
            doctor=doctor,
            date=request.data.get('date'),
            start_time=request.data.get('start_time'),
            end_time=request.data.get('end_time')
        )
        return Response({'message': 'Slot created'}, status=status.HTTP_201_CREATED)


class SlotListView(APIView):
    def get(self, request):
        slots = AppointmentSlot.objects.filter(is_booked=False).select_related('doctor__user')
        data = [{
            'id': slot.id,
            'doctor_name': slot.doctor.name,
            'specialization': slot.doctor.specialization,
            'date': slot.date,
            'start_time': slot.start_time,
            'end_time': slot.end_time
        } for slot in slots]
        return Response(data)


class DoctorSlotsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can view their slots'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            doctor = request.user.doctor_profile
            slots = AppointmentSlot.objects.filter(doctor=doctor)
            data = [{
                'id': slot.id,
                'date': slot.date,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'is_booked': slot.is_booked
            } for slot in slots]
            return Response(data)
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor profile not found'},
                            status=status.HTTP_400_BAD_REQUEST)


class SlotDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, slot_id):
        """Allow a doctor to delete their own unbooked slot."""
        if request.user.role != 'doctor':
            return Response({'error': 'Only doctors can delete slots'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            doctor = request.user.doctor_profile
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor profile not found'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            slot = AppointmentSlot.objects.get(id=slot_id, doctor=doctor)
        except AppointmentSlot.DoesNotExist:
            return Response({'error': 'Slot not found'}, status=status.HTTP_404_NOT_FOUND)

        if slot.is_booked:
            return Response({'error': 'Cannot delete a booked slot'},
                            status=status.HTTP_400_BAD_REQUEST)

        slot.delete()
        return Response({'message': 'Slot deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

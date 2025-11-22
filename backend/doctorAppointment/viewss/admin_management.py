from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from ..models import User, Doctor, Patient
from ..serializers import DoctorSerializer, PatientSerializer

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin')

class AdminDoctorListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        doctors = Doctor.objects.select_related('user').all()
        data = DoctorSerializer(doctors, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        # Create a doctor profile for an existing user with role 'doctor'
        user_id = request.data.get('user_id')
        name = request.data.get('name', '')
        specialization = request.data.get('specialization', '')

        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = get_object_or_404(User, id=user_id)
        if user.role != 'doctor':
            return Response({'error': 'Selected user is not a doctor'}, status=status.HTTP_400_BAD_REQUEST)
        if hasattr(user, 'doctor_profile'):
            return Response({'error': 'Doctor profile already exists for this user'}, status=status.HTTP_400_BAD_REQUEST)

        doctor = Doctor.objects.create(user=user, name=name, specialization=specialization)
        return Response(DoctorSerializer(doctor).data, status=status.HTTP_201_CREATED)

class AdminDoctorDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def patch(self, request, doctor_id: int):
        doctor = get_object_or_404(Doctor, id=doctor_id)
        name = request.data.get('name')
        specialization = request.data.get('specialization')
        if name is not None:
            doctor.name = name
        if specialization is not None:
            doctor.specialization = specialization
        doctor.save()
        return Response(DoctorSerializer(doctor).data, status=status.HTTP_200_OK)

    def delete(self, request, doctor_id: int):
        doctor = get_object_or_404(Doctor, id=doctor_id)
        doctor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminPatientListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        patients = Patient.objects.select_related('user').all()
        data = PatientSerializer(patients, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        # Create a patient profile for an existing user with role 'patient'
        user_id = request.data.get('user_id')
        name = request.data.get('name', '')
        phone_number = request.data.get('phone_number', '')

        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = get_object_or_404(User, id=user_id)
        if user.role != 'patient':
            return Response({'error': 'Selected user is not a patient'}, status=status.HTTP_400_BAD_REQUEST)
        if hasattr(user, 'patient_profile'):
            return Response({'error': 'Patient profile already exists for this user'}, status=status.HTTP_400_BAD_REQUEST)

        patient = Patient.objects.create(user=user, name=name, phone_number=phone_number)
        return Response(PatientSerializer(patient).data, status=status.HTTP_201_CREATED)

class AdminPatientDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def patch(self, request, patient_id: int):
        patient = get_object_or_404(Patient, id=patient_id)
        name = request.data.get('name')
        phone_number = request.data.get('phone_number')
        if name is not None:
            patient.name = name
        if phone_number is not None:
            patient.phone_number = phone_number
        patient.save()
        return Response(PatientSerializer(patient).data, status=status.HTTP_200_OK)

    def delete(self, request, patient_id: int):
        patient = get_object_or_404(Patient, id=patient_id)
        patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

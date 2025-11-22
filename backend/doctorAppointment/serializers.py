from rest_framework import serializers
from .models import User, Doctor, Patient, AppointmentSlot, Appointment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'username', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'username', 'email', 'password', 'password_confirm', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'name', 'specialization']

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'user', 'name', 'phone_number']

class AppointmentSlotSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), write_only=True, source='doctor')

    class Meta:
        model = AppointmentSlot
        fields = ['id', 'doctor', 'doctor_id', 'date', 'start_time', 'end_time', 'is_booked']

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all(), write_only=True, source='patient')
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), write_only=True, source='doctor')
    slot = AppointmentSlotSerializer(read_only=True)
    slot_id = serializers.PrimaryKeyRelatedField(queryset=AppointmentSlot.objects.filter(is_booked=False), write_only=True, source='slot')

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'patient_id', 'doctor', 'doctor_id', 'slot', 'slot_id', 'status', 'appointment_date', 'start_time', 'end_time']

    def create(self, validated_data):
        appointment = super().create(validated_data)
        # Mark the slot as booked is already handled in model save
        return appointment

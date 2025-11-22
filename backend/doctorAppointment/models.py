from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')

    def __str__(self):
        return self.username
    
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    name = models.CharField(max_length=100, default = 'Anonymous')
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name} - {self.specialization}'

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    name = models.CharField(max_length=100, default = 'Anonymous')
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return self.name

class AppointmentSlot(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f'Slot on {self.date} from {self.start_time} to {self.end_time} for Dr. {self.doctor.name}'

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Booked', 'Booked'),
        ('Visited', 'Visited'),
    ]
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    slot = models.OneToOneField(AppointmentSlot, on_delete=models.CASCADE, related_name='appointment')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Booked')
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    def save(self, *args, **kwargs):
        # Mark slot as booked when appointment is saved
        if not self.pk:
            self.slot.is_booked = True
            self.slot.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Appointment {self.id} for {self.patient.name} with Dr. {self.doctor.name} on {self.appointment_date}'

class Log(models.Model):
    LEVEL_CHOICES = [
        ('INFO', 'Info'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
    ]
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default='INFO')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f'{self.level}: {self.message[:50]}...'

class LoginInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    login_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    login_type = models.CharField(max_length=20, choices=[('registration', 'Registration'), ('login', 'Login')], default='login')

    class Meta:
        ordering = ['-login_time']
        verbose_name_plural = 'Login Information'

    def __str__(self):
        return f'{self.user.username} - {self.login_type} at {self.login_time}'

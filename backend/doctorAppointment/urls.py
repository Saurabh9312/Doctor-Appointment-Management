from django.urls import path, include
from .viewss.auth_views import RegisterAPIView, LoginAPIView
from .viewss.doctor_registration import DoctorCreateView, DoctorListView
from .viewss.patient_registration import PatientCreateView, PatientListView
from .viewss.slot_management import SlotCreateView, SlotListView, DoctorSlotsView
from .viewss.appointment_booking import AppointmentBookView, PatientAppointmentsView, DoctorAppointmentsView
from .viewss.admin_appointment_overview import AdminAppointmentOverviewView
from .viewss.appointment_status import UpdateAppointmentStatusView, DoctorAppointmentStatusView
from .viewss.admin_management import (
    AdminDoctorListCreateView,
    AdminDoctorDetailView,
    AdminPatientListCreateView,
    AdminPatientDetailView,
)
from .viewss.login_history import LoginHistoryView, UserLoginStatsView
from .chatbot import ChatbotAPIView

urlpatterns = [
    # Auth
    path('signup/', RegisterAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(), name='login'),
    
    # Doctor
    path('doctor/create/', DoctorCreateView.as_view(), name='doctor-create'),
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    
    # Patient
    path('patient/create/', PatientCreateView.as_view(), name='patient-create'),
    path('patients/', PatientListView.as_view(), name='patient-list'),
    
    # Slots
    path('slots/create/', SlotCreateView.as_view(), name='slot-create'),
    path('slots/', SlotListView.as_view(), name='slot-list'),
    path('doctor/slots/', DoctorSlotsView.as_view(), name='doctor-slots'),
    
    # Appointments
    path('appointments/book/', AppointmentBookView.as_view(), name='appointment-book'),
    path('patient/appointments/', PatientAppointmentsView.as_view(), name='patient-appointments'),
    path('doctor/appointments/', DoctorAppointmentsView.as_view(), name='doctor-appointments'),
    
    # Admin
    path('admin/appointments/', AdminAppointmentOverviewView.as_view(), name='admin-appointments'),
    path('admin/doctors/', AdminDoctorListCreateView.as_view(), name='admin-doctor-list-create'),
    path('admin/doctors/<int:doctor_id>/', AdminDoctorDetailView.as_view(), name='admin-doctor-detail'),
    path('admin/patients/', AdminPatientListCreateView.as_view(), name='admin-patient-list-create'),
    path('admin/patients/<int:patient_id>/', AdminPatientDetailView.as_view(), name='admin-patient-detail'),
    
    # Appointment Status
    path('appointments/<int:appointment_id>/status/', UpdateAppointmentStatusView.as_view(), name='update-appointment-status'),
    path('doctor/appointments/status/', DoctorAppointmentStatusView.as_view(), name='doctor-appointment-status'),

    # Chatbot
    path('bot/chat/', ChatbotAPIView.as_view(), name='bot-chat'),
    
    # Login History
    path('login-history/', LoginHistoryView.as_view(), name='login-history'),
    path('login-stats/', UserLoginStatsView.as_view(), name='login-stats'),
]

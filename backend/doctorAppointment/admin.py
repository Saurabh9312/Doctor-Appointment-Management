from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .models import Doctor, Patient, Appointment, AppointmentSlot, LoginInfo

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'is_staff']
    list_filter = ['role', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )

admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Appointment)
admin.site.register(AppointmentSlot)

@admin.register(LoginInfo)
class LoginInfoAdmin(admin.ModelAdmin):
    list_display = ['user', 'login_type', 'login_time', 'ip_address']
    list_filter = ['login_type', 'login_time']
    search_fields = ['user__username', 'ip_address']
    readonly_fields = ['user', 'login_time', 'ip_address', 'user_agent', 'login_type']

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Log, User, LoginInfo

@shared_task
def send_welcome_email_and_log_registration(user_id):
    """
    Sends a welcome email to the user and logs the registration event.
    """
    try:
        user = User.objects.get(id=user_id)
        subject = 'Welcome to Our Doctor Appointment Platform'
        message = f'Hi {user.username},\n\nThank you for registering on our platform.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [user.email]
        send_mail(subject, message, from_email, recipient_list)
        Log.objects.create(
            level='INFO',
            message=f'User {user.username} registered successfully and welcome email sent.',
            user=user
        )
    except User.DoesNotExist:
        Log.objects.create(
            level='ERROR',
            message=f'User with id {user_id} does not exist.'
        )
    except Exception as e:
        Log.objects.create(
            level='ERROR',
            message=f'Failed to send welcome email to user with id {user_id}: {e}'
        )

@shared_task
def log_login_info(user_id, ip_address=None, user_agent=None, login_type='login'):
    """
    Logs user login information to the database.
    """
    try:
        user = User.objects.get(id=user_id)
        LoginInfo.objects.create(
            user=user,
            ip_address=ip_address,
            user_agent=user_agent,
            login_type=login_type
        )
        Log.objects.create(
            level='INFO',
            message=f'User {user.username} {login_type} logged at {ip_address}',
            user=user
        )
    except User.DoesNotExist:
        Log.objects.create(
            level='ERROR',
            message=f'User with id {user_id} does not exist for login logging.'
        )
    except Exception as e:
        Log.objects.create(
            level='ERROR',
            message=f'Failed to log login info for user {user_id}: {e}'
        )

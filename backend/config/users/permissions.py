from django.conf import settings


def is_platform_admin(user):
    return bool(
        user
        and user.is_authenticated
        and user.email.lower() == settings.PLATFORM_ADMIN_EMAIL.lower()
    )

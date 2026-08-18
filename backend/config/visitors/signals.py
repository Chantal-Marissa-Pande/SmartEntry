from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Visitor
from users.models import User
from notifications.services import (
    create_notification
)

@receiver(post_save, sender=Visitor)
def visitor_created(sender, instance, created, raw=False, **kwargs):
    if not created or raw:
        return
    recipients = User.objects.filter(
        organization=instance.organization,
        role__in=[
            User.Role.ADMIN,
            User.Role.RECEPTION
        ]
    )
    for user in recipients:
        settings = getattr(user, "settings", None)
        if settings and not settings.visitor_notifications:
            continue
        create_notification(
            user=user,
            title="Visitor Registered",
            message=(
                f"{instance.name} "
                f"has been registered."
            ),
            notification_type="success",
            source="visitor",
            related_type="visitor",
            related_id=instance.id
        )

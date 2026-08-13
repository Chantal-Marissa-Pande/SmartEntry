from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Visitor
from users.models import User
from notifications.services import (
    create_notification
)

@receiver(post_save, sender=Visitor)
def visitor_created(sender, instance, created, **kwargs):
    if not created:
        return
    recipients = User.objects.filter(
        role__in=[
            User.Role.ADMIN,
            User.Role.RECEPTION
        ]
    )
    for user in recipients:
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
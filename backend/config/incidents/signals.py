from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Incident
from users.models import User
from notifications.services import (
    create_notification
)
from notifications.intelligence import (
    check_visitor_incident_relationship,
    detect_patterns
)

@receiver(post_save, sender=Incident)
def incident_created(sender, instance, created, **kwargs):
    if not created:
        return
    recipients = User.objects.filter(
        role__in=[
            User.Role.ADMIN,
            User.Role.SECURITY
        ]
    )
    for user in recipients:
        create_notification(
            user=user,
            title="Security Alert",
            message=(
                f"{instance.priority} priority "
                f"incident reported at "
                f"{instance.location}"
            ),
            notification_type="danger",
            source="incident",
            related_type="incident",
            related_id=instance.id
        )
    check_visitor_incident_relationship(
        instance
    )
    detect_patterns(instance)
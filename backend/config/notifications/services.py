from .models import Notification

def create_notification(
    user,
    title,
    message,
    notification_type="info",
    source="system",
    related_type=None,
    related_id=None
):
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        source=source,
        related_type=related_type,
        related_id=related_id
    )
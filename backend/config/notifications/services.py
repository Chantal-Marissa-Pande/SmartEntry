from .models import IntelligenceAlert, Notification

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


def create_intelligence_alert(
    title,
    description,
    alert_type="security",
    severity="Medium",
    source_organization=None,
    related_incident=None,
    related_visitor=None,
):
    return IntelligenceAlert.objects.create(
        title=title,
        description=description,
        alert_type=alert_type,
        severity=severity,
        source_organization=source_organization,
        related_incident=related_incident,
        related_visitor=related_visitor,
    )


def notify_users_about_intelligence(alert, users):
    notification_type = (
        "danger" if alert.severity in ("High", "Critical") else "warning"
    )
    for user in users:
        create_notification(
            user=user,
            title=alert.title,
            message=alert.description,
            notification_type=notification_type,
            source="intelligence",
            related_type="intelligence",
            related_id=alert.id,
        )

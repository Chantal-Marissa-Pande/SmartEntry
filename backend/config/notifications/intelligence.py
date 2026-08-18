from datetime import datetime, timedelta
from django.utils import timezone
from visitors.models import Visitor
from incidents.models import Incident
from .services import create_intelligence_alert, notify_users_about_intelligence
from users.models import User

def check_visitor_incident_relationship(incident):
    try:
        incident_datetime = timezone.make_aware(datetime.combine(
            incident.date,
            incident.time
        ), timezone.get_current_timezone())
        window_start = incident_datetime - timedelta(minutes=30)
        visitors = Visitor.objects.filter(
            expected_time__gte=window_start,
            expected_time__lte=incident_datetime,
            status__in=["Checked In", "Checked Out"],
        )

        for visitor in visitors:
            if not hasattr(visitor, "location"):
                continue
            if visitor.location.lower() != incident.location.lower():
                continue
            recipients = User.objects.filter(
                role__in=[User.Role.ADMIN, User.Role.SECURITY],
                is_active=True,
            )
            recipients = [
                user for user in recipients
                if not getattr(user, "settings", None)
                or user.settings.incident_notifications
            ]
            description = (
                f"{visitor.name} was scheduled at {incident.location} within "
                f"30 minutes of a {incident.priority.lower()} priority "
                f"{incident.incident_type.lower()} incident."
            )
            alert = create_intelligence_alert(
                title="Visitor and Incident Correlation",
                description=description,
                alert_type="visitor",
                severity=incident.priority,
                source_organization=incident.organization,
                related_incident=incident,
                related_visitor=visitor,
            )
            notify_users_about_intelligence(alert, recipients)
    except (TypeError, ValueError):
        return

def detect_patterns(incident):
    window_start = timezone.localdate() - timedelta(days=30)
    similar = Incident.objects.filter(
        location__iexact=incident.location,
        date__gte=window_start,
    )
    if similar.count() < 3:
        return
    recipients = User.objects.filter(
        role__in=[User.Role.ADMIN, User.Role.SECURITY],
        is_active=True,
    )
    recipients = [
        user for user in recipients
        if not getattr(user, "settings", None)
        or user.settings.incident_notifications
    ]
    description = (
        f"{similar.count()} incidents have been reported at "
        f"{incident.location} in the last 30 days."
    )
    alert = create_intelligence_alert(
        title="Recurring Incident Pattern",
        description=description,
        alert_type="trend",
        severity="High" if similar.count() >= 5 else "Medium",
        source_organization=incident.organization,
        related_incident=incident,
    )
    notify_users_about_intelligence(alert, recipients)

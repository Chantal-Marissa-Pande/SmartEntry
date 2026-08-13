from datetime import datetime, timedelta
from visitors.models import Visitor
from incidents.models import Incident
from .services import create_notification
from users.models import User

def check_visitor_incident_relationship(incident):
    try:
        incident_datetime = datetime.combine(
            incident.date,
            incident.time
        )
        window_start = incident_datetime - timedelta(minutes=30)
        visitors = Visitor.objects.filter(
            created_at__gte=window_start,
            created_at__lte=incident_datetime
        )

        for visitor in visitors:
            if not hasattr(visitor, "location"):
                continue
            if visitor.location.lower() != incident.location.lower():
                continue
            admins = User.objects.filter(
                role=User.Role.ADMIN
            )
            for admin in admins:
                create_notification(
                    user=admin,
                    title="Shared Intelligence Alert",
                    message=(
                        f"{visitor.name} checked in before "
                        f"a {incident.priority.lower()} priority "
                        f"incident at {incident.location}."
                    ),
                    notification_type="warning",
                    source="intelligence"
                )
    except Exception:
        pass

def detect_patterns(incident):
    similar = Incident.objects.filter(
        location=incident.location
    )
    if similar.count() < 3:
        return
    admins = User.objects.filter(
        role=User.Role.ADMIN
    )
    for admin in admins:
        create_notification(
            user=admin,
            title="Recurring Pattern Detected",
            message=(
                f"{similar.count()} incidents have been "
                f"reported at {incident.location}."
            ),
            notification_type="warning",
            source="intelligence"
        )
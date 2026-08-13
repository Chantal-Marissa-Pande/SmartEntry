from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User
from incidents.models import Incident
from visitors.models import Visitor
from .serializers import UserAdminSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):

    # =========================================
    # ADMIN ACCESS CHECK
    # =========================================
    if request.user.role != User.Role.ADMIN:
        return Response(
            {
                "detail": "You do not have permission to access the admin dashboard."
            },
            status=403,
        )

    # =========================================
    # USER STATISTICS
    # =========================================
    total_users = User.objects.count()
    active_users = User.objects.filter(
        is_active=True
    ).count()
    inactive_users = User.objects.filter(
        is_active=False
    ).count()
    users_by_role = {
        "admin": User.objects.filter(
            role=User.Role.ADMIN
        ).count(),
        "security": User.objects.filter(
            role=User.Role.SECURITY
        ).count(),
        "reception": User.objects.filter(
            role=User.Role.RECEPTION
        ).count(),
        "manager": User.objects.filter(
            role=User.Role.MANAGER
        ).count(),
    }

    # =========================================
    # VISITOR STATISTICS
    # =========================================
    total_visitors = Visitor.objects.count()
    checked_in_visitors = Visitor.objects.filter(
        status="Checked In"
    ).count()
    checked_out_visitors = Visitor.objects.filter(
        status="Checked Out"
    ).count()

    # =========================================
    # INCIDENT STATISTICS
    # =========================================
    total_incidents = Incident.objects.count()
    open_incidents = Incident.objects.filter(
        status="Open"
    ).count()
    investigating_incidents = Incident.objects.filter(
        status="Investigating"
    ).count()
    resolved_incidents = Incident.objects.filter(
        status="Resolved"
    ).count()
    critical_incidents = Incident.objects.filter(
        priority="Critical"
    ).count()
    high_priority_incidents = Incident.objects.filter(
        priority="High"
    ).count()

    # =========================================
    # RECENT USERS
    # =========================================
    recent_users_queryset = User.objects.order_by(
        "-date_joined"
    )[:10]
    recent_users = []
    for user in recent_users_queryset:
        recent_users.append(
            {
                "id": user.id,
                "name": f"{user.first_name} {user.last_name}".strip(),
                "email": user.email,
                "role": user.get_role_display(),
                "is_active": user.is_active,
                "date_joined": user.date_joined,
            }
        )

    # =========================================
    # RECENT INCIDENTS
    # =========================================
    recent_incidents_queryset = Incident.objects.select_related(
        "reported_by"
    ).order_by(
        "-created_at"
    )[:10]
    recent_incidents = []
    for incident in recent_incidents_queryset:
        reported_by = None
        if incident.reported_by:
            reported_by = (
                f"{incident.reported_by.first_name} "
                f"{incident.reported_by.last_name}"
            ).strip()
        recent_incidents.append(
            {
                "id": incident.id,
                "incident_type": incident.incident_type,
                "location": incident.location,
                "priority": incident.priority,
                "status": incident.status,
                "reported_by": reported_by,
                "created_at": incident.created_at,
            }
        )

    # =========================================
    # RESPONSE
    # =========================================
    return Response(
        {
            "users": {
                "total": total_users,
                "active": active_users,
                "inactive": inactive_users,
                "by_role": users_by_role,
            },
            "visitors": {
                "total": total_visitors,
                "checked_in": checked_in_visitors,
                "checked_out": checked_out_visitors,
            },
            "incidents": {
                "total": total_incidents,
                "open": open_incidents,
                "investigating": investigating_incidents,
                "resolved": resolved_incidents,
                "critical": critical_incidents,
                "high_priority": high_priority_incidents,
            },
            "recent_users": recent_users,
            "recent_incidents": recent_incidents,
        }
    )

def user_list(request):
    users = User.objects.all().order_by("date_joined")
    serializer = UserAdminSerializer(
        users,
        many=True
    )
    return Response(serializer.data)
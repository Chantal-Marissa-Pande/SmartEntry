from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User
from incidents.models import Incident
from visitors.models import Visitor
from .serializers import UserAdminSerializer
from .tenancy import organization_queryset
from .permissions import is_platform_admin

# ============================================================
# ADMIN DASHBOARD
# ============================================================
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

    users = User.objects.all() if is_platform_admin(request.user) else User.objects.filter(organization=request.user.organization)
    visitors = organization_queryset(Visitor.objects.all(), request.user)
    incidents = organization_queryset(Incident.objects.all(), request.user)

    # =========================================
    # USER STATISTICS
    # =========================================
    total_users = users.count()
    active_users = users.filter(
        is_active=True
    ).count()
    inactive_users = users.filter(
        is_active=False
    ).count()
    users_by_role = {
        "admin": users.filter(
            role=User.Role.ADMIN
        ).count(),
        "security": users.filter(
            role=User.Role.SECURITY
        ).count(),
        "reception": users.filter(
            role=User.Role.RECEPTION
        ).count(),
        "manager": users.filter(
            role=User.Role.MANAGER
        ).count(),
    }

    # =========================================
    # VISITOR STATISTICS
    # =========================================
    total_visitors = visitors.count()
    checked_in_visitors = visitors.filter(
        status="Checked In"
    ).count()
    checked_out_visitors = visitors.filter(
        status="Checked Out"
    ).count()

    # =========================================
    # INCIDENT STATISTICS
    # =========================================
    total_incidents = incidents.count()
    open_incidents = incidents.filter(
        status="Open"
    ).count()
    investigating_incidents = incidents.filter(
        status="Investigating"
    ).count()
    resolved_incidents = incidents.filter(
        status="Resolved"
    ).count()
    critical_incidents = incidents.filter(
        priority="Critical"
    ).count()
    high_priority_incidents = incidents.filter(
        priority="High"
    ).count()

    # =========================================
    # RECENT USERS
    # =========================================
    recent_users_queryset = users.order_by(
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
    recent_incidents_queryset = (
        incidents
        .select_related("reported_by")
        .order_by("-created_at")[:10]
    )
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

# ============================================================
# USER MANAGEMENT
# ============================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_list(request):

    # =========================================
    # ADMIN ACCESS CHECK
    # =========================================
    if request.user.role != User.Role.ADMIN:
        return Response(
            {
                "detail": "You do not have permission to access user management."
            },
            status=403,
        )

    # =========================================
    # GET ALL USERS
    # =========================================
    users = User.objects.all().order_by("date_joined")

    # =========================================
    # SERIALIZE USERS
    # =========================================
    serializer = UserAdminSerializer(
        users,
        many=True
    )

    # =========================================
    # RESPONSE
    # =========================================
    return Response(
        {
            "users": serializer.data,
            "count": users.count(),
        }
    )

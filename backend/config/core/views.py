from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from incidents.models import Incident
from visitors.models import Visitor
from users.tenancy import organization_queryset


User = get_user_model()


class HealthView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"status": "ok"})


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        visitors = organization_queryset(Visitor.objects.all(), request.user)
        incidents = organization_queryset(Incident.objects.all(), request.user)

        # -----------------------------
        # Visitor statistics
        # -----------------------------

        total_visitors = visitors.count()

        expected_today = visitors.filter(
            expected_time__date=today,
            status="Expected"
        ).count()

        checked_in = visitors.filter(
            status="Checked In"
        ).count()

        checked_out = visitors.filter(
            status="Checked Out"
        ).count()

        # -----------------------------
        # Users
        # -----------------------------

        users = User.objects.all() if request.user.is_superuser else User.objects.filter(organization=request.user.organization)
        total_users = users.count()

        # -----------------------------
        # Recent visitors
        # -----------------------------

        recent_visitors = visitors.order_by(
            "-created_at"
        )[:5]

        visitors_data = []

        for visitor in recent_visitors:
            visitors_data.append({
                "id": visitor.id,
                "name": visitor.name,
                "company": visitor.company,
                "purpose": visitor.purpose,
                "status": visitor.status,
                "expected_time": visitor.expected_time,
            })

        # -----------------------------
        # Recent incidents
        # -----------------------------

        recent_incidents = incidents.order_by(
            "-created_at"
        )[:5]

        incidents_data = []

        for incident in recent_incidents:
            incidents_data.append({
                "id": incident.id,
                "incident_type": incident.incident_type,
                "location": incident.location,
                "priority": incident.priority,
                "status": incident.status,
                "date": incident.date,
            })

        # -----------------------------
        # Dashboard response
        # -----------------------------

        return Response({
            "statistics": {
                "total_visitors": total_visitors,
                "expected_today": expected_today,
                "checked_in": checked_in,
                "checked_out": checked_out,
                "total_users": total_users,
            },

            "recent_visitors": visitors_data,

            "incidents": incidents_data
        })

from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from visitors.models import Visitor
from incidents.models import Incident
from users.tenancy import organization_queryset

class ReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        visitors = organization_queryset(Visitor.objects.all(), request.user)
        incidents = organization_queryset(Incident.objects.all(), request.user)

        # ==============================
        # VISITOR STATISTICS
        # ==============================
        total_visitors = visitors.count()
        checked_in_visitors = visitors.filter(
            status="Checked In"
        ).count()
        checked_out_visitors = visitors.filter(
            status="Checked Out"
        ).count()

        visitor_types = (
            visitors
            .values("visitor_type")
            .annotate(count=Count("id"))
            .order_by("visitor_type")
        )

        # ==============================
        # INCIDENT STATISTICS
        # ==============================
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
        closed_incidents = incidents.filter(
            status="Closed"
        ).count()

        incidents_by_priority = (
            incidents
            .values("priority")
            .annotate(count=Count("id"))
            .order_by("priority")
        )

        incidents_by_status = (
            incidents
            .values("status")
            .annotate(count=Count("id"))
            .order_by("status")
        )

        return Response({
            "visitors": {
                "total": total_visitors,
                "checked_in": checked_in_visitors,
                "checked_out": checked_out_visitors,
                "by_type": list(visitor_types),
            },

            "incidents": {
                "total": total_incidents,
                "open": open_incidents,
                "investigating": investigating_incidents,
                "resolved": resolved_incidents,
                "closed": closed_incidents,
                "by_priority": list(incidents_by_priority),
                "by_status": list(incidents_by_status),
            },
        })

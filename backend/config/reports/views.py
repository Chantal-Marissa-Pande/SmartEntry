from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from visitors.models import Visitor
from incidents.models import Incident

class ReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # ==============================
        # VISITOR STATISTICS
        # ==============================
        total_visitors = Visitor.objects.count()
        checked_in_visitors = Visitor.objects.filter(
            status="Checked In"
        ).count()
        checked_out_visitors = Visitor.objects.filter(
            status="Checked Out"
        ).count()

        visitor_types = (
            Visitor.objects
            .values("visitor_type")
            .annotate(count=Count("id"))
            .order_by("visitor_type")
        )

        # ==============================
        # INCIDENT STATISTICS
        # ==============================
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
        closed_incidents = Incident.objects.filter(
            status="Closed"
        ).count()

        incidents_by_priority = (
            Incident.objects
            .values("priority")
            .annotate(count=Count("id"))
            .order_by("priority")
        )

        incidents_by_status = (
            Incident.objects
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
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from visitors.models import Visitor


User = get_user_model()


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()

        # -----------------------------
        # Visitor statistics
        # -----------------------------

        total_visitors = Visitor.objects.count()

        expected_today = Visitor.objects.filter(
            expected_time__date=today,
            status="Expected"
        ).count()

        checked_in = Visitor.objects.filter(
            status="Checked In"
        ).count()

        checked_out = Visitor.objects.filter(
            status="Checked Out"
        ).count()

        # -----------------------------
        # Users
        # -----------------------------

        total_users = User.objects.count()

        # -----------------------------
        # Recent visitors
        # -----------------------------

        recent_visitors = Visitor.objects.order_by(
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

            # Incidents will be connected
            # when the incidents API is ready.
            "incidents": []
        })
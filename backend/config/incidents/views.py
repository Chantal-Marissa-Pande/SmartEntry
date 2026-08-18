from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Incident
from .serializers import IncidentSerializer
from users.tenancy import organization_queryset

class IncidentViewSet(viewsets.ModelViewSet):
    serializer_class = IncidentSerializer
    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return organization_queryset(
            Incident.objects.select_related("organization", "reported_by"),
            self.request.user,
        )

    def perform_create(self, serializer):
        if not self.request.user.organization_id:
            raise PermissionDenied("Your account must belong to an organization.")
        serializer.save(
            reported_by=self.request.user,
            organization=self.request.user.organization,
        )

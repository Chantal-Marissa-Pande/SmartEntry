from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Incident
from .serializers import IncidentSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user
        )
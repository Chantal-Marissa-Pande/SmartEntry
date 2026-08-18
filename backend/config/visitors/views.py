from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Visitor
from .serializers import VisitorSerializer
from users.tenancy import organization_queryset


class VisitorViewSet(viewsets.ModelViewSet):

    serializer_class = VisitorSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return organization_queryset(
            Visitor.objects.select_related("organization"),
            self.request.user,
        )

    def perform_create(self, serializer):
        if not self.request.user.organization_id:
            raise PermissionDenied("Your account must belong to an organization.")
        serializer.save(organization=self.request.user.organization)

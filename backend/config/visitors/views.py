from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Visitor
from .serializers import VisitorSerializer


class VisitorViewSet(viewsets.ModelViewSet):

    queryset = Visitor.objects.all()

    serializer_class = VisitorSerializer

    permission_classes = [
        IsAuthenticated
    ]
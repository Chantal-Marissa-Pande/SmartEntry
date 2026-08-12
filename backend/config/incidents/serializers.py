from rest_framework import serializers
from .models import Incident

class IncidentSerializer(serializers.ModelSerializer):
    reported_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Incident
        fields = [
            "id",
            "incident_type",
            "location",
            "date",
            "time",
            "description",
            "priority",
            "status",
            "reported_by",
            "reported_by_name",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "reported_by",
            "reported_by_name",
            "created_at",
            "updated_at",
        ]

    def get_reported_by_name(self, obj):
        if not obj.reported_by:
            return None

        # Use the username from SmartEntry's custom User model
        return obj.reported_by.get_username()
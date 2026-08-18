from rest_framework import serializers
from .models import IntelligenceAlert, Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "message",
            "notification_type",
            "source",
            "is_read",
            "related_type",
            "related_id",
            "created_at",
        ]


class IntelligenceAlertSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()
    incident = serializers.SerializerMethodField()
    visitor = serializers.SerializerMethodField()

    class Meta:
        model = IntelligenceAlert
        fields = [
            "id",
            "title",
            "description",
            "alert_type",
            "severity",
            "created_at",
            "is_active",
            "organization",
            "incident",
            "visitor",
        ]

    def get_organization(self, obj):
        if not obj.source_organization:
            return None
        return {"id": obj.source_organization_id, "name": obj.source_organization.name}

    def get_incident(self, obj):
        if not obj.related_incident:
            return None
        incident = obj.related_incident
        return {
            "id": incident.id,
            "type": incident.incident_type,
            "location": incident.location,
            "date": incident.date,
            "time": incident.time,
            "priority": incident.priority,
            "status": incident.status,
            "description": incident.description,
            "organization": incident.organization.name if incident.organization else None,
        }

    def get_visitor(self, obj):
        if not obj.related_visitor:
            return None
        visitor = obj.related_visitor
        return {
            "id": visitor.id,
            "name": visitor.name,
            "company": visitor.company,
            "department": visitor.location,
            "expected_time": visitor.expected_time,
            "status": visitor.status,
            "organization": visitor.organization.name if visitor.organization else None,
        }

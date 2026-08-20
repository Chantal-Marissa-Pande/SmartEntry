from rest_framework import serializers
from .models import Visitor


class VisitorSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(
        source="organization.name",
        read_only=True,
    )

    class Meta:
        model = Visitor
        fields = [
            "id",
            "name",
            "company",
            "phone",
            "national_id",
            "has_laptop",
            "laptop_make_model",
            "laptop_serial_number",
            "purpose",
            "host",
            "location",
            "expected_time",
            "visitor_type",
            "status",
            "organization",
            "organization_name",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "organization",
            "organization_name",
            "created_at",
            "updated_at",
        ]

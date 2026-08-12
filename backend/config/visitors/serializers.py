from rest_framework import serializers
from .models import Visitor


class VisitorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Visitor
        fields = [
            "id",
            "name",
            "company",
            "phone",
            "national_id",
            "purpose",
            "host",
            "expected_time",
            "visitor_type",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]
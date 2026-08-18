from django.contrib import admin
from .models import Visitor


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "company",
        "host",
        "location",
        "visitor_type",
        "status",
        "expected_time",
        "created_at",
    )

    list_filter = (
        "status",
        "visitor_type",
        "location",
        "created_at",
    )

    search_fields = (
        "name",
        "company",
        "host",
        "location",
        "phone",
        "national_id",
    )

    ordering = (
        "-created_at",
    )

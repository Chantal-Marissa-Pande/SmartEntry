from django.contrib import admin
from .models import Visitor


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "company",
        "host",
        "visitor_type",
        "status",
        "expected_time",
        "created_at",
    )

    list_filter = (
        "status",
        "visitor_type",
        "created_at",
    )

    search_fields = (
        "name",
        "company",
        "host",
        "phone",
        "national_id",
    )

    ordering = (
        "-created_at",
    )
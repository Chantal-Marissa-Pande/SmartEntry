from django.contrib import admin
from .models import Visitor
from users.permissions import is_organization_admin


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "company",
        "host",
        "location",
        "visitor_type",
        "has_laptop",
        "status",
        "expected_time",
        "created_at",
    )

    list_filter = (
        "status",
        "visitor_type",
        "has_laptop",
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
        "laptop_make_model",
        "laptop_serial_number",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        return queryset.filter(organization_id=request.user.organization_id)

    def has_module_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

    def _has_access(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if not is_organization_admin(request.user):
            return False
        return obj is None or obj.organization_id == request.user.organization_id

    has_view_permission = _has_access
    has_change_permission = _has_access
    has_delete_permission = _has_access

    def has_add_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

    def get_readonly_fields(self, request, obj=None):
        return () if request.user.is_superuser else ("organization",)

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.organization = request.user.organization
        super().save_model(request, obj, form, change)

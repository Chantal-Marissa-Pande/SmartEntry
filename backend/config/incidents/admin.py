from django.contrib import admin
from users.models import User
from users.permissions import is_organization_admin

from .models import Incident


@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ("incident_type", "organization", "location", "priority", "status", "date", "time")
    list_filter = ("priority", "status", "date")
    search_fields = ("incident_type", "location", "description")

    def get_queryset(self, request):
        queryset = super().get_queryset(request).select_related("organization", "reported_by")
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

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "reported_by" and not request.user.is_superuser:
            kwargs["queryset"] = User.objects.filter(organization_id=request.user.organization_id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

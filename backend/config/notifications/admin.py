from django.contrib import admin
from .models import Notification, IntelligenceAlert
from incidents.models import Incident
from users.models import User
from users.permissions import is_organization_admin
from visitors.models import Visitor


class OrganizationAdminAccessMixin:
    def has_module_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

    def _has_access(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if not is_organization_admin(request.user):
            return False
        return obj is None or self.object_organization_id(obj) == request.user.organization_id

    has_view_permission = _has_access
    has_change_permission = _has_access
    has_delete_permission = _has_access

    def has_add_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

@admin.register(Notification)
class NotificationAdmin(OrganizationAdminAccessMixin, admin.ModelAdmin):
    list_display = (
        "title",
        "user",
        "notification_type",
        "source",
        "is_read",
        "created_at",
    )
    list_filter = (
        "notification_type",
        "source",
        "is_read",
    )
    search_fields = (
        "title",
        "message",
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request).select_related("user__organization")
        if request.user.is_superuser:
            return queryset
        return queryset.filter(user__organization_id=request.user.organization_id)

    def object_organization_id(self, obj):
        return obj.user.organization_id

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user" and not request.user.is_superuser:
            kwargs["queryset"] = User.objects.filter(
                organization_id=request.user.organization_id,
                is_superuser=False,
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(IntelligenceAlert)
class IntelligenceAlertAdmin(OrganizationAdminAccessMixin, admin.ModelAdmin):
    list_display = ("title", "alert_type", "severity", "source_organization", "is_active", "created_at")
    list_filter = ("alert_type", "severity", "is_active")
    search_fields = ("title", "description")

    def get_queryset(self, request):
        queryset = super().get_queryset(request).select_related("source_organization")
        if request.user.is_superuser:
            return queryset
        return queryset.filter(source_organization_id=request.user.organization_id)

    def object_organization_id(self, obj):
        return obj.source_organization_id

    def get_readonly_fields(self, request, obj=None):
        return () if request.user.is_superuser else ("source_organization",)

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.source_organization = request.user.organization
        super().save_model(request, obj, form, change)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if not request.user.is_superuser:
            if db_field.name == "related_incident":
                kwargs["queryset"] = Incident.objects.filter(organization_id=request.user.organization_id)
            elif db_field.name == "related_visitor":
                kwargs["queryset"] = Visitor.objects.filter(organization_id=request.user.organization_id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

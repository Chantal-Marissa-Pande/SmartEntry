from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Organization, User, UserSettings
from .permissions import is_organization_admin


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")

    def has_module_permission(self, request):
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    has_add_permission = has_view_permission
    has_change_permission = has_view_permission
    has_delete_permission = has_view_permission


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    model = User

    # =========================================
    # USER LIST
    # =========================================

    list_display = (
        "email",
        "first_name",
        "last_name",
        "role",
        "organization",
        "is_active",
        "is_staff",
        "date_joined",
    )

    list_filter = (
        "role",
        "organization",
        "is_active",
        "is_staff",
    )

    search_fields = (
        "email",
        "first_name",
        "last_name",
    )

    ordering = (
        "email",
    )

    # =========================================
    # EDIT USER
    # =========================================

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),

        (
            "Personal Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                )
            },
        ),

        (
            "SmartEntry Access",
            {
                "fields": (
                    "role",
                    "organization",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),

        (
            "Activity",
            {
                "fields": (
                    "last_login",
                )
            },
        ),
    )

    # =========================================
    # ADD USER
    # =========================================

    add_fieldsets = (
        (
            None,
            {
                "classes": (
                    "wide",
                ),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "role",
                    "organization",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        return queryset.filter(
            organization_id=request.user.organization_id,
            is_superuser=False,
        )

    def has_module_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

    def _has_organization_access(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if not is_organization_admin(request.user):
            return False
        return obj is None or (
            not obj.is_superuser
            and obj.organization_id == request.user.organization_id
        )

    has_view_permission = _has_organization_access
    has_change_permission = _has_organization_access
    has_delete_permission = _has_organization_access

    def has_add_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return super().get_readonly_fields(request, obj)
        return ("organization", "is_staff", "is_superuser", "groups", "user_permissions")

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.organization = request.user.organization
            obj.is_superuser = False
            obj.is_staff = obj.role == User.Role.ADMIN
        super().save_model(request, obj, form, change)


@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "user", "require_id", "visitor_photo", "host_notification",
        "incident_notifications", "visitor_notifications", "updated_at",
    )
    search_fields = ("user__email", "user__first_name", "user__last_name")

    def get_queryset(self, request):
        queryset = super().get_queryset(request).select_related("user__organization")
        if request.user.is_superuser:
            return queryset
        return queryset.filter(user__organization_id=request.user.organization_id)

    def has_module_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

    def _has_access(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if not is_organization_admin(request.user):
            return False
        return obj is None or obj.user.organization_id == request.user.organization_id

    has_view_permission = _has_access
    has_change_permission = _has_access
    has_delete_permission = _has_access

    def has_add_permission(self, request):
        return request.user.is_superuser or is_organization_admin(request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user" and not request.user.is_superuser:
            kwargs["queryset"] = User.objects.filter(
                organization_id=request.user.organization_id,
                is_superuser=False,
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

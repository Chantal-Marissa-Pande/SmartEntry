from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Organization, User


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")


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

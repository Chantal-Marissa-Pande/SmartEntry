from django.contrib import admin
from django.urls import include, path
from users.django_admin_views import organization_admin_dashboard


urlpatterns = [

    path(
        "admin/organization-dashboard/",
        admin.site.admin_view(organization_admin_dashboard),
        name="organization-admin-dashboard",
    ),

    # Django Admin
    path(
        "admin/",
        admin.site.urls
    ),

    # Authentication
    path(
        "api/auth/",
        include("users.urls"),
    ),

    # Visitors
    path(
        "api/",
        include("visitors.urls"),
    ),

    #Dashboard
    path(
        "api/dashboard/",
        include("core.urls"),
    ),

    #Incidents
    path(
        "api/",
        include("incidents.urls"),
    ),

    #Reports
    path(
        "api/reports/",
        include("reports.urls"),
    ),

    #Notifications
    path(
        "api/notifications/",
        include("notifications.urls")
    ),
]

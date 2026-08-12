from django.contrib import admin
from django.urls import include, path


urlpatterns = [

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
]
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    EmailTokenObtainPairView,
    UserProfileView,
    UserSettingsView,
    ChangePasswordView,
    user_list,
)
from .admin_views import admin_dashboard, user_list

urlpatterns = [
    path(
        "login/",
        EmailTokenObtainPairView.as_view(),
        name="login",
    ),
    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "me/",
        UserProfileView.as_view(),
        name="user-profile",
    ),
    path(
        "settings/",
        UserSettingsView.as_view(),
        name="user-settings",
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),

    path(
        "admin-dashboard/",
        admin_dashboard,
        name="admin-dashboard",
    ),

    path(
        "users/",
        user_list,
        name="user-list",
    ),
]
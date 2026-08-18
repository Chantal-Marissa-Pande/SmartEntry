from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    EmailTokenObtainPairView,
    UserProfileView,
    UserSettingsView,
    ChangePasswordView,
    user_list,
    user_detail,
    organization_list,
    organization_detail,
)
from .admin_views import (
    admin_dashboard,
)

# ========================================================
# AUTHENTICATION
# ========================================================

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

    # ========================================================
    # USER PROFILE
    # ========================================================
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

    # ========================================================
    # ADMIN
    # ========================================================
    path(
        "admin-dashboard/",
        admin_dashboard,
        name="admin-dashboard",
    ),

    path(
        "users/",
        user_list,
        name="users",
    ),

    path(
        "users/<int:pk>/",
        user_detail,
        name="user_detail"
    ),
    path("organizations/", organization_list, name="organizations"),
    path("organizations/<int:pk>/", organization_detail, name="organization-detail"),
]

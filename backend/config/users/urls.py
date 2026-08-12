from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    EmailTokenObtainPairView,
    UserProfileView,
    UserSettingsView,
    ChangePasswordView,
)

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
]
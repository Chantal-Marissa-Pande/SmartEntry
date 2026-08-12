from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import DashboardView

urlpatterns = [
    #JWT authentication
    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    #Dashboard
    path(
        "",
        DashboardView.as_view(),
        name="dashboard",
    ),
]
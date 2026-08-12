from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import UserSettings
from .serializers import (
    EmailTokenObtainPairSerializer,
    UserProfileSerializer,
    UserSettingsSerializer,
)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

class UserSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSettingsSerializer
    def get_object(self):
        settings, created = UserSettings.objects.get_or_create(
            user=self.request.user
        )
        return settings

class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        current_password = request.data.get(
            "current_password"
        )
        new_password = request.data.get(
            "new_password"
        )
        if not current_password or not new_password:
            return Response(
                {
                    "detail": "Current password and new password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        user = request.user
        if not user.check_password(current_password):
            return Response(
                {
                    "detail": "Current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(new_password) < 8:
            return Response(
                {
                    "detail": "Password must contain at least 8 characters."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if current_password == new_password:
            return Response(
                {
                    "detail": "New password must be different from the current password."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(new_password)
        user.save(
            update_fields=["password"]
        )
        return Response(
            {
                "detail": "Password updated successfully."
            },
            status=status.HTTP_200_OK
        )
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, UserSettings


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = "email"

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["email"] = user.email
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["role"] = user.role

        return token


class UserProfileSerializer(serializers.ModelSerializer):

    role_display = serializers.CharField(
        source="get_role_display",
        read_only=True
    )

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "role_display",
        ]

        read_only_fields = [
            "id",
            "email",
            "role",
            "role_display",
        ]

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            "require_id",
            "visitor_photo",
            "host_notification",
            "incident_notifications",
            "visitor_notifications",
            "email_notifications",
            "session_timeout",
            "date_format",
            "timezone",
            "updated_at",
        ]
        read_only_fields = [
            "updated_at",
        ]
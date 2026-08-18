from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Organization, User, UserSettings
from .permissions import is_platform_admin


class OrganizationSerializer(serializers.ModelSerializer):
    user_count = serializers.IntegerField(read_only=True)
    visitor_count = serializers.IntegerField(read_only=True)
    incident_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Organization
        fields = [
            "id", "name", "slug", "is_active", "created_at",
            "user_count", "visitor_count", "incident_count",
        ]
        read_only_fields = ["id", "created_at", "user_count", "visitor_count", "incident_count"]


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = "email"

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["email"] = user.email
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["role"] = user.role
        token["organization_id"] = user.organization_id
        token["organization_name"] = user.organization.name if user.organization else None
        token["platform_admin"] = is_platform_admin(user)

        return token

class UserAdminSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    def get_name(self, obj):
        return f"{obj.first_name}{obj.last_name}"

    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False
    )
    organization_name = serializers.CharField(source="organization.name", read_only=True)
    def create(self, validated_data):
        password = validated_data.pop(
            "password",
            "Password123"
        )
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "first_name",
            "last_name",
            "email",
            "role",
            "organization",
            "organization_name",
            "is_active",
            "is_staff",
            "date_joined",
            "password",
        ]

        read_only_fields = [
            "id",
            "name",
            "date_joined",
        ]

class UserProfileSerializer(serializers.ModelSerializer):

    role_display = serializers.CharField(
        source="get_role_display",
        read_only=True
    )
    organization_name = serializers.CharField(source="organization.name", read_only=True)

    class Meta:
        model = User

        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "role_display",
            "organization",
            "organization_name",
        ]

        read_only_fields = [
            "id",
            "email",
            "role",
            "role_display",
            "organization",
            "organization_name",
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

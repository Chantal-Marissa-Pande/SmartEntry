from rest_framework.decorators import api_view, permission_classes
from django.db.models import Count
from django.utils.text import slugify
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    EmailTokenObtainPairSerializer,
    UserProfileSerializer,
    UserSettingsSerializer,
    UserAdminSerializer,
    OrganizationSerializer,
)
from .models import Organization, User
from .models import UserSettings
from .permissions import is_platform_admin


def unique_organization_slug(value, exclude_pk=None):
    base_slug = slugify(value) or "organization"
    candidate = base_slug
    suffix = 2
    queryset = Organization.objects.all()
    if exclude_pk is not None:
        queryset = queryset.exclude(pk=exclude_pk)
    while queryset.filter(slug=candidate).exists():
        candidate = f"{base_slug}-{suffix}"
        suffix += 1
    return candidate

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def user_list(request):
    if request.user.role != User.Role.ADMIN:
        return Response({"detail": "Administrator access is required."}, status=403)

    # GET USERS
    if request.method == "GET":
        users = User.objects.select_related("organization")
        if not is_platform_admin(request.user):
            users = users.filter(organization=request.user.organization)
        users = users.order_by("date_joined")
        serializer = UserAdminSerializer(users, many=True)
        return Response(
            {
                "users":serializer.data
            }
        )

    #CREATE USER
    data = request.data.copy()
    if not is_platform_admin(request.user):
        data["organization"] = request.user.organization_id
    serializer = UserAdminSerializer(data=data)
    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def user_detail(request, pk):
    if request.user.role != User.Role.ADMIN:
        return Response({"detail": "Administrator access is required."}, status=403)
    try:
        users = User.objects.all()
        if not is_platform_admin(request.user):
            users = users.filter(organization=request.user.organization)
        user = users.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found"},
            status=404
        )

    # UPDATE USER
    if request.method == "PUT":
        data = request.data.copy()
        if not is_platform_admin(request.user):
            data["organization"] = request.user.organization_id
        serializer = UserAdminSerializer(
            user,
            data=data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=400
        )

    # DELETE USER
    user.delete()
    return Response(
        {"detail": "User deleted"},
        status=204
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def organization_list(request):
    if not is_platform_admin(request.user):
        return Response({"detail": "Only the SmartEntry platform administrator can manage organizations."}, status=403)

    if request.method == "GET":
        organizations = Organization.objects.annotate(
            user_count=Count("users", distinct=True),
            visitor_count=Count("visitors", distinct=True),
            incident_count=Count("incidents", distinct=True),
        )
        return Response(OrganizationSerializer(organizations, many=True).data)

    data = request.data.copy()
    data["slug"] = unique_organization_slug(
        data.get("slug") or data.get("name", "")
    )
    serializer = OrganizationSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def organization_detail(request, pk):
    if not is_platform_admin(request.user):
        return Response({"detail": "Only the SmartEntry platform administrator can manage organizations."}, status=403)

    try:
        organization = Organization.objects.get(pk=pk)
    except Organization.DoesNotExist:
        return Response({"detail": "Organization not found."}, status=404)

    if request.method == "DELETE":
        organization.is_active = False
        organization.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    data = request.data.copy()
    if data.get("name") or data.get("slug"):
        data["slug"] = unique_organization_slug(
            data.get("slug") or data.get("name", organization.name),
            exclude_pk=organization.pk,
        )
    serializer = OrganizationSerializer(organization, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)

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
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        if not current_password or not new_password:
            return Response(
                {
                    "detail": "Current password and new password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = request.user

        if not user.check_password(current_password):
            return Response(
                {
                    "detail": "Current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {
                    "detail": "Password must contain at least 8 characters."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password == new_password:
            return Response(
                {
                    "detail": "New password must be different from the current password."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response(
            {
                "detail": "Password updated successfully."
            },
            status=status.HTTP_200_OK,
        )

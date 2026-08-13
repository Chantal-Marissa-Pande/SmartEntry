from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    EmailTokenObtainPairSerializer,
    UserProfileSerializer,
    UserSettingsSerializer,
    UserAdminSerializer,
)
from .models import User
from .models import UserSettings

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def user_list(request):
    # GET USERS
    if request.method == "GET":
        users = User.objects.all().order_by("date_joined")
        serializer = UserAdminSerializer(users, many=True)
        return Response(
            {
                "users":serializer.data
            }
        )

    #CREATE USER
    serializer = UserAdminSerializer(data=request.data)
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
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found"},
            status=404
        )

    # UPDATE USER
    if request.method == "PUT":
        serializer = UserAdminSerializer(
            user,
            data=request.data,
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
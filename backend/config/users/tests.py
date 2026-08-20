from django.contrib.admin.sites import AdminSite
from django.test import RequestFactory, TestCase

from .admin import CustomUserAdmin
from .models import Organization, User
from .permissions import is_platform_admin


class AdminAccessTests(TestCase):
    def setUp(self):
        self.first_org = Organization.objects.create(name="First", slug="first")
        self.second_org = Organization.objects.create(name="Second", slug="second")
        self.factory = RequestFactory()

    def test_any_superuser_has_platform_access(self):
        user = User.objects.create_superuser(
            "root@example.com", "password", first_name="Root", last_name="User"
        )
        self.assertTrue(is_platform_admin(user))

    def test_organization_admin_is_staff_and_user_admin_is_tenant_scoped(self):
        admin_user = User.objects.create_user(
            "admin@first.test", "password", first_name="Org", last_name="Admin",
            role=User.Role.ADMIN, organization=self.first_org,
        )
        User.objects.create_user(
            "other@second.test", "password", first_name="Other", last_name="User",
            organization=self.second_org,
        )
        request = self.factory.get("/admin/users/user/")
        request.user = admin_user
        model_admin = CustomUserAdmin(User, AdminSite())

        self.assertTrue(admin_user.is_staff)
        self.assertTrue(model_admin.has_module_permission(request))
        self.assertEqual(list(model_admin.get_queryset(request)), [admin_user])

# Create your tests here.

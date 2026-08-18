from datetime import datetime, time

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from incidents.models import Incident
from users.models import Organization, User, UserSettings
from visitors.models import Visitor


ORGANIZATIONS = [
    ("default-organization", "SmartEntry"),
    ("test", "Test"),
    ("acme-holdings", "Acme Holdings"),
    ("northstar-logistics", "Northstar Logistics"),
]

ORG_USERS = [
    ("admin", "Organization", "Admin", User.Role.ADMIN),
    ("security", "Security", "Officer", User.Role.SECURITY),
    ("reception", "Reception", "Officer", User.Role.RECEPTION),
    ("manager", "Operations", "Manager", User.Role.MANAGER),
]

VISITOR_TEMPLATES = [
    ("Amina Hassan", "Nexus Consulting", "Guest", "Checked In", "Operations", "Project planning meeting", 9, 0),
    ("Brian Otieno", "Cloudline Systems", "Contractor", "Checked Out", "Information Technology", "Network maintenance", 10, 30),
    ("Carol Njeri", "Independent", "Interview", "Expected", "Human Resources", "Job interview", 11, 0),
    ("David Kiptoo", "Prime Office Supplies", "Vendor", "Checked Out", "Procurement", "Supplies review", 14, 0),
    ("Felix Mutua", "Swift Courier Services", "Delivery", "Expected", "Administration", "Document delivery", 15, 30),
]

INCIDENT_TEMPLATES = [
    ("Unauthorized Access", "Operations", time(9, 20), "High", "Investigating", "An individual attempted to enter without a valid visitor badge."),
    ("Safety Hazard", "Main Reception", time(10, 15), "Medium", "Resolved", "A wet floor was reported near the reception area."),
    ("Badge Misuse", "Main Reception", time(12, 10), "High", "Open", "A visitor badge was used by a different individual."),
    ("Suspicious Package", "Main Reception", time(14, 5), "Critical", "Resolved", "An unlabelled parcel was isolated for inspection."),
    ("Equipment Damage", "Operations", time(16, 0), "Low", "Closed", "A delivery trolley damaged a storage-room door frame."),
]


class Command(BaseCommand):
    help = "Create idempotent multi-organization demo data for SmartEntry."

    def add_arguments(self, parser):
        parser.add_argument(
            "--password",
            default="SmartEntry123!",
            help="Password assigned to all seeded demo users.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        password = options["password"]
        organizations = {}

        for slug, name in ORGANIZATIONS:
            organization = (
                Organization.objects.filter(slug=slug).first()
                or Organization.objects.filter(name__iexact=name).first()
            )
            if organization is None:
                organization = Organization.objects.create(
                    slug=slug,
                    name=name,
                    is_active=True,
                )
            else:
                organization.name = name
                organization.is_active = True
                if not Organization.objects.exclude(pk=organization.pk).filter(slug=slug).exists():
                    organization.slug = slug
                organization.save(update_fields=["name", "slug", "is_active"])
            organizations[slug] = organization

        platform_organization = organizations["default-organization"]
        platform_admin, _ = User.objects.update_or_create(
            email=settings.PLATFORM_ADMIN_EMAIL,
            defaults={
                "first_name": "SmartEntry",
                "last_name": "Administrator",
                "role": User.Role.ADMIN,
                "organization": platform_organization,
                "is_active": True,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        platform_admin.set_password(password)
        platform_admin.save(update_fields=["password"])
        UserSettings.objects.get_or_create(user=platform_admin)

        # Enforce a single platform-level Django administrator.
        User.objects.exclude(email__iexact=settings.PLATFORM_ADMIN_EMAIL).update(
            is_superuser=False,
            is_staff=False,
        )

        seeded_users = 1
        seeded_visitors = 0
        seeded_incidents = 0

        for org_index, (slug, name) in enumerate(ORGANIZATIONS):
            organization = organizations[slug]
            domain = f"{slug}.example.com"
            organization_users = {}

            for prefix, first_name, last_name, role in ORG_USERS:
                # SmartEntry's platform organization already has its overall admin.
                if slug == "default-organization" and role == User.Role.ADMIN:
                    organization_users[role] = platform_admin
                    continue

                email = f"{prefix}@{domain}"
                user, _ = User.objects.update_or_create(
                    email=email,
                    defaults={
                        "first_name": first_name,
                        "last_name": last_name,
                        "role": role,
                        "organization": organization,
                        "is_active": True,
                        "is_staff": False,
                        "is_superuser": False,
                    },
                )
                user.set_password(password)
                user.save(update_fields=["password"])
                UserSettings.objects.get_or_create(user=user)
                organization_users[role] = user
                seeded_users += 1

            day = 18 - org_index
            expected_date = datetime(2026, 8, day)

            for visitor_index, template in enumerate(VISITOR_TEMPLATES, start=1):
                name_value, company, visitor_type, status_value, department, purpose, hour, minute = template
                expected_time = timezone.make_aware(
                    expected_date.replace(hour=hour, minute=minute),
                    timezone.get_current_timezone(),
                )
                national_id = f"{slug[:4].upper()}-{visitor_index:04d}"
                Visitor.objects.update_or_create(
                    organization=organization,
                    national_id=national_id,
                    defaults={
                        "name": name_value,
                        "company": company,
                        "phone": f"+254 700 {org_index + 1:03d} {visitor_index:03d}",
                        "purpose": purpose,
                        "host": (
                            f"{organization_users[User.Role.MANAGER].first_name} "
                            f"{organization_users[User.Role.MANAGER].last_name}"
                        ).strip(),
                        "expected_time": expected_time,
                        "visitor_type": visitor_type,
                        "status": status_value,
                        "location": department,
                    },
                )
                seeded_visitors += 1

            reporter = organization_users[User.Role.SECURITY]
            for incident_type, location, incident_time, priority, status_value, description in INCIDENT_TEMPLATES:
                Incident.objects.update_or_create(
                    organization=organization,
                    incident_type=incident_type,
                    date=expected_date.date(),
                    time=incident_time,
                    defaults={
                        "location": location,
                        "description": description,
                        "priority": priority,
                        "status": status_value,
                        "reported_by": reporter,
                    },
                )
                seeded_incidents += 1

        self.stdout.write(self.style.SUCCESS(
            f"Seed complete: {len(organizations)} organizations, "
            f"{seeded_users} users, {seeded_visitors} visitors, "
            f"and {seeded_incidents} incidents."
        ))
        self.stdout.write(f"Platform administrator: {settings.PLATFORM_ADMIN_EMAIL}")
        self.stdout.write(f"Demo password: {password}")

import django.db.models.deletion
from django.db import migrations, models


def assign_default_organization(apps, schema_editor):
    Organization = apps.get_model("users", "Organization")
    User = apps.get_model("users", "User")
    organization, _ = Organization.objects.get_or_create(
        pk=10000,
        defaults={"name": "Default Organization", "slug": "default-organization"},
    )
    User.objects.filter(organization__isnull=True).update(organization=organization)


class Migration(migrations.Migration):
    dependencies = [("users", "0002_usersettings")]
    operations = [
        migrations.CreateModel(
            name="Organization",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=150, unique=True)),
                ("slug", models.SlugField(max_length=160, unique=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.AddField(
            model_name="user",
            name="organization",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="users", to="users.organization"),
        ),
        migrations.RunPython(assign_default_organization, migrations.RunPython.noop),
    ]

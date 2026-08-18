import django.db.models.deletion
from django.db import migrations, models


def assign_default_organization(apps, schema_editor):
    Organization = apps.get_model("users", "Organization")
    Incident = apps.get_model("incidents", "Incident")
    organization = Organization.objects.get(slug="default-organization")
    Incident.objects.filter(organization__isnull=True).update(organization=organization)


class Migration(migrations.Migration):
    dependencies = [("users", "0003_organization"), ("incidents", "0001_initial")]
    operations = [
        migrations.AddField(
            model_name="incident",
            name="organization",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="incidents", to="users.organization"),
        ),
        migrations.RunPython(assign_default_organization, migrations.RunPython.noop),
    ]

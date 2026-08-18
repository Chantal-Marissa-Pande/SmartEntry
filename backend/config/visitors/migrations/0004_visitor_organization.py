import django.db.models.deletion
from django.db import migrations, models


def assign_default_organization(apps, schema_editor):
    Organization = apps.get_model("users", "Organization")
    Visitor = apps.get_model("visitors", "Visitor")
    organization = Organization.objects.get(slug="default-organization")
    Visitor.objects.filter(organization__isnull=True).update(organization=organization)


class Migration(migrations.Migration):
    dependencies = [("users", "0003_organization"), ("visitors", "0003_visitor_location")]
    operations = [
        migrations.AddField(
            model_name="visitor",
            name="organization",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="visitors", to="users.organization"),
        ),
        migrations.RunPython(assign_default_organization, migrations.RunPython.noop),
    ]

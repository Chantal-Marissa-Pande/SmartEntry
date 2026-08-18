import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0003_organization"),
        ("visitors", "0004_visitor_organization"),
        ("incidents", "0002_incident_organization"),
        ("notifications", "0003_model_ordering"),
    ]
    operations = [
        migrations.AddField(
            model_name="intelligencealert",
            name="source_organization",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="intelligence_alerts", to="users.organization"),
        ),
        migrations.AddField(
            model_name="intelligencealert",
            name="related_incident",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="intelligence_alerts", to="incidents.incident"),
        ),
        migrations.AddField(
            model_name="intelligencealert",
            name="related_visitor",
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="intelligence_alerts", to="visitors.visitor"),
        ),
    ]

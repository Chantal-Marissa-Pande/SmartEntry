from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("visitors", "0004_visitor_organization")]
    operations = [
        migrations.AddField(model_name="visitor", name="has_laptop", field=models.BooleanField(default=False)),
        migrations.AddField(model_name="visitor", name="laptop_make_model", field=models.CharField(blank=True, max_length=150)),
        migrations.AddField(model_name="visitor", name="laptop_serial_number", field=models.CharField(blank=True, max_length=100)),
    ]

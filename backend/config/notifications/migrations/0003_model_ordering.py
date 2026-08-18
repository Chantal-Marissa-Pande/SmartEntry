from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("notifications", "0002_intelligencealert"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="notification",
            options={"ordering": ["-created_at"]},
        ),
        migrations.AlterModelOptions(
            name="intelligencealert",
            options={"ordering": ["-created_at"]},
        ),
    ]

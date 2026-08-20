from django.db import migrations


def grant_staff_access(apps, schema_editor):
    User = apps.get_model("users", "User")
    User.objects.filter(role="admin", is_staff=False).update(is_staff=True)


class Migration(migrations.Migration):
    dependencies = [("users", "0003_organization")]
    operations = [migrations.RunPython(grant_staff_access, migrations.RunPython.noop)]

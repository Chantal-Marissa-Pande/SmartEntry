from django.db import models
from users.models import User


class Notification(models.Model):

    TYPE_CHOICES = [
        ("info", "Information"),
        ("success", "Success"),
        ("warning", "Warning"),
        ("danger", "Danger"),
    ]

    SOURCE_CHOICES = [
        ("visitor", "Visitor"),
        ("incident", "Incident"),
        ("intelligence", "Shared Intelligence"),
        ("system", "System"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(max_length=200)

    message = models.TextField()

    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default="info"
    )

    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default="system"
    )

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    related_type = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    related_id = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.title} - {self.user}"

class IntelligenceAlert(models.Model):

    ALERT_TYPES = [
        ("trend", "Trend"),
        ("visitor", "Visitor"),
        ("security", "Security"),
        ("escalation", "Escalation"),
    ]

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    alert_type = models.CharField(
        max_length=30,
        choices=ALERT_TYPES
    )

    severity = models.CharField(
        max_length=20,
        default="Medium"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return self.title
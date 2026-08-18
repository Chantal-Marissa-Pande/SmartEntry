from django.db import models
from django.conf import settings

class Incident(models.Model):

    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Critical", "Critical"),
    ]

    STATUS_CHOICES = [
        ("Open", "Open"),
        ("Investigating", "Investigating"),
        ("Resolved", "Resolved"),
        ("Closed", "Closed"),
    ]

    incident_type = models.CharField(
        max_length=100
    )

    location = models.CharField(
        max_length=255
    )

    date = models.DateField()

    time = models.TimeField()

    description = models.TextField(
        blank=True
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="Medium"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Open"
    )

    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reported_incidents"
    )

    organization = models.ForeignKey(
        "users.Organization",
        on_delete=models.PROTECT,
        related_name="incidents",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.incident_type} - {self.location}"

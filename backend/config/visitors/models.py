from django.db import models


class Visitor(models.Model):

    VISITOR_TYPE_CHOICES = [
        ("Guest", "Guest"),
        ("Vendor", "Vendor"),
        ("Contractor", "Contractor"),
        ("Interview", "Interview"),
        ("Delivery", "Delivery"),
    ]

    STATUS_CHOICES = [
        ("Expected", "Expected"),
        ("Checked In", "Checked In"),
        ("Checked Out", "Checked Out"),
        ("Cancelled", "Cancelled"),
    ]

    name = models.CharField(max_length=150)

    company = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    phone = models.CharField(
        max_length=30,
        blank=True,
        null=True
    )

    national_id = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    purpose = models.CharField(
        max_length=255
    )

    host = models.CharField(
        max_length=150
    )

    expected_time = models.DateTimeField(
        blank=True,
        null=True
    )

    visitor_type = models.CharField(
        max_length=30,
        choices=VISITOR_TYPE_CHOICES,
        default="Guest"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Expected"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    location = models.CharField(
    max_length=255,
    default="Main Reception"
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.company or 'No Company'}"
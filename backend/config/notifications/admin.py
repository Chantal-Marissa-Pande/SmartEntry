from django.contrib import admin
from .models import Notification, IntelligenceAlert

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "user",
        "notification_type",
        "source",
        "is_read",
        "created_at",
    )
    list_filter = (
        "notification_type",
        "source",
        "is_read",
    )
    search_fields = (
        "title",
        "message",
    )
admin.site.register(IntelligenceAlert)
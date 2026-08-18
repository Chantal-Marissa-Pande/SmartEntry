from django.urls import path
from .views import (
    notification_list,
    unread_count,
    mark_as_read,
    mark_all_as_read,
    intelligence_alert_list,
    dismiss_intelligence_alert,
    intelligence_alert_detail,
)

urlpatterns = [
    path(
        "",
        notification_list
    ),
    path(
        "unread-count/",
        unread_count
    ),
    path(
        "read-all/",
        mark_all_as_read
    ),
    path(
        "intelligence/",
        intelligence_alert_list
    ),
    path(
        "intelligence/<int:pk>/dismiss/",
        dismiss_intelligence_alert
    ),
    path("intelligence/<int:pk>/", intelligence_alert_detail),
    path(
        "<int:pk>/read/",
        mark_as_read
    ),
]

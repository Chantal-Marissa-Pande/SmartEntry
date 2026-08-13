from django.urls import path
from .views import (
    notification_list,
    unread_count,
    mark_as_read,
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
        "<int:pk>/read/",
        mark_as_read
    ),
]
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import IntelligenceAlert, Notification
from .serializers import IntelligenceAlertSerializer, NotificationSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notification_list(request):
    notifications = Notification.objects.filter(
        user=request.user
    )[:50]
    serializer = NotificationSerializer(
        notifications,
        many=True
    )
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()
    return Response({
        "count": count
    })

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_as_read(request, pk):
    try:
        notification = Notification.objects.get(
            pk=pk,
            user=request.user
        )
        notification.is_read = True
        notification.save()
        return Response({
            "message": "Notification marked as read"
        })
    except Notification.DoesNotExist:
        return Response(
            {"error": "Not found"},
            status=404
        )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_all_as_read(request):
    updated = Notification.objects.filter(
        user=request.user,
        is_read=False,
    ).update(is_read=True)
    return Response({"updated": updated})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def intelligence_alert_list(request):
    alerts = IntelligenceAlert.objects.filter(is_active=True).select_related(
        "source_organization",
        "related_incident__organization",
        "related_visitor__organization",
    )[:100]
    return Response(
        IntelligenceAlertSerializer(alerts, many=True).data
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def intelligence_alert_detail(request, pk):
    try:
        alert = IntelligenceAlert.objects.select_related(
            "source_organization",
            "related_incident__organization",
            "related_visitor__organization",
        ).get(pk=pk)
    except IntelligenceAlert.DoesNotExist:
        return Response({"detail": "Alert not found."}, status=404)
    return Response(IntelligenceAlertSerializer(alert).data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def dismiss_intelligence_alert(request, pk):
    if request.user.role not in ("admin", "security"):
        return Response(
            {"detail": "Only administrators and security officers can dismiss alerts."},
            status=403,
        )

    try:
        alert = IntelligenceAlert.objects.get(pk=pk, is_active=True)
    except IntelligenceAlert.DoesNotExist:
        return Response({"detail": "Alert not found."}, status=404)

    alert.is_active = False
    alert.save(update_fields=["is_active"])
    return Response({"message": "Intelligence alert dismissed."})

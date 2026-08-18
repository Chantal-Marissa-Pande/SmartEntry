from .permissions import is_platform_admin


def organization_queryset(queryset, user):
    """Restrict tenant-owned records while allowing platform superusers oversight."""
    if is_platform_admin(user):
        return queryset
    if not user.organization_id:
        return queryset.none()
    return queryset.filter(organization_id=user.organization_id)

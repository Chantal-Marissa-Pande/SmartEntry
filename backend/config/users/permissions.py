def is_platform_admin(user):
    """Return whether a user has unrestricted, platform-wide access."""
    return bool(
        user
        and user.is_authenticated
        and user.is_superuser
    )


def is_organization_admin(user):
    """Return whether a user may administer their own organization."""
    return bool(
        user
        and user.is_authenticated
        and user.is_active
        and user.role == "admin"
        and user.organization_id
    )

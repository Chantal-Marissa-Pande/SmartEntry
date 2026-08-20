from django.contrib import admin
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.template.response import TemplateResponse

from .permissions import is_organization_admin


def organization_admin_dashboard(request):
    """Render the Django admin index with only this organization's allowed models."""
    if request.user.is_superuser:
        return redirect("admin:index")
    if not is_organization_admin(request.user):
        raise PermissionDenied

    organization = request.user.organization
    context = {
        **admin.site.each_context(request),
        "title": f"{organization.name} administration",
        "subtitle": "Organization administration",
        "app_list": admin.site.get_app_list(request),
    }
    request.current_app = admin.site.name
    return TemplateResponse(request, "admin/index.html", context)

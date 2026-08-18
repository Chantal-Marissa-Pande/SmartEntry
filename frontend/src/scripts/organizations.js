import { loadLayout } from "../components/layout.js";
import { createOrganization, deactivateOrganization, getOrganizations, updateOrganization } from "../services/organizationService.js";

let organizations = [];

function isPlatformAdmin() {
    try {
        const token = localStorage.getItem("accessToken");
        return Boolean(JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).platform_admin);
    } catch { return false; }
}

const escapeHtml = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function render() {
    const content = `
        <div class="organization-summary mb-4"><div><span>Tenant administration</span><h3>Organizations</h3><p>Keep operational visitor and incident records isolated by organization.</p></div>${isPlatformAdmin() ? '<button id="addOrganizationBtn" class="btn btn-primary"><i class="bi bi-building-add me-2"></i>Add organization</button>' : ""}</div>
        <div class="row g-4">${organizations.map((organization) => `
            <div class="col-md-6 col-xl-4"><article class="organization-card ${organization.is_active ? "" : "inactive"}">
                <header><div class="organization-avatar">${escapeHtml(organization.name.slice(0, 2).toUpperCase())}</div><div><h4>${escapeHtml(organization.name)}</h4><span>${escapeHtml(organization.slug)}</span></div><span class="badge ${organization.is_active ? "text-bg-success" : "text-bg-secondary"}">${organization.is_active ? "Active" : "Inactive"}</span></header>
                <div class="organization-stats"><div><strong>${organization.user_count || 0}</strong><span>Users</span></div><div><strong>${organization.visitor_count || 0}</strong><span>Visitors</span></div><div><strong>${organization.incident_count || 0}</strong><span>Incidents</span></div></div>
                <footer><button class="btn btn-sm btn-outline-primary" data-edit-organization="${organization.id}">Edit</button>${organization.is_active && isPlatformAdmin() ? `<button class="btn btn-sm btn-link text-danger" data-deactivate-organization="${organization.id}">Deactivate</button>` : ""}</footer>
            </article></div>`).join("") || '<div class="col-12"><div class="notification-empty bg-white rounded"><i class="bi bi-buildings"></i><strong>No organizations found</strong></div></div>'}</div>`;
    loadLayout("Organizations", content);
}

async function reload() {
    try { organizations = await getOrganizations(); render(); }
    catch { loadLayout("Organizations", '<div class="alert alert-danger">Unable to load organizations.</div>'); }
}

async function organizationForm(organization = null) {
    const result = await Swal.fire({
        title: organization ? "Edit Organization" : "Add Organization",
        html: `<input id="organizationName" class="swal2-input" placeholder="Organization name" value="${escapeHtml(organization?.name || "")}"><input id="organizationSlug" class="swal2-input" placeholder="URL-friendly identifier" value="${escapeHtml(organization?.slug || "")}">`,
        showCancelButton: true,
        confirmButtonText: organization ? "Save changes" : "Create organization",
        preConfirm: () => {
            const name = document.getElementById("organizationName").value.trim();
            const slug = document.getElementById("organizationSlug").value.trim();
            if (!name) return Swal.showValidationMessage("Organization name is required.");
            return { name, slug };
        }
    });
    if (!result.isConfirmed) return;
    try {
        if (organization) await updateOrganization(organization.id, result.value);
        else await createOrganization(result.value);
        await reload();
    } catch (error) {
        Swal.fire("Unable to save", error.response?.data?.detail || "Check the name, identifier, and your permissions.", "error");
    }
}

document.addEventListener("click", async (event) => {
    if (event.target.closest("#addOrganizationBtn")) organizationForm();
    const edit = event.target.closest("[data-edit-organization]");
    if (edit) organizationForm(organizations.find((item) => item.id === Number(edit.dataset.editOrganization)));
    const deactivate = event.target.closest("[data-deactivate-organization]");
    if (deactivate) {
        const result = await Swal.fire({ title: "Deactivate organization?", text: "Its existing records will be retained.", icon: "warning", showCancelButton: true });
        if (result.isConfirmed) {
            try { await deactivateOrganization(Number(deactivate.dataset.deactivateOrganization)); await reload(); }
            catch (error) { Swal.fire("Unable to deactivate", error.response?.data?.detail || "The organization could not be deactivated.", "error"); }
        }
    }
});
reload();

import { loadLayout } from "../components/layout.js";
import api from "../services/api.js";
// =========================================
// ADMIN DASHBOARD ENDPOINT
// =========================================
const ADMIN_DASHBOARD_ENDPOINT = "/auth/admin-dashboard/";

// =========================================
// FORMAT DATE
// =========================================
function formatDate(dateString) {
    if (!dateString) {
        return "—";
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
// =========================================
// STATUS BADGE
// =========================================
function statusBadge(isActive) {
    return isActive
        ? `
            <span class="badge bg-success">
                Active
            </span>
        `
        : `
            <span class="badge bg-secondary">
                Inactive
            </span>
        `;
}

// =========================================
// ROLE BADGE
// =========================================
function roleBadge(role) {
    const normalizedRole =
        String(role || "").toLowerCase();

    let badgeClass = "bg-secondary";
    if (normalizedRole === "admin") {
        badgeClass = "bg-danger";
    } else if (normalizedRole === "security") {
        badgeClass = "bg-warning text-dark";
    } else if (normalizedRole === "reception") {
        badgeClass = "bg-primary";
    } else if (normalizedRole === "manager") {
        badgeClass = "bg-info text-dark";
    }

    return `
        <span class="badge ${badgeClass}">
            ${role || "Unknown"}
        </span>
    `;
}

// =========================================
// PRIORITY BADGE
// =========================================
function priorityBadge(priority) {
    const normalizedPriority =
        String(priority || "").toLowerCase();

    let badgeClass = "bg-secondary";
    if (normalizedPriority === "critical") {
        badgeClass = "bg-danger";
    } else if (normalizedPriority === "high") {
        badgeClass = "bg-warning text-dark";
    } else if (normalizedPriority === "medium") {
        badgeClass = "bg-primary";
    } else if (normalizedPriority === "low") {
        badgeClass = "bg-success";
    }

    return `
        <span class="badge ${badgeClass}">
            ${priority || "Unknown"}
        </span>
    `;
}

// =========================================
// INCIDENT STATUS BADGE
// =========================================
function incidentStatusBadge(status) {
    const normalizedStatus =
        String(status || "").toLowerCase();

    let badgeClass = "bg-secondary";
    if (normalizedStatus === "open") {
        badgeClass = "bg-danger";
    } else if (normalizedStatus === "investigating") {
        badgeClass = "bg-warning text-dark";
    } else if (normalizedStatus === "resolved") {
        badgeClass = "bg-success";
    } else if (normalizedStatus === "closed") {
        badgeClass = "bg-dark";
    }

    return `
        <span class="badge ${badgeClass}">
            ${status || "Unknown"}
        </span>
    `;
}

// =========================================
// STAT CARD
// =========================================
function statCard(
    title,
    value,
    icon,
    iconClass = "text-primary"
) {
    return `
        <div class="col-md-6 col-xl-3">
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="text-muted mb-1">
                                ${title}
                            </p>
                            <h3 class="fw-bold mb-0">
                                ${value ?? 0}
                            </h3>
                        </div>

                        <div>
                            <i class="bi ${icon} fs-1 ${iconClass}"></i>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}

// =========================================
// USER ROLE CARD
// =========================================
function roleCard(
    title,
    value,
    icon,
    iconClass
) {
    return `
        <div class="col-md-6 col-xl-3">
            <div class="card shadow-sm h-100">
                <div class="card-body">

                    <div class="d-flex align-items-center">
                        <div
                            class="rounded-circle bg-light p-3 me-3">
                            <i
                                class="bi ${icon} fs-4 ${iconClass}">
                            </i>
                        </div>

                        <div>
                            <p class="text-muted mb-1">
                                ${title}
                            </p>

                            <h4 class="fw-bold mb-0">
                                ${value ?? 0}
                            </h4>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
}

// =========================================
// RECENT USERS TABLE
// =========================================
function recentUsersTable(users) {
    if (!users || users.length === 0) {
        return `
            <div class="text-center text-muted py-4">
                <i class="bi bi-people fs-2 d-block mb-2"></i>
                No users found.
            </div>
        `;
    }

    return `
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Date Joined</th>
                    </tr>
                </thead>

                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>
                                <div class="fw-semibold">
                                    ${user.name || "—"}
                                </div>
                            </td>

                            <td>
                                ${user.email || "—"}
                            </td>

                            <td>
                                ${roleBadge(user.role)}
                            </td>

                            <td>
                                ${statusBadge(user.is_active)}
                            </td>

                            <td>
                                ${formatDate(user.date_joined)}
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// =========================================
// RECENT INCIDENTS TABLE
// =========================================
function recentIncidentsTable(incidents) {
    if (!incidents || incidents.length === 0) {
        return `
            <div class="text-center text-muted py-4">
                <i class="bi bi-shield-check fs-2 d-block mb-2"></i>
                No recent incidents.
            </div>
        `;
    }

    return `
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Incident</th>
                        <th>Location</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Reported By</th>
                    </tr>
                </thead>

                <tbody>
                    ${incidents.map(incident => `
                        <tr>
                            <td>
                                <div class="fw-semibold">
                                    ${incident.incident_type || "—"}
                                </div>
                            </td>

                            <td>
                                ${incident.location || "—"}
                            </td>

                            <td>
                                ${priorityBadge(incident.priority)}
                            </td>

                            <td>
                                ${incidentStatusBadge(incident.status)}
                            </td>

                            <td>
                                ${incident.reported_by || "—"}
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

// =========================================
// ADMIN TASKS
// =========================================
function adminTasks() {
    return `
        <div class="row g-4">

            <!-- Manage Users -->
            <div class="col-md-6 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-primary-subtle p-3 me-3">
                                <i class="bi bi-people fs-4 text-primary"></i>
                            </div>

                            <h5 class="mb-0">
                                Manage Users
                            </h5>
                        </div>

                        <p class="text-muted">
                            Add, edit, deactivate, and manage
                            SmartEntry user accounts.
                        </p>

                        <a
                            href="/src/pages/user-management.html"
                            class="btn btn-outline-primary">
                            <i class="bi bi-person-gear me-1"></i>
                            Manage Users
                        </a>
                    </div>
                </div>
            </div>

            <!-- Manage Visitors -->
            <div class="col-md-6 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-success-subtle p-3 me-3">
                                <i class="bi bi-person-badge fs-4 text-success"></i>
                            </div>

                            <h5 class="mb-0">
                                Visitors
                            </h5>
                        </div>

                        <p class="text-muted">
                            Review visitor activity and
                            manage visitor records.
                        </p>

                        <a
                            href="/src/pages/visitors.html"
                            class="btn btn-outline-success">
                            <i class="bi bi-people me-1"></i>
                            View Visitors
                        </a>
                    </div>
                </div>
            </div>

            <!-- Review Incidents -->
            <div class="col-md-6 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-danger-subtle p-3 me-3">
                                <i class="bi bi-exclamation-triangle fs-4 text-danger"></i>
                            </div>

                            <h5 class="mb-0">
                                Review Incidents
                            </h5>
                        </div>

                        <p class="text-muted">
                            Review security incidents,
                            priorities, and their status.
                        </p>

                        <a
                            href="/src/pages/incidents.html"
                            class="btn btn-outline-danger">
                            <i class="bi bi-shield-exclamation me-1"></i>
                            Review Incidents
                        </a>
                    </div>
                </div>
            </div>

            <!-- Reports -->
            <div class="col-md-6 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-info-subtle p-3 me-3">
                                <i class="bi bi-bar-chart fs-4 text-info"></i>
                            </div>

                            <h5 class="mb-0">
                                Reports
                            </h5>
                        </div>

                        <p class="text-muted">
                            Generate visitor and incident
                            activity reports.
                        </p>

                        <a
                            href="/src/pages/reports.html"
                            class="btn btn-outline-info">
                            <i class="bi bi-file-earmark-text me-1"></i>
                            Open Reports
                        </a>
                    </div>
                </div>
            </div>

            <!-- Settings -->
            <div class="col-md-6 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-warning-subtle p-3 me-3">
                                <i class="bi bi-gear fs-4 text-warning"></i>
                            </div>

                            <h5 class="mb-0">
                                System Settings
                            </h5>
                        </div>

                        <p class="text-muted">
                            Configure SmartEntry system,
                            visitor, notification, and security settings.
                        </p>

                        <a
                            href="/src/pages/settings.html"
                            class="btn btn-outline-warning">
                            <i class="bi bi-sliders me-1"></i>
                            Open Settings
                        </a>
                    </div>
                </div>
            </div>

            <!-- Django Administration -->
            <div class="col-md-6 col-xl-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-dark-subtle p-3 me-3">
                                <i class="bi bi-shield-lock fs-4 text-dark"></i>
                            </div>

                            <h5 class="mb-0">
                                Django Administration
                            </h5>
                        </div>

                        <p class="text-muted">
                            Access advanced administrative
                            controls and user management.
                        </p>

                        <a
                            href="http://127.0.0.1:8000/admin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="btn btn-outline-dark">
                            <i class="bi bi-box-arrow-up-right me-1"></i>
                            Open Admin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// =========================================
// RENDER ADMIN DASHBOARD
// =========================================
function renderAdminDashboard(data) {
    const users =
        data.users || {};

    const visitors =
        data.visitors || {};

    const incidents =
        data.incidents || {};

    const recentUsers =
        data.recent_users || [];

    const recentIncidents =
        data.recent_incidents || [];

    const byRole =
        users.by_role || {};

    const pageContent = `

        <!-- =====================================
             SYSTEM OVERVIEW
        ====================================== -->
        <div class="mb-4">
            <h4 class="fw-bold mb-1">
                System Overview
            </h4>

            <p class="text-muted">
                Monitor SmartEntry activity and system usage.
            </p>
        </div>

        <div class="row g-4 mb-5">
            ${statCard(
                "Total Users",
                users.total,
                "bi-people",
                "text-primary"
            )}
            ${statCard(
                "Active Users",
                users.active,
                "bi-person-check",
                "text-success"
            )}
            ${statCard(
                "Total Visitors",
                visitors.total,
                "bi-person-badge",
                "text-info"
            )}
            ${statCard(
                "Total Incidents",
                incidents.total,
                "bi-exclamation-triangle",
                "text-danger"
            )}
        </div>

        <!-- =====================================
             USER ROLES
        ====================================== -->
        <div class="mb-4">
            <h4 class="fw-bold mb-1">
                User Management
            </h4>

            <p class="text-muted">
                Current SmartEntry users by role.
            </p>
        </div>

        <div class="row g-4 mb-5">
            ${roleCard(
                "Administrators",
                byRole.admin,
                "bi-shield-lock",
                "text-danger"
            )}
            ${roleCard(
                "Security",
                byRole.security,
                "bi-shield-check",
                "text-warning"
            )}
            ${roleCard(
                "Reception",
                byRole.reception,
                "bi-person-badge",
                "text-primary"
            )}
            ${roleCard(
                "Managers",
                byRole.manager,
                "bi-person-workspace",
                "text-info"
            )}
        </div>

        <!-- =====================================
             INCIDENT OVERVIEW
        ====================================== -->
        <div class="mb-4">
            <h4 class="fw-bold mb-1">
                Incident Overview
            </h4>

            <p class="text-muted">
                Current security incident status.
            </p>
        </div>

        <div class="row g-4 mb-5">
            ${statCard(
                "Open",
                incidents.open,
                "bi-folder2-open",
                "text-danger"
            )}
            ${statCard(
                "Investigating",
                incidents.investigating,
                "bi-search",
                "text-warning"
            )}
            ${statCard(
                "Resolved",
                incidents.resolved,
                "bi-check-circle",
                "text-success"
            )}
            ${statCard(
                "High Priority",
                incidents.high_priority,
                "bi-exclamation-octagon",
                "text-danger"
            )}
        </div>

        <!-- =====================================
             RECENT USERS
        ====================================== -->
        <div class="card shadow-sm mb-5">
            <div class="card-header bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">
                            <i class="bi bi-people me-2"></i>
                            Recent Users
                        </h5>
                        <small class="text-muted">
                            Recently registered SmartEntry users
                        </small>
                    </div>

                    <a
                        href="/src/pages/user-management.html"
                        class="btn btn-sm btn-outline-primary">
                        Manage Users
                    </a>
                </div>
            </div>

            <div class="card-body p-0">
                ${recentUsersTable(recentUsers)}
            </div>
        </div>

        <!-- =====================================
             RECENT INCIDENTS
        ====================================== -->
        <div class="card shadow-sm mb-5">
            <div class="card-header bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Recent Incidents
                        </h5>
                        <small class="text-muted">
                            Latest security incidents recorded
                        </small>
                    </div>

                    <a
                        href="/src/pages/incidents.html"
                        class="btn btn-sm btn-outline-danger">
                        View Incidents
                    </a>
                </div>
            </div>

            <div class="card-body p-0">
                ${recentIncidentsTable(recentIncidents)}
            </div>
        </div>

        <!-- =====================================
             ADMIN TASKS
        ====================================== -->
        <div class="mb-4">
            <h4 class="fw-bold mb-1">
                Admin Tasks
            </h4>
            <p class="text-muted">
                Quick access to common administrative tasks.
            </p>
        </div>
        ${adminTasks()}
    `;
    loadLayout(
        "Admin Dashboard",
        pageContent
    );
}

// =========================================
// LOAD ADMIN DASHBOARD
// =========================================
async function loadAdminDashboard() {
    try {
        const response =
            await api.get(
                ADMIN_DASHBOARD_ENDPOINT
            );

        const data =
            response.data || {};
        console.log(
            "Admin dashboard loaded successfully:",
            data
        );
        renderAdminDashboard(data);

    } catch (error) {
        console.error(
            "Error loading admin dashboard:",
            error
        );

        loadLayout(
            "Admin Dashboard",
            `
                <div class="alert alert-danger">
                    <h5 class="alert-heading">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Unable to Load Admin Dashboard
                    </h5>
                    <p class="mb-2">
                        SmartEntry could not retrieve the
                        administrator dashboard data.
                    </p>

                    <hr>
                    <p class="mb-0">
                        Please make sure you are logged in
                        and the backend server is running.
                    </p>
                </div>
            `
        );

        if (error.response?.status === 401) {
            Swal.fire({
                icon: "warning",
                title: "Session Expired",
                text:
                    "Your session has expired. Please log in again.",
                confirmButtonText: "Go to Login"
            }).then(() => {
                localStorage.removeItem(
                    "accessToken"
                );
                localStorage.removeItem(
                    "refreshToken"
                );
                window.location.href =
                    "/login.html";
            });
        } else if (error.response?.status === 403) {

            Swal.fire({
                icon: "error",
                title: "Access Denied",
                text:
                    "You do not have administrator permissions."
            });
        } else if (error.response?.status === 404) {

            Swal.fire({
                icon: "error",
                title: "Endpoint Not Found",
                text:
                    "The admin dashboard API endpoint could not be found."
            });
        }
    }
}

// =========================================
// START
// =========================================
loadAdminDashboard();
export function sidebar() {
    return `

<div class="sidebar">
    <a href="/src/pages/dashboard.html" class="menu-item active">
        <i class="bi bi-grid me-2"></i>
        Dashboard
    </a>

    <a href="/src/pages/visitors.html" class="menu-item">
        <i class="bi bi-people me-2"></i>
        Visitors
    </a>

    <a href="/src/pages/incident.html" class="menu-item">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Incidents
    </a>

    <a href="/src/pages/reports.html" class="menu-item">
        <i class="bi bi-file-earmark-text me-2"></i>
        Reports
    </a>

    <a href="/src/pages/settings.html" class="menu-item">
        <i class="bi bi-gear me-2"></i>
        Settings
    </a>
</div>
`;
}
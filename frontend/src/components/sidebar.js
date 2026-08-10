export function sidebar() {

    const currentPath = window.location.pathname;

    const isActive = (page) => {
        return currentPath.includes(`/src/pages/${page}.html`);
    };

    return `

        <a
            href="/src/pages/dashboard.html"
            class="menu-item ${isActive("dashboard") ? "active" : ""}"
        >
            <i class="bi bi-grid-4x4 me-2"></i>
            Dashboard
        </a>


        <a
            href="/src/pages/visitors.html"
            class="menu-item ${isActive("visitors") ? "active" : ""}"
        >
            <i class="bi bi-people me-2"></i>
            Visitors
        </a>


        <a
            href="/src/pages/incidents.html"
            class="menu-item ${isActive("incidents") ? "active" : ""}"
        >
            <i class="bi bi-exclamation-triangle me-2"></i>
            Incidents
        </a>


        <a
            href="/src/pages/reports.html"
            class="menu-item ${isActive("reports") ? "active" : ""}"
        >
            <i class="bi bi-file-earmark-text me-2"></i>
            Reports
        </a>


        <a
            href="/src/pages/settings.html"
            class="menu-item ${isActive("settings") ? "active" : ""}"
        >
            <i class="bi bi-gear me-2"></i>
            Settings
        </a>

    `;
}
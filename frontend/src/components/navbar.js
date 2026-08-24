// =========================================
// NAVBAR
// =========================================
export function navbar() {
    const user = getLoggedInUser();
    const userName =
        user?.fullName ||
        user?.email ||
        "User";

    return `
        <nav class="navbar navbar-expand-lg console-navbar px-4">
            <div class="container-fluid">

                <button
                    type="button"
                    class="mobile-menu-toggle"
                    id="mobileMenuToggle"
                    aria-label="Open navigation"
                    aria-controls="sidebar"
                    aria-expanded="false">
                    <i class="bi bi-list"></i>
                </button>

                <!-- BRAND -->
                <div class="console-context"><span class="live-dot"></span>LIVE OPERATIONS</div>

                <!-- RIGHT SIDE -->
                <div class="d-flex align-items-center gap-3">
                    <button type="button" class="theme-toggle" id="themeToggle" title="Toggle theme" aria-label="Toggle theme">
                        <i class="bi bi-sun"></i>
                    </button>

                    <!-- NOTIFICATIONS -->
                    <div class="dropdown">
                        <button
                            type="button"
                            class="btn btn-link console-icon-button p-0 position-relative"
                            id="notificationBtn"
                            title="Notifications"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            aria-expanded="false">
                            <i class="bi bi-bell fs-4"></i>
                            <span
                                id="notificationBadge"
                                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">
                                0
                            </span>
                        </button>

                        <div
                            class="dropdown-menu dropdown-menu-end"
                            id="notificationMenu">
                            <div class="notification-empty">
                                <span class="spinner-border spinner-border-sm text-primary"></span>
                                <span>Loading activity…</span>
                            </div>
                        </div>
                    </div>

                    <!-- USER DROPDOWN -->
                    <div class="dropdown">
                        <button
                            class="btn btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-person-circle me-1"></i>
                            ${userName}
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end">

                            <!-- PROFILE -->
                            <li>
                                <a
                                    class="dropdown-item"
                                    href="/src/pages/settings.html">
                                    <i class="bi bi-person me-2"></i>
                                    ${userName}
                                </a>
                            </li>

                            <!-- SETTINGS -->
                            <li>
                                <a
                                    class="dropdown-item"
                                    href="/src/pages/settings.html">
                                    <i class="bi bi-gear me-2"></i>
                                    Settings
                                </a>
                            </li>

                            <li>
                                <hr class="dropdown-divider">
                            </li>

                            <!-- LOGOUT -->
                            <li>
                                <button
                                    class="dropdown-item text-danger"
                                    type="button"
                                    id="logoutBtn">
                                    <i class="bi bi-box-arrow-right me-2"></i>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    `;
}

// =========================================
// GET LOGGED-IN USER
// =========================================
function getLoggedInUser() {
    try {
        const token =
            localStorage.getItem("accessToken");
        if (!token) {
            return null;
        }

        const payload =
            JSON.parse(
                atob(
                    token
                        .split(".")[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

        return {
            id: payload.user_id,
            email: payload.email,
            first_name: payload.first_name,
            last_name: payload.last_name,
            role: payload.role,
            fullName:
                `${payload.first_name || ""} ${payload.last_name || ""}`
                    .trim()
        };

    } catch (error) {
        console.error(
            "Unable to read logged-in user:",
            error
        );
        return null;
    }
}

// =========================================
// LOGOUT
// =========================================
document.addEventListener("click", (event) => {
    const menuButton = event.target.closest("#mobileMenuToggle");
    const closeButton = event.target.closest("[data-sidebar-close]");
    const sidebarLink = event.target.closest(".app-sidebar a");

    if (menuButton) {
        const isOpen = document.body.classList.toggle("sidebar-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
        return;
    }

    if (closeButton || (sidebarLink && window.matchMedia("(max-width: 800px)").matches)) {
        closeMobileNavigation();
    }

    const themeButton = event.target.closest("#themeToggle");
    if (themeButton) {
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("smartentryTheme", next);
        themeButton.innerHTML = `<i class="bi bi-${next === "light" ? "moon" : "sun"}"></i>`;
        return;
    }
    const logoutButton =
        event.target.closest("#logoutBtn");
    if (!logoutButton) {
        return;
    }
    event.preventDefault();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href =
        "/";
});

function closeMobileNavigation() {
    document.body.classList.remove("sidebar-open");
    const menuButton = document.getElementById("mobileMenuToggle");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileNavigation();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
        closeMobileNavigation();
    }
});

const savedTheme = localStorage.getItem("smartentryTheme") || "dark";
document.documentElement.dataset.theme = savedTheme;

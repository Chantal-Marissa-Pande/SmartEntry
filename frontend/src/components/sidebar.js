// =========================================
// SIDEBAR
// =========================================
export function sidebar() {
    const currentPath =
        window.location.pathname;

    const user =
        getLoggedInUser();

    const isAdmin =
        user?.role === "admin";

    const isActive = (page) => {
        return currentPath.includes(
            `/src/pages/${page}.html`
        );
    };

    return `
        <!-- MAIN NAVIGATION -->
        <div class="sidebar-section">

            <a
                href="/src/pages/dashboard.html"
                class="menu-item ${
                    isActive("dashboard")
                        ? "active"
                        : ""
                }">
                <i class="bi bi-grid-4x4 me-2"></i>
                Dashboard
            </a>

            <a
                href="/src/pages/visitors.html"
                class="menu-item ${
                    isActive("visitors")
                        ? "active"
                        : ""
                }">
                <i class="bi bi-people me-2"></i>
                Visitors
            </a>

            <a
                href="/src/pages/incidents.html"
                class="menu-item ${
                    isActive("incidents")
                        ? "active"
                        : ""
                }">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Incidents
            </a>

            <a
                href="/src/pages/reports.html"
                class="menu-item ${
                    isActive("reports")
                        ? "active"
                        : ""
                }">
                <i class="bi bi-file-earmark-text me-2"></i>
                Reports
            </a>

            <a
                href="/src/pages/settings.html"
                class="menu-item ${
                    isActive("settings")
                        ? "active"
                        : ""
                }">
                <i class="bi bi-gear me-2"></i>
                Settings
            </a>
        </div>

        ${
            isAdmin
                ? `
                    <!-- ADMINISTRATION -->
                    <div class="sidebar-section mt-4">

                        <a
                            href="/src/pages/admin-dashboard.html"
                            class="menu-item ${
                                isActive("admin-dashboard")
                                    ? "active"
                                    : ""
                            }">
                            <i class="bi bi-shield-lock me-2"></i>
                            Admin Dashboard
                        </a>

                        <a
                            href="/src/pages/user-management.html"
                            class="menu-item ${
                                isActive("user-management")
                                    ?"active"
                                    :""
                            }">
                            <i class="bi bi-person-gear me-2"></i>
                            User Management
                        </a>
                    </div>
                `
                : ""
        }
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
            role: payload.role
        };

    } catch (error) {
        console.error(
            "Unable to read logged-in user:",
            error
        );
        return null;
    }
}
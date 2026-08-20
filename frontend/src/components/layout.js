import { navbar } from "./navbar.js";
import { sidebar } from "./sidebar.js";
import { initializeNotificationCenter } from "./notificationCenter.js";
import { initializePickerInputs } from "./pickerInputs.js";

export function loadLayout(title, content) {
    const user =
        getLoggedInUser();

    const organizationName =
        user?.organization_name ||
        "SmartEntry";

    const userName =
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
        user?.email ||
        "User";

    document.getElementById("app").innerHTML = `
        <div class="app-shell">
            <aside class="app-sidebar">
                <div class="sidebar-brand">
                    <img src="/smartentry-mark.png" alt="" class="sidebar-brand-mark">
                    <div><strong>SmartEntry</strong><span>SECURITY CONSOLE</span></div>
                </div>
                <div class="system-status"><span></span>SYSTEM ONLINE</div>
                <div id="sidebar"></div>
            </aside>

            <div class="app-workspace">
                <div id="navbar"></div>
                <main class="app-main">
                    <header class="page-heading">
                        <div>
                            <span>${organizationName.toUpperCase()} / ${title.toUpperCase()}</span>
                            <h1>${title}</h1>
                            <p>Welcome back, ${userName} — ${organizationName}</p>
                        </div>
                    </header>
                    ${content}
                </main>
            </div>
        </div>

        <!-- MODAL CONTAINER -->
        <div id="modal-container"></div>
    `;

    document.getElementById("navbar").innerHTML =
        navbar();

    document.getElementById("sidebar").innerHTML =
        sidebar();

    initializeNotificationCenter();
    initializePickerInputs();
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
            organization_id: payload.organization_id,
            organization_name: payload.organization_name
        };

    } catch (error) {
        console.error(
            "Unable to read logged-in user:",
            error
        );
        return null;
    }
}

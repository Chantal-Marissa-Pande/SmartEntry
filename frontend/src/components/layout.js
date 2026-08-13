import { navbar } from "./navbar.js";
import { sidebar } from "./sidebar.js";

export function loadLayout(title, content) {
    const user =
        getLoggedInUser();

    const displayName =
        user?.first_name ||
        "User";

    document.getElementById("app").innerHTML = `
        <div id="navbar"></div>
        <div class="container-fluid">
            <div class="row g-0">
                <div class="col-auto px-0">
                    <div id="sidebar"></div>
                </div>

                <main class="col bg-light min-vh-100 p-4">
                    <div
                        class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="fw-bold">
                                ${title}
                            </h2>
                            <p class="text-muted mb-0">
                                Welcome back,
                                ${displayName}
                            </p>
                        </div>
                    </div>

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
export function navbar() {
    const user = getLoggedInUser();
    const displayName =
        user?.name ||
        user?.username ||
        user?.email ||
        "User";

    return `
        <nav class="navbar navbar-expand-lg bg-white shadow-sm px-4">
            <div class="container-fluid">

                <!-- BRAND -->
                <a
                    class="navbar-brand fw-bold"
                    href="/dashboard.html">
                    SmartEntry
                </a>

                <!-- RIGHT SIDE -->
                <div class="d-flex align-items-center">

                    <!-- NOTIFICATIONS -->
                    <button
                        type="button"
                        class="btn btn-link text-dark p-0 me-4 position-relative"
                        id="notificationBtn"
                        title="Notifications"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="bi bi-bell fs-4"></i>
                        <span
                           id="notificationBadge"
                           class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">
                           0
                        </span> 
                    </button>

                    <ul
                        class="dropdown-menu dropdown-menu-end"
                        id="notificationMenu"
                        style"min-width:320px;">
                        <li>
                            <h6 class="dropdown-header">
                                Notifications
                            </h6>
                        </li>
                        <li>
                            <div class="dropdown-item text-muted text-center py-3">
                                No new notifications
                            </div>
                        </li>

                    </ul>
                </div>

                    <!-- USER DROPDOWN -->
                    <div class="dropdown">
                        <button
                            class="btn btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-person-circle me-1"></i>
                            ${displayName}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">

                            <!-- PROFILE -->
                            <li>
                                <a
                                    class="dropdown-item"
                                    href="/profile.html"
                                    id="profileBtn">
                                    <i class="bi bi-person me-2"></i>
                                    Profile
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

/* =========================================
   GET LOGGED-IN USER
========================================= */
function getLoggedInUser() {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return null;
        }

        const payload = JSON.parse(
            atob(
                token
                    .split(".")[1]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );

        return {
            id: payload.user_id,
            username: payload.username,
            email: payload.email,
            name: payload.name
        };

    } catch (error) {
        console.error(
            "Unable to read logged-in user:",
            error
        );
        return null;
    }
}

/* =========================================
   LOGOUT
========================================= */
document.addEventListener("click", (event) => {

    const logoutButton =
        event.target.closest("#logoutBtn");
    if (!logoutButton) {
        return;
    }
    event.preventDefault();

    // Remove authentication tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect to login
    window.location.href = "/login.html";
});
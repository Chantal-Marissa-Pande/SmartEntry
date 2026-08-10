import { loadLayout } from "../components/layout.js";

// =========================================
// RENDER PAGE
// =========================================
function renderPage() {
    const pageContent = `

        <!-- Profile Settings -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">

                <h5 class="mb-0">
                    <i class="bi bi-person-circle me-2"></i>
                    Profile
                </h5>
            </div>

            <div class="card-body">
                <form id="profileForm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label
                                for="fullName"
                                class="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="fullName"
                                class="form-control"
                                value="Admin User">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="email"
                                class="form-label">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                class="form-control"
                                value="admin@smartentry.com">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="phone"
                                class="form-label">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                id="phone"
                                class="form-control"
                                value="+254 700 000 000">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="role"
                                class="form-label">
                                Role
                            </label>

                            <input
                                type="text"
                                id="role"
                                class="form-control"
                                value="Administrator"
                                disabled>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button
                            type="submit"
                            class="btn btn-primary">
                            <i class="bi bi-save me-1"></i>
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Visitor Settings -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">

                <h5 class="mb-0">
                    <i class="bi bi-person-badge me-2"></i>
                    Visitor Settings
                </h5>
            </div>

            <div class="card-body">
                <div class="form-check form-switch mb-3">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="requireId"
                        checked>

                    <label
                        class="form-check-label"
                        for="requireId">
                        Require identification when registering visitors
                    </label>
                </div>

                <div class="form-check form-switch mb-3">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="visitorPhoto">
                    <label
                        class="form-check-label"
                        for="visitorPhoto">
                        Require visitor photograph
                    </label>
                </div>

                <div class="form-check form-switch">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="hostNotification"
                        checked>
                    <label
                        class="form-check-label"
                        for="hostNotification">
                        Notify host when visitor arrives
                    </label>
                </div>
            </div>
        </div>

        <!-- Notification Settings -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    <i class="bi bi-bell me-2"></i>
                    Notifications
                </h5>
            </div>

            <div class="card-body">
                <div class="form-check form-switch mb-3">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="incidentNotifications"
                        checked>
                    <label
                        class="form-check-label"
                        for="incidentNotifications">
                        Incident notifications
                    </label>
                </div>

                <div class="form-check form-switch mb-3">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="visitorNotifications"
                        checked>
                    <label
                        class="form-check-label"
                        for="visitorNotifications">
                        Visitor arrival notifications
                    </label>
                </div>

                <div class="form-check form-switch">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="emailNotifications">
                    <label
                        class="form-check-label"
                        for="emailNotifications">
                        Email notifications
                    </label>
                </div>
            </div>
        </div>

        <!-- Security Settings -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    <i class="bi bi-shield-lock me-2"></i>
                    Security
                </h5>
            </div>

            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-1">
                            Change Password
                        </h6>
                        <p class="text-muted mb-0">
                            Update your account password.
                        </p>
                    </div>

                    <button
                        type="button"
                        id="changePasswordBtn"
                        class="btn btn-outline-primary">
                        Change Password
                    </button>
                </div>

                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">
                            Session Security
                        </h6>
                        <p class="text-muted mb-0">
                            Automatically log out after inactivity.
                        </p>
                    </div>

                    <select
                        id="sessionTimeout"
                        class="form-select"
                        style="width: 180px;">

                        <option value="15">
                            15 minutes
                        </option>
                        <option value="30" selected>
                            30 minutes
                        </option>
                        <option value="60">
                            1 hour
                        </option>
                        <option value="120">
                            2 hours
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- System Preferences -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    <i class="bi bi-sliders me-2"></i>
                    System Preferences
                </h5>
            </div>

            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label
                            for="dateFormat"
                            class="form-label">
                            Date Format
                        </label>

                        <select
                            id="dateFormat"
                            class="form-select">

                            <option value="DD/MM/YYYY" selected>
                                DD/MM/YYYY
                            </option>
                            <option value="MM/DD/YYYY">
                                MM/DD/YYYY
                            </option>
                            <option value="YYYY-MM-DD">
                                YYYY-MM-DD
                            </option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label
                            for="timezone"
                            class="form-label">
                            Time Zone
                        </label>

                        <select
                            id="timezone"
                            class="form-select">

                            <option value="Africa/Nairobi" selected>
                                Africa/Nairobi (EAT)
                            </option>
                            <option value="UTC">
                                UTC
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Save Settings -->
        <div class="d-flex justify-content-end mb-4">
            <button
                id="saveSettingsBtn"
                class="btn btn-primary">
                <i class="bi bi-check-circle me-1"></i>
                Save Settings
            </button>
        </div>
    `;
    loadLayout("Settings", pageContent);
}

// =========================================
// PROFILE FORM
// =========================================
document.addEventListener("submit", (event) => {

    if (event.target.id !== "profileForm") {
        return;
    }
    event.preventDefault();

    Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been updated successfully.",
        confirmButtonText: "OK"
    });
});

// =========================================
// SAVE SETTINGS
// =========================================
document.addEventListener("click", (event) => {

    const button =
        event.target.closest("#saveSettingsBtn");
    if (!button) return;

    Swal.fire({
        icon: "success",
        title: "Settings Saved",
        text: "Your SmartEntry settings have been saved successfully.",
        confirmButtonText: "OK"
    });
});

// =========================================
// CHANGE PASSWORD
// =========================================
document.addEventListener("click", (event) => {

    const button =
        event.target.closest("#changePasswordBtn");
    if (!button) return;

    Swal.fire({
        title: "Change Password",
        html: `
            <input
                type="password"
                id="currentPassword"
                class="form-control mb-3"
                placeholder="Current password">

            <input
                type="password"
                id="newPassword"
                class="form-control mb-3"
                placeholder="New password">

            <input
                type="password"
                id="confirmPassword"
                class="form-control"
                placeholder="Confirm new password">
        `,
        showCancelButton: true,
        confirmButtonText: "Update Password",
        cancelButtonText: "Cancel",

        preConfirm: () => {
            const current =
                document.getElementById("currentPassword").value;
            const newPassword =
                document.getElementById("newPassword").value;
            const confirm =
                document.getElementById("confirmPassword").value;

            if (!current || !newPassword || !confirm) {

                Swal.showValidationMessage(
                    "Please fill in all password fields."
                );
                return false;
            }

            if (newPassword !== confirm) {

                Swal.showValidationMessage(
                    "The new passwords do not match."
                );
                return false;
            }

            if (newPassword.length < 8) {

                Swal.showValidationMessage(
                    "Password must contain at least 8 characters."
                );
                return false;
            }

            return true;
        }

    }).then((result) => {
        if (!result.isConfirmed) {
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Password Updated",
            text: "Your password has been updated successfully."
        });
    });
});
renderPage();
import { loadLayout } from "../components/layout.js";
import api from "../services/api.js";
import { getOrganizations } from "../services/organizationService.js";

let managedUsers = [];
let managedOrganizations = [];

function organizationOptions(selected = "") {
    return managedOrganizations.map((organization) => `<option value="${organization.id}" ${Number(selected) === organization.id ? "selected" : ""}>${organization.name}</option>`).join("");
}

// =========================================
// LOAD USERS
// =========================================
async function loadUsers() {
    try {
        const [response, organizations] = await Promise.all([
            api.get("/auth/users/"),
            getOrganizations()
        ]);
        const users = response.data?.users || [];
        managedUsers = users;
        managedOrganizations = organizations;

        const content = `
            <div class="card shadow-sm">

                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        User Management
                    </h5>

                    <button
                        class="btn btn-primary"
                        id="addUserBtn">
                        <i class="bi bi-person-plus me-1"></i>
                        Add User
                    </button>
                </div>

                <div class="card-body">

                    <div class="table-responsive">

                        <table class="table table-hover align-middle">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Organization</th>
                                    <th>Status</th>
                                    <th width="250">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                ${users.map(user => `
                                    <tr>

                                        <td>
                                            ${user.first_name || ""}
                                            ${user.last_name || ""}
                                        </td>

                                        <td>
                                            ${user.email}
                                        </td>

                                        <td>
                                            <span class="badge bg-primary">
                                                ${user.role}
                                            </span>
                                        </td>

                                        <td>${user.organization_name || "Unassigned"}</td>

                                        <td>
                                            ${
                                                user.is_active
                                                    ? `<span class="badge bg-success">
                                                            Active
                                                       </span>`
                                                    : `<span class="badge bg-secondary">
                                                            Inactive
                                                       </span>`
                                            }
                                        </td>

                                        <td>

                                            <button
                                                class="btn btn-sm btn-warning edit-user"
                                                data-id="${user.id}">
                                                <i class="bi bi-pencil"></i>
                                            </button>

                                            <button
                                                class="btn btn-sm ${
                                                    user.is_active
                                                        ? "btn-secondary"
                                                        : "btn-success"
                                                } toggle-user"
                                                data-id="${user.id}"
                                                data-active="${user.is_active}">
                                                ${
                                                    user.is_active
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }
                                            </button>

                                            <button
                                                class="btn btn-sm btn-danger delete-user"
                                                data-id="${user.id}">
                                                <i class="bi bi-trash"></i>
                                            </button>

                                        </td>

                                    </tr>
                                `).join("")}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        `;

        loadLayout(
            "User Management",
            content
        );

        initializeEvents();

    } catch (error) {

        console.error(error);

        loadLayout(
            "User Management",
            `
                <div class="alert alert-danger">
                    Unable to load users.
                </div>
            `
        );
    }
}

// =========================================
// EVENTS
// =========================================
function initializeEvents() {

    document
        .getElementById("addUserBtn")
        ?.addEventListener(
            "click",
            showAddUserModal
        );

    document
        .querySelectorAll(".edit-user")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    editUser(
                        button.dataset.id
                    )
            );
        });

    document
        .querySelectorAll(".toggle-user")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    toggleUser(
                        button.dataset.id,
                        button.dataset.active
                    )
            );
        });

    document
        .querySelectorAll(".delete-user")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    deleteUser(
                        button.dataset.id
                    )
            );
        });
}

// =========================================
// ADD USER
// =========================================
async function showAddUserModal() {

    const { value: formValues } =
        await Swal.fire({

            title: "Add User",

            html: `
                <input
                    id="first_name"
                    class="swal2-input"
                    placeholder="First Name">

                <input
                    id="last_name"
                    class="swal2-input"
                    placeholder="Last Name">

                <input
                    id="email"
                    class="swal2-input"
                    placeholder="Email">

                <input
                    id="password"
                    type="password"
                    class="swal2-input"
                    placeholder="Password">

                <select
                    id="role"
                    class="swal2-input">

                    <option value="admin">
                        Admin
                    </option>

                    <option value="security">
                        Security
                    </option>

                    <option value="reception">
                        Reception
                    </option>

                    <option value="manager">
                        Manager
                    </option>

                </select>

                <select id="organization" class="swal2-input">
                    <option value="">Select organization</option>
                    ${organizationOptions()}
                </select>
            `,

            showCancelButton: true,

            preConfirm: () => ({
                first_name:
                    document.getElementById("first_name").value,

                last_name:
                    document.getElementById("last_name").value,

                email:
                    document.getElementById("email").value,

                password:
                    document.getElementById("password").value,

                role:
                    document.getElementById("role").value,

                organization:
                    document.getElementById("organization").value || null
            })
        });

    if (!formValues) return;

    try {

        await api.post(
            "/auth/users/",
            formValues
        );

        Swal.fire(
            "Success",
            "User created successfully",
            "success"
        );

        loadUsers();

    } catch (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Failed to create user",
            "error"
        );
    }
}

// =========================================
// EDIT USER
// =========================================
async function editUser(id) {

    const user = managedUsers.find((item) => item.id === Number(id));

    const { value } =
        await Swal.fire({

            title: "Edit User",

            html: `
                <select
                    id="role"
                    class="swal2-input">

                    <option value="admin" ${user?.role === "admin" ? "selected" : ""}>
                        Admin
                    </option>

                    <option value="security" ${user?.role === "security" ? "selected" : ""}>
                        Security
                    </option>

                    <option value="reception" ${user?.role === "reception" ? "selected" : ""}>
                        Reception
                    </option>

                    <option value="manager" ${user?.role === "manager" ? "selected" : ""}>
                        Manager
                    </option>

                </select>

                <select id="organization" class="swal2-input">
                    ${organizationOptions(user?.organization)}
                </select>
            `,

            showCancelButton: true,

            preConfirm: () => ({
                role:
                    document.getElementById("role").value,

                organization:
                    document.getElementById("organization").value || null
            })
        });

    if (!value) return;

    try {

        await api.put(
            `/auth/users/${id}/`,
            value
        );

        Swal.fire(
            "Updated",
            "User updated successfully",
            "success"
        );

        loadUsers();

    } catch (error) {

        Swal.fire(
            "Error",
            "Failed to update user",
            "error"
        );
    }
}

// =========================================
// ACTIVATE / DEACTIVATE USER
// =========================================
async function toggleUser(
    id,
    currentState
) {

    try {

        await api.put(
            `/auth/users/${id}/`,
            {
                is_active:
                    currentState !== "true"
            }
        );

        loadUsers();

    } catch (error) {

        Swal.fire(
            "Error",
            "Unable to update user status",
            "error"
        );
    }
}

// =========================================
// DELETE USER
// =========================================
async function deleteUser(id) {

    const result =
        await Swal.fire({
            title: "Delete User?",
            text:
                "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true
        });

    if (!result.isConfirmed) {
        return;
    }

    try {

        await api.delete(
            `/auth/users/${id}/`
        );

        Swal.fire(
            "Deleted",
            "User deleted successfully",
            "success"
        );

        loadUsers();

    } catch (error) {

        Swal.fire(
            "Error",
            "Failed to delete user",
            "error"
        );
    }
}

// =========================================
// START
// =========================================
loadUsers();

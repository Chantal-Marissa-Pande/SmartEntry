import { loadLayout } from "../components/layout.js";
import api from "../services/api.js";

async function loadUsers() {
    try {
        const response = await api.get("/auth/users/");
        const users = response.data || [];
        const content = `
            <div class="card shadow-sm">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">User Management</h5>
                    <button
                        class="btn btn-primary"
                        id="addUserBtn">
                        Add User
                    </button>
                </div>

                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
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
                                            ${user.role}
                                        </td>

                                        <td>
                                            ${user.is_active
                                                ? '<span class="badge bg-success">Active</span>'
                                                : '<span class="badge bg-secondary">Inactive</span>'
                                            }
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
loadUsers();
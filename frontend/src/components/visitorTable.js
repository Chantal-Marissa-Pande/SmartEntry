import { statusBadge } from "./statusBadge.js";

export function visitorTable(visitors = []) {
    const rows = visitors.map(visitor => `

        <tr>
            <td>${visitor.name}</td>
            <td>${visitor.company}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.nationalId}</td>
            <td>${visitor.host}</td>
            <td>${visitor.purpose}</td>
            <td>${visitor.visitorType}</td>
            <td>${visitor.expectedTime}</td>
            <td>${statusBadge(visitor.status)}</td>

            <td>
                <button
                class="btn btn-sm btn-outline-primary view-btn"
                data-id="${visitor.id}">
                    View
                </button>

                <button
                class="btn btn-sm btn-outline-warning edit-btn"
                data-id="${visitor.id}">
                    Edit
                </button>

                <button class="btn btn-sm btn-outline-danger delete-btn"
                data-id="${visitor.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");

    return `
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    Visitors
                </h5>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Phone</th>
                            <th>National ID</th>
                            <th>Host</th>
                            <th>Purpose</th>
                            <th>Type</th>
                            <th>Expected Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
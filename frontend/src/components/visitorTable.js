import { statusBadge } from "./statusBadge.js";

export function visitorTable(visitors = []) {
    const rows = visitors.map(visitor => `

        <tr>
            <td>
                <strong>${visitor.name}</strong>
            </td>

            <td>
                ${visitor.company || "-"}
            </td>
            
            <td>
                ${visitor.phone || "-"}
            </td>

            <td>
                ${visitor.nationalId || "-"}
            </td>

            <td>
                ${visitor.host || "-"}
            </td>

            <td>
                ${visitor.purpose || "-"}
            </td>

            <td>
                ${visitor.visitorType || "-"}
            </td>

            <td>
                ${visitor.expectedTime || "-"}
            </td>

            <td>
                ${statusBadge(visitor.status)}
            </td>

            <td class="text-nowrap">
                <button
                    class="btn btn-sm btn-outline-primary view-btn"
                    data-id="${visitor.id}"
                    title="View Visitor">
                    <i class="bi bi-eye"></i>
                </button>

                <button
                    class="btn btn-sm btn-outline-warning edit-btn"
                    data-id="${visitor.id}"
                    title="Edit Visitor">
                    <i class="bi bi-pencil"></i>
                </button>

                <button
                    class="btn btn-sm btn-outline-danger delete-btn"
                    data-id="${visitor.id}"
                    title="Delete Visitor">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");

    return `
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    Visitors Records
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
                        ${
                            rows|| `
                            <tr>
                                <td
                                    colspan="10"
                                    class="text-center text-muted py-4">
                                    No visitors found.
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
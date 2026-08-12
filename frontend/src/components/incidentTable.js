export function incidentTable(incidents = []) {
    const getStatusClass = (status) => {
        switch (status) {
            case "Open":
                return "bg-danger";

            case "Investigating":
                return "bg-warning text-dark";

            case "Resolved":
                return "bg-success";

            default:
                return "bg-secondary";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "High":
                return "bg-danger";

            case "Medium":
                return "bg-warning text-dark";

            case "Low":
                return "bg-info text-dark";

            default:
                return "bg-secondary";
        }
    };

    const rows = incidents.length
        ? incidents.map((incident) => {

            return `
                <tr>

                    <!-- TYPE -->
                    <td>
                        <strong>
                            ${incident.type || "-"}
                        </strong>
                    </td>

                    <!-- LOCATION -->
                    <td>
                        ${incident.location || "-"}
                    </td>

                    <!-- DATE -->
                    <td>
                        ${incident.date || "-"}
                    </td>

                    <!-- TIME -->
                    <td>
                        ${incident.time || "-"}
                    </td>

                    <!-- PRIORITY -->
                    <td>
                        <span class="badge ${getPriorityClass(incident.priority)}">
                            ${incident.priority || "-"}
                        </span>
                    </td>

                    <!-- STATUS -->
                    <td>
                        <span class="badge ${getStatusClass(incident.status)}">
                            ${incident.status || "-"}
                        </span>
                    </td>

                    <!-- ACTIONS -->
                    <td class="text-nowrap">

                        <button
                            class="btn btn-sm btn-outline-primary view-incident-btn"
                            data-id="${incident.id}"
                            title="View Incident">
                            <i class="bi bi-eye"></i>
                        </button>

                        <button
                            class="btn btn-sm btn-outline-warning edit-incident-btn"
                            data-id="${incident.id}"
                            title="Edit Incident">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button
                            class="btn btn-sm btn-outline-danger delete-incident-btn"
                            data-id="${incident.id}"
                            title="Delete Incident">
                            <i class="bi bi-trash"></i>
                        </button>

                    </td>
                </tr>
            `;
        }).join("")
        : `
            <tr>
                <td
                    colspan="7"
                    class="text-center text-muted py-4">
                    <i class="bi bi-shield-check fs-3 d-block mb-2"></i>
                    No incidents found.
                </td>
            </tr>
        `;

    return `
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        Incident Records
                    </h5>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Priority</th>
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
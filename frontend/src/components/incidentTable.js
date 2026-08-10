export function incidentTable(incidents = []) {

    const rows = incidents.map(incident => {
        let statusClass = "bg-secondary";

        if (incident.status === "Open") {
            statusClass = "bg-danger";
        }

        if (incident.status === "Investigating") {
            statusClass = "bg-warning text-dark";
        }

        if (incident.status === "Resolved") {
            statusClass = "bg-success";
        }


        let priorityClass = "bg-secondary";

        if (incident.priority === "High") {
            priorityClass = "bg-danger";
        }

        if (incident.priority === "Medium") {
            priorityClass = "bg-warning text-dark";
        }

        if (incident.priority === "Low") {
            priorityClass = "bg-info text-dark";
        }


        return `
            <tr>
                <td>
                    <strong>
                        ${incident.type}
                    </strong>

                </td>

                <td>
                    ${incident.location}
                </td>

                <td>
                    ${incident.date}
                </td>

                <td>
                    ${incident.time}
                </td>

                <td>
                    <span class="badge ${priorityClass}">
                        ${incident.priority}
                    </span>
                </td>

                <td>
                    <span class="badge ${statusClass}">
                        ${incident.status}
                    </span>
                </td>

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

    }).join("");


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
                        ${
                            rows ||
                            `
                                <tr>
                                    <td
                                        colspan="7"
                                        class="text-center text-muted py-4">
                                        No incidents found.
                                    </td>
                                </tr>
                            `
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
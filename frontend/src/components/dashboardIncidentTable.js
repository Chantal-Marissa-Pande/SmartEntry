export function dashboardIncidentTable(incidents = []) {
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
            case "Critical":
                return "bg-dark";
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
        ? incidents.map((incident) => `
            <tr>
                <td>
                    <strong>
                        ${incident.type || incident.incident_type || "-"}
                    </strong>
                </td>

                <td>
                    <span class="badge ${getPriorityClass(incident.priority)}">
                        ${incident.priority}
                    </span>
                </td>

                <td>
                    <span class="badge ${getStatusClass(incident.status)}">
                        ${incident.status}
                    </span>
                </td>
            </tr>
        `).join("")
        : `
            <tr>
                <td colspan="3" class="text-center text-muted py-4">
                    No incidents found
                </td>
            </tr>
        `;

    return `
        <div class="card shadow-sm">

            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Recent Incidents</h5>
                <a
                    href="incidents.html"
                    class="btn btn-sm btn-outline-primary">
                    View All
                </a>
            </div>

            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Type</th>
                            <th>Priority</th>
                            <th>Status</th>
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
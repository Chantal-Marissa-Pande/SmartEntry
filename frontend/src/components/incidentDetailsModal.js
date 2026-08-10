export function incidentDetailsModal(incident) {
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
        <div
            class="modal fade"
            id="incidentDetailsModal"
            tabindex="-1"
            aria-hidden="true">

            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">

                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Incident Details
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal">
                        </button>
                    </div>


                    <div class="modal-body">
                        <div class="row g-4">

                            <div class="col-md-6">
                                <div class="text-muted small">
                                    Incident Type
                                </div>
                                <div class="fw-semibold">
                                    ${incident.type}
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="text-muted small">
                                    Location
                                </div>
                                <div class="fw-semibold">
                                    ${incident.location}
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="text-muted small">
                                    Date
                                </div>
                                <div class="fw-semibold">
                                    ${incident.date}
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="text-muted small">
                                    Time
                                </div>
                                <div class="fw-semibold">
                                    ${incident.time}
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="text-muted small">
                                    Priority
                                </div>
                                <span class="badge ${priorityClass}">
                                    ${incident.priority}
                                </span>
                            </div>

                            <div class="col-md-6">
                                <div class="text-muted small">
                                    Status
                                </div>
                                <span class="badge ${statusClass}">
                                    ${incident.status}
                                </span>
                            </div>

                            <div class="col-12">
                                <div class="text-muted small">
                                    Reported By
                                </div>

                                <div class="fw-semibold">
                                    ${incident.reportedBy}
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="text-muted small mb-1">
                                    Description
                                </div>
                                <div class="border rounded p-3 bg-light">
                                    ${incident.description}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
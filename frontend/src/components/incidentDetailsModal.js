export function incidentDetailsModal(incident) {

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


    return `
        <div
            class="modal fade"
            id="incidentDetailsModal"
            tabindex="-1"
            aria-labelledby="incidentDetailsModalLabel"
            aria-hidden="true">

            <div class="modal-dialog modal-lg">

                <div class="modal-content">

                    <!-- HEADER -->
                    <div class="modal-header">

                        <h5
                            class="modal-title"
                            id="incidentDetailsModalLabel">

                            <i class="bi bi-exclamation-triangle me-2"></i>

                            Incident Details

                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        </button>

                    </div>


                    <!-- BODY -->
                    <div class="modal-body">

                        <div class="row g-4">

                            <!-- INCIDENT TYPE -->
                            <div class="col-md-6">

                                <div class="text-muted small">
                                    Incident Type
                                </div>

                                <div class="fw-semibold">
                                    ${incident.type || "-"}
                                </div>

                            </div>


                            <!-- LOCATION -->
                            <div class="col-md-6">

                                <div class="text-muted small">
                                    Location
                                </div>

                                <div class="fw-semibold">
                                    ${incident.location || "-"}
                                </div>

                            </div>


                            <!-- DATE -->
                            <div class="col-md-6">

                                <div class="text-muted small">
                                    Date
                                </div>

                                <div class="fw-semibold">
                                    ${incident.date || "-"}
                                </div>

                            </div>


                            <!-- TIME -->
                            <div class="col-md-6">

                                <div class="text-muted small">
                                    Time
                                </div>

                                <div class="fw-semibold">
                                    ${incident.time || "-"}
                                </div>

                            </div>


                            <!-- PRIORITY -->
                            <div class="col-md-6">

                                <div class="text-muted small mb-1">
                                    Priority
                                </div>

                                <span
                                    class="badge ${getPriorityClass(
                                        incident.priority
                                    )}">

                                    ${incident.priority || "-"}

                                </span>

                            </div>


                            <!-- STATUS -->
                            <div class="col-md-6">

                                <div class="text-muted small mb-1">
                                    Status
                                </div>

                                <span
                                    class="badge ${getStatusClass(
                                        incident.status
                                    )}">

                                    ${incident.status || "-"}

                                </span>

                            </div>


                            <!-- REPORTED BY -->
                            <div class="col-12">

                                <div class="text-muted small">
                                    Reported By
                                </div>

                                <div class="fw-semibold">

                                    ${
                                        incident.reportedBy ||
                                        incident.reported_by ||
                                        "-"
                                    }

                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- FOOTER -->
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
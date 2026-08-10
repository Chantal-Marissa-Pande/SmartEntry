export function incidentModal(incident = null) {
    const isEditing = incident !== null;

    return `
        <div
            class="modal fade"
            id="incidentModal"
            tabindex="-1"
            aria-labelledby="incidentModalLabel"
            aria-hidden="true">

            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5
                            class="modal-title"
                            id="incidentModalLabel">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            ${isEditing
                                ? "Edit Incident"
                                : "Report Incident"}
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        </button>
                    </div>


                    <form id="incidentForm">
                        <div class="modal-body">
                            <div class="row g-3">

                                <!-- Incident Type -->
                                <div class="col-md-6">
                                    <label
                                        for="incidentType"
                                        class="form-label">
                                        Incident Type
                                    </label>

                                    <select
                                        id="incidentType"
                                        class="form-select"
                                        required>

                                        <option value="">
                                            Select incident type
                                        </option>

                                        <option
                                            value="Unauthorized Access"
                                            ${incident?.type === "Unauthorized Access"
                                                ? "selected"
                                                : ""}>
                                            Unauthorized Access
                                        </option>

                                        <option
                                            value="Lost Visitor Badge"
                                            ${incident?.type === "Lost Visitor Badge"
                                                ? "selected"
                                                : ""}>
                                            Lost Visitor Badge
                                        </option>

                                        <option
                                            value="Unauthorized Vehicle"
                                            ${incident?.type === "Unauthorized Vehicle"
                                                ? "selected"
                                                : ""}>
                                            Unauthorized Vehicle
                                        </option>

                                        <option
                                            value="Suspicious Activity"
                                            ${incident?.type === "Suspicious Activity"
                                                ? "selected"
                                                : ""}>
                                            Suspicious Activity
                                        </option>

                                        <option
                                            value="Other"
                                            ${incident?.type === "Other"
                                                ? "selected"
                                                : ""}>
                                            Other
                                        </option>
                                    </select>
                                </div>


                                <!-- Location -->
                                <div class="col-md-6">
                                    <label
                                        for="incidentLocation"
                                        class="form-label">
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        id="incidentLocation"
                                        class="form-control"
                                        value="${incident?.location || ""}"
                                        required>
                                </div>


                                <!-- Date -->
                                <div class="col-md-6">
                                    <label
                                        for="incidentDate"
                                        class="form-label">
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        id="incidentDate"
                                        class="form-control"
                                        value="${incident?.date || ""}"
                                        required>
                                </div>


                                <!-- Time -->
                                <div class="col-md-6">
                                    <label
                                        for="incidentTime"
                                        class="form-label">
                                        Time
                                    </label>

                                    <input
                                        type="time"
                                        id="incidentTime"
                                        class="form-control"
                                        value="${incident?.time || ""}"
                                        required>
                                </div>


                                <!-- Priority -->
                                <div class="col-md-6">
                                    <label
                                        for="incidentPriority"
                                        class="form-label">
                                        Priority
                                    </label>

                                    <select
                                        id="incidentPriority"
                                        class="form-select"
                                        required>

                                        <option value="">
                                            Select priority
                                        </option>

                                        <option
                                            value="High"
                                            ${incident?.priority === "High"
                                                ? "selected"
                                                : ""}>
                                            High
                                        </option>

                                        <option
                                            value="Medium"
                                            ${incident?.priority === "Medium"
                                                ? "selected"
                                                : ""}>
                                            Medium
                                        </option>

                                        <option
                                            value="Low"
                                            ${incident?.priority === "Low"
                                                ? "selected"
                                                : ""}>
                                            Low
                                        </option>
                                    </select>
                                </div>


                                <!-- Status -->
                                <div class="col-md-6">
                                    <label
                                        for="incidentStatus"
                                        class="form-label">
                                        Status
                                    </label>

                                    <select
                                        id="incidentStatus"
                                        class="form-select"
                                        required>

                                        <option
                                            value="Open"
                                            ${incident?.status === "Open"
                                                ? "selected"
                                                : ""}>
                                            Open
                                        </option>

                                        <option
                                            value="Investigating"
                                            ${incident?.status === "Investigating"
                                                ? "selected"
                                                : ""}>
                                            Investigating
                                        </option>

                                        <option
                                            value="Resolved"
                                            ${incident?.status === "Resolved"
                                                ? "selected"
                                                : ""}>
                                            Resolved
                                        </option>
                                    </select>
                                </div>


                                <!-- Reported By -->
                                <div class="col-12">
                                    <label
                                        for="reportedBy"
                                        class="form-label">
                                        Reported By
                                    </label>

                                    <input
                                        type="text"
                                        id="reportedBy"
                                        class="form-control"
                                        value="${incident?.reportedBy || ""}"
                                        required>
                                </div>


                                <!-- Description -->
                                <div class="col-12">
                                    <label
                                        for="incidentDescription"
                                        class="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        id="incidentDescription"
                                        class="form-control"
                                        rows="4"
                                        required>${incident?.description || ""}</textarea>
                                </div>
                            </div>
                        </div>


                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal">
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="btn btn-primary">
                                <i class="bi bi-check-circle me-1"></i>
                                ${isEditing
                                    ? "Update Incident"
                                    : "Report Incident"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
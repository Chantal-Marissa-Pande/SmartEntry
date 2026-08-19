export function incidentModal(incident = null) {

    const isEditing =
        incident !== null;

    const selectedType =
        incident?.type || "";

    const selectedPriority =
        incident?.priority || "";

    const selectedStatus =
        incident?.status || "Open";


    return `
        <div
            class="modal fade"
            id="incidentModal"
            tabindex="-1"
            aria-labelledby="incidentModalLabel"
            aria-hidden="true">

            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <!-- HEADER -->
                    <div class="modal-header">

                        <h5
                            class="modal-title"
                            id="incidentModalLabel">

                            <i class="bi bi-exclamation-triangle me-2"></i>

                            ${
                                isEditing
                                    ? "Edit Incident"
                                    : "Report Incident"
                            }

                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        </button>

                    </div>


                    <!-- FORM -->
                    <form id="incidentForm">

                        <div class="modal-body">

                            <div class="row g-3">

                                <!-- INCIDENT TYPE -->
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
                                            ${
                                                selectedType ===
                                                "Unauthorized Access"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Unauthorized Access

                                        </option>

                                        <option
                                            value="Lost Visitor Badge"
                                            ${
                                                selectedType ===
                                                "Lost Visitor Badge"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Lost Visitor Badge

                                        </option>

                                        <option
                                            value="Unauthorized Vehicle"
                                            ${
                                                selectedType ===
                                                "Unauthorized Vehicle"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Unauthorized Vehicle

                                        </option>

                                        <option
                                            value="Suspicious Activity"
                                            ${
                                                selectedType ===
                                                "Suspicious Activity"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Suspicious Activity

                                        </option>

                                        <option
                                            value="Other"
                                            ${
                                                selectedType ===
                                                "Other"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Other

                                        </option>

                                    </select>

                                </div>


                                <!-- LOCATION -->
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
                                        placeholder="e.g. Main Entrance"
                                        required>

                                </div>


                                <!-- DATE -->
                                <div class="col-md-6">

                                    <label
                                        for="incidentDate"
                                        class="form-label">

                                        Date

                                    </label>

                                    <div class="picker-input-group"><input
                                        type="date"
                                        id="incidentDate"
                                        class="form-control"
                                        value="${incident?.date || ""}"
                                        required><button type="button" class="picker-button" data-picker-target="incidentDate" aria-label="Open incident date calendar"><i class="bi bi-calendar3" aria-hidden="true"></i></button></div>

                                </div>


                                <!-- TIME -->
                                <div class="col-md-6">

                                    <label
                                        for="incidentTime"
                                        class="form-label">

                                        Time

                                    </label>

                                    <div class="picker-input-group"><input
                                        type="time"
                                        id="incidentTime"
                                        class="form-control"
                                        value="${incident?.time || ""}"
                                        step="60"
                                        required><button type="button" class="picker-button" data-picker-target="incidentTime" aria-label="Open incident time selector"><i class="bi bi-clock" aria-hidden="true"></i></button></div>

                                </div>


                                <!-- PRIORITY -->
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
                                            ${
                                                selectedPriority === "High"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            High

                                        </option>

                                        <option
                                            value="Medium"
                                            ${
                                                selectedPriority === "Medium"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Medium

                                        </option>

                                        <option
                                            value="Low"
                                            ${
                                                selectedPriority === "Low"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Low

                                        </option>

                                    </select>

                                </div>


                                <!-- STATUS -->
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
                                            ${
                                                selectedStatus === "Open"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Open

                                        </option>

                                        <option
                                            value="Investigating"
                                            ${
                                                selectedStatus ===
                                                "Investigating"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Investigating

                                        </option>

                                        <option
                                            value="Resolved"
                                            ${
                                                selectedStatus === "Resolved"
                                                    ? "selected"
                                                    : ""
                                            }>

                                            Resolved

                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        <!-- FOOTER -->
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

                                <i
                                    class="bi bi-check-circle me-1">
                                </i>

                                ${
                                    isEditing
                                        ? "Update Incident"
                                        : "Report Incident"
                                }

                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    `;
}

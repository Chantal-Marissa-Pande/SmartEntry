export function visitorModal(visitor = null) {
    const isEditMode = visitor !== null;
    return `

<div
    class="modal fade"
    id="visitorModal"
    tabindex="-1"
    aria-labelledby="visitorModalLabel"
    aria-hidden="true">

    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5
                    class="modal-title"
                    id="visitorModalLabel">
                    <i class="bi bi-person-plus me-2"></i>
                    ${isEditMode ? "Edit Visitor" : "Register Visitor"}
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close">
                </button>
            </div>

            <form id="visitorForm">
                <div class="modal-body">
                    <div class="row g-3">

                        <div class="col-md-6">
                            <label
                                for="visitorName"
                                class="form-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="visitorName"
                                class="form-control"
                                value="${visitor?.name || ""}"
                                required>
                        </div>

                        <div class="col-md-6">
                            <label
                                for="visitorCompany"
                                class="form-label">
                                Company/Organization
                            </label>
                            <input
                                type="text"
                                id="visitorCompany"
                                class="form-control"
                                value="${visitor?.company || ""}"
                                required>
                        </div>

                        <div class="col-md-6">
                            <label
                                for="visitorPhone"
                                class="form-label">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="visitorPhone"
                                class="form-control"
                                value="${visitor?.phone || ""}">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="visitorId"
                                class="form-label">
                                National ID / Passport
                            </label>
                            <input
                                type="text"
                                id="visitorId"
                                class="form-control"
                                value="${visitor?.id || ""}">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="visitorPurpose"
                                class="form-label">
                                Purpose
                            </label>
                            <input
                                type="text"
                                id="visitorPurpose"
                                class="form-control"
                                value="${visitor?.purpose || ""}">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="visitorHost"
                                class="form-label">
                                Host
                            </label>
                            <input
                                type="text"
                                id="visitorHost"
                                class="form-control"
                                value="${visitor?.host || ""}">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="expectedTime"
                                class="form-label">
                                Expected Time
                            </label>
                            <input
                                type="datetime-local"
                                id="expectedTime"
                                class="form-control"
                                value="${visitor?.expectedTime || ""}">
                        </div>

                        <div class="col-md-6">
                            <label
                                for="visitorType"
                                class="form-label">
                                Visitor Type
                            </label>
                            <select
                                id="visitorType"
                                class="form-select"
                                value="${visitor?.type || ""}">
                                    <option>Guest</option>
                                    <option>Contractor</option>
                                    <option>Vendor</option>
                                    <option>Interview</option>
                                    <option>Delivery</option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label
                                for="visitorStatus"
                                class="form-label">
                                Status
                            </label>
                            <select
                                id="visitorStatus"
                                class="form-select"
                                value="${visitor?.status || ""}">
                                <option value="Expected">Expected</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
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
                        class="btn btn-primary"
                        type="submit">
                        <i class="bi bi-check-circle me-2"></i> 
                        ${isEditMode ? "Update Visitor" : "Register Visitor"}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
`;
}
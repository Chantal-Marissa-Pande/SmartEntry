export function visitorDetailsModal(visitor) {
    return `
        <div
            class="modal fade"
            id="detailsModal"
            tabindex="-1"
            aria-hidden="true"
        >

            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-person-vcard me-2"></i>
                            Visitor Details
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close">
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="row g-3">

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Full Name
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.name}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Company
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.company || "-"}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Phone Number
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.phone || "-"}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    National ID / Passport
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.nationalId || "-"}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Host
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.host || "-"}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Purpose
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.purpose || "-"}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">Laptop</label>
                                <p class="fw-semibold">
                                    ${visitor.hasLaptop ? "Yes" : "No"}
                                </p>
                            </div>

                            ${visitor.hasLaptop ? `
                                <div class="col-md-6">
                                    <label class="text-muted small">Laptop Make / Model</label>
                                    <p class="fw-semibold">${visitor.laptopMakeModel || "-"}</p>
                                </div>
                                <div class="col-md-6">
                                    <label class="text-muted small">Laptop Serial Number</label>
                                    <p class="fw-semibold">${visitor.laptopSerialNumber || "-"}</p>
                                </div>
                            ` : ""}

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Department
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.department || visitor.location || "-"}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Visitor Type
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.visitorType || "-"}
                                </p>
                            </div>

                            <div class="col-md-6">
                                <label class="text-muted small">
                                    Expected Time
                                </label>
                                <p class="fw-semibold">
                                    ${visitor.expectedTime || "-"}
                                </p>
                            </div>

                            <div class="col-12">
                                <label class="text-muted small">
                                    Status
                                </label>
                                <div>
                                    <span class="badge bg-success">
                                        ${visitor.status}
                                    </span>
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

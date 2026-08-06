export function visitorModal() {
    return `

<div
    class="modal fade"
    id="visitorModal"
    tabindex="-1"
    aria-hidden="true">

    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    Register Visitor
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>
            </div>

            <form id="visitorForm">
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">
                                Full Name
                            </label>

                            <input
                                id="visitorName"
                                class="form-control"
                                required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                Company
                            </label>

                            <input
                                id="visitorCompany"
                                class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                Phone Number
                            </label>

                            <input
                                id="visitorPhone"
                                class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                National ID / Passport
                            </label>

                            <input
                                id="visitorId"
                                class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                Purpose
                            </label>

                            <input
                                id="visitorPurpose"
                                class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                Host
                            </label>

                            <input
                                id="visitorHost"
                                class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                Expected Time
                            </label>

                            <input
                                type="datetime-local"
                                id="expectedTime"
                                class="form-control">
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">
                                Visitor Type
                            </label>

                            <select
                                id="visitorType"
                                class="form-select">

                                <option>Guest</option>
                                <option>Contractor</option>
                                <option>Vendor</option>
                                <option>Interview</option>
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
                        Register Visitor
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
`;
}
export function visitorModal(visitor = null) {
    const isEditMode = visitor !== null;

    const selectedVisitorType = visitor?.visitorType || "";
    const selectedStatus = visitor?.status || "Expected";

    // Convert backend ISO datetime into values suitable for HTML inputs
    let expectedDate = "";
    let expectedTime = "";

    if (visitor?.expectedTime) {
        const dateObject = new Date(visitor.expectedTime);

        if (!isNaN(dateObject.getTime())) {
            // YYYY-MM-DD
            expectedDate = dateObject.toISOString().slice(0, 10);

            // HH:MM
            expectedTime = dateObject.toISOString().slice(11, 16);
        }
    }

    return `
        <div
            class="modal fade"
            id="visitorModal"
            tabindex="-1"
            aria-labelledby="visitorModalLabel"
            aria-hidden="true">

            <div class="modal-dialog modal-lg">
                <div class="modal-content">

                    <!-- HEADER -->
                    <div class="modal-header">
                        <h5
                            class="modal-title"
                            id="visitorModalLabel">

                            <i class="bi bi-person-plus me-2"></i>

                            ${
                                isEditMode
                                    ? "Edit Visitor"
                                    : "Register Visitor"
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
                    <form id="visitorForm">

                        <div class="modal-body">

                            <div class="row g-3">

                                <!-- FULL NAME -->
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

                                <!-- COMPANY -->
                                <div class="col-md-6">
                                    <label
                                        for="visitorCompany"
                                        class="form-label">
                                        Company / Organization
                                    </label>

                                    <input
                                        type="text"
                                        id="visitorCompany"
                                        class="form-control"
                                        value="${visitor?.company || ""}"
                                        required>
                                </div>

                                <!-- PHONE -->
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

                                <!-- NATIONAL ID / PASSPORT -->
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
                                        value="${visitor?.nationalId || ""}"
                                        required>
                                </div>

                                <!-- PURPOSE -->
                                <div class="col-12">
                                    <div class="form-check">
                                        <input
                                            type="checkbox"
                                            id="visitorHasLaptop"
                                            class="form-check-input"
                                            ${visitor?.hasLaptop ? "checked" : ""}>
                                        <label for="visitorHasLaptop" class="form-check-label">
                                            Visitor is bringing a laptop (optional)
                                        </label>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label for="laptopMakeModel" class="form-label">
                                        Laptop Make / Model
                                    </label>
                                    <input
                                        type="text"
                                        id="laptopMakeModel"
                                        class="form-control"
                                        value="${visitor?.laptopMakeModel || ""}"
                                        placeholder="e.g. Dell Latitude 5440">
                                </div>

                                <div class="col-md-6">
                                    <label for="laptopSerialNumber" class="form-label">
                                        Laptop Serial Number
                                    </label>
                                    <input
                                        type="text"
                                        id="laptopSerialNumber"
                                        class="form-control"
                                        value="${visitor?.laptopSerialNumber || ""}">
                                </div>

                                <!-- PURPOSE -->
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
                                        value="${visitor?.purpose || ""}"
                                        required>
                                </div>

                                <!-- HOST -->
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
                                        value="${visitor?.host || ""}"
                                        required>
                                </div>

                                <!-- EXPECTED DATE -->
                                <div class="col-md-6">
                                    <label
                                        for="visitorDepartment"
                                        class="form-label">
                                        Department
                                    </label>

                                    <input
                                        type="text"
                                        id="visitorDepartment"
                                        class="form-control"
                                        list="departmentOptions"
                                        value="${visitor?.department || visitor?.location || ""}"
                                        placeholder="Select or enter a department"
                                        required>

                                    <datalist id="departmentOptions">
                                        <option value="Administration">
                                        <option value="Finance">
                                        <option value="Human Resources">
                                        <option value="Information Technology">
                                        <option value="Operations">
                                        <option value="Procurement">
                                        <option value="Sales & Marketing">
                                        <option value="Security">
                                    </datalist>
                                </div>

                                <!-- EXPECTED DATE -->
                                <div class="col-md-6">
                                    <label
                                        for="expectedDate"
                                        class="form-label">
                                        Expected Date
                                    </label>

                                    <input
                                        type="date"
                                        id="expectedDate"
                                        class="form-control"
                                        value="${expectedDate}"
                                        required>
                                </div>

                                <!-- EXPECTED TIME -->
                                <div class="col-md-6">
                                    <label
                                        for="expectedTime"
                                        class="form-label">
                                        Expected Time
                                    </label>

                                    <input
                                        type="time"
                                        id="expectedTime"
                                        class="form-control"
                                        value="${expectedTime}"
                                        step="60"
                                        required>

                                    <div class="form-text">
                                        Select a time using the scroll/clock controls.
                                    </div>
                                </div>

                                <!-- VISITOR TYPE -->
                                <div class="col-md-6">
                                    <label
                                        for="visitorType"
                                        class="form-label">
                                        Visitor Type
                                    </label>

                                    <select
                                        id="visitorType"
                                        class="form-select"
                                        required>

                                        <option
                                            value=""
                                            ${
                                                selectedVisitorType === ""
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Select visitor type
                                        </option>

                                        <option
                                            value="Guest"
                                            ${
                                                selectedVisitorType === "Guest"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Guest
                                        </option>

                                        <option
                                            value="Contractor"
                                            ${
                                                selectedVisitorType === "Contractor"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Contractor
                                        </option>

                                        <option
                                            value="Vendor"
                                            ${
                                                selectedVisitorType === "Vendor"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Vendor
                                        </option>

                                        <option
                                            value="Interview"
                                            ${
                                                selectedVisitorType === "Interview"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Interview
                                        </option>

                                        <option
                                            value="Delivery"
                                            ${
                                                selectedVisitorType === "Delivery"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Delivery
                                        </option>

                                    </select>
                                </div>

                                <!-- STATUS -->
                                <div class="col-md-6">
                                    <label
                                        for="visitorStatus"
                                        class="form-label">
                                        Status
                                    </label>

                                    <select
                                        id="visitorStatus"
                                        class="form-select">

                                        <option
                                            value="Expected"
                                            ${
                                                selectedStatus === "Expected"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Expected
                                        </option>

                                        <option
                                            value="In Progress"
                                            ${
                                                selectedStatus === "In Progress"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            In Progress
                                        </option>

                                        <option
                                            value="Completed"
                                            ${
                                                selectedStatus === "Completed"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Completed
                                        </option>

                                        <option
                                            value="Cancelled"
                                            ${
                                                selectedStatus === "Cancelled"
                                                    ? "selected"
                                                    : ""
                                            }>
                                            Cancelled
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

                                <i class="bi bi-check-circle me-2"></i>

                                ${
                                    isEditMode
                                        ? "Update Visitor"
                                        : "Register Visitor"
                                }

                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    `;
}

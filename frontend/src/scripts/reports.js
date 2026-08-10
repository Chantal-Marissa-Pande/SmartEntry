import { loadLayout } from "../components/layout.js";

// =========================================
// SAMPLE REPORT DATA
// =========================================
const reportData = {
    visitors: {
        total: 120,
        checkedIn: 34,
        checkedOut: 86,
        expected: 12
    },
    incidents: {
        total: 5,
        open: 2,
        resolved: 3,
        highPriority: 1
    }
};

// =========================================
// RENDER PAGE
// =========================================
function renderPage() {

    const pageContent = `

        <!-- Report Controls -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <div class="col-md-4">

                        <label
                            for="dateFrom"
                            class="form-label fw-semibold">
                            From
                        </label>

                        <input
                            type="date"
                            id="dateFrom"
                            class="form-control">
                    </div>

                    <div class="col-md-4">
                        <label
                            for="dateTo"
                            class="form-label fw-semibold">
                            To
                        </label>

                        <input
                            type="date"
                            id="dateTo"
                            class="form-control">
                    </div>


                    <div class="col-md-4">
                        <button
                            id="generateReportBtn"
                            class="btn btn-primary w-100">
                            <i class="bi bi-bar-chart me-1"></i>
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Visitor Statistics -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">

                <h5 class="mb-0">
                    <i class="bi bi-people me-2"></i>
                    Visitor Statistics
                </h5>
            </div>

            <div class="card-body">
                <div class="row g-4">

                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">

                                <div>
                                    <p class="text-muted mb-1">
                                        Total Visitors
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.visitors.total}
                                    </h3>
                                </div>
                                <i class="bi bi-people fs-2"></i>
                            </div>
                        </div>
                    </div>


                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <p class="text-muted mb-1">
                                        Checked In
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.visitors.checkedIn}
                                    </h3>
                                </div>
                                <i class="bi bi-person-check fs-2"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <p class="text-muted mb-1">
                                        Checked Out
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.visitors.checkedOut}
                                    </h3>
                                </div>
                                <i class="bi bi-box-arrow-right fs-2"></i>
                            </div>
                        </div>
                    </div>


                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <p class="text-muted mb-1">
                                        Expected
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.visitors.expected}
                                    </h3>
                                </div>
                                <i class="bi bi-calendar-event fs-2"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Incident Statistics -->
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white">

                <h5 class="mb-0">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Incident Statistics
                </h5>
            </div>

            <div class="card-body">
                <div class="row g-4">

                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">

                                <div>
                                    <p class="text-muted mb-1">
                                        Total Incidents
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.incidents.total}
                                    </h3>
                                </div>
                                <i class="bi bi-exclamation-octagon fs-2"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">

                                <div>
                                    <p class="text-muted mb-1">
                                        Open
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.incidents.open}
                                    </h3>
                                </div>
                                <i class="bi bi-folder2-open fs-2"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <p class="text-muted mb-1">
                                        Resolved
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.incidents.resolved}
                                    </h3>
                                </div>
                                <i class="bi bi-check-circle fs-2"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6 col-xl-3">
                        <div class="border rounded p-3">
                            <div class="d-flex justify-content-between">

                                <div>
                                    <p class="text-muted mb-1">
                                        High Priority
                                    </p>
                                    <h3 class="fw-bold mb-0">
                                        ${reportData.incidents.highPriority}
                                    </h3>
                                </div>
                                <i class="bi bi-exclamation-triangle fs-2"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Report Summary -->
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    <i class="bi bi-file-earmark-text me-2"></i>
                    Report Summary
                </h5>
            </div>

            <div class="card-body">
                <p class="mb-2">
                    The current report contains visitor
                    and incident activity recorded in SmartEntry.
                </p>

                <p class="text-muted mb-0">
                    Select a date range above when the
                    reporting system is connected to the
                    backend.
                </p>
            </div>
        </div>
    `;
    loadLayout("Reports", pageContent);
}

// =========================================
// GENERATE REPORT
// =========================================
document.addEventListener("click", (event) => {

    const button =
        event.target.closest("#generateReportBtn");

    if (!button) return;

    const dateFrom =
        document.getElementById("dateFrom").value;

    const dateTo =
        document.getElementById("dateTo").value;

    if (!dateFrom || !dateTo) {
        Swal.fire({
            icon: "warning",
            title: "Select a Date Range",
            text: "Please select both a start date and an end date."
        });
        return;
    }

    if (dateFrom > dateTo) {
        Swal.fire({
            icon: "warning",
            title: "Invalid Date Range",
            text: "The start date cannot be after the end date."
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Report Generated",
        text: `Report generated for ${dateFrom} to ${dateTo}.`
    });
});
renderPage();
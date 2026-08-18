import { loadLayout } from "../components/layout.js";
import { getReportData } from "../services/reportService.js";
import { downloadReportPdf } from "../utils/reportPdf.js";

// =========================================
// DEFAULT REPORT DATA
// =========================================
let reportData = {
    visitors: {
        total: 0,
        checkedIn: 0,
        checkedOut: 0,
        expected: 0
    },

    incidents: {
        total: 0,
        open: 0,
        resolved: 0,
        highPriority: 0
    }
};

let selectedRange = {
    from: "",
    to: ""
};

let reportGenerated = false;

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
                            class="form-control"
                            value="${selectedRange.from}">
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
                            class="form-control"
                            value="${selectedRange.to}">
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

        ${reportGenerated ? `
            <div class="d-flex justify-content-end mb-4">
                <button id="downloadReportBtn" class="btn btn-outline-danger">
                    <i class="bi bi-file-earmark-pdf me-2"></i>
                    Download PDF Summary
                </button>
            </div>
        ` : ""}


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

                    <!-- Total -->
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


                    <!-- Checked In -->
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


                    <!-- Checked Out -->
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


                    <!-- Expected -->
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

                    <!-- Total -->
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


                    <!-- Open -->
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


                    <!-- Resolved -->
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


                    <!-- High Priority -->
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
                    The report contains visitor and incident
                    activity recorded in SmartEntry.
                </p>

                <p
                    id="reportSummaryText"
                    class="text-muted mb-0">

                    Select a date range and generate a report
                    to view activity.

                </p>

            </div>

        </div>
    `;

    loadLayout("Reports", pageContent);
}

// =========================================
// GENERATE REPORT
// =========================================
document.addEventListener("click", async (event) => {

    const button =
        event.target.closest("#generateReportBtn");

    if (!button) return;

    const dateFrom =
        document.getElementById("dateFrom")?.value;

    const dateTo =
        document.getElementById("dateTo")?.value;

    // =========================================
    // VALIDATE DATES
    // =========================================
    if (!dateFrom || !dateTo) {

        Swal.fire({
            icon: "warning",
            title: "Select a Date Range",
            text:
                "Please select both a start date and an end date."
        });

        return;
    }

    if (dateFrom > dateTo) {

        Swal.fire({
            icon: "warning",
            title: "Invalid Date Range",
            text:
                "The start date cannot be after the end date."
        });

        return;
    }

    // =========================================
    // LOADING
    // =========================================
    const originalText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = `
        <span
            class="spinner-border spinner-border-sm me-2">
        </span>
        Generating...
    `;

    try {

        // =========================================
        // GET REAL BACKEND DATA
        // =========================================
        reportData =
            await getReportData(
                dateFrom,
                dateTo
            );

        selectedRange = {
            from: dateFrom,
            to: dateTo
        };

        reportGenerated = true;

        // =========================================
        // RE-RENDER PAGE
        // =========================================
        renderPage();

        const summary =
            document.getElementById(
                "reportSummaryText"
            );

        if (summary) {

            summary.textContent =
                `Report generated for ${dateFrom} to ${dateTo}. ` +
                `${reportData.visitors.total} visitor(s) ` +
                `and ${reportData.incidents.total} incident(s) ` +
                `were recorded during this period.`;
        }

        Swal.fire({
            icon: "success",
            title: "Report Generated",
            text:
                `Report generated for ${dateFrom} to ${dateTo}.`,
            timer: 2000,
            showConfirmButton: false
        });

    } catch (error) {

        console.error(
            "Error generating report:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Report Failed",
            text:
                "Unable to retrieve report data from the server."
        });

        button.disabled = false;
        button.innerHTML = originalText;
    }
});

// =========================================
// DOWNLOAD PDF SUMMARY
// =========================================
document.addEventListener("click", (event) => {
    const button = event.target.closest("#downloadReportBtn");
    if (!button || !reportGenerated) return;

    downloadReportPdf(
        reportData,
        selectedRange.from,
        selectedRange.to
    );
});

// =========================================
// INITIAL RENDER
// =========================================
renderPage();

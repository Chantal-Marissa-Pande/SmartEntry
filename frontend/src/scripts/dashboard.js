import { loadLayout } from "../components/layout.js";
import { statCards } from "../components/statCards.js";
import { visitorsTable } from "../components/visitorsTable.js";
import { incidentTable } from "../components/incidentTable.js";
import api from "../services/api.js";

/* =========================================
   LOAD DASHBOARD
========================================= */
async function loadDashboard() {
    try {
        const response =
            await api.get("/dashboard/");

        const data =
            response.data;

        const statistics =
            data.statistics || {};

        const recentVisitors =
            data.recent_visitors || [];

        const incidents =
            data.incidents || [];

        /* =====================================
           BUILD DASHBOARD
        ===================================== */
        const dashboardContent = `
            ${statCards(statistics)}

            <div class="row">
                <div class="col-lg-7 mb-4">
                    ${visitorsTable(
                        recentVisitors
                    )}
                </div>

                <div class="col-lg-5 mb-4">
                    ${incidentTable(
                        incidents
                    )}
                </div>
            </div>
        `;

        loadLayout(
            "Dashboard",
            dashboardContent
        );

        console.log(
            "Dashboard loaded successfully",
            data
        );

    } catch (error) {
        console.error(
            "Error loading dashboard:",
            error
        );

        loadLayout(
            "Dashboard",
            `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Unable to load dashboard data.
                    Please refresh the page or log in again.
                </div>
            `
        );

        if (error.response?.status === 401) {
            Swal.fire({
                icon: "warning",
                title: "Session Expired",
                text:
                    "Your session has expired. Please log in again."
            });
        }
    }
}

loadDashboard();
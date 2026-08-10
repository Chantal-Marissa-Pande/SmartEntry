import { loadLayout } from "../components/layout.js";
import { statCards } from "../components/statCards.js";
import { visitorsTable } from "../components/visitorsTable.js";
import { incidentTable } from "../components/incidentTable.js";

const dashboardContent = `
    ${statCards()}

    <div class="row">

        <div class="col-lg-7 mb-4">
            ${visitorsTable()}
        </div>

        <div class="col-lg-5 mb-4">
            ${incidentTable()}
        </div>

    </div>
`;

loadLayout("Dashboard", dashboardContent);

console.log("Dashboard loaded");
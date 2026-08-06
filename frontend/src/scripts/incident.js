import { loadLayout } from "../components/layout.js";
const incidentsContent = `

<div class="card shadow-sm">
    <div class="card-header bg-white">
        <h5 class="mb-0">
            Incident Management
        </h5>
    </div>

    <div class="card-body">
        <p class="text-muted">
            Incident records will appear here.
        </p>
    </div>
</div>
`;

loadLayout("Incidents", incidentsContent);
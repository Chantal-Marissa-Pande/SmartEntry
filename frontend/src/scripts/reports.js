import { loadLayout } from "../components/layout.js";
const reportsContent = `

<div class="card shadow-sm">
    <div class="card-header bg-white">
        <h5 class="mb-0">
            Reports
        </h5>
    </div>

    <div class="card-body">
        <p class="text-muted">
            Reports will appear here.
        </p>
    </div>
</div>
`;

loadLayout("Reports", reportsContent);
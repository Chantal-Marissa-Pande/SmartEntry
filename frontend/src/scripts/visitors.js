import { loadLayout } from "../components/layout.js";
const visitorsContent = `

<div class="card shadow-sm">
    <div class="card-header bg-white d-flex justify-content-between align-items-center">

        <h5 class="mb-0">
            Visitor Management
        </h5>

        <button class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>
            Register Visitor
        </button>

    </div>
    <div class="card-body">
        <p class="text-muted">
            Visitor records will appear here.
        </p>
    </div>
</div>
`;

loadLayout("Visitors", visitorsContent);
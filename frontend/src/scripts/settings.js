import { loadLayout } from "../components/layout.js";
const settingsContent = `

<div class="card shadow-sm">
    <div class="card-header bg-white">
        <h5 class="mb-0">
            Settings
        </h5>
    </div>

    <div class="card-body">
        <p class="text-muted">
            User settings will appear here.
        </p>
    </div>
</div>
`;

loadLayout("Settings", settingsContent);
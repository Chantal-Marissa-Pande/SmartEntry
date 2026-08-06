export function statCards() {
    return `

    <div class="row g-4 mb-4">
        <div class="col-md-6 col-xl-3">
            <div class="card dashboard-card visitors-card shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">

                    <div>
                        <h6 class="text-muted">Total Visitors</h6>

                        <h2 class="fw-bold">120</h2>
                    </div>
                    <i class="bi bi-people-fill fs-1"></i>
                </div>
            </div>
        </div>

        <div class="col-md-6 col-xl-3">
            <div class="card dashboard-card checkin-card shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">

                    <div>
                        <h6 class="text-muted">Checked In</h6>

                        <h2 class="fw-bold">34</h2>
                    </div>
                    <i class="bi bi-box-arrow-in-right fs-1"></i>
                </div>

            </div>
        </div>

        <div class="col-md-6 col-xl-3">
            <div class="card dashboard-card incident-card shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">

                    <div>
                        <h6 class="text-muted">Incidents</h6>
                        <h2 class="fw-bold">5</h2>
                    </div>
                    <i class="bi bi-exclamation-octagon-fill fs-1"></i>
                </div>
            </div>
        </div>

        <div class="col-md-6 col-xl-3">
            <div class="card dashboard-card users-card shadow-sm">
                <div class="card-body d-flex justify-content-between align-items-center">

                    <div>
                        <h6 class="text-muted">Users</h6>
                        <h2 class="fw-bold">18</h2>
                    </div>
                    <i class="bi bi-person-badge-fill fs-1"></i>
                </div>
            </div>
        </div>
    </div>
    `;
}
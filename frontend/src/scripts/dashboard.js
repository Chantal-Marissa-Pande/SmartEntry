import { loadLayout } from "../components/layout.js";

const dashboardContent = `
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

<div class="row">
    <div class="col-lg-7">
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">Recent Visitors</h5>
            </div>

            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Purpose</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>Eclectics</td>
                            <td>Meeting</td>

                            <td>
                                <span class="badge bg-success">
                                    Checked In
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>Jane Smith</td>
                            <td>Microsoft</td>
                            <td>Delivery</td>

                            <td>
                                <span class="badge bg-secondary">
                                    Checked Out
                                </span>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="col-lg-5">
        <div class="card shadow-sm">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    Recent Incidents
                </h5>
            </div>

            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Unauthorized Access</td>
                            <td>Main Gate</td>

                            <td>
                                <span class="badge bg-warning text-dark">
                                    Open
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>Lost Badge</td>
                            <td>Reception</td>

                            <td>
                                <span class="badge bg-success">
                                    Resolved
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;

loadLayout("Dashboard", dashboardContent);
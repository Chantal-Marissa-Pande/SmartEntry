export function statCards(stats = {}) {
    const totalVisitors =
        stats.total_visitors ?? 0;

    const checkedIn =
        stats.checked_in ?? 0;

    const expectedToday =
        stats.expected_today ?? 0;

    const totalUsers =
        stats.total_users ?? 0;

    return `
        <div class="row g-4 mb-4">

            <!-- TOTAL VISITORS -->
            <div class="col-md-6 col-xl-3">
                <div class="card dashboard-card visitors-card shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted">
                                Total Visitors
                            </h6>
                            <h2 class="fw-bold">
                                ${totalVisitors}
                            </h2>
                        </div>
                        <i class="bi bi-people-fill fs-1"></i>
                    </div>
                </div>
            </div>

            <!-- CHECKED IN -->
            <div class="col-md-6 col-xl-3">
                <div class="card dashboard-card checkin-card shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted">
                                Checked In
                            </h6>
                            <h2 class="fw-bold">
                                ${checkedIn}
                            </h2>
                        </div>
                        <i class="bi bi-box-arrow-in-right fs-1"></i>
                    </div>
                </div>
            </div>

            <!-- EXPECTED TODAY -->
            <div class="col-md-6 col-xl-3">
                <div class="card dashboard-card incident-card shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted">
                                Expected Today
                            </h6>
                            <h2 class="fw-bold">
                                ${expectedToday}
                            </h2>
                        </div>
                        <i class="bi bi-calendar-event fs-1"></i>
                    </div>
                </div>
            </div>

            <!-- USERS -->
            <div class="col-md-6 col-xl-3">
                <div class="card dashboard-card users-card shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-muted">
                                Users
                            </h6>
                            <h2 class="fw-bold">
                                ${totalUsers}
                            </h2>
                        </div>
                        <i class="bi bi-person-badge-fill fs-1"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}
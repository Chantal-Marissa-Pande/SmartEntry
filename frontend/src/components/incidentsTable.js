export function incidentsTable() {
    return `

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
    `;
}
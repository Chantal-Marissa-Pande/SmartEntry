export function visitorsTable() {
    return `

    <div class="card shadow-sm">

        <div class="card-header bg-white">
            <h5 class="mb-0">
                Recent Visitors
            </h5>
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
    `;
}
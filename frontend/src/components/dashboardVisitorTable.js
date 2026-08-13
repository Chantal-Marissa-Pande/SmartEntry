import { statusBadge } from "./statusBadge.js";

export function dashboardVisitorTable(visitors = []) {
    const rows = visitors.map(visitor => {

        return `
            <tr>
                <td>
                    <strong>
                        ${visitor.name || "-"}
                    </strong>
                </td>

                <td>
                    ${visitor.company || "-"}
                </td>

                <td>
                    ${visitor.purpose || "-"}
                </td>

                <td>
                    ${statusBadge(visitor.status)}
                </td>
            </tr>
        `;
    }).join("");

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
                            <th>
                                Name
                            </th>
                            <th>
                                Company
                            </th>
                            <th>
                                Purpose
                            </th>
                            <th>
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        ${
                            rows ||
                            `
                                <tr>
                                    <td
                                        colspan="4"
                                        class="text-center text-muted py-4">
                                        No visitors found.
                                    </td>
                                </tr>
                            `
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
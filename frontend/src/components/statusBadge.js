export function statusBadge(status) {

    switch (status) {
        case "Expected":
            return `<span class="badge bg-primary">${status}</span>`;

        case "Checked In":
            return `<span class="badge bg-success">${status}</span>`;

        case "Checked Out":
            return `<span class="badge bg-secondary">${status}</span>`;

        default:
            return `<span class="badge bg-dark">${status}</span>`;
    }

}
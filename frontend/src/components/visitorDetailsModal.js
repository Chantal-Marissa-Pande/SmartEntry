export function visitorDetailsModal(visitor) {
    return `

<div class="modal fade" id="detailsModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    Visitor Details
                </h5>

                <button
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>
            </div>

            <div class="modal-body">
                <p><strong>Name:</strong> ${visitor.name}</p>
                <p><strong>Company:</strong> ${visitor.company}</p>
                <p><strong>Phone:</strong> ${visitor.phone}</p>
                <p><strong>National ID:</strong> ${visitor.nationalId}</p>
                <p><strong>Host:</strong> ${visitor.host}</p>
                <p><strong>Purpose:</strong> ${visitor.purpose}</p>
                <p><strong>Visitor Type:</strong> ${visitor.visitorType}</p>
                <p><strong>Expected Time:</strong> ${visitor.expectedTime}</p>
                <p><strong>Status:</strong> ${visitor.status}</p>
            </div>
        </div>
    </div>
</div>
`;
}
export function searchBar(placeholder = "Search...") {
    return `
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-8">
                        <input
                            id="searchInput"
                            class="form-control"
                            type="text"
                            placeholder="${placeholder}"
                        >
                    </div>

                    <div class="col-md-2 d-grid">
                        <button
                            id="searchBtn"
                            class="btn btn-primary">
                            <i class="bi bi-search me-2"></i>
                            Search
                        </button>
                    </div>

                    <div class="col-md-2 d-grid">
                        <button
                            id="addVisitorBtn"
                            class="btn btn-success">
                            <i class="bi bi-plus-circle me-2"></i>
                            Add Visitor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
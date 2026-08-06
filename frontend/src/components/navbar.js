export function navbar() {
    return `
    
<nav class="navbar navbar-expand-lg bg-white shadow-sm px-4">
    <div class="container-fluid">
        <a class="navbar-brand fw-bold">
            SmartEntry
        </a>

        <div class="d-flex align-items-center">
            <i class="bi bi-bell fs-4 me-4"></i>
            <div class="dropdown">

                <button class="btn btn-outline-primary dropdown-toggle"
                    data-bs-toggle="dropdown">
                    Admin
                </button>

                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item">
                            Profile
                        </a>
                    </li>

                    <li>
                        <a class="dropdown-item"
                            id="logoutBtn">
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</nav>
`;

}
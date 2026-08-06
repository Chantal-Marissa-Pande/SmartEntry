import { navbar } from "./navbar.js";
import { sidebar } from "./sidebar.js";

export function loadLayout(title, content) {
    document.getElementById("app").innerHTML = `

        <div id="navbar"></div>
        <div class="container-fluid">

            <div class="row flex-nowrap">
                <div class="col-auto px-0">
                    <div id="sidebar"></div>
                </div>

                <main class="col bg-light min-vh-100 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="fw-bold">${title}</h2>
                            <p class="text-muted">
                                Welcome back, Admin
                            </p>
                        </div>
                    </div>

                    ${content}
                </main>
            </div>
        </div>
    `;

    document.getElementById("navbar").innerHTML = navbar();
    document.getElementById("sidebar").innerHTML = sidebar();
}
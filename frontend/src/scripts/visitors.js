import { loadLayout } from "../components/layout.js";
import { searchBar } from "../components/searchBar.js";
import { visitorTable } from "../components/visitorTable.js";
import { visitorModal } from "../components/visitorModal.js";
import {getVisitors, getVisitor, addVisitor} from "../services/visitorService.js";
import { visitorDetailsModal } from "../components/visitorDetailsModal.js";

function renderPage(){
    const pageContent = `
        ${searchBar()}
        ${visitorTable(getVisitors())}
        ${visitorModal()}
    `;

    loadLayout("Visitors", pageContent);
}

renderPage();

document.addEventListener("click", (event) => {
    const button = event.target.closest("#addVisitorBtn");
    if (!button) return;

        const modal = new bootstrap.Modal(document.getElementById("visitorModal"));
        modal.show();
});

document.addEventListener("submit", (event) => {
    if (event.target.id !== "visitorForm") return;
    event.preventDefault();

    const visitor ={
        id: Date.now(),
        name: document.getElementById("visitorName").value,
        company: document.getElementById("visitorCompany").value,
        phone: document.getElementById("visitorPhone").value,
        nationalId: document.getElementById("visitorId").value,
        purpose: document.getElementById("visitorPurpose").value,
        host: document.getElementById("visitorHost").value,
        expectedTime: document.getElementById("expectedTime").value,
        visitorType: document.getElementById("visitorType").value,
        status: "Expected"
    };

    addVisitor(visitor);
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("visitorModal")
    );

    if (modal){
        modal.hide();
    }
    renderPage();


    Swal.fire({
        icon: "success",
        title: "Visitor Registered",
        text: "The visitor has been successfully registered.",
        confirmButtonText: "OK"
    });
});

document.addEventListener("click", (event) => {

    const viewButton = event.target.closest(".view-btn");

    if (!viewButton) return;

    const visitorId = Number(viewButton.dataset.id);

    const visitor = getVisitor(visitorId);

    // Create modal HTML
    document.getElementById("modal-container").innerHTML = visitorDetailsModal(visitor);

    // Show modal
    const modal = new bootstrap.Modal(
        document.getElementById("detailsModal")
    );

    modal.show();

});
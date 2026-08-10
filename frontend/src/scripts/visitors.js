import { loadLayout } from "../components/layout.js";
import { searchBar } from "../components/searchBar.js";
import { visitorTable } from "../components/visitorTable.js";
import { visitorModal } from "../components/visitorModal.js";
import {
    getVisitors,
    getVisitor,
    addVisitor,
    updateVisitor,
    deleteVisitor
} from "../services/visitorService.js";
import { visitorDetailsModal } from "../components/visitorDetailsModal.js";

let editingVisitorId = null;

function renderPage(){
    const pageContent = `
        ${searchBar()}
        ${visitorTable(getVisitors())}
    `;

    loadLayout("Visitors", pageContent);
}

renderPage();

// Visitor registration modal
document.addEventListener("click", (event) => {
    const addbutton = event.target.closest("#addVisitorBtn");
    if (!addbutton) return;
    editingVisitorId = null;

    const modalContainer =
        document.getElementById("modal-container"); 
    modalContainer.innerHTML = visitorModal();

    const modalElement =
        document.getElementById("visitorModal");

    const modal = 
        new bootstrap.Modal(modalElement);
    modal.show();
});

// Visitor edit modal
document.addEventListener("click", (event) => {
    const editButton =
        event.target.closest(".edit-btn");
    if (!editButton) return;

    const visitorId =
        Number(editButton.dataset.id);
    const visitor =
        getVisitor(visitorId);

    if (!visitor) {
        Swal.fire({
            icon: "error",
            title: "Visitor Not Found",
            text: "The selected visitor could not be found."
        });
        return;
    }
    editingVisitorId = visitorId;

    const modalContainer =
        document.getElementById("modal-container");
    modalContainer.innerHTML =
        visitorModal(visitor);

    const modalElement =
        document.getElementById("visitorModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();

});

// Visitor registration form submission
document.addEventListener("submit", (event) => {
    if (event.target.id !== "visitorForm") return;
    event.preventDefault();

    const visitor ={
        id: Date.now(),
        name: document.getElementById("visitorName").value.trim(),
        company: document.getElementById("visitorCompany").value.trim(),
        phone: document.getElementById("visitorPhone").value.trim(),
        nationalId: document.getElementById("visitorId").value.trim(),
        purpose: document.getElementById("visitorPurpose").value.trim(),
        host: document.getElementById("visitorHost").value.trim(),
        expectedTime: document.getElementById("expectedTime").value,
        visitorType: document.getElementById("visitorType").value,
        status: "Expected"
    };

    // Edit existing visitor
    if (editingVisitorId !== null) {
        const updatedVisitor = {
            id: editingVisitorId,
            ...visitorData,

            status:
                getVisitor(editingVisitorId)?.status
                || "Expected"
        };
        updateVisitor(updatedVisitor);
        editingVisitorId = null;

        const modalElement =
            document.getElementById("visitorModal");

        const modal =
            bootstrap.Modal.getInstance(modalElement);
        
        if (modal){
            modal.hide();
        }

        renderPage();

        Swal.fire({
            icon: "success",
            title: "Visitor Updated",
            text: `Visitor ${updatedVisitor.name} has been successfully updated.`,
            confirmButtonText: "OK"
        });
        return;
    }

    // Add new visitor
    const newVisitor ={
        id: Date.now(),
        ...visitorData,
        status: "Expected"
    }
    addVisitor(newVisitor);

    const modalElement =
        document.getElementById("visitorModal");

    const modal =
        bootstrap.Modal.getInstance(modalElement);

    if (modal){
        modal.hide();
    }
    renderPage();


    Swal.fire({
        icon: "success",
        title: "Visitor Registered",
        text: `Visitor ${visitor.name} has been successfully registered.`,
        confirmButtonText: "OK"
    });
});

// View visitor details
document.addEventListener("click", (event) => {

    const viewButton = event.target.closest(".view-btn");
    if (!viewButton) return;

    const visitorId = Number(viewButton.dataset.id);
    const visitor = getVisitor(visitorId);

    if (!visitor) {
        Swal.fire({
            icon: "error",
            title: "Visitor Not Found",
            text: "The requested visitor could not be found."
        });
        return;
    }

    // Show modal
    const modalContainer =
        document.getElementById("modal-container");

    modalContainer.innerHTML = visitorDetailsModal(visitor);

    const modalElement =
        document.getElementById("detailsModal");

    const modal =
        new bootstrap.Modal(modalElement);
    modal.show();

});

// Delete visitor
document.addEventListener("click", async (event) => {
    const deleteButton =
        event.target.closest(".delete-btn");
    if (!deleteButton) return;

    const visitorId =
        Number(deleteButton.dataset.id);

    const visitor =
        getVisitor(visitorId);
    if (!visitor) {
        Swal.fire({
            icon: "error",
            title: "Visitor Not Found",
            text: "The selected visitor could not be found."
        });
        return;
    }


    const result = await Swal.fire({
        icon: "warning",
        title: "Delete Visitor?",
        text:
            `Are you sure you want to delete ${visitor.name}?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true
    });

    if (!result.isConfirmed) {
        return;
    }
    deleteVisitor(visitorId);
    renderPage();
    Swal.fire({
        icon: "success",
        title: "Visitor Deleted",
        text:
            `${visitor.name} has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false
    });
});
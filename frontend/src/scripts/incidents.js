import { loadLayout } from "../components/layout.js";
import { incidentTable } from "../components/incidentTable.js";
import {
    getIncidents,
    getIncident,
    addIncident,
    updateIncident,
    deleteIncident
} from "../services/incidentService.js";
import { incidentModal } from "../components/incidentModal.js";
import { incidentDetailsModal } from "../components/incidentDetailsModal.js";

let editingIncidentId = null;

/* =========================================
   RENDER PAGE
========================================= */
function renderPage() {
    const pageContent = `
        <div class="d-flex justify-content-end mb-3">
            <button
                id="addIncidentBtn"
                class="btn btn-primary">
                <i class="bi bi-plus-circle me-1"></i>
                Report Incident
            </button>
        </div>

        ${incidentTable(getIncidents())}
    `;
    loadLayout("Incidents", pageContent);
}
renderPage();


/* =========================================
   ADD INCIDENT
========================================= */
document.addEventListener("click", (event) => {
    const button =
        event.target.closest("#addIncidentBtn");

    if (!button) return;
    editingIncidentId = null;

    const container =
        document.getElementById("modal-container");

    container.innerHTML =
        incidentModal();

    const modalElement =
        document.getElementById("incidentModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );
    modal.show();
});

/* =========================================
   VIEW INCIDENT
========================================= */
document.addEventListener("click", (event) => {
    const button =
        event.target.closest(".view-incident-btn");

    if (!button) return;

    const id =
        Number(button.dataset.id);

    const incident =
        getIncident(id);

    if (!incident) {
        Swal.fire({
            icon: "error",
            title: "Incident Not Found",
            text: "The selected incident could not be found."
        });
        return;
    }

    const container =
        document.getElementById("modal-container");

    container.innerHTML =
        incidentDetailsModal(incident);

    const modalElement =
        document.getElementById(
            "incidentDetailsModal"
        );

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );
    modal.show();
});


/* =========================================
   EDIT INCIDENT
========================================= */
document.addEventListener("click", (event) => {
    const button =
        event.target.closest(".edit-incident-btn");

    if (!button) return;

    const id =
        Number(button.dataset.id);

    const incident =
        getIncident(id);

    if (!incident) return;

    editingIncidentId = id;

    const container =
        document.getElementById("modal-container");

    container.innerHTML =
        incidentModal(incident);

    const modalElement =
        document.getElementById("incidentModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );
    modal.show();
});

/* =========================================
   DELETE INCIDENT
========================================= */
document.addEventListener("click", async (event) => {
    const button =
        event.target.closest(".delete-incident-btn");

    if (!button) return;

    const id =
        Number(button.dataset.id);

    const incident =
        getIncident(id);

    if (!incident) return;

    const result =
        await Swal.fire({
            icon: "warning",
            title: "Delete Incident?",
            text:
                `Are you sure you want to delete "${incident.type}"?`,
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            reverseButtons: true
        });

    if (!result.isConfirmed) return;
    
    deleteIncident(id);
    renderPage();

    Swal.fire({
        icon: "success",
        title: "Incident Deleted",
        text: "The incident has been deleted.",
        timer: 2000,
        showConfirmButton: false
    });
});

/* =========================================
   CREATE / UPDATE INCIDENT
========================================= */
document.addEventListener("submit", (event) => {

    if (event.target.id !== "incidentForm") {
        return;
    }

    event.preventDefault();

    const incidentData = {
        type:
            document
                .getElementById("incidentType")
                .value,
        location:
            document
                .getElementById("incidentLocation")
                .value
                .trim(),
        date:
            document
                .getElementById("incidentDate")
                .value,
        time:
            document
                .getElementById("incidentTime")
                .value,
        priority:
            document
                .getElementById("incidentPriority")
                .value,
        status:
            document
                .getElementById("incidentStatus")
                .value,
        reportedBy:
            document
                .getElementById("reportedBy")
                .value
                .trim(),
        description:
            document
                .getElementById("incidentDescription")
                .value
                .trim()
    };

    /* UPDATE */
    if (editingIncidentId !== null) {

        const updatedIncident = {
            id: editingIncidentId,
            ...incidentData
        };

        updateIncident(updatedIncident);
        editingIncidentId = null;
        renderPage();

        Swal.fire({
            icon: "success",
            title: "Incident Updated",
            text:
                "The incident has been updated successfully."
        });
        return;
    }

    /* CREATE */
    const newIncident = {

        id: Date.now(),
        ...incidentData
    };

    addIncident(newIncident);
    renderPage();

    Swal.fire({
        icon: "success",
        title: "Incident Reported",
        text:
            "The incident has been recorded successfully."
    });
});
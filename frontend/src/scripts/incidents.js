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
async function renderPage() {
    try {
        const incidents = await getIncidents();
        const pageContent = `
            <div class="d-flex justify-content-end mb-3">
                <button
                    id="addIncidentBtn"
                    class="btn btn-primary">
                    <i class="bi bi-plus-circle me-1"></i>
                    Report Incident
                </button>
            </div>
            ${incidentTable(incidents)}
        `;
        loadLayout("Incidents", pageContent);

    } catch (error) {
        console.error("Error loading incidents:", error);
        loadLayout(
            "Incidents",
            `
                <div class="alert alert-danger">
                    Unable to load incidents.
                    Please try again.
                </div>
            `
        );

        Swal.fire({
            icon: "error",
            title: "Unable to Load Incidents",
            text: "There was a problem retrieving incident records."
        });
    }
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
    if (!container) {
        console.error("Modal container not found.");
        return;
    }
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
document.addEventListener("click", async (event) => {
    const button =
        event.target.closest(".view-incident-btn");
    if (!button) return;

    const id =
        Number(button.dataset.id);

    try {
        const incident =
            await getIncident(id);
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

    } catch (error) {
        console.error(
            "Error loading incident:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to load incident details."
        });
    }
});

/* =========================================
   EDIT INCIDENT
========================================= */
document.addEventListener("click", async (event) => {
    const button =
        event.target.closest(".edit-incident-btn");

    if (!button) return;

    const id =
        Number(button.dataset.id);

    try {
        const incident =
            await getIncident(id);
        if (!incident) {
            Swal.fire({
                icon: "error",
                title: "Incident Not Found",
                text: "The selected incident could not be found."
            });
            return;
        }
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

    } catch (error) {
        console.error(
            "Error loading incident:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to load the incident information."
        });
    }
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

    try {
        const incident =
            await getIncident(id);
        if (!incident) {
            Swal.fire({
                icon: "error",
                title: "Incident Not Found",
                text: "The selected incident could not be found."
            });
            return;
        }

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
        if (!result.isConfirmed) {
            return;
        }
        await deleteIncident(id);
        await renderPage();

        Swal.fire({
            icon: "success",
            title: "Incident Deleted",
            text: "The incident has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false
        });

    } catch (error) {
        console.error(
            "Error deleting incident:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: "Unable to delete the incident."
        });
    }
});

/* =========================================
   CREATE / UPDATE INCIDENT
========================================= */
document.addEventListener("submit", async (event) => {
    if (event.target.id !== "incidentForm") {
        return;
    }
    event.preventDefault();

    /* =====================================
       GET FORM VALUES
    ===================================== */
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
        description:
            document
                .getElementById("incidentDescription")
                .value
                .trim(),
        priority:
            document
                .getElementById("incidentPriority")
                .value,
        status:
            document
                .getElementById("incidentStatus")
                .value
    };

    /* =====================================
       UPDATE EXISTING INCIDENT
    ===================================== */
    if (editingIncidentId !== null) {
        try {
            await updateIncident(
                editingIncidentId,
                incidentData
            );
            editingIncidentId = null;

            const modalElement =
                document.getElementById("incidentModal");

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );
            if (modal) {
                modal.hide();
            }
            await renderPage();

            Swal.fire({
                icon: "success",
                title: "Incident Updated",
                text:
                    "The incident has been updated successfully.",
                confirmButtonText: "OK"
            });

        } catch (error) {
            console.error(
                "Error updating incident:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    "Unable to update the incident."
            });
        }
        return;
    }

    /* =====================================
       CREATE NEW INCIDENT
    ===================================== */
    try {
        await addIncident(incidentData);
        const modalElement =
            document.getElementById("incidentModal");

        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );
        if (modal) {
            modal.hide();
        }
        await renderPage();

        Swal.fire({
            icon: "success",
            title: "Incident Reported",
            text:
                "The incident has been recorded successfully.",
            confirmButtonText: "OK"
        });

    } catch (error) {
        console.error(
            "Error reporting incident:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Report Failed",
            text:
                "Unable to record the incident."
        });
    }
});

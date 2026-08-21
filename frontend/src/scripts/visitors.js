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


/* =========================================
   RENDER PAGE
========================================= */

async function renderPage() {

    try {

        const visitors = await getVisitors();

        const pageContent = `
            ${searchBar()}
            ${visitorTable(visitors)}
        `;

        loadLayout("Visitors", pageContent);

    } catch (error) {

        console.error(
            "Error loading visitors:",
            error
        );

        loadLayout(
            "Visitors",
            `
                <div class="alert alert-danger">
                    Unable to load visitors.
                    Please try again.
                </div>
            `
        );

        Swal.fire({
            icon: "error",
            title: "Unable to Load Visitors",
            text:
                "There was a problem retrieving visitor records."
        });
    }
}

renderPage();


/* =========================================
   ADD VISITOR
========================================= */

document.addEventListener("click", (event) => {

    const addButton =
        event.target.closest("#addVisitorBtn");

    if (!addButton) {
        return;
    }

    editingVisitorId = null;

    const modalContainer =
        document.getElementById("modal-container");

    modalContainer.innerHTML =
        visitorModal();

    const modalElement =
        document.getElementById("visitorModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );

    modal.show();
});


/* =========================================
   EDIT VISITOR
========================================= */

document.addEventListener("click", async (event) => {

    const editButton =
        event.target.closest(".edit-btn");

    if (!editButton) {
        return;
    }

    const visitorId =
        Number(editButton.dataset.id);

    try {

        const visitor =
            await getVisitor(visitorId);

        if (!visitor) {

            Swal.fire({
                icon: "error",
                title: "Visitor Not Found",
                text:
                    "The selected visitor could not be found."
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
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();

    } catch (error) {

        console.error(
            "Error loading visitor:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Error",
            text:
                "Unable to load the visitor information."
        });
    }
});


/* =========================================
   VISITOR FORM SUBMISSION
========================================= */

document.addEventListener("submit", async (event) => {

    if (event.target.id !== "visitorForm") {
        return;
    }

    event.preventDefault();


    /* -------------------------------------
       GET FORM VALUES
    ------------------------------------- */

    const name =
        document
            .getElementById("visitorName")
            .value
            .trim();

    const company =
        document
            .getElementById("visitorCompany")
            .value
            .trim();

    const phone =
        document
            .getElementById("visitorPhone")
            .value
            .trim();

    const nationalId =
        document
            .getElementById("visitorId")
            .value
            .trim();

    const purpose =
        document
            .getElementById("visitorPurpose")
            .value
            .trim();

    const host =
        document
            .getElementById("visitorHost")
            .value
            .trim();

    const hasLaptop = document.getElementById("visitorHasLaptop").checked;
    const laptopMakeModel = document.getElementById("laptopMakeModel").value.trim();
    const laptopSerialNumber = document.getElementById("laptopSerialNumber").value.trim();

    const department =
        document
            .getElementById("visitorDepartment")
            .value
            .trim();

    const expectedDate =
        document
            .getElementById("expectedDate")
            .value;

    const expectedTime =
        document
            .getElementById("expectedTime")
            .value;

    const visitorType =
        document
            .getElementById("visitorType")
            .value;

    const status =
        document
            .getElementById("visitorStatus")
            .value;


    /* -------------------------------------
       VALIDATION
    ------------------------------------- */

    if (
        !name ||
        !company ||
        !nationalId ||
        !purpose ||
        !host ||
        !department ||
        !expectedDate ||
        !expectedTime ||
        !visitorType
    ) {

        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text:
                "Please complete all required visitor information."
        });

        return;
    }


    /* -------------------------------------
       COMBINE DATE + TIME
    ------------------------------------- */

    const combinedExpectedTime =
        `${expectedDate}T${expectedTime}`;


    /* -------------------------------------
       VISITOR DATA
    ------------------------------------- */

    const visitorData = {

        name,

        company,

        phone,

        nationalId,

        hasLaptop,

        laptopMakeModel,

        laptopSerialNumber,

        purpose,

        host,

        department,

        expectedTime:
            combinedExpectedTime,

        visitorType,

        status
    };


    /* =====================================
       UPDATE EXISTING VISITOR
    ===================================== */

    if (editingVisitorId !== null) {

        try {

            await updateVisitor(
                editingVisitorId,
                visitorData
            );

            editingVisitorId = null;


            const modalElement =
                document.getElementById(
                    "visitorModal"
                );

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
                title: "Visitor Updated",
                text:
                    "The visitor has been successfully updated.",
                confirmButtonText: "OK"
            });

        } catch (error) {

            console.error(
                "Error updating visitor:",
                error
            );

            const validationErrors = error.response?.data;
            const backendMessage = validationErrors
                ? Object.entries(validationErrors)
                    .map(([field, messages]) =>
                        `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`
                    )
                    .join("\n")
                : "Unable to update the visitor.";

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: backendMessage
            });
        }

        return;
    }


    /* =====================================
       CREATE NEW VISITOR
    ===================================== */

    try {

        await addVisitor(visitorData);


        const modalElement =
            document.getElementById(
                "visitorModal"
            );

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
            title: "Visitor Registered",
            text:
                "The visitor has been successfully registered.",
            confirmButtonText: "OK"
        });

    } catch (error) {

        console.error(
            "Error registering visitor:",
            error
        );

        /* Show backend validation error when available */

        const backendMessage =
            error.response?.data
                ? JSON.stringify(
                    error.response.data
                )
                : "Unable to register the visitor.";

        Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: backendMessage
        });
    }
});


/* =========================================
   VIEW VISITOR DETAILS
========================================= */

document.addEventListener("click", async (event) => {

    const viewButton =
        event.target.closest(".view-btn");

    if (!viewButton) {
        return;
    }

    const visitorId =
        Number(viewButton.dataset.id);

    try {

        const visitor =
            await getVisitor(visitorId);

        if (!visitor) {

            Swal.fire({
                icon: "error",
                title: "Visitor Not Found",
                text:
                    "The requested visitor could not be found."
            });

            return;
        }


        const modalContainer =
            document.getElementById(
                "modal-container"
            );

        modalContainer.innerHTML =
            visitorDetailsModal(visitor);


        const modalElement =
            document.getElementById(
                "detailsModal"
            );

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();

    } catch (error) {

        console.error(
            "Error loading visitor details:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Error",
            text:
                "Unable to load visitor details."
        });
    }
});

/* =========================================
   SEARCH VISITORS
========================================= */
document.addEventListener("input", async (event) => {

    if (event.target.id !== "searchInput") {
        return;
    }

    const searchTerm =
        event.target.value
            .toLowerCase()
            .trim();

    const visitors =
        await getVisitors();

    const filteredVisitors =
        visitors.filter(visitor =>
            (visitor.name || "")
                .toLowerCase()
                .includes(searchTerm)

            ||

            (visitor.company || "")
                .toLowerCase()
                .includes(searchTerm)

            ||

            (visitor.host || "")
                .toLowerCase()
                .includes(searchTerm)

            ||

            (visitor.department || visitor.location || "")
                .toLowerCase()
                .includes(searchTerm)

            ||

            (visitor.phone || "")
                .toLowerCase()
                .includes(searchTerm)

            ||

            (visitor.nationalId || "")
                .toLowerCase()
                .includes(searchTerm)
        );

    const tableContainer =
        document.querySelector(".card.shadow-sm:last-child");

    if (tableContainer) {
        tableContainer.outerHTML =
            visitorTable(filteredVisitors);
    }
});

document.addEventListener("click", async (event) => {

    const searchButton =
        event.target.closest("#searchBtn");

    if (!searchButton) {
        return;
    }

    try {

        const searchTerm =
            document
                .getElementById("searchInput")
                .value
                .toLowerCase()
                .trim();

        const visitors =
            await getVisitors();

        const filteredVisitors =
            visitors.filter(visitor =>
                (visitor.name || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (visitor.company || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (visitor.host || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (visitor.department || visitor.location || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (visitor.phone || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (visitor.nationalId || "")
                    .toLowerCase()
                    .includes(searchTerm)
            );

        const pageContent = `
            ${searchBar()}
            ${visitorTable(filteredVisitors)}
        `;

        loadLayout(
            "Visitors",
            pageContent
        );

    } catch (error) {

        console.error(
            "Search failed:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Search Failed",
            text:
                "Unable to perform the search."
        });
    }
});

/* =========================================
   DELETE VISITOR
========================================= */

document.addEventListener("click", async (event) => {

    const deleteButton =
        event.target.closest(".delete-btn");

    if (!deleteButton) {
        return;
    }

    const visitorId =
        Number(deleteButton.dataset.id);

    try {

        const visitor =
            await getVisitor(visitorId);

        if (!visitor) {

            Swal.fire({
                icon: "error",
                title: "Visitor Not Found",
                text:
                    "The selected visitor could not be found."
            });

            return;
        }


        const result =
            await Swal.fire({

                icon: "warning",

                title: "Delete Visitor?",

                text:
                    `Are you sure you want to delete ${visitor.name}?`,

                showCancelButton: true,

                confirmButtonText:
                    "Yes, Delete",

                cancelButtonText:
                    "Cancel",

                reverseButtons: true
            });


        if (!result.isConfirmed) {
            return;
        }


        await deleteVisitor(visitorId);

        await renderPage();


        Swal.fire({

            icon: "success",

            title: "Visitor Deleted",

            text:
                `${visitor.name} has been deleted successfully.`,

            timer: 2000,

            showConfirmButton: false
        });

    } catch (error) {

        console.error(
            "Error deleting visitor:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text:
                "Unable to delete the visitor."
        });
    }
});

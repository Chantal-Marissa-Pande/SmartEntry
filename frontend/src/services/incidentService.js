import api from "./api.js";

/* =========================================
   NORMALIZE INCIDENT
========================================= */
function normalizeIncident(incident) {
    return {
        id: incident.id,
        type: incident.incident_type,
        location: incident.location,
        date: incident.date,
        time: incident.time,
        description: incident.description,
        priority: incident.priority,
        status: incident.status,
        reportedBy: incident.reported_by_name,
        reportedById: incident.reported_by,
        createdAt: incident.created_at,
        updatedAt: incident.updated_at
    };
}

/* =========================================
   GET ALL INCIDENTS
========================================= */
export async function getIncidents() {
    const response = await api.get("/incidents/");
    return response.data.map(normalizeIncident);
}

/* =========================================
   GET SINGLE INCIDENT
========================================= */
export async function getIncident(id) {
    const response =
        await api.get(`/incidents/${id}/`);
    return normalizeIncident(response.data);
}

/* =========================================
   ADD INCIDENT
========================================= */
export async function addIncident(incident) {
    const response = await api.post(
        "/incidents/",
        {
            incident_type: incident.type,
            location: incident.location,
            date: incident.date,
            time: incident.time,
            description: incident.description,
            priority: incident.priority,
            status: incident.status
        }
    );
    return normalizeIncident(response.data);
}

/* =========================================
   UPDATE INCIDENT
========================================= */
export async function updateIncident(id, incident) {
    const response = await api.put(
        `/incidents/${id}/`,
        {
            incident_type: incident.type,
            location: incident.location,
            date: incident.date,
            time: incident.time,
            description: incident.description,
            priority: incident.priority,
            status: incident.status
        }
    );
    return normalizeIncident(response.data);
}

/* =========================================
   DELETE INCIDENT
========================================= */
export async function deleteIncident(id) {
    await api.delete(
        `/incidents/${id}/`
    );
    return true;
}
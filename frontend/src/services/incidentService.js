let incidents = [
    {
        id: 1,
        type: "Unauthorized Access",
        description: "Attempted access through restricted entrance.",
        location: "Main Gate",
        reportedBy: "Security Officer",
        date: "2026-08-10",
        time: "08:45",
        priority: "High",
        status: "Open"
    },

    {
        id: 2,
        type: "Lost Visitor Badge",
        description: "Visitor reported a missing identification badge.",
        location: "Reception",
        reportedBy: "Reception Desk",
        date: "2026-08-09",
        time: "14:20",
        priority: "Medium",
        status: "Resolved"
    },

    {
        id: 3,
        type: "Unauthorized Vehicle",
        description: "Vehicle attempted entry without authorization.",
        location: "Parking Entrance",
        reportedBy: "Security Officer",
        date: "2026-08-08",
        time: "17:10",
        priority: "High",
        status: "Investigating"
    }
];

export function getIncidents() {
    return incidents;
}

export function getIncident(id) {
    return incidents.find(
        incident => incident.id === id
    );
}

export function addIncident(incident) {
    incidents.unshift(incident);
}

export function updateIncident(updatedIncident) {

    incidents = incidents.map(incident =>
        incident.id === updatedIncident.id
            ? updatedIncident
            : incident
    );
}

export function deleteIncident(id) {

    incidents = incidents.filter(
        incident => incident.id !== id
    );
}
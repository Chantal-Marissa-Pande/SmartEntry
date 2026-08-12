import api from "./api.js";

// =========================================
// GET REPORT DATA
// =========================================
export async function getReportData(dateFrom = null, dateTo = null) {
    const [visitorsResponse, incidentsResponse] = await Promise.all([
        api.get("/visitors/"),
        api.get("/incidents/")
    ]);

    let visitors = visitorsResponse.data;
    let incidents = incidentsResponse.data;

    // =========================================
    // FILTER BY DATE
    // =========================================
    if (dateFrom && dateTo) {
        visitors = visitors.filter((visitor) => {
            const visitorDate =
                visitor.expected_time?.split("T")[0] ||
                visitor.created_at?.split("T")[0];

            return (
                visitorDate >= dateFrom &&
                visitorDate <= dateTo
            );
        });

        incidents = incidents.filter((incident) => {
            return (
                incident.date >= dateFrom &&
                incident.date <= dateTo
            );
        });
    }

    // =========================================
    // VISITOR STATISTICS
    // =========================================
    const visitorStats = {
        total: visitors.length,

        checkedIn: visitors.filter(
            (visitor) =>
                visitor.status === "Checked In"
        ).length,

        checkedOut: visitors.filter(
            (visitor) =>
                visitor.status === "Checked Out"
        ).length,

        expected: visitors.filter(
            (visitor) =>
                visitor.status === "Expected"
        ).length
    };

    // =========================================
    // INCIDENT STATISTICS
    // =========================================
    const incidentStats = {
        total: incidents.length,

        open: incidents.filter(
            (incident) =>
                incident.status === "Open"
        ).length,

        resolved: incidents.filter(
            (incident) =>
                incident.status === "Resolved"
        ).length,

        highPriority: incidents.filter(
            (incident) =>
                incident.priority === "High"
        ).length
    };

    return {
        visitors: visitorStats,
        incidents: incidentStats
    };
}
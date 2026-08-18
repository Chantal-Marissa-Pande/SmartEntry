import api from "./api.js";

export async function getNotifications() {
    const response = await api.get("/notifications/");
    return response.data;
}

export async function getIntelligenceAlerts() {
    const response = await api.get("/notifications/intelligence/");
    return response.data;
}

export async function getIntelligenceAlert(id) {
    const response = await api.get(`/notifications/intelligence/${id}/`);
    return response.data;
}

export async function markNotificationRead(id) {
    await api.patch(`/notifications/${id}/read/`);
}

export async function markAllNotificationsRead() {
    await api.patch("/notifications/read-all/");
}

export async function dismissIntelligenceAlert(id) {
    await api.patch(`/notifications/intelligence/${id}/dismiss/`);
}

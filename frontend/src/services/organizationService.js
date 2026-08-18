import api from "./api.js";

export async function getOrganizations() {
    const response = await api.get("/auth/organizations/");
    return response.data;
}

export async function createOrganization(data) {
    const response = await api.post("/auth/organizations/", data);
    return response.data;
}

export async function updateOrganization(id, data) {
    const response = await api.patch(`/auth/organizations/${id}/`, data);
    return response.data;
}

export async function deactivateOrganization(id) {
    await api.delete(`/auth/organizations/${id}/`);
}

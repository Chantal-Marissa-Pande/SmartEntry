import api from "./api.js";

export async function login(email, password) {
    const response = await api.post("/auth/login/", {
        email,
        password
    });

    const { access, refresh } = response.data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    return response.data;
}

export function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = "/src/pages/login.html";
}

export function getAccessToken() {
    return localStorage.getItem("accessToken");
}

export function isAuthenticated() {
    return !!localStorage.getItem("accessToken");
}
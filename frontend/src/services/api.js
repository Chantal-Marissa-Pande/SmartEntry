import axios from "axios";

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, ""),
    headers: {
        "Content-Type": "application/json"
    }
});

let refreshRequest = null;

function endSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (window.location.pathname !== "/") {
        window.location.href = "/";
    }
}

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isUnauthorized = error.response?.status === 401;
        const isAuthRequest = originalRequest?.url?.includes("/auth/login/")
            || originalRequest?.url?.includes("/auth/refresh/");

        if (
            !isUnauthorized
            || !originalRequest
            || originalRequest._retry
            || isAuthRequest
        ) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            endSession();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshRequest) {
                refreshRequest = axios.post(
                    `${api.defaults.baseURL}/auth/refresh/`,
                    { refresh: refreshToken },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then((response) => {
                    const { access, refresh } = response.data;

                    localStorage.setItem("accessToken", access);

                    // SimpleJWT returns a new refresh token when rotation is enabled.
                    if (refresh) {
                        localStorage.setItem("refreshToken", refresh);
                    }

                    return access;
                }).finally(() => {
                    refreshRequest = null;
                });
            }

            const accessToken = await refreshRequest;

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            endSession();
            return Promise.reject(refreshError);
        }
    }
);

export default api;

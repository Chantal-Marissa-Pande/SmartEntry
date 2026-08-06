import { login } from "../services/auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please enter both email and password.",
        });
        return;
    }

    try {
        const data = await login(email, password);

        localStorage.setItem("token", data.token);

        Swal.fire({
            icon: "success",
            title: "Login Successful",
            timer: 1200,
            showConfirmButton: false,
        });

        setTimeout(() => {
            window.location.href = "/src/pages/dashboard.html";
        }, 1200);

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: error.response?.data?.message || "Invalid credentials.",
        });
    }
});
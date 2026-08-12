import { login } from "../services/auth.js";

document.addEventListener("submit", async (event) => {

    // Only handle the login form
    if (event.target.id !== "loginForm") {
        return;
    }

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validate fields
    if (!email || !password) {
        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please enter both email and password."
        });

        return;
    }

    try {

        // Send credentials to Django
        await login(email, password);

        Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome to SmartEntry.",
            timer: 1200,
            showConfirmButton: false
        });

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = "/src/pages/dashboard.html";
        }, 1200);

    } catch (error) {

        console.error("Login error:", error);

        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text:
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Invalid email or password."
        });
    }
});
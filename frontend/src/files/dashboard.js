import { navbar } from "../components/navbar.js";
import { sidebar } from "../components/sidebar.js";

document.getElementById("navbar").innerHTML = navbar();

document.getElementById("sidebar").innerHTML = sidebar();
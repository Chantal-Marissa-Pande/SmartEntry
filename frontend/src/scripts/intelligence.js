import { loadLayout } from "../components/layout.js";
import { dismissIntelligenceAlert, getIntelligenceAlert, getIntelligenceAlerts } from "../services/notificationService.js";

let alerts = [];
let selectedId = null;

const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function role() {
    try {
        const token = localStorage.getItem("accessToken");
        return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).role;
    } catch { return ""; }
}

function severityTone(value) {
    return ({ Critical: "danger", High: "danger", Medium: "warning", Low: "info" })[value] || "secondary";
}

function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function renderList() {
    const type = document.getElementById("intelligenceType")?.value || "all";
    const severity = document.getElementById("intelligenceSeverity")?.value || "all";
    const query = document.getElementById("intelligenceSearch")?.value.toLowerCase().trim() || "";
    const filtered = alerts.filter((alert) =>
        (type === "all" || alert.alert_type === type)
        && (severity === "all" || alert.severity === severity)
        && (!query || `${alert.title} ${alert.description} ${alert.organization?.name || ""}`.toLowerCase().includes(query))
    );
    const container = document.getElementById("intelligenceList");
    if (!container) return;
    container.innerHTML = filtered.length ? filtered.map((alert) => `
        <button class="intelligence-list-item ${selectedId === alert.id ? "active" : ""}" data-alert-id="${alert.id}">
            <div><span class="badge text-bg-${severityTone(alert.severity)}">${escapeHtml(alert.severity)}</span><span class="alert-type">${escapeHtml(alert.alert_type)}</span></div>
            <strong>${escapeHtml(alert.title)}</strong>
            <p>${escapeHtml(alert.description)}</p>
            <footer><span><i class="bi bi-buildings me-1"></i>${escapeHtml(alert.organization?.name || "Shared intelligence")}</span><span>${formatDate(alert.created_at)}</span></footer>
        </button>`).join("") : `<div class="notification-empty"><i class="bi bi-search"></i><strong>No matching alerts</strong><span>Try changing the filters.</span></div>`;
}

function detailRow(label, value) {
    return `<div class="intel-detail-row"><span>${label}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
}

function renderDetail(alert) {
    const panel = document.getElementById("intelligenceDetail");
    if (!panel) return;
    if (!alert) {
        panel.innerHTML = `<div class="intelligence-placeholder"><i class="bi bi-stars"></i><h4>Select an intelligence alert</h4><p>Review its evidence, organization, and linked activity.</p></div>`;
        return;
    }
    panel.innerHTML = `
        <div class="intel-detail-header">
            <div><span class="badge text-bg-${severityTone(alert.severity)}">${escapeHtml(alert.severity)}</span><span class="alert-type ms-2">${escapeHtml(alert.alert_type)}</span></div>
            ${["admin", "security"].includes(role()) ? `<button class="btn btn-sm btn-outline-secondary" data-dismiss-detail="${alert.id}">Dismiss alert</button>` : ""}
        </div>
        <h3>${escapeHtml(alert.title)}</h3><p class="intel-description">${escapeHtml(alert.description)}</p>
        <section><h5>Alert context</h5>${detailRow("Source organization", alert.organization?.name)}${detailRow("Detected", formatDate(alert.created_at))}${detailRow("Status", alert.is_active ? "Active" : "Dismissed")}</section>
        ${alert.incident ? `<section><h5><i class="bi bi-shield-exclamation me-2"></i>Related incident</h5>${detailRow("Type", alert.incident.type)}${detailRow("Location", alert.incident.location)}${detailRow("Date and time", `${alert.incident.date} ${alert.incident.time}`)}${detailRow("Priority", alert.incident.priority)}${detailRow("Status", alert.incident.status)}<p class="intel-evidence">${escapeHtml(alert.incident.description || "No description recorded.")}</p></section>` : ""}
        ${alert.visitor ? `<section><h5><i class="bi bi-person-badge me-2"></i>Correlated visitor</h5>${detailRow("Visitor", alert.visitor.name)}${detailRow("Organization", alert.visitor.organization)}${detailRow("Company", alert.visitor.company)}${detailRow("Department", alert.visitor.department)}${detailRow("Scheduled", formatDate(alert.visitor.expected_time))}</section>` : ""}`;
}

async function selectAlert(id) {
    selectedId = id;
    renderList();
    const panel = document.getElementById("intelligenceDetail");
    panel.innerHTML = `<div class="notification-empty"><span class="spinner-border text-primary"></span><span>Loading alert details…</span></div>`;
    try { renderDetail(await getIntelligenceAlert(id)); }
    catch { panel.innerHTML = `<div class="alert alert-danger">Unable to load this intelligence alert.</div>`; }
}

async function loadAlerts() {
    try {
        alerts = await getIntelligenceAlerts();
        renderList();
        const requested = Number(new URLSearchParams(window.location.search).get("alert"));
        if (requested && alerts.some((alert) => alert.id === requested)) selectAlert(requested);
        else if (alerts.length) selectAlert(alerts[0].id);
        else renderDetail(null);
    } catch {
        document.getElementById("intelligenceList").innerHTML = `<div class="alert alert-danger m-3">Unable to load intelligence alerts.</div>`;
    }
}

const content = `
    <div class="intelligence-hero"><div><span>Cross-organization awareness</span><h3>Shared security intelligence</h3><p>Patterns and correlations are visible across organizations while operational records remain tenant-isolated.</p></div><i class="bi bi-stars"></i></div>
    <div class="intelligence-filters">
        <input id="intelligenceSearch" class="form-control" type="search" placeholder="Search alerts or organizations">
        <select id="intelligenceType" class="form-select"><option value="all">All types</option><option value="trend">Trends</option><option value="visitor">Visitor correlations</option><option value="security">Security</option><option value="escalation">Escalations</option></select>
        <select id="intelligenceSeverity" class="form-select"><option value="all">All severities</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
    </div>
    <div class="intelligence-workspace"><div id="intelligenceList" class="intelligence-list"><div class="notification-empty"><span class="spinner-border text-primary"></span></div></div><aside id="intelligenceDetail" class="intelligence-detail"></aside></div>`;
loadLayout("Intelligence", content);

document.addEventListener("input", (event) => { if (["intelligenceSearch", "intelligenceType", "intelligenceSeverity"].includes(event.target.id)) renderList(); });
document.addEventListener("change", (event) => { if (["intelligenceType", "intelligenceSeverity"].includes(event.target.id)) renderList(); });
document.addEventListener("click", async (event) => {
    const item = event.target.closest("[data-alert-id]");
    if (item) selectAlert(Number(item.dataset.alertId));
    const dismiss = event.target.closest("[data-dismiss-detail]");
    if (dismiss) {
        await dismissIntelligenceAlert(Number(dismiss.dataset.dismissDetail));
        alerts = alerts.filter((alert) => alert.id !== Number(dismiss.dataset.dismissDetail));
        selectedId = null; renderList();
        if (alerts.length) selectAlert(alerts[0].id); else renderDetail(null);
    }
});
loadAlerts();

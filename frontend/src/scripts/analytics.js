import { loadLayout } from "../components/layout.js";
import { getVisitors } from "../services/visitorService.js";
import { getIncidents } from "../services/incidentService.js";

const palette = ["#2563eb", "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981"];
let allVisitors = [];
let allIncidents = [];

const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatNumber = (value) => new Intl.NumberFormat().format(value);

function toLocalDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function inRange(date, from, to) {
    if (!date) return false;
    const day = date.toISOString().slice(0, 10);
    return (!from || day >= from) && (!to || day <= to);
}

function countBy(items, getKey) {
    return items.reduce((counts, item) => {
        const key = getKey(item) || "Unspecified";
        counts[key] = (counts[key] || 0) + 1;
        return counts;
    }, {});
}

function sortedEntries(counts) {
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function metricCard(label, value, detail, icon, tone) {
    return `
        <div class="col-sm-6 col-xl-3">
            <div class="analytics-metric h-100">
                <div class="metric-icon metric-${tone}"><i class="bi ${icon}"></i></div>
                <p>${label}</p>
                <h3>${escapeHtml(value)}</h3>
                <small>${escapeHtml(detail)}</small>
            </div>
        </div>`;
}

function horizontalBars(entries, emptyText) {
    if (!entries.length) return `<div class="chart-empty"><i class="bi bi-bar-chart"></i><span>${emptyText}</span></div>`;
    const max = Math.max(...entries.map(([, value]) => value), 1);
    return `<div class="horizontal-chart">${entries.slice(0, 6).map(([label, value], index) => `
        <div class="bar-row">
            <div class="bar-label" title="${escapeHtml(label)}">${escapeHtml(label)}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${(value / max) * 100}%;--bar-color:${palette[index % palette.length]}"></div></div>
            <strong>${value}</strong>
        </div>`).join("")}</div>`;
}

function donutChart(entries) {
    if (!entries.length) return `<div class="chart-empty"><i class="bi bi-pie-chart"></i><span>No incidents in this period</span></div>`;
    const visible = entries.slice(0, 5);
    const total = visible.reduce((sum, [, value]) => sum + value, 0);
    let cursor = 0;
    const stops = visible.map(([, value], index) => {
        const start = cursor;
        cursor += (value / total) * 100;
        return `${palette[index]} ${start}% ${cursor}%`;
    }).join(",");
    return `<div class="donut-wrap">
        <div class="donut" style="background:conic-gradient(${stops})"><div><strong>${total}</strong><span>incidents</span></div></div>
        <div class="donut-legend">${visible.map(([label, value], index) => `
            <div><span class="legend-dot" style="background:${palette[index]}"></span><span title="${escapeHtml(label)}">${escapeHtml(label)}</span><strong>${value}</strong></div>`).join("")}</div>
    </div>`;
}

function activityChart(visitors, incidents) {
    const hours = Array(24).fill(0);
    visitors.forEach((visitor) => {
        const date = toLocalDate(visitor.expectedTime || visitor.createdAt);
        if (date) hours[date.getHours()] += 1;
    });
    incidents.forEach((incident) => {
        const hour = Number.parseInt(String(incident.time || "").slice(0, 2), 10);
        if (Number.isInteger(hour) && hour >= 0 && hour < 24) hours[hour] += 1;
    });
    const max = Math.max(...hours, 1);
    const peak = hours.indexOf(Math.max(...hours));
    return `<div class="activity-chart" aria-label="Activity by hour">${hours.map((value, hour) => `
        <div class="hour-column" title="${String(hour).padStart(2, "0")}:00 — ${value} activities">
            <span class="hour-value">${value || ""}</span>
            <div class="hour-bar ${hour === peak && value ? "peak" : ""}" style="height:${Math.max((value / max) * 100, value ? 8 : 2)}%"></div>
            <small>${hour % 3 === 0 ? String(hour).padStart(2, "0") : ""}</small>
        </div>`).join("")}</div>`;
}

function renderAnalytics() {
    const from = document.getElementById("analyticsFrom")?.value || "";
    const to = document.getElementById("analyticsTo")?.value || "";
    const visitors = allVisitors.filter((item) => inRange(toLocalDate(item.expectedTime || item.createdAt), from, to));
    const incidents = allIncidents.filter((item) => inRange(toLocalDate(item.date || item.createdAt), from, to));
    const departments = sortedEntries(countBy(visitors, (item) => item.department || item.location));
    const incidentTypes = sortedEntries(countBy(incidents, (item) => item.type));
    const openIncidents = incidents.filter((item) => ["Open", "Investigating"].includes(item.status)).length;
    const checkedIn = visitors.filter((item) => item.status === "Checked In").length;
    const hours = countBy(visitors, (item) => {
        const date = toLocalDate(item.expectedTime || item.createdAt);
        return date ? date.getHours() : null;
    });
    const peakEntry = sortedEntries(hours)[0];
    const peakLabel = peakEntry ? `${String(peakEntry[0]).padStart(2, "0")}:00–${String((Number(peakEntry[0]) + 1) % 24).padStart(2, "0")}:00` : "—";
    const topDepartment = departments[0]?.[0] || "No data";

    document.getElementById("analyticsResults").innerHTML = `
        <div class="row g-3 mb-4">
            ${metricCard("Total visits", formatNumber(visitors.length), `${checkedIn} currently checked in`, "bi-people", "blue")}
            ${metricCard("Incidents", formatNumber(incidents.length), `${openIncidents} require attention`, "bi-shield-exclamation", "red")}
            ${metricCard("Peak visitor hour", peakLabel, peakEntry ? `${peakEntry[1]} scheduled visit${peakEntry[1] === 1 ? "" : "s"}` : "No visits recorded", "bi-clock-history", "amber")}
            ${metricCard("Top destination", topDepartment, departments[0] ? `${departments[0][1]} visit${departments[0][1] === 1 ? "" : "s"}` : "No visits recorded", "bi-building", "purple")}
        </div>
        <div class="row g-4 mb-4">
            <div class="col-xl-7"><section class="analytics-card h-100"><div class="chart-heading"><div><span>Visitor flow</span><h4>Most visited departments</h4></div><i class="bi bi-building"></i></div>${horizontalBars(departments, "No department visits in this period")}</section></div>
            <div class="col-xl-5"><section class="analytics-card h-100"><div class="chart-heading"><div><span>Safety overview</span><h4>Incidents by type</h4></div><i class="bi bi-pie-chart"></i></div>${donutChart(incidentTypes)}</section></div>
        </div>
        <section class="analytics-card"><div class="chart-heading"><div><span>Daily rhythm</span><h4>Peak activity hours</h4></div><div class="chart-key"><span></span>Combined visitor and incident activity</div></div>${activityChart(visitors, incidents)}<div class="activity-axis"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div></section>`;
}

function renderShell() {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 29);
    const content = `
        <div class="analytics-toolbar mb-4">
            <div><p class="mb-1">Operational intelligence</p><span>Monitor visitor traffic and security patterns across your facilities.</span></div>
            <div class="date-controls">
                <label>From<input id="analyticsFrom" type="date" value="${start.toISOString().slice(0, 10)}"></label>
                <label>To<input id="analyticsTo" type="date" value="${today.toISOString().slice(0, 10)}"></label>
                <button id="refreshAnalytics" class="btn btn-primary"><i class="bi bi-arrow-clockwise me-2"></i>Refresh</button>
            </div>
        </div>
        <div id="analyticsResults"><div class="analytics-loading"><span class="spinner-border text-primary"></span><p>Building your dashboard…</p></div></div>`;
    loadLayout("Analytics", content);
}

async function loadAnalytics() {
    const button = document.getElementById("refreshAnalytics");
    if (button) button.disabled = true;
    try {
        [allVisitors, allIncidents] = await Promise.all([getVisitors(), getIncidents()]);
        renderAnalytics();
    } catch (error) {
        console.error("Unable to load analytics:", error);
        document.getElementById("analyticsResults").innerHTML = `<div class="analytics-error"><i class="bi bi-cloud-slash"></i><h4>Analytics are unavailable</h4><p>We couldn't retrieve the latest visitor and incident data.</p><button class="btn btn-outline-primary" id="retryAnalytics">Try again</button></div>`;
    } finally {
        if (button) button.disabled = false;
    }
}

document.addEventListener("click", (event) => {
    if (event.target.closest("#refreshAnalytics") || event.target.closest("#retryAnalytics")) loadAnalytics();
});
document.addEventListener("change", (event) => {
    if (["analyticsFrom", "analyticsTo"].includes(event.target.id)) renderAnalytics();
});

renderShell();
loadAnalytics();

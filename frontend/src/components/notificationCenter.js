import {
    dismissIntelligenceAlert,
    getIntelligenceAlerts,
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead
} from "../services/notificationService.js";

let notifications = [];
let intelligenceAlerts = [];
let activeTab = "notifications";
let pollTimer = null;
let eventsBound = false;

const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function currentRole() {
    try {
        const token = localStorage.getItem("accessToken");
        return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).role;
    } catch {
        return "";
    }
}

function relativeTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

function notificationIcon(item) {
    if (item.source === "intelligence") return "bi-stars";
    if (item.source === "incident") return "bi-shield-exclamation";
    if (item.source === "visitor") return "bi-person-check";
    return "bi-info-circle";
}

function severityClass(severity) {
    return {
        Critical: "danger",
        High: "danger",
        Medium: "warning",
        Low: "info"
    }[severity] || "secondary";
}

function renderNotifications() {
    if (!notifications.length) {
        return `<div class="notification-empty"><i class="bi bi-bell-slash"></i><strong>You're all caught up</strong><span>New activity will appear here.</span></div>`;
    }

    return notifications.map((item) => `
        <button class="notification-item ${item.is_read ? "" : "unread"}" data-notification-id="${item.id}" data-related-type="${escapeHtml(item.related_type || "")}" data-related-id="${item.related_id || ""}">
            <span class="notification-icon type-${escapeHtml(item.notification_type)}"><i class="bi ${notificationIcon(item)}"></i></span>
            <span class="notification-copy">
                <span class="notification-title">${escapeHtml(item.title)}</span>
                <span class="notification-message">${escapeHtml(item.message)}</span>
                <span class="notification-time">${relativeTime(item.created_at)}</span>
            </span>
            ${item.is_read ? "" : '<span class="unread-dot"></span>'}
        </button>`).join("");
}

function renderIntelligence() {
    if (!intelligenceAlerts.length) {
        return `<div class="notification-empty"><i class="bi bi-stars"></i><strong>No active alerts</strong><span>SmartEntry is monitoring for unusual patterns.</span></div>`;
    }

    const canDismiss = ["admin", "security"].includes(currentRole());
    return intelligenceAlerts.map((alert) => `
        <article class="intelligence-item">
            <div class="d-flex justify-content-between align-items-start gap-2">
                <span class="badge text-bg-${severityClass(alert.severity)}">${escapeHtml(alert.severity)}</span>
                <span class="notification-time">${relativeTime(alert.created_at)}</span>
            </div>
            <strong>${escapeHtml(alert.title)}</strong>
            <p>${escapeHtml(alert.description)}</p>
            <div class="intelligence-footer">
                <span><i class="bi bi-stars me-1"></i>${escapeHtml(alert.alert_type)}</span>
                ${canDismiss ? `<button class="btn btn-sm btn-link" data-dismiss-alert="${alert.id}">Dismiss</button>` : ""}
            </div>
        </article>`).join("");
}

function render() {
    const menu = document.getElementById("notificationMenu");
    if (!menu) return;

    const unread = notifications.filter((item) => !item.is_read).length;
    const badge = document.getElementById("notificationBadge");
    if (badge) {
        badge.textContent = unread > 99 ? "99+" : unread;
        badge.classList.toggle("d-none", unread === 0);
    }

    menu.innerHTML = `
        <div class="notification-header">
            <div><strong>Activity center</strong><span>Live updates from SmartEntry</span></div>
            ${unread ? '<button class="btn btn-sm btn-link" id="markAllReadBtn">Mark all read</button>' : ""}
        </div>
        <div class="notification-tabs" role="tablist">
            <button class="${activeTab === "notifications" ? "active" : ""}" data-alert-tab="notifications">Notifications ${unread ? `<span>${unread}</span>` : ""}</button>
            <button class="${activeTab === "intelligence" ? "active" : ""}" data-alert-tab="intelligence">Intelligence ${intelligenceAlerts.length ? `<span>${intelligenceAlerts.length}</span>` : ""}</button>
        </div>
        <div class="notification-list">${activeTab === "notifications" ? renderNotifications() : renderIntelligence()}</div>`;
}

async function loadData(showError = false) {
    try {
        [notifications, intelligenceAlerts] = await Promise.all([
            getNotifications(),
            getIntelligenceAlerts()
        ]);
        render();
    } catch (error) {
        console.error("Unable to load notifications:", error);
        if (showError) {
            const list = document.querySelector("#notificationMenu .notification-list");
            if (list) list.innerHTML = `<div class="notification-empty"><i class="bi bi-wifi-off"></i><strong>Unable to load activity</strong><span>Please try again shortly.</span></div>`;
        }
    }
}

function relatedUrl(type, id) {
    if (type === "visitor") return `/src/pages/visitors.html?visitor=${id}`;
    if (type === "incident") return `/src/pages/incidents.html?incident=${id}`;
    if (type === "intelligence") return `/src/pages/intelligence.html?alert=${id}`;
    if (type === "intelligence") return `/src/pages/intelligence.html?alert=${id}`;
    return null;
}

function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    document.addEventListener("click", async (event) => {
        const tab = event.target.closest("[data-alert-tab]");
        if (tab) {
            event.stopPropagation();
            activeTab = tab.dataset.alertTab;
            render();
            return;
        }

        const markAll = event.target.closest("#markAllReadBtn");
        if (markAll) {
            event.stopPropagation();
            await markAllNotificationsRead();
            notifications = notifications.map((item) => ({ ...item, is_read: true }));
            render();
            return;
        }

        const notification = event.target.closest("[data-notification-id]");
        if (notification) {
            event.stopPropagation();
            const id = Number(notification.dataset.notificationId);
            const item = notifications.find((entry) => entry.id === id);
            if (item && !item.is_read) await markNotificationRead(id);
            const url = relatedUrl(notification.dataset.relatedType, notification.dataset.relatedId);
            if (url) window.location.href = url;
            else {
                notifications = notifications.map((entry) => entry.id === id ? { ...entry, is_read: true } : entry);
                if (item?.source === "intelligence") activeTab = "intelligence";
                render();
            }
            return;
        }

        const dismiss = event.target.closest("[data-dismiss-alert]");
        if (dismiss) {
            event.stopPropagation();
            const id = Number(dismiss.dataset.dismissAlert);
            await dismissIntelligenceAlert(id);
            intelligenceAlerts = intelligenceAlerts.filter((alert) => alert.id !== id);
            render();
        }
    });

    document.addEventListener("show.bs.dropdown", (event) => {
        if (event.target.querySelector?.("#notificationBtn")) loadData(true);
    });
}

export function initializeNotificationCenter() {
    if (!document.getElementById("notificationMenu")) return;
    bindEvents();
    activeTab = "notifications";
    render();
    loadData();
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = window.setInterval(loadData, 60000);
}

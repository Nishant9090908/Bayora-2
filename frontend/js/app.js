/**
 * =========================================================================
 * BAYORA CLIENT APPLICATION CORE
 * Router, Global State, Role Switcher, Theme Manager & View Orchestrator
 * =========================================================================
 */
import { SAMPLE_DATA } from "./mock-data.js";
import { renderLanding } from "../common/landing.js";
import { renderLogin, renderRegister } from "../common/auth.js";
import { renderRedTeam } from "../red-team/red-team.js";
import { renderBlueTeam } from "../blue-team/blue-team.js";
import { renderAdmin } from "../admin/admin.js";
import { renderEvaluation } from "../common/evaluation.js";
import { renderSecurityEvents } from "../admin/security-events.js";
import { apiClient } from "./api.js";

class AppState {
  constructor() {
    this.currentRole = "red_team"; // default role for testing
    this.currentUsername = "red_operator";
    this.currentTheme = "dark";
    this.init();
  }

  init() {
    // 1. Initialize Theme Engine (Light/Dark Mode)
    this.initTheme();

    // 2. Listen for hash changes
    window.addEventListener("hashchange", () => this.handleRoute());
    
    // 3. Setup Topbar Role Switcher
    const roleSelect = document.getElementById("nav-role-select");
    if (roleSelect) {
      roleSelect.value = this.currentRole;
      roleSelect.addEventListener("change", (e) => {
        const newRole = e.target.value;
        const matchedUser = SAMPLE_DATA.users.find(u => u.role === newRole);
        this.setUserRole(newRole, matchedUser ? matchedUser.username : "operator");
        this.showToast(`Active clearance switched to: ${newRole.toUpperCase()}`, "warning");
        this.updateNavBadges();
      });
    }

    // 4. Initial database and health check
    apiClient.checkHealth();

    this.updateNavBadges();
    this.handleRoute();
  }

  initTheme() {
    const savedTheme = localStorage.getItem("bayora-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const activeTheme = savedTheme || systemTheme;
    this.setTheme(activeTheme, false);

    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const target = current === "dark" ? "light" : "dark";
        this.setTheme(target, true);
        this.showToast(`Switched to ${target.charAt(0).toUpperCase() + target.slice(1)} Mode`, "info");
      });
    }

    // Sync with OS theme changes if user hasn't explicitly set a preference
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("bayora-theme")) {
        this.setTheme(e.matches ? "dark" : "light", false);
      }
    });

    // Listen to themechange to dynamically redraw charts on active pages
    window.addEventListener("bayorathemechange", () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#red-team" || hash === "#blue-team") {
        this.handleRoute();
      }
    });
  }

  setTheme(theme, persist = true) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme;
    if (persist) {
      localStorage.setItem("bayora-theme", theme);
    }
    window.dispatchEvent(new CustomEvent("bayorathemechange", { detail: { theme } }));
  }

  setUserRole(role, username) {
    this.currentRole = role;
    this.currentUsername = username;
    const roleSelect = document.getElementById("nav-role-select");
    if (roleSelect) roleSelect.value = role;
    this.updateNavBadges();
  }

  updateNavBadges() {
    const roleBadge = document.getElementById("nav-role-badge");
    if (!roleBadge) return;

    if (this.currentRole === "red_team") {
      roleBadge.textContent = "RED TEAM";
      roleBadge.className = "badge badge-red";
    } else if (this.currentRole === "blue_team") {
      roleBadge.textContent = "BLUE TEAM";
      roleBadge.className = "badge badge-blue";
    } else {
      roleBadge.textContent = "AUDITOR";
      roleBadge.className = "badge badge-emerald";
    }
  }

  handleRoute() {
    const hash = window.location.hash.toLowerCase() || "#landing";
    const content = document.getElementById("main-content");
    if (!content) return;

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    window.scrollTo(0, 0);

    // Route dispatch
    switch (hash) {
      case "#":
      case "#landing":
        renderLanding(content);
        break;
      case "#login":
        renderLogin(content, this);
        break;
      case "#register":
        renderRegister(content);
        break;
      case "#red-team":
        renderRedTeam(content, this);
        break;
      case "#blue-team":
        renderBlueTeam(content, this);
        break;
      case "#admin":
        renderAdmin(content, this);
        break;
      case "#evaluation":
        renderEvaluation(content, this);
        break;
      case "#security-events":
        renderSecurityEvents(content, this);
        break;
      default:
        content.innerHTML = `
          <div style="text-align: center; padding: 80px 20px;">
            <h1 class="text-red" style="font-size: 2.5rem; margin-bottom: 12px;">404 // Enclave Route Not Found</h1>
            <p style="margin-bottom: 24px;">The requested security endpoint or dashboard does not exist in the routing manifest.</p>
            <a href="#landing" class="btn btn-secondary">Return to Enclave Overview</a>
          </div>
        `;
    }
  }

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "error") icon = "🚨";
    if (type === "warning") icon = "⚡";

    toast.innerHTML = `
      <span style="font-weight: 700; font-size: 1.1rem;">${icon}</span>
      <div style="flex: 1; font-weight: 600;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Instantiate on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.BayoraApp = new AppState();
});

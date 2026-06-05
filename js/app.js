/* ==========================
IMPORTS
========================== */

import {
  renderTabs
} from "./ui/tabs.js";

import {
  renderFilters
} from "./ui/filters.js";

import {
  loadAllData
} from "./services/fetchService.js";

/* ==========================
APP STATE
========================== */

export const APP_STATE = {

  loading: true,

  activeTab: "dashboard",

  filters: {

    brand: "ALL",

    erpStatus: "ALL",

    search: ""

  }

};

/* ==========================
BOOT
========================== */

init();

async function init() {

  showLoading();

  try {

    await loadAllData();

    renderGlobalFilters();

    renderTabs(
      APP_STATE.activeTab,
      handleTabChange
    );

    renderPage();

  }
  catch (error) {

    showError(
      error.message
    );

    console.error(
      error
    );

  }

}

/* ==========================
TAB CHANGE
========================== */

function handleTabChange(
  tabId
) {

  APP_STATE.activeTab =
    tabId;

  renderTabs(
    APP_STATE.activeTab,
    handleTabChange
  );

  renderPage();

}

/* ==========================
FILTERS
========================== */

function renderGlobalFilters() {

  const container =
    document.getElementById(
      "globalFilters"
    );

  container.innerHTML = `

    <div class="filter-group">

      <label class="filter-label">
        Brand
      </label>

      <select
        id="brandFilter"
        class="filter-control"
      >
      </select>

    </div>

    <div class="filter-group">

      <label class="filter-label">
        ERP Status
      </label>

      <select
        id="erpStatusFilter"
        class="filter-control"
      >
      </select>

    </div>

    <div class="filter-group">

      <label class="filter-label">
        Search
      </label>

      <input
        id="searchFilter"
        type="text"
        class="filter-control search-control"
        placeholder="Style ID / ERP SKU"
      >
    </div>

  `;

  renderFilters(
    renderPage
  );

}

/* ==========================
PAGE ROUTER
========================== */

function renderPage() {

  const container =
    document.getElementById(
      "pageContent"
    );

  switch (
    APP_STATE.activeTab
  ) {

    case "dashboard":

      container.innerHTML =
        renderDashboard();

      break;

    case "margin":

      container.innerHTML =
        renderMarginTrendReport();

      break;

    case "stock":

      container.innerHTML =
        renderStockTrendReport();

      break;

    case "verification":

      container.innerHTML =
        getVerificationPage();

      break;

    default:

      container.innerHTML = "";

  }

}

/* ==========================
LOADING
========================== */

function showLoading() {

  document.getElementById(
    "pageContent"
  ).innerHTML = `

    <div class="empty-state">

      Loading Data...

    </div>

  `;

}

/* ==========================
ERROR
========================== */

function showError(
  message
) {

  document.getElementById(
    "pageContent"
  ).innerHTML = `

    <div class="empty-state">

      ${message}

    </div>

  `;

}

/* ==========================
DASHBOARD
========================== */

function getDashboardPage() {

  return `

    <section class="page-section">

      <div class="kpi-grid">

        ${createKpiCard(
          "Total Styles"
        )}

        ${createKpiCard(
          "Active Styles"
        )}

        ${createKpiCard(
          "Total SOR Stock"
        )}

        ${createKpiCard(
          "Latest Snapshot Stock"
        )}

        ${createKpiCard(
          "Avg Margin"
        )}

        ${createKpiCard(
          "Above 27%"
        )}

        ${createKpiCard(
          "Below 27%"
        )}

        ${createKpiCard(
          "OOS Styles"
        )}

      </div>

      <div class="empty-state">

        Dashboard Engine Pending

      </div>

    </section>

  `;

}

/* ==========================
MARGIN PAGE
========================== */

function getMarginPage() {

  return `

    <section class="page-section">

      <div class="section-header">

        <div class="section-title">

          Margin Trend

        </div>

        <div class="section-actions">

          <button
            class="btn-primary"
          >
            Export Excel
          </button>

        </div>

      </div>

      <div class="empty-state">

        Margin Trend Report Pending

      </div>

    </section>

  `;

}

/* ==========================
STOCK PAGE
========================== */

function getStockPage() {

  return `

    <section class="page-section">

      <div class="section-header">

        <div class="section-title">

          Stock Trend

        </div>

        <div class="section-actions">

          <button
            class="btn-primary"
          >
            Export Excel
          </button>

        </div>

      </div>

      <div class="empty-state">

        Stock Trend Report Pending

      </div>

    </section>

  `;

}

/* ==========================
VERIFICATION PAGE
========================== */

function getVerificationPage() {

  return `

    <section class="page-section">

      <div class="upload-section">

        <div class="upload-actions">

          <button
            class="btn-secondary"
          >
            Download Sample
          </button>

          <button
            class="btn-primary"
          >
            Upload CSV
          </button>

          <button
            class="btn-primary"
          >
            Generate Report
          </button>

        </div>

        <div class="upload-dropzone">

          <div class="upload-title">

            Upload Paid Report

          </div>

          <div class="upload-subtitle">

            CSV File Upload

          </div>

        </div>

      </div>

      <div class="kpi-grid">

        ${createKpiCard(
          "Matched Styles"
        )}

        ${createKpiCard(
          "Not Found"
        )}

        ${createKpiCard(
          "Total Units"
        )}

        ${createKpiCard(
          "Total Purchase"
        )}

        ${createKpiCard(
          "Total Revenue"
        )}

        ${createKpiCard(
          "Actual Margin"
        )}

        ${createKpiCard(
          "Overpaid"
        )}

        ${createKpiCard(
          "Underpaid"
        )}

      </div>

      <div class="empty-state">

        Verification Engine Pending

      </div>

    </section>

  `;

}

/* ==========================
KPI CARD
========================== */

function createKpiCard(
  label
) {

  return `

    <div class="kpi-card">

      <div class="kpi-label">

        ${label}

      </div>

      <div class="kpi-value">

        -

      </div>

    </div>

  `;

}
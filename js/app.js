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

import {
  renderDashboard
} from "./reports/dashboardReport.js";

import {
  renderMarginTrendReport
} from "./reports/marginTrendReport.js";

import {
  renderStockTrendReport
} from "./reports/stockTrendReport.js";

import {
  renderPaidVerificationReport
} from "./reports/paidVerificationReport.js";

import {
  readCsvFile,
  validateCsvStructure,
  downloadSampleCsv
} from "./services/csvUploadService.js";

import {
  exportTableToExcel
} from "./services/exportService.js";

/* ==========================
APP STATE
========================== */

export const APP_STATE = {

  loading: true,

  activeTab: "dashboard"

};

let uploadedRows = [];

let uploadedFileName = "";

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

    console.error(
      error
    );

    showError(
      error.message
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
        renderVerificationPage();

      bindVerificationEvents();

      break;

    default:

      container.innerHTML =
        "";

  }

}

/* ==========================
VERIFICATION PAGE
========================== */

function renderVerificationPage() {

  return `

    <section class="page-section">

      <div class="upload-section">

        <div class="upload-actions">

          <button
            id="downloadSampleBtn"
            class="btn-secondary"
          >
            Download Sample
          </button>

          <button
            id="uploadCsvBtn"
            class="btn-primary"
          >
            Upload CSV
          </button>

          <button
            id="generateReportBtn"
            class="btn-primary"
          >
            Generate Report
          </button>

          <input
            id="verificationFile"
            type="file"
            accept=".csv"
            style="display:none;"
          >

        </div>

        <div
          id="uploadStatus"
          class="upload-status"
        >

          No file uploaded

        </div>

      </div>

      <div
        id="verificationResult"
      ></div>

    </section>

  `;

}

/* ==========================
VERIFICATION EVENTS
========================== */

function bindVerificationEvents() {

  const sampleBtn =
    document.getElementById(
      "downloadSampleBtn"
    );

  const uploadBtn =
    document.getElementById(
      "uploadCsvBtn"
    );

  const generateBtn =
    document.getElementById(
      "generateReportBtn"
    );

  const fileInput =
    document.getElementById(
      "verificationFile"
    );

  sampleBtn?.addEventListener(
    "click",
    () => {

      downloadSampleCsv();

    }
  );

  uploadBtn?.addEventListener(
    "click",
    () => {

      fileInput.click();

    }
  );

  fileInput?.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files[0];

      if (!file) {
        return;
      }

      try {

        uploadedRows =
          await readCsvFile(
            file
          );

        uploadedFileName =
          file.name;

        const validation =
          validateCsvStructure(
            uploadedRows
          );

        updateUploadStatus(
          validation.valid
            ? `Loaded ${uploadedRows.length} rows from ${uploadedFileName}`
            : validation.message
        );

      }
      catch (error) {

        updateUploadStatus(
          error.message
        );

      }

    }
  );

  generateBtn?.addEventListener(
    "click",
    () => {

      if (
        !uploadedRows.length
      ) {

        alert(
          "Upload CSV first"
        );

        return;

      }

      const validation =
        validateCsvStructure(
          uploadedRows
        );

      if (
        !validation.valid
      ) {

        alert(
          validation.message
        );

        return;

      }

      document.getElementById(
        "verificationResult"
      ).innerHTML =

        renderPaidVerificationReport(
          uploadedRows
        );

      bindExportButton();

    }
  );

}

/* ==========================
EXPORT
========================== */

function bindExportButton() {

  const button =
    document.getElementById(
      "exportVerificationReport"
    );

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    () => {

      exportTableToExcel(
        "verificationTable",
        "paid_verification"
      );

    }
  );

}

/* ==========================
UPLOAD STATUS
========================== */

function updateUploadStatus(
  text
) {

  const element =
    document.getElementById(
      "uploadStatus"
    );

  if (
    element
  ) {

    element.innerHTML =
      text;

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
/* ==========================
IMPORTS
========================== */

import {
  generatePaidReport
} from "../engine/paidVerificationEngine.js";

/* ==========================
RENDER REPORT
========================== */

export function renderPaidVerificationReport(
  uploadedRows
) {

  const result =
    generatePaidReport(
      uploadedRows
    );

  return `

    <section class="page-section">

      ${renderKpis(
        result.kpis
      )}

      ${renderValidation(
        result.validation
      )}

      ${renderNotFound(
        result.validation.notFound
      )}

      ${renderTable(
        result.reportRows
      )}

    </section>

  `;

}

/* ==========================
KPIS
========================== */

function renderKpis(
  kpis
) {

  return `

    <div class="kpi-grid">

      ${createCard(
        "Matched Styles",
        formatNumber(
          kpis.matchedStyles
        )
      )}

      ${createCard(
        "Not Found",
        formatNumber(
          kpis.notFoundStyles
        )
      )}

      ${createCard(
        "Total Units",
        formatNumber(
          kpis.totalUnits
        )
      )}

      ${createCard(
        "Total Purchase",
        formatCurrency(
          kpis.totalPurchase
        )
      )}

      ${createCard(
        "Total Revenue",
        formatCurrency(
          kpis.totalRevenue
        )
      )}

      ${createCard(
        "Actual Margin",
        formatPercent(
          kpis.actualMargin
        )
      )}

      ${createCard(
        "Overpaid",
        formatNumber(
          kpis.overpaid
        )
      )}

      ${createCard(
        "Underpaid",
        formatNumber(
          kpis.underpaid
        )
      )}

    </div>

  `;

}

/* ==========================
VALIDATION
========================== */

function renderValidation(
  validation
) {

  return `

    <div class="validation-card">

      <div class="validation-item">

        <div class="validation-label">
          Found Styles
        </div>

        <div class="
          validation-value
          success
        ">
          ${validation.foundCount}
        </div>

      </div>

      <div class="validation-item">

        <div class="validation-label">
          Not Found
        </div>

        <div class="
          validation-value
          danger
        ">
          ${validation.notFoundCount}
        </div>

      </div>

    </div>

  `;

}

/* ==========================
NOT FOUND
========================== */

function renderNotFound(
  rows
) {

  if (
    !rows.length
  ) {

    return "";

  }

  return `

    <div class="table-section">

      <div class="table-header">

        <div class="table-title">

          Not Found Styles

        </div>

      </div>

      <div class="table-wrapper">

        <table
          class="
            report-table
            not-found-table
          "
        >

          <thead>

            <tr>

              <th>
                Style ID
              </th>

            </tr>

          </thead>

          <tbody>

            ${rows
              .map(
                row => `

                  <tr>

                    <td>
                      ${row.style_id}
                    </td>

                  </tr>

                `
              )
              .join("")}

          </tbody>

        </table>

      </div>

    </div>

  `;

}

/* ==========================
REPORT TABLE
========================== */

function renderTable(
  rows
) {

  return `

    <div class="table-section">

      <div class="table-header">

        <div class="table-title">

          Paid Verification

        </div>

        <div class="table-actions">

          <button
            id="exportVerificationReport"
            class="btn-primary"
          >
            Export Excel
          </button>

        </div>

      </div>

      <div class="table-wrapper">

        <table
          id="verificationTable"
          class="
            report-table
            verification-table
          "
        >

          <thead>

            <tr>

              <th>Style ID</th>

              <th>ERP SKU</th>

              <th>ERP Status</th>

              <th>Qty</th>

              <th>Revenue</th>

              <th>Purchase Price</th>

              <th>TP</th>

              <th>Unit Purchase</th>

              <th>Diff</th>

              <th>Margin %</th>

              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            ${rows
              .map(
                row => `

                  <tr>

                    <td>
                      ${row.style_id}
                    </td>

                    <td>
                      ${row.erp_sku}
                    </td>

                    <td>
                      ${row.erp_status}
                    </td>

                    <td class="cell-right">
                      ${formatNumber(row.quantity)}
                    </td>

                    <td class="cell-right">
                      ${formatCurrency(row.revenue)}
                    </td>

                    <td class="cell-right">
                      ${formatCurrency(row.purchase_price)}
                    </td>

                    <td class="cell-right">
                      ${formatCurrency(row.tp)}
                    </td>

                    <td class="cell-right">
                      ${formatCurrency(row.unit_purchase_price)}
                    </td>

                    <td class="
                      cell-right
                      ${getDiffClass(row.diff)}
                    ">
                      ${formatCurrency(row.diff)}
                    </td>

                    <td class="cell-right">
                      ${
                        row.margin === null
                          ? "NA"
                          : formatPercent(row.margin)
                      }
                    </td>

                    <td class="
                      ${getStatusClass(row.status)}
                    ">
                      ${row.status}
                    </td>

                  </tr>

                `
              )
              .join("")}

          </tbody>

        </table>

      </div>

    </div>

  `;

}

/* ==========================
CARD
========================== */

function createCard(
  label,
  value
) {

  return `

    <div class="kpi-card">

      <div class="kpi-label">
        ${label}
      </div>

      <div class="kpi-value">
        ${value}
      </div>

    </div>

  `;

}

/* ==========================
STATUS CLASS
========================== */

function getStatusClass(
  status
) {

  if (
    status === "OVERPAID"
  ) {
    return "status-danger";
  }

  if (
    status === "UNDERPAID"
  ) {
    return "status-warning";
  }

  return "status-success";

}

function getDiffClass(
  value
) {

  if (
    value > 0
  ) {
    return "status-danger";
  }

  if (
    value < 0
  ) {
    return "status-warning";
  }

  return "status-success";

}

/* ==========================
FORMATTERS
========================== */

function formatNumber(
  value
) {

  return Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  );

}

function formatCurrency(
  value
) {

  return Number(
    value || 0
  ).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }
  );

}

function formatPercent(
  value
) {

  return Number(
    value || 0
  ).toFixed(
    2
  ) + "%";

}
/* ==========================
IMPORTS
========================== */

import {
  generatePaidReport
} from "../engine/paidVerificationEngine.js";

/* ==========================
DATA ACCESS
========================== */

export function getPaidVerificationData(
  uploadedRows
) {

  return generatePaidReport(
    uploadedRows
  );

}

/* ==========================
RENDER REPORT
========================== */

export function renderPaidVerificationReport(
  uploadedRows
) {

  const result =
    getPaidVerificationData(
      uploadedRows
    );

  return `

    <section class="page-section">

      ${renderValidationSummary(
        result.validation
      )}

      ${renderKpis(
        result.kpis
      )}

      ${renderTable(
        result.reportRows
      )}

    </section>

  `;

}

/* ==========================
VALIDATION SUMMARY
========================== */

function renderValidationSummary(
  validation
) {

  return `

    <div class="validation-summary">

      <div class="
        validation-box
        success
      ">

        <div class="
          validation-box-title
        ">
          Found Styles
        </div>

        <div class="
          validation-box-value
        ">
          ${validation.foundCount}
        </div>

      </div>

      <div class="
        validation-box
        ${
          validation.notFoundCount > 0
            ? "warning"
            : "success"
        }
      ">

        <div class="
          validation-box-title
        ">
          Missing Styles
        </div>

        <div class="
          validation-box-value
        ">
          ${validation.notFoundCount}
        </div>

      </div>

      ${
        validation.notFoundCount > 0

          ? `

            <div class="
              validation-box
              warning
            ">

              <button
                id="exportMissingStyles"
                class="btn-primary"
              >
                Export Missing Styles
              </button>

            </div>

          `

          : ""

      }

    </div>

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
        "Found Styles",
        formatNumber(
          kpis.foundStyles
        )
      )}

      ${createCard(
        "Overpaid Styles",
        formatNumber(
          kpis.overpaidStyles
        )
      )}

      ${createCard(
        "Underpaid Styles",
        formatNumber(
          kpis.underpaidStyles
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

    </div>

  `;

}

/* ==========================
TABLE
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
            Export Found Styles
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
              <th>Total Diff</th>
              <th>Margin %</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            ${rows.map(
              row => `

                <tr>

                  <td>${row.style_id}</td>

                  <td>${row.erp_sku}</td>

                  <td>${row.erp_status}</td>

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
                    ${getStatusClass(
                      row.status
                    )}
                  ">
                    ${formatCurrency(row.diff)}
                  </td>

                  <td class="
                    cell-right
                    ${getStatusClass(
                      row.status
                    )}
                  ">
                    ${formatCurrency(row.total_diff)}
                  </td>

                  <td class="cell-right">

                    ${
                      row.margin === null
                        ? "NA"
                        : formatPercent(
                            row.margin
                          )
                    }

                  </td>

                  <td class="
                    ${getStatusClass(
                      row.status
                    )}
                  ">

                    ${row.status}

                  </td>

                </tr>

              `
            ).join("")}

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
STATUS
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
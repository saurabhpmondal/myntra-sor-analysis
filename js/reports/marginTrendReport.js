/* ==========================
IMPORTS
========================== */

import {
  getCache
} from "../services/cacheService.js";

import {
  applyFilters
} from "../ui/filters.js";

import {
  buildMarginData
} from "../engine/marginEngine.js";

import {
  SETTINGS
} from "../config/sheetConfig.js";

/* ==========================
RENDER REPORT
========================== */

export function renderMarginTrendReport() {

  const rows =
    applyFilters(
      buildMarginData()
    );

  const dates =
    (
      getCache(
        "priceDates"
      ) || []
    ).slice(
      0,
      SETTINGS.DEFAULT_DATE_COUNT
    );

  return `

    <section class="page-section">

      <div class="table-section">

        <div class="table-header">

          <div class="table-title">

            Margin Trend

          </div>

          <div class="table-actions">

            <button
              id="exportMarginReport"
              class="btn-primary"
            >
              Export Excel
            </button>

          </div>

        </div>

        <div class="table-wrapper">

          <table
            class="
              report-table
              margin-table
            "
          >

            ${buildHeader(
              dates
            )}

            ${buildBody(
              rows,
              dates
            )}

          </table>

        </div>

      </div>

    </section>

  `;

}

/* ==========================
HEADER
========================== */

function buildHeader(
  dates
) {

  let html = `

    <thead>

      <tr>

        <th>
          Style ID
        </th>

        <th>
          ERP SKU
        </th>

        <th>
          ERP Status
        </th>

        <th>
          TP
        </th>

  `;

  dates.forEach(
    date => {

      html += `

        <th>
          ${date} SP
        </th>

        <th>
          ${date} Margin %
        </th>

      `;

    }
  );

  html += `

      </tr>

    </thead>

  `;

  return html;

}

/* ==========================
BODY
========================== */

function buildBody(
  rows,
  dates
) {

  if (
    !rows.length
  ) {

    return `

      <tbody>

        <tr>

          <td
            colspan="
              ${
                4 +
                (
                  dates.length *
                  2
                )
              }
            "
          >

            No Data Found

          </td>

        </tr>

      </tbody>

    `;

  }

  let html =
    "<tbody>";

  rows.forEach(
    row => {

      html += `

        <tr>

          <td>
            ${
              row.style_id
            }
          </td>

          <td>
            ${
              row.erp_sku
            }
          </td>

          <td>
            ${
              row.erp_status
            }
          </td>

          <td class="cell-right">
            ${formatNumber(
              row.tp
            )}
          </td>

      `;

      dates.forEach(
        date => {

          html += `

            <td class="cell-right">

              ${formatNumber(
                row[
                  `${date}_sp`
                ]
              )}

            </td>

            <td class="
              cell-right
              ${getMarginClass(
                row[
                  `${date}_margin`
                ]
              )}
            ">

              ${formatPercent(
                row[
                  `${date}_margin`
                ]
              )}

            </td>

          `;

        }
      );

      html += `

        </tr>

      `;

    }
  );

  html +=
    "</tbody>";

  return html;

}

/* ==========================
MARGIN COLOR
========================== */

function getMarginClass(
  value
) {

  value =
    Number(
      value || 0
    );

  if (
    value >= 27
  ) {

    return "status-success";

  }

  if (
    value >= 20
  ) {

    return "status-warning";

  }

  return "status-danger";

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
    "en-IN",
    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
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
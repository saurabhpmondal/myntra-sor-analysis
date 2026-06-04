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
  buildStockData
} from "../engine/stockEngine.js";

import {
  SETTINGS
} from "../config/sheetConfig.js";

/* ==========================
RENDER REPORT
========================== */

export function renderStockTrendReport() {

  const rows =
    applyFilters(
      buildStockData()
    );

  const dates =
    (
      getCache(
        "stockDates"
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

            Stock Trend

          </div>

          <div class="table-actions">

            <button
              id="exportStockReport"
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
              stock-table
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

  `;

  dates.forEach(
    date => {

      html += `

        <th>
          ${date}
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

  if (!rows.length) {

    return `

      <tbody>

        <tr>

          <td
            colspan="
              ${
                3 +
                dates.length
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

      `;

      dates.forEach(
        date => {

          const stock =
            Number(
              row[
                `${date}_stock`
              ] || 0
            );

          html += `

            <td class="
              cell-right
              ${getStockClass(
                stock
              )}
            ">

              ${formatNumber(
                stock
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
STOCK CLASS
========================== */

function getStockClass(
  stock
) {

  if (
    stock <= 0
  ) {

    return "status-danger";

  }

  if (
    stock < 5
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
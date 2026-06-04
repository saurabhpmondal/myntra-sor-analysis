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
  buildMarginData,
  getAverageMargin,
  getAboveBaseCount,
  getBelowBaseCount,
  getLatestPriceDate
} from "../engine/marginEngine.js";

import {
  buildStockData,
  getLatestStockDate,
  getTotalStock,
  getOOSStyles
} from "../engine/stockEngine.js";

/* ==========================
BUILD DASHBOARD
========================== */

export function buildDashboard() {

  const marginRows =
    applyFilters(
      buildMarginData()
    );

  const stockRows =
    applyFilters(
      buildStockData()
    );

  const sor =
    applyFilters(
      getCache(
        "sor"
      ) || []
    );

  const latestPriceDate =
    getLatestPriceDate();

  const latestStockDate =
    getLatestStockDate();

  return {

    totalStyles:
      sor.length,

    activeStyles:
      sor.filter(
        row =>
          (
            row.erp_status || ""
          )
            .toLowerCase()
            .includes(
              "active"
            )
      ).length,

    totalSorStock:
      sor.reduce(
        (
          sum,
          row
        ) =>
          sum +
          Number(
            row.stock || 0
          ),
        0
      ),

    latestSnapshotStock:
      getTotalStock(
        stockRows,
        latestStockDate
      ),

    averageMargin:
      getAverageMargin(
        marginRows,
        latestPriceDate
      ),

    aboveBase:
      getAboveBaseCount(
        marginRows,
        latestPriceDate
      ),

    belowBase:
      getBelowBaseCount(
        marginRows,
        latestPriceDate
      ),

    oosStyles:
      getOOSStyles(
        stockRows,
        latestStockDate
      )

  };

}

/* ==========================
RENDER DASHBOARD
========================== */

export function renderDashboard() {

  const data =
    buildDashboard();

  return `

    <section class="page-section">

      <div class="kpi-grid">

        ${createCard(
          "Total Styles",
          formatNumber(
            data.totalStyles
          )
        )}

        ${createCard(
          "Active Styles",
          formatNumber(
            data.activeStyles
          )
        )}

        ${createCard(
          "Total SOR Stock",
          formatNumber(
            data.totalSorStock
          )
        )}

        ${createCard(
          "Latest Snapshot Stock",
          formatNumber(
            data.latestSnapshotStock
          )
        )}

        ${createCard(
          "Avg Margin %",
          formatPercent(
            data.averageMargin
          )
        )}

        ${createCard(
          "Above 27%",
          formatNumber(
            data.aboveBase
          )
        )}

        ${createCard(
          "Below 27%",
          formatNumber(
            data.belowBase
          )
        )}

        ${createCard(
          "OOS Styles",
          formatNumber(
            data.oosStyles
          )
        )}

      </div>

    </section>

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

function formatPercent(
  value
) {

  return Number(
    value || 0
  ).toFixed(
    2
  ) + "%";

}
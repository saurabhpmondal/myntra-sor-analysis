/* ==========================
IMPORTS
========================== */

import {
  getCache
} from "../services/cacheService.js";

import {
  SETTINGS
} from "../config/sheetConfig.js";

/* ==========================
BUILD STOCK DATA
========================== */

export function buildStockData() {

  const sor =
    getCache(
      "sor"
    ) || [];

  const stock =
    getCache(
      "stock"
    ) || [];

  const dates =
    (
      getCache(
        "stockDates"
      ) || []
    )
      .slice(
        0,
        SETTINGS.DEFAULT_DATE_COUNT
      );

  const stockMap =
    buildStockMap(
      stock
    );

  return sor.map(
    row => {

      const output = {

        style_id:
          row.style_id,

        erp_sku:
          row.erp_sku,

        erp_status:
          row.erp_status,

        brand:
          row.brand

      };

      dates.forEach(
        date => {

          const stockRow =
            stockMap[
              `${row.style_id}||${date}`
            ];

          output[
            `${date}_stock`
          ] = Number(
            stockRow?.stock || 0
          );

        }
      );

      return output;

    }
  );

}

/* ==========================
STOCK MAP
========================== */

function buildStockMap(
  rows
) {

  const map = {};

  rows.forEach(
    row => {

      const key =
        `${row.style_id}||${row.snapshot_date}`;

      map[key] = row;

    }
  );

  return map;

}

/* ==========================
LATEST DATE
========================== */

export function getLatestStockDate() {

  const dates =
    getCache(
      "stockDates"
    ) || [];

  return dates[0] || "";

}

/* ==========================
TOTAL STOCK
========================== */

export function getTotalStock(
  rows,
  date
) {

  const key =
    `${date}_stock`;

  return rows.reduce(
    (
      sum,
      row
    ) =>
      sum +
      Number(
        row[key] || 0
      ),
    0
  );

}

/* ==========================
STYLES WITH STOCK
========================== */

export function getStylesWithStock(
  rows,
  date
) {

  const key =
    `${date}_stock`;

  return rows.filter(
    row =>
      Number(
        row[key]
      ) > 0
  ).length;

}

/* ==========================
OOS STYLES
========================== */

export function getOOSStyles(
  rows,
  date
) {

  const key =
    `${date}_stock`;

  return rows.filter(
    row =>
      Number(
        row[key]
      ) <= 0
  ).length;

}

/* ==========================
LOW STOCK
========================== */

export function getLowStockStyles(
  rows,
  date
) {

  const key =
    `${date}_stock`;

  return rows.filter(
    row => {

      const stock =
        Number(
          row[key]
        );

      return (
        stock > 0 &&
        stock <
        SETTINGS.LOW_STOCK_THRESHOLD
      );

    }
  ).length;

}

/* ==========================
LATEST STOCK VALUE
========================== */

export function getLatestStockValue(
  row
) {

  const latestDate =
    getLatestStockDate();

  if (
    !latestDate
  ) {

    return 0;

  }

  return Number(
    row[
      `${latestDate}_stock`
    ] || 0
  );

}

/* ==========================
SORT BY STOCK
========================== */

export function sortByLatestStock(
  rows,
  direction = "DESC"
) {

  const latestDate =
    getLatestStockDate();

  const key =
    `${latestDate}_stock`;

  const sorted =
    [...rows];

  sorted.sort(
    (
      a,
      b
    ) => {

      const stockA =
        Number(
          a[key] || 0
        );

      const stockB =
        Number(
          b[key] || 0
        );

      if (
        direction === "ASC"
      ) {

        return (
          stockA -
          stockB
        );

      }

      return (
        stockB -
        stockA
      );

    }
  );

  return sorted;

}
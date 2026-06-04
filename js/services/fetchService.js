/* ==========================
IMPORTS
========================== */

import {
  SHEETS
} from "../config/sheetConfig.js";

import {
  setCache,
  updateCacheTimestamp
} from "./cacheService.js";

/* ==========================
LOAD ALL DATA
========================== */

export async function loadAllData() {

  const [
    sor,
    price,
    stock
  ] = await Promise.all([
    loadSheet(
      SHEETS.SOR.url
    ),
    loadSheet(
      SHEETS.PRICE.url
    ),
    loadSheet(
      SHEETS.STOCK.url
    )
  ]);

  setCache(
    "sor",
    sor
  );

  setCache(
    "price",
    price
  );

  setCache(
    "stock",
    stock
  );

  setCache(
    "brands",
    getBrands(
      sor
    )
  );

  setCache(
    "erpStatuses",
    getErpStatuses(
      sor
    )
  );

  setCache(
    "priceDates",
    getLatestDates(
      price,
      "snapshot_date"
    )
  );

  setCache(
    "stockDates",
    getLatestDates(
      stock,
      "snapshot_date"
    )
  );

  updateCacheTimestamp();

  return {
    sor,
    price,
    stock
  };

}

/* ==========================
LOAD SHEET
========================== */

async function loadSheet(
  url
) {

  const response =
    await fetch(
      url
    );

  if (
    !response.ok
  ) {

    throw new Error(
      `Failed to load ${url}`
    );

  }

  const csv =
    await response.text();

  return parseCsv(
    csv
  );

}

/* ==========================
CSV PARSER
========================== */

function parseCsv(
  csv
) {

  const lines =
    csv
      .replace(
        /\r/g,
        ""
      )
      .split(
        "\n"
      )
      .filter(
        line =>
          line.trim()
      );

  if (
    !lines.length
  ) {
    return [];
  }

  const headers =
    splitCsvLine(
      lines[0]
    ).map(
      normalizeHeader
    );

  const rows = [];

  for (
    let i = 1;
    i < lines.length;
    i++
  ) {

    const values =
      splitCsvLine(
        lines[i]
      );

    const row = {};

    headers.forEach(
      (
        header,
        index
      ) => {

        row[
          header
        ] =
          values[
            index
          ] || "";

      }
    );

    rows.push(
      row
    );

  }

  return rows;

}

/* ==========================
CSV SPLITTER
========================== */

function splitCsvLine(
  line
) {

  const values = [];

  let current = "";

  let inQuotes =
    false;

  for (
    let i = 0;
    i < line.length;
    i++
  ) {

    const char =
      line[i];

    if (
      char === '"'
    ) {

      inQuotes =
        !inQuotes;

      continue;

    }

    if (
      char === "," &&
      !inQuotes
    ) {

      values.push(
        current.trim()
      );

      current = "";

      continue;

    }

    current += char;

  }

  values.push(
    current.trim()
  );

  return values;

}

/* ==========================
HEADER NORMALIZATION
========================== */

function normalizeHeader(
  value
) {

  return value
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      "_"
    );

}

/* ==========================
BRANDS
========================== */

function getBrands(
  rows
) {

  return [
    ...new Set(
      rows
        .map(
          row =>
            row.brand
        )
        .filter(
          Boolean
        )
    )
  ]
    .sort();

}

/* ==========================
ERP STATUS
========================== */

function getErpStatuses(
  rows
) {

  return [
    ...new Set(
      rows
        .map(
          row =>
            row.erp_status
        )
        .filter(
          Boolean
        )
    )
  ]
    .sort();

}

/* ==========================
LATEST DATES
========================== */

function getLatestDates(
  rows,
  field
) {

  return [
    ...new Set(
      rows
        .map(
          row =>
            row[field]
        )
        .filter(
          Boolean
        )
    )
  ]
    .sort(
      (
        a,
        b
      ) =>
        new Date(
          b
        ) -
        new Date(
          a
        )
    );

}
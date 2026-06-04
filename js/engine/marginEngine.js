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
BUILD MARGIN DATA
========================== */

export function buildMarginData() {

  const sor =
    getCache(
      "sor"
    ) || [];

  const price =
    getCache(
      "price"
    ) || [];

  const dates =
    (
      getCache(
        "priceDates"
      ) || []
    )
      .slice(
        0,
        SETTINGS.DEFAULT_DATE_COUNT
      );

  const priceMap =
    buildPriceMap(
      price
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
          row.brand,

        tp:
          Number(
            row.tp || 0
          )

      };

      dates.forEach(
        date => {

          const priceData =
            priceMap[
              `${row.style_id}||${date}`
            ];

          const sp =
            Number(
              priceData?.sp || 0
            );

          const margin =
            calculateMargin(
              sp,
              output.tp
            );

          output[
            `${date}_sp`
          ] = sp;

          output[
            `${date}_margin`
          ] = margin;

        }
      );

      return output;

    }
  );

}

/* ==========================
PRICE MAP
========================== */

function buildPriceMap(
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
MARGIN FORMULA
========================== */

export function calculateMargin(
  sp,
  tp
) {

  sp =
    Number(
      sp || 0
    );

  tp =
    Number(
      tp || 0
    );

  if (
    !sp ||
    !tp
  ) {

    return 0;

  }

  const marketplaceCost =
    tp *
    (
      SETTINGS.MARKETPLACE_COST_PERCENT /
      100
    );

  const margin =

    (
      (
        sp -
        tp
      ) -
      marketplaceCost
    ) /
    sp;

  return Number(
    (
      margin * 100
    ).toFixed(
      2
    )
  );

}

/* ==========================
AVG MARGIN
========================== */

export function getAverageMargin(
  rows,
  date
) {

  const key =
    `${date}_margin`;

  const values =
    rows
      .map(
        row =>
          Number(
            row[key]
          )
      )
      .filter(
        value =>
          value > 0
      );

  if (
    !values.length
  ) {

    return 0;

  }

  const total =
    values.reduce(
      (
        sum,
        value
      ) =>
        sum + value,
      0
    );

  return Number(
    (
      total /
      values.length
    ).toFixed(
      2
    )
  );

}

/* ==========================
ABOVE BASE
========================== */

export function getAboveBaseCount(
  rows,
  date
) {

  const key =
    `${date}_margin`;

  return rows.filter(
    row =>
      Number(
        row[key]
      ) >=
      SETTINGS.BASE_MARGIN
  ).length;

}

/* ==========================
BELOW BASE
========================== */

export function getBelowBaseCount(
  rows,
  date
) {

  const key =
    `${date}_margin`;

  return rows.filter(
    row =>
      Number(
        row[key]
      ) <
      SETTINGS.BASE_MARGIN
  ).length;

}

/* ==========================
LATEST DATE
========================== */

export function getLatestPriceDate() {

  const dates =
    getCache(
      "priceDates"
    ) || [];

  return dates[0] || "";

}
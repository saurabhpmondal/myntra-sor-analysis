/* ==========================
IMPORTS
========================== */

import {
  getCache
} from "../services/cacheService.js";

/* ==========================
VALIDATE FILE
========================== */

export function validatePaidData(
  uploadedRows
) {

  const sor =
    getCache(
      "sor"
    ) || [];

  const sorMap =
    buildSorMap(
      sor
    );

  const found = [];

  const notFound = [];

  uploadedRows.forEach(
    row => {

      const styleId =
        String(
          row.style_id || ""
        ).trim();

      const sorRow =
        sorMap[
          styleId
        ];

      if (
        !sorRow
      ) {

        notFound.push({
          style_id:
            styleId
        });

        return;

      }

      found.push({
        ...row,
        ...sorRow
      });

    }
  );

  return {

    found,

    notFound,

    foundCount:
      found.length,

    notFoundCount:
      notFound.length

  };

}

/* ==========================
GENERATE REPORT
========================== */

export function generatePaidReport(
  uploadedRows
) {

  const validation =
    validatePaidData(
      uploadedRows
    );

  const reportRows =
    validation.found.map(
      row => {

        const quantity =
          Number(
            row.quantity || 0
          );

        const revenue =
          Number(
            row.revenue || 0
          );

        const purchasePrice =
          Number(
            row.purchase_price || 0
          );

        const tp =
          Number(
            row.tp || 0
          );

        const unitPurchasePrice =

          quantity > 0
            ? (
                purchasePrice /
                quantity
              )
            : 0;

        const diff =

          unitPurchasePrice -
          tp;

        const margin =

          revenue > 0
            ? (
                (
                  revenue -
                  purchasePrice
                ) /
                revenue
              ) * 100
            : null;

        return {

          style_id:
            row.style_id,

          erp_sku:
            row.erp_sku,

          erp_status:
            row.erp_status,

          quantity,

          revenue,

          purchase_price:
            purchasePrice,

          tp,

          unit_purchase_price:
            unitPurchasePrice,

          diff,

          margin,

          status:
            getStatus(
              diff
            )

        };

      }
    );

  return {

    reportRows,

    validation,

    kpis:
      buildKpis(
        reportRows,
        validation
      )

  };

}

/* ==========================
KPIS
========================== */

function buildKpis(
  rows,
  validation
) {

  const totalUnits =
    rows.reduce(
      (
        sum,
        row
      ) =>
        sum +
        row.quantity,
      0
    );

  const totalRevenue =
    rows.reduce(
      (
        sum,
        row
      ) =>
        sum +
        row.revenue,
      0
    );

  const totalPurchase =
    rows.reduce(
      (
        sum,
        row
      ) =>
        sum +
        row.purchase_price,
      0
    );

  const actualMargin =

    totalRevenue > 0

      ? (
          (
            totalRevenue -
            totalPurchase
          ) /
          totalRevenue
        ) * 100

      : 0;

  const overpaid =
    rows.filter(
      row =>
        row.diff > 0
    ).length;

  const underpaid =
    rows.filter(
      row =>
        row.diff < 0
    ).length;

  return {

    matchedStyles:
      validation.foundCount,

    notFoundStyles:
      validation.notFoundCount,

    totalUnits,

    totalRevenue,

    totalPurchase,

    actualMargin,

    overpaid,

    underpaid

  };

}

/* ==========================
STATUS
========================== */

function getStatus(
  diff
) {

  if (
    diff > 0
  ) {

    return "OVERPAID";

  }

  if (
    diff < 0
  ) {

    return "UNDERPAID";

  }

  return "CORRECT";

}

/* ==========================
SOR MAP
========================== */

function buildSorMap(
  rows
) {

  const map = {};

  rows.forEach(
    row => {

      map[
        String(
          row.style_id
        ).trim()
      ] = row;

    }
  );

  return map;

}
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
    getCache("sor") || [];

  const sorMap = {};

  sor.forEach(
    row => {

      sorMap[
        String(
          row.style_id
        ).trim()
      ] = row;

    }
  );

  const found = [];

  const notFound = [];

  uploadedRows.forEach(
    row => {

      const styleId =
        String(
          row.style_id || ""
        ).trim();

      if (
        !sorMap[
          styleId
        ]
      ) {

        notFound.push({
          style_id:
            styleId
        });

        return;

      }

      found.push({
        ...row,
        ...sorMap[
          styleId
        ]
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

        const totalDiff =

          diff *
          quantity;

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

          total_diff:
            totalDiff,

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

  return {

    matchedStyles:
      validation.foundCount,

    notFoundStyles:
      validation.notFoundCount,

    totalUnits,

    totalRevenue,

    totalPurchase,

    actualMargin,

    overpaid:
      rows.filter(
        row =>
          row.status ===
          "OVERPAID"
      ).length,

    underpaid:
      rows.filter(
        row =>
          row.status ===
          "UNDERPAID"
      ).length

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
/* ==========================
IMPORTS
========================== */

import {
  getCache
} from "../services/cacheService.js";

/* ==========================
FILTER STATE
========================== */

const FILTERS = {

  brand: "ALL",

  erpStatus: "ALL",

  search: ""

};

/* ==========================
GET FILTERS
========================== */

export function getFilters() {

  return FILTERS;

}

/* ==========================
RENDER FILTERS
========================== */

export function renderFilters(
  onChange
) {

  populateBrands();

  populateErpStatuses();

  bindEvents(
    onChange
  );

}

/* ==========================
BRANDS
========================== */

function populateBrands() {

  const brands =
    getCache(
      "brands"
    ) || [];

  const select =
    document.getElementById(
      "brandFilter"
    );

  if (!select) return;

  select.innerHTML = `

    <option value="ALL">
      All Brands
    </option>

    ${brands.map(
      brand => `
        <option value="${brand}">
          ${brand}
        </option>
      `
    ).join("")}

  `;

}

/* ==========================
ERP STATUS
========================== */

function populateErpStatuses() {

  const statuses =
    getCache(
      "erpStatuses"
    ) || [];

  const select =
    document.getElementById(
      "erpStatusFilter"
    );

  if (!select) return;

  select.innerHTML = `

    <option value="ALL">
      All Status
    </option>

    ${statuses.map(
      status => `
        <option value="${status}">
          ${status}
        </option>
      `
    ).join("")}

  `;

}

/* ==========================
EVENTS
========================== */

function bindEvents(
  onChange
) {

  const brand =
    document.getElementById(
      "brandFilter"
    );

  const status =
    document.getElementById(
      "erpStatusFilter"
    );

  const search =
    document.getElementById(
      "searchFilter"
    );

  if (brand) {

    brand.onchange =
      event => {

        FILTERS.brand =
          event.target.value;

        onChange();

      };

  }

  if (status) {

    status.onchange =
      event => {

        FILTERS.erpStatus =
          event.target.value;

        onChange();

      };

  }

  if (search) {

    let timer = null;

    search.oninput =
      event => {

        clearTimeout(
          timer
        );

        timer =
          setTimeout(
            () => {

              FILTERS.search =
                event.target.value
                  .trim()
                  .toLowerCase();

              onChange();

            },
            300
          );

      };

  }

}

/* ==========================
APPLY FILTERS
========================== */

export function applyFilters(
  rows
) {

  const {
    brand,
    erpStatus,
    search
  } = FILTERS;

  return rows.filter(
    row => {

      const brandMatch =
        brand === "ALL"
          ? true
          : row.brand === brand;

      const statusMatch =
        erpStatus === "ALL"
          ? true
          : row.erp_status === erpStatus;

      const searchMatch =
        !search
          ? true
          : [
              row.style_id,
              row.erp_sku
            ]
              .join(" ")
              .toLowerCase()
              .includes(search);

      return (
        brandMatch &&
        statusMatch &&
        searchMatch
      );

    }
  );

}
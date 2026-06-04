/* ==========================
IMPORTS
========================== */

import {
  getCache
} from "../services/cacheService.js";

import {
  APP_STATE
} from "../app.js";

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

  if (!select) {
    return;
  }

  select.innerHTML = `

    <option value="ALL">
      All Brands
    </option>

    ${brands
      .map(
        brand => `

          <option value="${brand}">
            ${brand}
          </option>

        `
      )
      .join("")}

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

  if (!select) {
    return;
  }

  select.innerHTML = `

    <option value="ALL">
      All Status
    </option>

    ${statuses
      .map(
        status => `

          <option value="${status}">
            ${status}
          </option>

        `
      )
      .join("")}

  `;

}

/* ==========================
BIND EVENTS
========================== */

function bindEvents(
  onChange
) {

  bindBrand(
    onChange
  );

  bindErpStatus(
    onChange
  );

  bindSearch(
    onChange
  );

}

/* ==========================
BRAND
========================== */

function bindBrand(
  onChange
) {

  const select =
    document.getElementById(
      "brandFilter"
    );

  if (!select) {
    return;
  }

  select.onchange =
    event => {

      APP_STATE.filters.brand =
        event.target.value;

      onChange();

    };

}

/* ==========================
ERP STATUS
========================== */

function bindErpStatus(
  onChange
) {

  const select =
    document.getElementById(
      "erpStatusFilter"
    );

  if (!select) {
    return;
  }

  select.onchange =
    event => {

      APP_STATE.filters.erpStatus =
        event.target.value;

      onChange();

    };

}

/* ==========================
SEARCH
========================== */

function bindSearch(
  onChange
) {

  const input =
    document.getElementById(
      "searchFilter"
    );

  if (!input) {
    return;
  }

  let timer = null;

  input.oninput =
    event => {

      clearTimeout(
        timer
      );

      timer =
        setTimeout(
          () => {

            APP_STATE.filters.search =
              event.target.value
                .trim()
                .toLowerCase();

            onChange();

          },
          300
        );

    };

}

/* ==========================
FILTER DATA
========================== */

export function applyFilters(
  rows
) {

  const {
    brand,
    erpStatus,
    search
  } =
    APP_STATE.filters;

  return rows.filter(
    row => {

      const brandMatch =
        brand === "ALL"
          ? true
          : row.brand ===
            brand;

      const statusMatch =
        erpStatus ===
        "ALL"
          ? true
          : row.erp_status ===
            erpStatus;

      const searchMatch =
        !search
          ? true
          : [
              row.style_id,
              row.erp_sku
            ]
              .join(" ")
              .toLowerCase()
              .includes(
                search
              );

      return (
        brandMatch &&
        statusMatch &&
        searchMatch
      );

    }
  );

}
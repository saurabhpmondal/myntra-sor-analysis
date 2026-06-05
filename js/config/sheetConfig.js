/* ==========================
GOOGLE SHEET CONFIG
========================== */

export const SHEETS = {

  SOR: {
    name: "SOR",
    url:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG6UUIpYjTVSXYJT5KIzno5a_uNnOgK3bFH8oRS7_FvQCmyg0taENeP0O7erPgBfWBRrhi7IHYhb1C/pub?gid=0&single=true&output=csv"
  },

  PRICE: {
    name: "PRICE",
    url:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG6UUIpYjTVSXYJT5KIzno5a_uNnOgK3bFH8oRS7_FvQCmyg0taENeP0O7erPgBfWBRrhi7IHYhb1C/pub?gid=306269267&single=true&output=csv"
  },

  STOCK: {
    name: "STOCK",
    url:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQG6UUIpYjTVSXYJT5KIzno5a_uNnOgK3bFH8oRS7_FvQCmyg0taENeP0O7erPgBfWBRrhi7IHYhb1C/pub?gid=536477929&single=true&output=csv"
  }

};

/* ==========================
DEFAULT SETTINGS
========================== */

export const SETTINGS = {

  SEARCH_DEBOUNCE: 300,

  DEFAULT_DATE_COUNT: 10,

  DATE_OPTIONS: [
    5,
    10,
    15,
    20
  ],

  BASE_MARGIN: 27,

  MARKETPLACE_COST_PERCENT: 5,

  LOW_STOCK_THRESHOLD: 5

};
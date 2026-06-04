/* ==========================
APP CACHE
========================== */

const CACHE = {

  sor: [],

  price: [],

  stock: [],

  margin: [],

  stockTrend: [],

  priceDates: [],

  stockDates: [],

  brands: [],

  erpStatuses: [],

  lastUpdated: null

};

/* ==========================
SET CACHE
========================== */

export function setCache(
  key,
  value
) {

  CACHE[key] = value;

}

/* ==========================
GET CACHE
========================== */

export function getCache(
  key
) {

  return CACHE[key];

}

/* ==========================
HAS CACHE
========================== */

export function hasCache(
  key
) {

  const value =
    CACHE[key];

  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  if (
    Array.isArray(value)
  ) {
    return value.length > 0;
  }

  return true;

}

/* ==========================
CLEAR CACHE
========================== */

export function clearCache() {

  CACHE.sor = [];

  CACHE.price = [];

  CACHE.stock = [];

  CACHE.margin = [];

  CACHE.stockTrend = [];

  CACHE.priceDates = [];

  CACHE.stockDates = [];

  CACHE.brands = [];

  CACHE.erpStatuses = [];

  CACHE.lastUpdated = null;

}

/* ==========================
LAST UPDATED
========================== */

export function updateCacheTimestamp() {

  CACHE.lastUpdated =
    new Date();

}

/* ==========================
GET LAST UPDATED
========================== */

export function getLastUpdated() {

  return CACHE.lastUpdated;

}

/* ==========================
FULL CACHE
========================== */

export function getFullCache() {

  return CACHE;

}
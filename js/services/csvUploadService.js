/* ==========================
READ CSV FILE
========================== */

export async function readCsvFile(
  file
) {

  const text =
    await file.text();

  return parseCsv(
    text
  );

}

/* ==========================
PARSE CSV
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
NORMALIZE HEADER
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
VALIDATE STRUCTURE
========================== */

export function validateCsvStructure(
  rows
) {

  if (
    !rows.length
  ) {

    return {

      valid: false,

      message:
        "No rows found"

    };

  }

  const firstRow =
    rows[0];

  const mandatoryFields = [

    "style_id",

    "quantity",

    "purchase_price"

  ];

  const missingFields =
    mandatoryFields.filter(
      field =>
        !(
          field in
          firstRow
        )
    );

  if (
    missingFields.length
  ) {

    return {

      valid: false,

      message:
        `Missing Columns: ${missingFields.join(", ")}`

    };

  }

  return {

    valid: true,

    message:
      "Valid File"

  };

}

/* ==========================
SAMPLE CSV
========================== */

export function downloadSampleCsv() {

  const csv =

`style_id,quantity,purchase_price,revenue
123456,10,3500,5000
789123,5,1750,2500`;

  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    url;

  link.download =
    "paid_verification_sample.csv";

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );

}
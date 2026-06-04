/* ==========================
EXPORT TABLE TO EXCEL
Requires SheetJS XLSX
========================== */

export function exportTableToExcel(
  tableId,
  fileName
) {

  const table =
    document.getElementById(
      tableId
    );

  if (!table) {

    alert(
      "Table not found"
    );

    return;

  }

  const workbook =
    XLSX.utils.table_to_book(
      table,
      {
        sheet:
          "Report"
      }
    );

  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );

}

/* ==========================
EXPORT JSON TO EXCEL
========================== */

export function exportJsonToExcel(
  rows,
  fileName,
  sheetName = "Report"
) {

  if (
    !rows ||
    !rows.length
  ) {

    alert(
      "No data available"
    );

    return;

  }

  const worksheet =
    XLSX.utils.json_to_sheet(
      rows
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sheetName
  );

  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );

}

/* ==========================
EXPORT MULTIPLE SHEETS
========================== */

export function exportWorkbook(
  sheets,
  fileName
) {

  const workbook =
    XLSX.utils.book_new();

  sheets.forEach(
    sheet => {

      const worksheet =
        XLSX.utils.json_to_sheet(
          sheet.rows || []
        );

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        sheet.name
      );

    }
  );

  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );

}

/* ==========================
DOWNLOAD CSV
========================== */

export function exportCsv(
  rows,
  fileName
) {

  if (
    !rows ||
    !rows.length
  ) {

    return;

  }

  const headers =
    Object.keys(
      rows[0]
    );

  const csvRows = [

    headers.join(",")

  ];

  rows.forEach(
    row => {

      const values =
        headers.map(
          header => {

            const value =
              row[
                header
              ] ?? "";

            return `"${String(
              value
            ).replace(
              /"/g,
              '""'
            )}"`;

          }
        );

      csvRows.push(
        values.join(",")
      );

    }
  );

  const csv =
    csvRows.join(
      "\n"
    );

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
    `${fileName}.csv`;

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
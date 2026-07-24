"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ExcelCellFormat } from "./export-excel-utils";
import { calculateExcelColumnWidths } from "./export-excel-utils";

export type ExportExcelColumn<TData> = {
  header: string;
  accessor: keyof TData | ((row: TData) => unknown);
  format?: ExcelCellFormat;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
};

type ExportExcelButtonProps<TData> = {
  data: TData[];
  columns: ExportExcelColumn<TData>[];
  fileName: string;
  sheetName?: string;
  extraRows?: Record<string, unknown>[];
  disabled?: boolean;
};

const normalizeFileName = (fileName: string) => {
  const normalizedName = fileName
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return normalizedName.endsWith(".xlsx")
    ? normalizedName
    : `${normalizedName || "exportacao"}.xlsx`;
};

const normalizeSheetName = (sheetName?: string) =>
  (sheetName || "Dados").replace(/[\\/?*[\]:]/g, " ").slice(0, 31) || "Dados";

export function ExportExcelButton<TData>({
  data,
  columns,
  fileName,
  sheetName,
  extraRows = [],
  disabled,
}: ExportExcelButtonProps<TData>) {
  const buildRow = (row: TData) =>
    columns.reduce<Record<string, unknown>>((acc, column) => {
      acc[column.header] =
        typeof column.accessor === "function"
          ? column.accessor(row)
          : row[column.accessor];

      return acc;
    }, {});

  const handleExport = async () => {
    if (!data.length && !extraRows.length) {
      toast.info("Não há dados para exportar.");
      return;
    }

    const XLSX = (await import("xlsx-js-style")).default;
    const rows = [...data.map(buildRow), ...extraRows];
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
    const headerByColumn = columns.reduce<
      Record<string, ExportExcelColumn<TData>>
    >((acc, column) => {
      acc[column.header] = column;
      return acc;
    }, {});
    const columnWidths = calculateExcelColumnWidths({
      columns,
      rows,
    });
    const firstSummaryRow = range.e.r - extraRows.length + 1;

    worksheet["!cols"] = columnWidths;
    worksheet["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

    for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex += 1) {
      for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex += 1) {
        const cellAddress = XLSX.utils.encode_cell({
          r: rowIndex,
          c: colIndex,
        });
        const cell =
          worksheet[cellAddress] ||
          (worksheet[cellAddress] = { t: "s", v: "" });

        const headerAddress = XLSX.utils.encode_cell({
          r: range.s.r,
          c: colIndex,
        });
        const header = String(worksheet[headerAddress]?.v || "");
        const column = headerByColumn[header];

        const isHeader = rowIndex === range.s.r;
        const isSummary = extraRows.length > 0 && rowIndex >= firstSummaryRow;
        const borderStyle = isHeader || isSummary ? "medium" : "thin";
        const borderColor = "000000";

        cell.s = {
          ...(cell.s || {}),
          border: {
            top: { style: borderStyle, color: { rgb: borderColor } },
            bottom: { style: borderStyle, color: { rgb: borderColor } },
            left: { style: borderStyle, color: { rgb: borderColor } },
            right: { style: borderStyle, color: { rgb: borderColor } },
          },
          alignment: {
            vertical: "center",
            horizontal: isHeader
              ? "center"
              : column?.format && column.format !== "text"
                ? "right"
                : "left",
          },
        };

        if (isHeader) {
          cell.s = {
            ...cell.s,
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4A0718" } },
          };
          continue;
        }

        if (isSummary) {
          cell.s = {
            ...cell.s,
            font: { bold: true, color: { rgb: "4A0718" } },
            fill: { fgColor: { rgb: "FDE8EC" } },
          };
        }

        if (column?.format === "currency") {
          cell.t = "n";
          cell.z = '"R$" #,##0.00';
        }
        if (column?.format === "number") {
          cell.t = "n";
          cell.z = "#,##0.00";
        }
        if (column?.format === "percent") {
          cell.t = "n";
          cell.z = '0.00"%"';
        }
      }
    }

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      normalizeSheetName(sheetName),
    );
    XLSX.writeFile(workbook, normalizeFileName(fileName), {
      cellStyles: true,
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={disabled}
      onClick={handleExport}
    >
      <Download className="size-4" />
      Exportar Excel
    </Button>
  );
}

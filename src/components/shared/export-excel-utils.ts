export type ExcelCellFormat = "currency" | "number" | "percent" | "text";

type ExcelWidthColumn = {
  header: string;
  format?: ExcelCellFormat;
  minWidth?: number;
  maxWidth?: number;
};

type CalculateExcelColumnWidthsParams = {
  columns: ExcelWidthColumn[];
  rows: Record<string, unknown>[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const formatWidthValue = (value: unknown, format?: ExcelCellFormat) => {
  if (value === null || value === undefined || value === "") return "";
  if (format === "currency") return currencyFormatter.format(Number(value));
  if (format === "number") return numberFormatter.format(Number(value));
  if (format === "percent") {
    return `${percentFormatter.format(Number(value))}%`;
  }
  return String(value);
};

export const calculateExcelColumnWidths = ({
  columns,
  rows,
}: CalculateExcelColumnWidthsParams) =>
  columns.map((column) => {
    const minWidth = column.minWidth ?? 10;
    const maxWidth = column.maxWidth ?? 40;
    const contentWidth = rows.reduce(
      (width, row) =>
        Math.max(
          width,
          formatWidthValue(row[column.header], column.format).length,
        ),
      column.header.length,
    );

    return {
      wch: Math.min(maxWidth, Math.max(minWidth, contentWidth + 2)),
    };
  });

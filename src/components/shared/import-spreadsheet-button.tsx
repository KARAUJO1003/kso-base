"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  UploadIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/axios-instance";
import { cn } from "@/lib/utils";

type ImportField<T extends object> = {
  key: Extract<keyof T, string>;
  label: string;
  required?: boolean;
  sample?: string | number;
  description?: string;
};

type ImportSpreadsheetButtonProps<T extends object> = {
  route: string;
  bulkRoute?: string;
  bulkPayloadKey?: string;
  fields: ImportField<T>[];
  queryInvalidationKeys?: string[];
  templateFileName?: string;
  importLabel?: string;
  templateLabel?: string;
  title?: string;
  description?: string;
  transformRow?: (row: T, sourceRow: Record<string, string>) => T;
};

type ParsedSpreadsheet = {
  headers: string[];
  rows: Record<string, string>[];
  rowNumbers: number[];
};

const csvSeparator = ";";
const noColumnValue = "__no_column__";
const acceptedSpreadsheetExtensions = [".csv", ".tsv", ".xlsx", ".xls"];
const acceptedSpreadsheetTypes = [
  "text/csv",
  "text/tab-separated-values",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const fileInputAccept = [
  ...acceptedSpreadsheetExtensions,
  ...acceptedSpreadsheetTypes,
].join(",");

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const escapeCsvValue = (value: unknown) => {
  const stringValue = String(value ?? "");

  if (
    stringValue.includes(csvSeparator) ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const parseDelimitedLine = (line: string, separator: string) => {
  const values: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === separator && !insideQuotes) {
      values.push(value.trim());
      value = "";
      continue;
    }

    value += char;
  }

  values.push(value.trim());
  return values;
};

const detectSeparator = (line: string) => {
  const candidates = [csvSeparator, ",", "\t"];

  return candidates.reduce(
    (bestSeparator, separator) => {
      const count = parseDelimitedLine(line, separator).length;
      return count > bestSeparator.count ? { separator, count } : bestSeparator;
    },
    { separator: csvSeparator, count: 0 },
  ).separator;
};

const buildUniqueHeaders = (headers: string[]) => {
  const usedHeaders = new Map<string, number>();

  return headers.map((header, index) => {
    const baseHeader = header.trim() || `Coluna ${index + 1}`;
    const count = usedHeaders.get(baseHeader) ?? 0;
    usedHeaders.set(baseHeader, count + 1);

    return count ? `${baseHeader} (${count + 1})` : baseHeader;
  });
};

const rowsFromMatrix = (matrix: string[][]): ParsedSpreadsheet => {
  const cleanedMatrix = matrix
    .map((line, index) => ({ line, rowNumber: index + 1 }))
    .filter(({ line }) =>
      line.some((cell) => String(cell ?? "").trim() !== ""),
  );

  if (cleanedMatrix.length < 2) {
    return { headers: [], rows: [], rowNumbers: [] };
  }

  const headers = buildUniqueHeaders(
    cleanedMatrix[0].line.map((header) => String(header ?? "").trim()),
  );
  const dataRows = cleanedMatrix.slice(1);
  const rows = dataRows.map(({ line }) =>
    headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = String(line[index] ?? "").trim();
      return row;
    }, {}),
  );

  return {
    headers,
    rows,
    rowNumbers: dataRows.map(({ rowNumber }) => rowNumber),
  };
};

const parseDelimitedFile = (content: string) => {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/);

  if (!lines.length) return { headers: [], rows: [], rowNumbers: [] };

  const separator = detectSeparator(lines[0]);
  const matrix = lines.map((line) => parseDelimitedLine(line, separator));

  return rowsFromMatrix(matrix);
};

const isExcelFile = (file: File) => {
  const fileName = file.name.toLowerCase();

  return fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
};

const isAcceptedSpreadsheetFile = (file: File) => {
  const fileName = file.name.toLowerCase();

  return (
    acceptedSpreadsheetExtensions.some((extension) =>
      fileName.endsWith(extension),
    ) || acceptedSpreadsheetTypes.includes(file.type)
  );
};

const parseSpreadsheetFile = async (file: File) => {
  if (isExcelFile(file)) {
    const XLSX = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) return { headers: [], rows: [], rowNumbers: [] };

    const matrix = XLSX.utils.sheet_to_json<string[]>(
      workbook.Sheets[firstSheetName],
      {
        header: 1,
        defval: "",
        raw: false,
      },
    );

    return rowsFromMatrix(matrix);
  }

  return parseDelimitedFile(await file.text());
};

const buildAutomaticMapping = <T extends object>(
  fields: ImportField<T>[],
  headers: string[],
) =>
  fields.reduce<Record<string, string>>((mapping, field) => {
    const normalizedKey = normalizeText(field.key);
    const normalizedLabel = normalizeText(field.label);
    const match = headers.find((header) => {
      const normalizedHeader = normalizeText(header);
      return (
        normalizedHeader === normalizedKey || normalizedHeader === normalizedLabel
      );
    });

    mapping[field.key] = match ?? "";
    return mapping;
  }, {});

const summarizeRowValues = (row: Record<string, string>) => {
  const values = Object.entries(row)
    .filter(([, value]) => value.trim() !== "")
    .slice(0, 5)
    .map(([header, value]) => `${header}: ${value}`);

  return values.length ? values.join(" | ") : "Linha sem valores preenchidos";
};

export function ImportSpreadsheetButton<T extends object>({
  route,
  bulkRoute,
  bulkPayloadKey = "items",
  fields,
  queryInvalidationKeys = [],
  templateFileName = "modelo-importacao.csv",
  importLabel = "Importar planilha",
  templateLabel = "Baixar modelo",
  title = "Importar planilha",
  description = "Envie uma planilha, confira as colunas detectadas e relacione cada coluna ao campo correto.",
  transformRow,
}: ImportSpreadsheetButtonProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [rowNumbers, setRowNumbers] = useState<number[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const mappedRows = useMemo(
    () =>
      rows.map((row) =>
        fields.reduce<Record<string, string>>((mappedRow, field) => {
          const column = mapping[field.key];
          mappedRow[field.key] = column ? row[column] ?? "" : "";
          return mappedRow;
        }, {}),
      ),
    [fields, mapping, rows],
  );

  const requiredFieldsWithoutColumn = fields.filter(
    (field) => field.required && !mapping[field.key],
  );
  const requiredRowsWithMissingValue = mappedRows
    .map((row, index) => {
      const missingFields = fields.filter(
        (field) => field.required && !row[field.key],
      );

      return {
        rowIndex: index,
        rowNumber: rowNumbers[index] ?? index + 2,
        missingFields,
        sourceRow: rows[index] ?? {},
      };
    })
    .filter((error) => error.missingFields.length > 0);
  const requiredRowsWithMissingValueByIndex = new Map(
    requiredRowsWithMissingValue.map((error) => [error.rowIndex, error]),
  );
  const missingValueLineSummary = requiredRowsWithMissingValue
    .slice(0, 6)
    .map((error) => error.rowNumber)
    .join(", ");
  const remainingMissingValueLines =
    requiredRowsWithMissingValue.length > 6
      ? requiredRowsWithMissingValue.length - 6
      : 0;
  const requiredFieldKeys = new Set(
    fields.filter((field) => field.required).map((field) => field.key),
  );
  const canImport =
    rows.length > 0 &&
    requiredFieldsWithoutColumn.length === 0 &&
    requiredRowsWithMissingValue.length === 0 &&
    !isImporting;

  const resetFile = () => {
    setFileName("");
    setHeaders([]);
    setRows([]);
    setRowNumbers([]);
    setMapping({});
  };

  const downloadTemplate = () => {
    const headersLine = fields.map((field) => field.key).join(csvSeparator);
    const sampleLine = fields
      .map((field) => escapeCsvValue(field.sample ?? field.label ?? ""))
      .join(csvSeparator);
    const content = `\uFEFF${headersLine}\n${sampleLine}\n`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = templateFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;

    if (!isAcceptedSpreadsheetFile(file)) {
      toast.error("Envie uma planilha nos formatos CSV, TSV, XLS ou XLSX.");
      resetFile();
      return;
    }

    let parsed: ReturnType<typeof rowsFromMatrix>;

    try {
      parsed = await parseSpreadsheetFile(file);
    } catch {
      toast.error("Não foi possível ler a planilha enviada.");
      resetFile();
      return;
    }

    if (!parsed.headers.length || !parsed.rows.length) {
      toast.error("A planilha precisa ter cabeçalho e pelo menos uma linha.");
      resetFile();
      return;
    }

    setFileName(file.name);
    setHeaders(parsed.headers);
    setRows(parsed.rows);
    setRowNumbers(parsed.rowNumbers);
    setMapping(buildAutomaticMapping(fields, parsed.headers));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingFile(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDraggingFile(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    await handleFile(event.dataTransfer.files?.[0]);
  };

  const handleMappingChange = (fieldKey: string, column: string) => {
    setMapping((current) => ({
      ...current,
      [fieldKey]: column === noColumnValue ? "" : column,
    }));
  };

  const handleImport = async () => {
    if (!canImport) return;

    try {
      setIsImporting(true);

      const payloads = mappedRows.map((row, index) =>
        transformRow
          ? transformRow(row as T, rows[index])
          : (row as unknown as T),
      );

      if (bulkRoute) {
        await api.post(bulkRoute, { [bulkPayloadKey]: payloads });
      } else {
        for (const payload of payloads) {
          await api.post(route, payload);
        }
      }

      queryInvalidationKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      toast.success(`${mappedRows.length} registro(s) importado(s).`);
      setOpen(false);
      resetFile();
    } catch {
      toast.error("Não foi possível importar a planilha.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <UploadIcon data-icon="inline-center" />
        {importLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" onClick={downloadTemplate}>
                <DownloadIcon data-icon="inline-center" />
                {templateLabel}
              </Button>
              {fileName && (
                <span className="text-sm text-muted-foreground">{fileName}</span>
              )}
              <input
                ref={inputRef}
                type="file"
                accept={fileInputAccept}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div
              role="button"
              tabIndex={0}
              className={cn(
                "grid min-h-48 place-items-center rounded-lg border border-dashed bg-muted/20 p-6 text-center transition-colors",
                isDraggingFile &&
                  "border-primary bg-primary/10 text-primary",
                rows.length > 0 && "border-solid bg-background",
              )}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="grid max-w-md gap-3 justify-items-center">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full border bg-background",
                    isDraggingFile && "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  <FileSpreadsheetIcon className="size-6" />
                </div>
                <div className="grid gap-1">
                  <div className="text-sm font-medium">
                    Arraste a planilha aqui ou selecione um arquivo
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Formatos aceitos: XLSX, XLS, CSV e TSV.
                  </div>
                </div>
                <Button
                  type="button"
                  variant={isDraggingFile ? "default" : "outline"}
                  onClick={(event) => {
                    event.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  <UploadIcon data-icon="inline-center" />
                  Adicionar arquivo
                </Button>
              </div>
            </div>

            {headers.length > 0 && (
              <div className="grid gap-3">
                <div className="grid gap-2 rounded-lg border p-3">
                  <div className="text-sm font-medium">Relacionar colunas</div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {fields.map((field) => (
                      <div key={field.key} className="grid gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm">
                            {field.label}
                            {field.required && (
                              <span className="text-destructive"> *</span>
                            )}
                          </span>
                          {field.description && (
                            <span className="text-xs text-muted-foreground">
                              {field.description}
                            </span>
                          )}
                        </div>
                        <Select
                          value={mapping[field.key] || noColumnValue}
                          onValueChange={(value) =>
                            handleMappingChange(field.key, value ?? noColumnValue)
                          }
                        >
                          <SelectTrigger
                            aria-invalid={
                              field.required && !mapping[field.key]
                            }
                          >
                            <SelectValue placeholder="Selecionar coluna" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={noColumnValue}>
                              Ignorar
                            </SelectItem>
                            {headers.map((header, index) => (
                              <SelectItem key={`${header}-${index}`} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium">Prévia</div>
                    <div
                      className={cn(
                        "text-xs text-muted-foreground",
                        requiredRowsWithMissingValue.length &&
                        "text-destructive",
                      )}
                    >
                      {rows.length} linha(s) encontradas
                      {requiredRowsWithMissingValue.length
                        ? `, ${requiredRowsWithMissingValue.length} com campo obrigatório vazio`
                        : ""}
                    </div>
                  </div>
                  {requiredRowsWithMissingValue.length > 0 && (
                    <div className="grid gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                      <div className="font-medium">
                        Campo obrigatório vazio nas linhas:{" "}
                        {missingValueLineSummary}
                        {remainingMissingValueLines
                          ? ` e mais ${remainingMissingValueLines}`
                          : ""}
                      </div>
                      <div className="mt-1 text-xs">
                        Corrija a planilha ou ajuste o relacionamento das
                        colunas antes de importar.
                      </div>
                      <div className="max-h-40 overflow-auto rounded-md border border-destructive/20 bg-background/70">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-20 text-destructive">
                                Linha
                              </TableHead>
                              <TableHead className="text-destructive">
                                Campos vazios
                              </TableHead>
                              <TableHead className="text-destructive">
                                Conteúdo da linha
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {requiredRowsWithMissingValue
                              .slice(0, 10)
                              .map((error) => (
                                <TableRow key={error.rowIndex}>
                                  <TableCell className="font-medium text-destructive">
                                    {error.rowNumber}
                                  </TableCell>
                                  <TableCell className="text-destructive">
                                    {error.missingFields
                                      .map((field) => field.label)
                                      .join(", ")}
                                  </TableCell>
                                  <TableCell className="max-w-md text-xs text-muted-foreground">
                                    {summarizeRowValues(error.sourceRow)}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                      {requiredRowsWithMissingValue.length > 10 && (
                        <div className="text-xs">
                          Exibindo 10 de {requiredRowsWithMissingValue.length}{" "}
                          linhas com erro.
                        </div>
                      )}
                    </div>
                  )}
                  <div className="max-h-64 overflow-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Linha</TableHead>
                          {fields.map((field) => (
                            <TableHead key={field.key}>{field.label}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mappedRows.slice(0, 8).map((row, rowIndex) => {
                          const rowError =
                            requiredRowsWithMissingValueByIndex.get(rowIndex);

                          return (
                            <TableRow
                              key={rowIndex}
                              className={cn(rowError && "bg-destructive/5")}
                            >
                              <TableCell
                                className={cn(
                                  "font-medium text-muted-foreground",
                                  rowError && "text-destructive",
                                )}
                              >
                                {rowNumbers[rowIndex] ?? rowIndex + 2}
                              </TableCell>
                              {fields.map((field) => {
                                const isMissingRequiredValue =
                                  requiredFieldKeys.has(field.key) &&
                                  !row[field.key];

                                return (
                                  <TableCell
                                    key={field.key}
                                    className={cn(
                                      isMissingRequiredValue &&
                                      "font-medium text-destructive",
                                    )}
                                  >
                                    {row[field.key] || "-"}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetFile();
              }}
            >
              Cancelar
            </Button>
            <Button type="button" disabled={!canImport} onClick={handleImport}>
              {isImporting ? "Importando..." : "Importar registros"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

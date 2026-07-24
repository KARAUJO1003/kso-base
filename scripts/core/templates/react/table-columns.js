/**
 * Template for table columns
 * @module table-columns
 */

/**
 * Generate table-columns.tsx template
 * @param {object} params - Template parameters
 * @param {string} params.INTERFACE - Interface name
 * @param {string} params.PASCAL - PascalCase module name
 * @param {string} params.KEBAB - kebab-case module name
 * @param {string} params.typeFolderName - Types folder name
 * @param {string} params.mainFieldName - Main field name
 * @param {string} params.mainFieldLabel - Main field label
 * @returns {string} Table columns template
 */
export function tableColumnsTemplate(params) {
  const {
    INTERFACE,
    PASCAL,
    KEBAB,
    typeFolderName,
    mainFieldName,
    mainFieldLabel,
    fields,
  } = params;

  const resolvedFields =
    fields && fields.length > 0
      ? fields
      : [{ name: mainFieldName, label: mainFieldLabel }];

  const fieldColumnFunctions = resolvedFields
    .map(
      (f) => `const ${f.name}Column = (): ColumnDef<${INTERFACE}, string> => {
  return {
    accessorKey: "${f.name}",
    id: "${f.name}",
    header: ({ column }) => (
      <DataTableColumnHeader title="${f.label}" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <Highlight search={searchTerm} className="font-medium text-foreground">{cellValue}</Highlight>
          </div>
        </div>
      );
    },
  };
};`,
    )
    .join("\n\n");

  const fieldColumnCalls = resolvedFields
    .map((f) => `  ${f.name}Column(),`)
    .join("\n");

  return `import { ${INTERFACE} } from "@/types/${typeFolderName}/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { Editar${PASCAL} } from "@/features/(cadastros)/${KEBAB}/components/editar-${KEBAB}-modal";
import { Excluir${PASCAL} } from "@/features/(cadastros)/${KEBAB}/components/excluir-${KEBAB}-modal";

${fieldColumnFunctions}

const createdAtColumn = (): ColumnDef<${INTERFACE}, string> => {
  return {
    accessorFn: (row) => {
      if (!row.createdAt) return "-";
      const date = new Date(row.createdAt);
      return formatDate(date, "dd/MM/yy HH:mm", { locale: ptBR });
    },
    id: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader title="Criado em" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <Highlight
            search={searchTerm}
            className="font-medium text-foreground"
          >
            {cellValue}
          </Highlight>
        </div>
      );
    },
  };
};

const updatedAtColumn = (): ColumnDef<${INTERFACE}, string> => {
  return {
    accessorFn: (row) => {
      if (!row.updatedAt) return "-";
      const date = new Date(row.updatedAt);
      return formatDate(date, "dd/MM/yy HH:mm", { locale: ptBR });
    },
    id: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader title="Atualizado em" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <Highlight
            search={searchTerm}
            className="font-medium text-foreground"
          >
            {cellValue}
          </Highlight>
        </div>
      );
    },
  };
};

const actionsColumn = (): ColumnDef<${INTERFACE}, any> => {
  return {
    accessorKey: "actions",
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader title="Ações" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      return (
        <div className="flex items-center gap-1">
          <Editar${PASCAL} row={info.row} />
          <Excluir${PASCAL} row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<${INTERFACE}, any>[] => [
${fieldColumnCalls}
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];
`;
}

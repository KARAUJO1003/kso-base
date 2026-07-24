import { ILoja, StatusLoja } from "@/types/lojas/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { EditarLoja } from "@/features/(cadastros)/lojas/components/editar-lojas-modal";
import { ExcluirLoja } from "@/features/(cadastros)/lojas/components/excluir-lojas-modal";
import { Badge } from "@/components/ui/badge";

const codigoColumn = (): ColumnDef<ILoja, string> => {
  return {
    accessorKey: "codigo",
    id: "codigo",
    header: ({ column }) => (
      <DataTableColumnHeader title="Código" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <Highlight
              search={searchTerm}
              className="font-medium text-foreground"
            >
              {cellValue}
            </Highlight>
          </div>
        </div>
      );
    },
  };
};

const nomeColumn = (): ColumnDef<ILoja, string> => {
  return {
    accessorKey: "nome",
    id: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader title="Nome" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <Highlight
              search={searchTerm}
              className="font-medium text-foreground"
            >
              {cellValue}
            </Highlight>
          </div>
        </div>
      );
    },
  };
};

const statusColumn = (): ColumnDef<ILoja, string> => {
  return {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader title="Status" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <Badge
              variant={
                cellValue === StatusLoja.ATIVO ? "notionGreen" : "notionRed"
              }
            >
              {cellValue}
            </Badge>
          </div>
        </div>
      );
    },
  };
};

const createdAtColumn = (): ColumnDef<ILoja, string> => {
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

const updatedAtColumn = (): ColumnDef<ILoja, string> => {
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

const actionsColumn = (): ColumnDef<ILoja, any> => {
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
          <EditarLoja row={info.row} />
          <ExcluirLoja row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<ILoja, any>[] => [
  codigoColumn(),
  nomeColumn(),
  statusColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];

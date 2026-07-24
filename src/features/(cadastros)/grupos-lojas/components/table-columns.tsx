import { IGrupoLoja } from "@/types/grupos-lojas/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { EditarGrupoLoja } from "@/features/(cadastros)/grupos-lojas/components/editar-grupos-lojas-modal";
import { ExcluirGrupoLoja } from "@/features/(cadastros)/grupos-lojas/components/excluir-grupos-lojas-modal";

const codigoColumn = (): ColumnDef<IGrupoLoja, string> => {
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
            <Highlight search={searchTerm} className="font-medium text-foreground">{cellValue}</Highlight>
          </div>
        </div>
      );
    },
  };
};

const nomeColumn = (): ColumnDef<IGrupoLoja, string> => {
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
            <Highlight search={searchTerm} className="font-medium text-foreground">{cellValue}</Highlight>
          </div>
        </div>
      );
    },
  };
};

const createdAtColumn = (): ColumnDef<IGrupoLoja, string> => {
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

const updatedAtColumn = (): ColumnDef<IGrupoLoja, string> => {
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

const actionsColumn = (): ColumnDef<IGrupoLoja, any> => {
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
          <EditarGrupoLoja row={info.row} />
          <ExcluirGrupoLoja row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<IGrupoLoja, any>[] => [
  codigoColumn(),
  nomeColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];

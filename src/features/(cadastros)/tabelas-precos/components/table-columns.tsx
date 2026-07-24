import { EStatusTabelaPreco, ITabelasPrecos } from "@/types/tabelas-precos/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { EditarTabelasPrecos } from "@/features/(cadastros)/tabelas-precos/components/editar-tabelas-precos-modal";
import { ExcluirTabelasPrecos } from "@/features/(cadastros)/tabelas-precos/components/excluir-tabelas-precos-modal";
import { Badge } from "@/components/ui/badge";
import { AdicionarPrecoItemAction } from "./adicionar-preco-item-action";

const codigoColumn = (): ColumnDef<ITabelasPrecos, string> => {
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

const nomeColumn = (): ColumnDef<ITabelasPrecos, string> => {
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

const ativoColumn = (): ColumnDef<ITabelasPrecos, string> => {
  return {
    accessorKey: "ativo",
    id: "ativo",
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
              variant={cellValue === EStatusTabelaPreco.ATIVO ? "default" : "destructive"}
            >
              {cellValue}
            </Badge>
          </div>
        </div>
      );
    },
    meta: {
      filterVariant: "select",
    }
  };
};

const data_validadeColumn = (): ColumnDef<ITabelasPrecos, string> => {
  return {
    accessorKey: "data_validade",
    id: "data_validade",
    header: ({ column }) => (
      <DataTableColumnHeader title="Data Validade" column={column} />
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

const createdAtColumn = (): ColumnDef<ITabelasPrecos, string> => {
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

const updatedAtColumn = (): ColumnDef<ITabelasPrecos, string> => {
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

const actionsColumn = (): ColumnDef<ITabelasPrecos, any> => {
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
          <AdicionarPrecoItemAction row={info.row} />
          <EditarTabelasPrecos row={info.row} />
          <ExcluirTabelasPrecos row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<ITabelasPrecos, any>[] => [
  codigoColumn(),
  nomeColumn(),
  ativoColumn(),
  data_validadeColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];

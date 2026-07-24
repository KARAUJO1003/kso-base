import { IFormaPagamento } from "@/types/formas-pagamentos/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { EditarFormaPagamento } from "@/features/(cadastros)/formas-pagamentos/components/editar-formas-pagamentos-modal";
import { ExcluirFormaPagamento } from "@/features/(cadastros)/formas-pagamentos/components/excluir-formas-pagamentos-modal";
import { Badge } from "@/components/ui/badge";

const codigoColumn = (): ColumnDef<IFormaPagamento, string> => {
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

const nomeColumn = (): ColumnDef<IFormaPagamento, string> => {
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

const descricaoColumn = (): ColumnDef<IFormaPagamento, string> => {
  return {
    accessorKey: "descricao",
    id: "descricao",
    header: ({ column }) => (
      <DataTableColumnHeader title="Descrição" column={column} />
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

const ativoColumn = (): ColumnDef<IFormaPagamento, string> => {
  return {
    accessorKey: "ativo",
    id: "ativo",
    header: ({ column }) => (
      <DataTableColumnHeader title="Status" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <Badge variant={cellValue ? "success" : "destructive"} className="font-medium ">
              {cellValue ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </div>
      );
    },
  };
};

const taxaColumn = (): ColumnDef<IFormaPagamento, string> => {
  return {
    accessorKey: "taxa",
    id: "taxa",
    header: ({ column }) => (
      <DataTableColumnHeader title="Possui Taxa" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <Badge variant={cellValue ? "success" : "destructive"} className="font-medium ">
              {cellValue ? "Sim" : "Não"}
            </Badge>
          </div>
        </div>
      );
    },
  };
};

const acrescimo_percentualColumn = (): ColumnDef<IFormaPagamento, string> => {
  return {
    accessorKey: "acrescimo_percentual",
    id: "acrescimo_percentual",
    header: ({ column }) => (
      <DataTableColumnHeader title="Acréscimo %" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      const searchTerm = info.cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <Highlight search={searchTerm} className="font-medium text-foreground">{cellValue && Number(cellValue) !== 0 ? `${cellValue}%` : "-"}</Highlight>
          </div>
        </div>
      );
    },
  };
};

const createdAtColumn = (): ColumnDef<IFormaPagamento, string> => {
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

const updatedAtColumn = (): ColumnDef<IFormaPagamento, string> => {
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

const actionsColumn = (): ColumnDef<IFormaPagamento, any> => {
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
          <EditarFormaPagamento row={info.row} />
          <ExcluirFormaPagamento row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<IFormaPagamento, any>[] => [
  codigoColumn(),
  nomeColumn(),
  descricaoColumn(),
  ativoColumn(),
  taxaColumn(),
  acrescimo_percentualColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];

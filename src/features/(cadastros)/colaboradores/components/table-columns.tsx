import { IColaborador } from "@/types/colaboradores/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { EditarColaborador } from "@/features/(cadastros)/colaboradores/components/editar-colaboradores-modal";
import { ExcluirColaborador } from "@/features/(cadastros)/colaboradores/components/excluir-colaboradores-modal";
import { Badge } from "@/components/ui/badge";

const codigoColumn = (): ColumnDef<IColaborador, string> => {
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

const pessoaColumn = (): ColumnDef<IColaborador, string> => {
  return {
    accessorFn: (row) => row.pessoa?.nome || "-",
    id: "pessoa",
    header: ({ column }) => (
      <DataTableColumnHeader title="Pessoa" column={column} />
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

const obsColumn = (): ColumnDef<IColaborador, string> => {
  return {
    accessorKey: "obs",
    id: "obs",
    header: ({ column }) => (
      <DataTableColumnHeader title="Observação" column={column} />
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

const ativoColumn = (): ColumnDef<IColaborador, string> => {
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
              variant={cellValue === "ATIVO" ? "default" : "destructive"}
              className="font-medium"
            >
              {cellValue}
            </Badge>
          </div>
        </div>
      );
    },
  };
};

const gerenciaColumn = (): ColumnDef<IColaborador, string> => {
  return {
    accessorFn: (row) => row.gerencia?.nome || "-",
    id: "gerencia",
    header: ({ column }) => (
      <DataTableColumnHeader title="Gerência" column={column} />
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

const setorColumn = (): ColumnDef<IColaborador, string> => {
  return {
    accessorFn: (row) => row.setor?.nome || "-",
    id: "setor",
    header: ({ column }) => (
      <DataTableColumnHeader title="Setor" column={column} />
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

const cargoColumn = (): ColumnDef<IColaborador, string> => {
  return {
    accessorFn: (row) => row.cargo?.nome || "-",
    id: "cargo",
    header: ({ column }) => (
      <DataTableColumnHeader title="Cargo" column={column} />
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

const centro_custoColumn = (): ColumnDef<IColaborador, string> => {
  return {
    accessorFn: (row) => row.centro_custo?.nome || row.centro_custo?.nome || "-",
    id: "centro_custo",
    header: ({ column }) => (
      <DataTableColumnHeader title="Centro de Custo" column={column} />
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

const data_admissaoColumn = (): ColumnDef<IColaborador, string> => {
  return {
    accessorFn: (row) => {
      if (!row.data_admissao) return "-";
      const date = new Date(row.data_admissao);
      return Number.isNaN(date.getTime())
        ? row.data_admissao
        : formatDate(date, "dd/MM/yyyy", { locale: ptBR });
    },
    id: "data_admissao",
    header: ({ column }) => (
      <DataTableColumnHeader title="Data Admissão" column={column} />
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

const createdAtColumn = (): ColumnDef<IColaborador, string> => {
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

const updatedAtColumn = (): ColumnDef<IColaborador, string> => {
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

const actionsColumn = (): ColumnDef<IColaborador, any> => {
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
          <EditarColaborador row={info.row} />
          <ExcluirColaborador row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<IColaborador, any>[] => [
  codigoColumn(),
  pessoaColumn(),
  gerenciaColumn(),
  setorColumn(),
  cargoColumn(),
  obsColumn(),
  ativoColumn(),
  centro_custoColumn(),
  data_admissaoColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];

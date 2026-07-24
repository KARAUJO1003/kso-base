import { IIten } from "@/types/itens/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { EditarIten } from "@/features/(cadastros)/itens/components/editar-itens-modal";
import { ExcluirIten } from "@/features/(cadastros)/itens/components/excluir-itens-modal";
import { Badge } from "@/components/ui/badge";
import { EStatusItem } from "@/types/items/types";
import { cn } from "@/lib/utils";

const codigoColumn = (): ColumnDef<IIten, string> => {
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

const nomeColumn = (): ColumnDef<IIten, string> => {
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

const codigoBarrasColumn = (): ColumnDef<IIten, string> => {
  return {
    accessorKey: "codigo_barras",
    id: "codigo_barras",
    header: ({ column }) => (
      <DataTableColumnHeader title="Cód. barras/QR" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue() || "-";
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

const descricaoColumn = (): ColumnDef<IIten, string> => {
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

const validadeColumn = (): ColumnDef<IIten, string> => {
  return {
    accessorFn: (row) => {
      if (!row.validade) return "-";
      const date = new Date(row.validade);
      return formatDate(date, "dd/MM/yyyy", { locale: ptBR });
    },
    id: "validade",
    header: ({ column }) => (
      <DataTableColumnHeader title="Vlidade" column={column} />
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

const tipoItemColumn = (): ColumnDef<IIten, string> => {
  return {
    accessorKey: "tipo_item",
    id: "tipo_item",
    header: ({ column }) => (
      <DataTableColumnHeader title="Tipo do Item" column={column} />
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
    meta: {
      filterVariant: "select",
    }
  };
}

const grupoItemColumn = (): ColumnDef<IIten, string> => {
  return {
    accessorFn: (row) => row.grupo_item ? row.grupo_item?.nome : "-",
    id: "grupoItem",
    header: ({ column }) => (
      <DataTableColumnHeader title="Grupo de Item" column={column} />
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
    meta: {
      filterVariant: "select",
    }
  };
};

const subGrupoItemColumn = (): ColumnDef<IIten, string> => {
  return {
    accessorFn: (row) => row.sub_grupo_item ? row.sub_grupo_item?.nome : "-",
    id: "subGrupoItem",
    header: ({ column }) => (
      <DataTableColumnHeader title="Subgrupo de Item" column={column} />
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
    meta: {
      filterVariant: "select",
    }
  };
}

const statusColumn = (): ColumnDef<IIten, string> => {
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
              className={cn([
                {
                  "bg-green-500/10 dark:bg-green-500/20 dark:text-green-600 text-green-800":
                    cellValue === EStatusItem.ATIVO,
                  "bg-yellow-500/10 dark:bg-yellow-500/20 dark:text-yellow-600 text-yellow-800":
                    cellValue === EStatusItem.INATIVO,
                  "bg-red-500/10 dark:bg-red-500/20 dark:text-red-600 text-red-800":
                    cellValue === EStatusItem.SUSPENSO,
                },
              ])}
            >
              {cellValue}
            </Badge>
          </div>
        </div>
      );
    },
    meta: {
      filterVariant: "select",
    },
  };
};

const createdAtColumn = (): ColumnDef<IIten, string> => {
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

const updatedAtColumn = (): ColumnDef<IIten, string> => {
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

const actionsColumn = (): ColumnDef<IIten, any> => {
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
          <EditarIten row={info.row} />
          <ExcluirIten row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<IIten, any>[] => [
  codigoColumn(),
  codigoBarrasColumn(),
  tipoItemColumn(),
  nomeColumn(),
  descricaoColumn(),
  grupoItemColumn(),
  subGrupoItemColumn(),
  validadeColumn(),
  statusColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];

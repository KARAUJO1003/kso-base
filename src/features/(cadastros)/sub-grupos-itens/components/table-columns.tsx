import { ISubGrupoIten } from "@/types/sub-grupos-itens/types";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";
import { Highlight } from "@/components/extensions/search-highlight";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { EditarSubGrupoIten } from "@/features/(cadastros)/sub-grupos-itens/components/editar-sub-grupos-itens-modal";
import { ExcluirSubGrupoIten } from "@/features/(cadastros)/sub-grupos-itens/components/excluir-sub-grupos-itens-modal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { siteConfig } from "@/config/site-config";

const codigoColumn = (): ColumnDef<ISubGrupoIten, string> => {
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

const nomeColumn = (): ColumnDef<ISubGrupoIten, string> => {
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


const imagemColumn = (): ColumnDef<ISubGrupoIten, string> => {
  return {
    accessorKey: "imagem",
    id: "imagem",
    header: ({ column }) => (
      <DataTableColumnHeader title="Imagem" column={column} />
    ),
    cell: (info) => {
      if (!info.row.original) return "-";
      const cellValue = info.getValue();
      if (!cellValue) return "-";
      return (
        <div className="flex items-center gap-3">
          <div className="space-y-px">
            <AspectRatio ratio={16 / 9} className="w-12">
              <Image src={`${siteConfig.baseUrlFiles}/${cellValue}`} alt={cellValue || ''} fill objectFit="cover" />
            </AspectRatio>
          </div>
        </div>
      );
    },
  };
};


const createdAtColumn = (): ColumnDef<ISubGrupoIten, string> => {
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

const updatedAtColumn = (): ColumnDef<ISubGrupoIten, string> => {
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

const actionsColumn = (): ColumnDef<ISubGrupoIten, any> => {
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
          <EditarSubGrupoIten row={info.row} />
          <ExcluirSubGrupoIten row={info.row} />
        </div>
      );
    },
  };
};

export const columns = (): ColumnDef<ISubGrupoIten, any>[] => [
  codigoColumn(),
  imagemColumn(),
  nomeColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];

import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { Highlight } from "@/components/extensions/search-highlight";
import { Button } from "@/components/ui/button";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarIcon, EditIcon, LinkIcon, TrashIcon } from "lucide-react";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { ISystem } from "../../interfaces/modules";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActionsColumn({ row }: { row: ISystem }) {
  const { onOpen } = useModalInstance<ISystem>(MODAL_KEYS.CREATE_SYSTEM);
  const { onOpen: onConfirmDelete } = useModalInstance(MODAL_KEYS.DELETE_SYSTEM);

  return (
    <div className="flex justify-end items-center gap-1 text-muted-foreground">
      <Button onClick={() => onOpen(row)} size="icon" variant="ghost">
        <EditIcon className="w-4 h-4" />
        <span className="sr-only">Editar</span>
      </Button>
      <Button
        onClick={() => onConfirmDelete({ ...row, title: "delete" })}
        size="icon"
        variant="ghost"
        className="hover:text-red-500"
      >
        <TrashIcon className="w-4 h-4" />
        <span className="sr-only">Excluir</span>
      </Button>
    </div>
  );
}

export const systemsColumns = (): ColumnDef<ISystem>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sistema" />
    ),
    cell: ({ row, cell }) => {
      const value = row.getValue<string>("name");
      const filterValue = cell.column.getFilterValue() as string;
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono">
            {row.original.codigo || "-"}
          </span>
          <Highlight className="font-semibold" search={filterValue}>
            {value || "Registro sem nome"}
          </Highlight>
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
    cell: ({ row, cell }) => {
      const value = row.getValue<string>("url");
      const filterValue = cell.column.getFilterValue() as string;
      return value ? (
        <div className="flex items-center gap-2">
          <LinkIcon className="size-4 text-muted-foreground" />
          <Highlight search={filterValue}>{value}</Highlight>
        </div>
      ) : (
        <span className="text-muted-foreground italic">Sem URL</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <CalendarIcon className="size-4 text-muted-foreground" />
        {formatDate(row.getValue<string>("createdAt")) || "-"}
      </div>
    ),
  },
  {
    size: 20,
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ações" />,
    meta: { cellClassName: "!max-w-24 justify-center" },
    cell: ({ row }) => <ActionsColumn row={row.original} />,
  },
];

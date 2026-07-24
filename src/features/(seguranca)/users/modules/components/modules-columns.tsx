import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { Button } from "@/components/ui/button";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, EditIcon, NewspaperIcon, TrashIcon } from "lucide-react";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { IModules } from "../../interfaces/modules";
import { Highlight } from "@/components/extensions/search-highlight";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function filterFnDate(row: any, columnId: string, value: string) {
  const date = row?.getValue(columnId);
  if (!date) return false;

  return formatDate(date).includes(value);
}

function ActionsColumn({ row }: { row: IModules }) {
  const { onOpen } = useModalInstance<IModules>(MODAL_KEYS.CREATE_MODULE);
  const { onOpen: onConfirmDelete } = useModalInstance(MODAL_KEYS.DELETE_MODULE);

  function handleUpdate() {
    onOpen(row);
  }

  function handleDelete() {
    onConfirmDelete({
      ...row,
      title: "delete",
    });
  }

  return (
    <div className="flex justify-end items-center gap-1 text-muted-foreground">
      <Button
        onClick={handleUpdate}
        size={"icon"}
        variant={"ghost"}
      >
        <EditIcon className="w-4 h-4" />
        <span className="sr-only">Editar</span>
      </Button>

      <Button
        onClick={handleDelete}
        size={"icon"}
        variant={"ghost"}
        className="hover:text-red-500"
      >
        <span className="sr-only">Excluir</span>
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

export const modulesColumns = (): ColumnDef<IModules>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-r-0 border-b-none"
          column={column}
          title="Nome"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("name");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem nome
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <NewspaperIcon className="size-4 text-muted-foreground" />
            <Highlight
              className="font-semibold"
              search={filterValue}
            >
              {value}
            </Highlight>
          </div>
        );
      },
    },
    {
      accessorKey: "sistema",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Sistema"
        />
      ),
      cell: ({ row }) => {
        const sistema = row.original.sistema;
        return (
          <span className="text-sm">
            {typeof sistema === "object" ? sistema?.name : sistema || "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Slug"
        />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.slug || "-"}</Badge>
      ),
    },
    {
      accessorKey: "permissoes",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Permissões"
        />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {(row.original.permissoes || []).length} permissão(ões)
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Criado em"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("createdAt");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem data de criação
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <Highlight search={filterValue}>{formatDate(value)}</Highlight>
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        return filterFnDate(row, columnId, value);
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Atualizado em"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("updatedAt");
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem data de atualização
            </span>
          );

        return (
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <Highlight search={filterValue}>{formatDate(value)}</Highlight>
          </div>
        );
      },
      filterFn: (row, columnId, value) => {
        return filterFnDate(row, columnId, value);
      },
    },
    {
      size: 20,
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-b-none border-l-0"
          column={column}
          title="Ações"
        />
      ),
      meta: {
        cellClassName: "!max-w-24 justify-center",
      },
      cell: ({ row, cell }) => {
        const value = row.original;
        const filterValue = cell.column.getFilterValue() as string;
        if (!value)
          return (
            <span className="text-muted-foreground italic">
              Registro sem atualizador
            </span>
          );

        return <ActionsColumn row={value} />;
      },
    },
  ];
};

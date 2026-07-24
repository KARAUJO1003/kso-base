import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { Button } from "@/components/ui/button";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarIcon, EditIcon, NewspaperIcon, TrashIcon } from "lucide-react";
import { Highlight } from "@/components/extensions/search-highlight";
import { IUsers } from "../interfaces/users";
import { MODAL_KEYS } from "../constants/modal-keys";
import { Badge } from "@/components/ui/badge";

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

function ActionsColumn({ row }: { row: IUsers }) {
  const { onOpen } = useModalInstance<IUsers>(MODAL_KEYS.CREATE_USER);
  const { onOpen: onConfirmDelete } = useModalInstance(MODAL_KEYS.DELETE_USER);

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

export const usersColumns = (): ColumnDef<IUsers>[] => {
  return [
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-r-0 border-b-none"
          column={column}
          title="Nome"
        />
      ),
      cell: ({ row, cell }) => {
        const value = row.getValue<string>("username");
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
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Nome / Email"
        />
      ),
      cell: ({ row, cell }) => {
        const filterValue = cell.column.getFilterValue() as string;
        return (
          <div className="grid gap-1">
            <Highlight className="font-medium" search={filterValue}>
              {row.original.nome || row.original.apelido || "-"}
            </Highlight>
            <Highlight className="text-muted-foreground text-xs" search={filterValue}>
              {row.original.email}
            </Highlight>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Status"
        />
      ),
      cell: ({ row }) => {
        const status = row.original.status || "ATIVO";
        return (
          <Badge
            variant={status === "ATIVO" ? "default" : "secondary"}
            className={
              status === "BLOQUEADO"
                ? "bg-amber-500/10 text-amber-600"
                : status === "INATIVO"
                  ? "bg-red-500/10 text-red-600"
                  : ""
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Role"
        />
      ),
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <span className="text-sm">
            {typeof role === "object" ? role?.name : role || "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "lojas_associadas",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="bg-muted-foreground/5 border border-x-0 border-b-none"
          column={column}
          title="Lojas / Perfis"
        />
      ),
      cell: ({ row }) => {
        const loja = row.original.loja;
        const lojas = row.original.lojas_associadas || [];
        const profiles = row.original.profiles || [];
        const lojaNome = typeof loja === "object" ? loja?.nome : loja;
        return (
          <div className="flex flex-wrap gap-1">
            {lojaNome ? <Badge variant="outline">{lojaNome}</Badge> : null}
            <Badge variant="secondary">{lojas.length} loja(s)</Badge>
            <Badge variant="secondary">{profiles.length} perfil(is)</Badge>
          </div>
        );
      },
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

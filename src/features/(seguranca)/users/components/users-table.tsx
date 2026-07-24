"use client";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { MODAL_KEYS } from "../constants/modal-keys";
import { UsersForm } from "./users-form";
import { DataTableColumnsToggle } from "@/components/extensions/datatable/datatable-columns-toggle";
import { PlusIcon } from "lucide-react";
import { usersColumns } from "./users-columns";
import { useMemo } from "react";
import { UsersConfirmDelete } from "./users-confirm-delete";
import { useFetch } from "@/hooks/use-crud";
import { IUsers } from "../interfaces/users";
import { useModalInstance } from "@/hooks/use-modal-instance";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const UsersTable = () => {
  const { data: queryData } = useFetch<IUsers[]>({
    route: "/users",
    queryKey: ["users"],
  });
  const columns = useMemo(() => usersColumns(), []);
  return (
    <div>
      <DataTable
        data={queryData || []}
        columns={columns || []}
        toolbar={(table) => (
          <div className="flex flex-1 items-center bg-muted p-1 border rounded-md">
            <UsersFormModal />
            <DataTableColumnsToggle table={table} className="bg-card" />
            <UsersConfirmDelete />
          </div>
        )}
      />
    </div>
  );
};
export const UsersFormModal = () => {
  const modal = useModalInstance(MODAL_KEYS.CREATE_USER);
  return (
    <Drawer open={modal.open} onOpenChange={modal.onOpenChange}>
      <DrawerTrigger className="flex items-center gap-1 mr-auto">
        <PlusIcon className="w-4 h-4" />
        <span>Novo Usuário</span>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="items-start px-10 bg-muted-foreground/10 -mt-6 -z-10 rounded-b-4xl">
          <DrawerTitle>Cadastro de Usuários</DrawerTitle>
          <DrawerDescription>
            Preencha os dados abaixo para criar um novo usuário.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid px-10 overflow-y-auto">
          <UsersForm />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

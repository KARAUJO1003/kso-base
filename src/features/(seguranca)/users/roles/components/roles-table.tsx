"use client";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { Modal } from "../../components/modal-form";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { RolesForm } from "./roles-form";
import { DataTableColumnsToggle } from "@/components/extensions/datatable/datatable-columns-toggle";
import { PlusIcon } from "lucide-react";
import { rolesColumns } from "./roles-columns";
import { useMemo } from "react";
import { IRoles } from "../../interfaces/roles";
import { RolesConfirmDelete } from "./roles-confirm-delete";
import { useFetch } from "@/hooks/use-crud";

export const RolesTable = () => {
  const { data: queryData } = useFetch<IRoles[]>({
    route: "/roles",
    queryKey: ["roles"],
  });
  const columns = useMemo(() => rolesColumns(), []);
  return (
    <div>
      <DataTable
        data={queryData || []}
        columns={columns || []}
        toolbar={(table) => (
          <div className="flex flex-1 items-center bg-muted p-1 border rounded-md">
            <RolesFormModal />
            <DataTableColumnsToggle
              table={table}
              className="bg-card"
            />
            <RolesConfirmDelete />
          </div>
        )}
      />
    </div>
  );
};
export const RolesFormModal = () => {
  return (
    <Modal
      trigger={
        <div className="flex items-center gap-1">
          <PlusIcon className="w-4 h-4" />
          <span>Nova Role</span>
        </div>
      }
      modalKey={MODAL_KEYS.CREATE_ROLE}
      className="mr-auto"
    >
      <RolesForm />
    </Modal>
  );
};

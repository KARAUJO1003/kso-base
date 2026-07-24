"use client";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { Modal } from "../../components/modal-form";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { PermissionsForm } from "./permissions-form";
import { DataTableColumnsToggle } from "@/components/extensions/datatable/datatable-columns-toggle";
import { PlusIcon } from "lucide-react";
import { permissionsColumns } from "./permissions-columns";
import { useMemo } from "react";
import { IPermissions } from "../../interfaces/permissions";
import { PermissionsConfirmDelete } from "./permissions-confirm-delete";
import { useFetch } from "@/hooks/use-crud";

export const PermissionsTable = () => {
  const { data: queryData } = useFetch<IPermissions[]>({
    route: "/permissoes",
    queryKey: ["permissions"],
  });
  const columns = useMemo(() => permissionsColumns(), []);
  return (
    <div>
      <DataTable
        data={queryData || []}
        columns={columns || []}
        toolbar={(table) => (
          <div className="flex flex-1 items-center bg-muted p-1 border rounded-md">
            <PermissionsFormModal />
            <DataTableColumnsToggle
              table={table}
              className="bg-card"
            />
            <PermissionsConfirmDelete />
          </div>
        )}
      />
    </div>
  );
};
export const PermissionsFormModal = () => {
  return (
    <Modal
      trigger={
        <div className="flex items-center gap-1">
          <PlusIcon className="w-4 h-4" />
          <span>Nova Permissão</span>
        </div>
      }
      modalKey={MODAL_KEYS.CREATE_PERMISSION}
      className="mr-auto"
    >
      <PermissionsForm />
    </Modal>
  );
};

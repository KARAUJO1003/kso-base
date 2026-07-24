"use client";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { Modal } from "../../components/modal-form";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { ModulesForm } from "./modules-form";
import { DataTableColumnsToggle } from "@/components/extensions/datatable/datatable-columns-toggle";
import { PlusIcon } from "lucide-react";
import { modulesColumns } from "./modules-columns";
import { useMemo } from "react";
import { IModules } from "../../interfaces/modules";
import { ModulesConfirmDelete } from "./modules-confirm-delete";
import { useFetch } from "@/hooks/use-crud";

export const ModulesTable = () => {
  const { data: queryData } = useFetch<IModules[]>({
    route: "/permissao-grupos",
    queryKey: ["permission-groups"],
  });
  const columns = useMemo(() => modulesColumns(), []);
  return (
    <div>
      <DataTable
        data={queryData || []}
        columns={columns || []}
        toolbar={(table) => (
          <div className="flex flex-1 items-center bg-muted p-1 border rounded-md">
            <ModulesFormModal />
            <DataTableColumnsToggle
              table={table}
              className="bg-card"
            />
            <ModulesConfirmDelete />
          </div>
        )}
      />
    </div>
  );
};
export const ModulesFormModal = () => {
  return (
    <Modal
      trigger={
        <div className="flex items-center gap-1">
          <PlusIcon className="w-4 h-4" />
          <span>Novo Grupo</span>
        </div>
      }
      modalKey={MODAL_KEYS.CREATE_MODULE}
      className="mr-auto"
    >
      <ModulesForm />
    </Modal>
  );
};

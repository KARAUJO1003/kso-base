"use client";

import { DataTable } from "@/components/extensions/datatable/datatable";
import { DataTableColumnsToggle } from "@/components/extensions/datatable/datatable-columns-toggle";
import { useFetch } from "@/hooks/use-crud";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { Modal } from "../../components/modal-form";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { ISystem } from "../../interfaces/modules";
import { SystemsConfirmDelete } from "./systems-confirm-delete";
import { systemsColumns } from "./systems-columns";
import { SystemsForm } from "./systems-form";

export const SystemsTable = () => {
  const { data: queryData } = useFetch<ISystem[]>({
    route: "/sistemas",
    queryKey: ["systems"],
  });
  const columns = useMemo(() => systemsColumns(), []);

  return (
    <DataTable
      data={queryData || []}
      columns={columns}
      toolbar={(table) => (
        <div className="flex flex-1 items-center bg-muted p-1 border rounded-md">
          <SystemsFormModal />
          <DataTableColumnsToggle table={table} className="bg-card" />
          <SystemsConfirmDelete />
        </div>
      )}
    />
  );
};

const SystemsFormModal = () => (
  <Modal
    trigger={
      <div className="flex items-center gap-1">
        <PlusIcon className="w-4 h-4" />
        <span>Novo Sistema</span>
      </div>
    }
    modalKey={MODAL_KEYS.CREATE_SYSTEM}
    className="mr-auto"
  >
    <SystemsForm />
  </Modal>
);

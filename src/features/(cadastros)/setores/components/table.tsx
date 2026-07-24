"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/setores/components/table-columns";
import {
  MODAL_KEYS_SETOR,
  QUERIES_KEYS_SETOR,
} from "@/features/(cadastros)/setores/utils/constants";
import {
  PERMISSIONS,
  MODULE_ROUTE,
} from "@/features/(cadastros)/setores/utils/module-utils";
import { ISetor } from "@/types/setores/type";
import { Feature } from "@/lib/feature-flags/components/feature-flag";

export const TableSetor = () => {
  const { data = [], isPending } = useFetch<ISetor[]>({
    queryKey: [QUERIES_KEYS_SETOR.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_SETOR.FORM);

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          <Feature flag="modules.organizacao.setores.criar">
            <Button onClick={() => modal.onOpen()}>
              <PlusIcon data-icon="inline-center" />
              Adicionar
            </Button>
          </Feature>
        </Can>
      }
    />
  );
};

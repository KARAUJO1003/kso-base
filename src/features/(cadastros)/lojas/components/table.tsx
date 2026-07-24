"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ILoja } from "@/types/lojas/types";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/lojas/components/table-columns";
import {
  MODAL_KEYS_LOJA,
  QUERIES_KEYS_LOJA,
} from "@/features/(cadastros)/lojas/utils/constants";
import {
  PERMISSIONS,
  MODULE_ROUTE,
} from "@/features/(cadastros)/lojas/utils/module-utils";

export const TableLoja = () => {
  const { data = [], isPending } = useFetch<ILoja[]>({
    queryKey: [QUERIES_KEYS_LOJA.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_LOJA.FORM);

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="lojas">*/}
          <Button onClick={() => modal.onOpen()}>
            <PlusIcon data-icon="inline-center" />
            Adicionar
          </Button>
          {/*  </Feature> */}
        </Can>
      }
    />
  );
};

"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IFornecedor } from "@/types/fornecedores/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/fornecedores/components/table-columns";
import { MODAL_KEYS_FORNECEDOR, QUERIES_KEYS_FORNECEDOR } from "@/features/(cadastros)/fornecedores/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/fornecedores/utils/module-utils";

export const TableFornecedor = () => {
  const { data = [], isPending } = useFetch<IFornecedor[]>({
    queryKey: [QUERIES_KEYS_FORNECEDOR.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_FORNECEDOR.FORM);
  

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="fornecedores">*/}
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

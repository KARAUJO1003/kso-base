"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ICentroCusto } from "@/types/centros-custos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/centros-custos/components/table-columns";
import { MODAL_KEYS_CENTROCUSTO, QUERIES_KEYS_CENTROCUSTO } from "@/features/(cadastros)/centros-custos/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/centros-custos/utils/module-utils";

export const TableCentroCusto = () => {
  const { data = [], isPending } = useFetch<ICentroCusto[]>({
    queryKey: [QUERIES_KEYS_CENTROCUSTO.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_CENTROCUSTO.FORM);
  

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="centros-custos">*/}
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

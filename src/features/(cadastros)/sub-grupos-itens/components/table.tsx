"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ISubGrupoIten } from "@/types/sub-grupos-itens/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/sub-grupos-itens/components/table-columns";
import { MODAL_KEYS_SUBGRUPOITEN, QUERIES_KEYS_SUBGRUPOITEN } from "@/features/(cadastros)/sub-grupos-itens/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/sub-grupos-itens/utils/module-utils";

export const TableSubGrupoIten = () => {
  const { data = [], isPending } = useFetch<ISubGrupoIten[]>({
    queryKey: [QUERIES_KEYS_SUBGRUPOITEN.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_SUBGRUPOITEN.FORM);
  

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="sub-grupos-itens">*/}
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

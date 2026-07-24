"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IGrupoIten } from "@/types/grupos-itens/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/grupos-itens/components/table-columns";
import { MODAL_KEYS_GRUPOITEN, QUERIES_KEYS_GRUPOITEN } from "@/features/(cadastros)/grupos-itens/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/grupos-itens/utils/module-utils";

export const TableGrupoIten = () => {
  const { data = [], isPending } = useFetch<IGrupoIten[]>({
    queryKey: [QUERIES_KEYS_GRUPOITEN.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_GRUPOITEN.FORM);
  

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="grupos-itens">*/}
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

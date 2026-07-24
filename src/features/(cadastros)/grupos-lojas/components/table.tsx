"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IGrupoLoja } from "@/types/grupos-lojas/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/grupos-lojas/components/table-columns";
import { MODAL_KEYS_GRUPOLOJA, QUERIES_KEYS_GRUPOLOJA } from "@/features/(cadastros)/grupos-lojas/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/grupos-lojas/utils/module-utils";

export const TableGrupoLoja = () => {
  const { data = [], isPending } = useFetch<IGrupoLoja[]>({
    queryKey: [QUERIES_KEYS_GRUPOLOJA.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_GRUPOLOJA.FORM);


  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="grupos-lojas">*/}
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

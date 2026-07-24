"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IGerencia } from "@/types/gerencia/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/gerencias/components/table-columns";
import { MODAL_KEYS_GERENCIA, QUERIES_KEYS_GERENCIA } from "@/features/(cadastros)/gerencias/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/gerencias/utils/module-utils";

export const TableGerencia = () => {
  const { data = [], isPending } = useFetch<IGerencia[]>({
    queryKey: [QUERIES_KEYS_GERENCIA.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_GERENCIA.FORM);


  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="gerencia">*/}
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

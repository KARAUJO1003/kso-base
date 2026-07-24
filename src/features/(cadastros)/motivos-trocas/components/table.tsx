"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IMotivoTroca } from "@/types/motivos-trocas/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/motivos-trocas/components/table-columns";
import { MODAL_KEYS_MOTIVOTROCA, QUERIES_KEYS_MOTIVOTROCA } from "@/features/(cadastros)/motivos-trocas/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/motivos-trocas/utils/module-utils";

export const TableMotivoTroca = () => {
  const { data = [], isPending } = useFetch<IMotivoTroca[]>({
    queryKey: [QUERIES_KEYS_MOTIVOTROCA.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_MOTIVOTROCA.FORM);


  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="motivos-trocas">*/}
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

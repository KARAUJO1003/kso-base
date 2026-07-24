"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IDeposito } from "@/types/deposito/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/depositos/components/table-columns";
import { MODAL_KEYS_DEPOSITO, QUERIES_KEYS_DEPOSITO } from "@/features/(cadastros)/depositos/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/depositos/utils/module-utils";

export const TableDeposito = () => {
  const { data = [], isPending } = useFetch<IDeposito[]>({
    queryKey: [QUERIES_KEYS_DEPOSITO.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_DEPOSITO.FORM);


  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="deposito">*/}
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

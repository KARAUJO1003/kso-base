"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ITabelasPrecos } from "@/types/tabelas-precos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/tabelas-precos/components/table-columns";
import { MODAL_KEYS_TABELASPRECOS, QUERIES_KEYS_TABELASPRECOS } from "@/features/(cadastros)/tabelas-precos/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/tabelas-precos/utils/module-utils";

export const TableTabelasPrecos = () => {
  const { data = [], isPending } = useFetch<ITabelasPrecos[]>({
    queryKey: [QUERIES_KEYS_TABELASPRECOS.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_TABELASPRECOS.FORM);
  

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="tabelas-precos">*/}
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

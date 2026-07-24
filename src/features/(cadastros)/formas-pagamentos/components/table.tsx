"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IFormaPagamento } from "@/types/formas-pagamentos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/formas-pagamentos/components/table-columns";
import { MODAL_KEYS_FORMAPAGAMENTO, QUERIES_KEYS_FORMAPAGAMENTO } from "@/features/(cadastros)/formas-pagamentos/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/formas-pagamentos/utils/module-utils";

export const TableFormaPagamento = () => {
  const { data = [], isPending } = useFetch<IFormaPagamento[]>({
    queryKey: [QUERIES_KEYS_FORMAPAGAMENTO.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_FORMAPAGAMENTO.FORM);


  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          <Feature flag="modules.inventario.formasPagamento.visualizar">
            <Button onClick={() => modal.onOpen()}>
              <PlusIcon data-icon="inline-center" />
              Adicionar
            </Button>
          </Feature>
        </Can>
      }
    />
  );
};

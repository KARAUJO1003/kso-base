"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IPessoa } from "@/types/pessoas/types";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/pessoas/components/table-columns";
import {
  MODAL_KEYS_PESSOA,
  QUERIES_KEYS_PESSOA,
} from "@/features/(cadastros)/pessoas/utils/constants";
import {
  PERMISSIONS,
  MODULE_ROUTE,
} from "@/features/(cadastros)/pessoas/utils/module-utils";

export const TablePessoa = () => {
  const { data = [], isPending } = useFetch<IPessoa[]>({
    queryKey: [QUERIES_KEYS_PESSOA.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_PESSOA.FORM);

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="pessoas">*/}
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

"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IUnidadeMedida } from "@/types/unidade-medida/types";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/unidade-medida/components/table-columns";
import { MODAL_KEYS_UNIDADEMEDIDA, QUERIES_KEYS_UNIDADEMEDIDA } from "@/features/(cadastros)/unidade-medida/utils/constants";
import { PERMISSIONS, MODULE_ROUTE } from "@/features/(cadastros)/unidade-medida/utils/module-utils";
import { ImportSpreadsheetButton } from "@/components/shared/import-spreadsheet-button";

type UnidadeMedidaImportRow = {
  nome: string;
  sigla: string;
};

export const TableUnidadeMedida = () => {
  const { data = [], isPending } = useFetch<IUnidadeMedida[]>({
    queryKey: [QUERIES_KEYS_UNIDADEMEDIDA.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_UNIDADEMEDIDA.FORM);

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <div className="flex flex-wrap items-center gap-2">
          <Can can={[PERMISSIONS.create]}>
            {/* <Feature flag="unidade-medida">*/}
            <Button onClick={() => modal.onOpen()}>
              <PlusIcon data-icon="inline-center" />
              Adicionar
            </Button>
            <ImportSpreadsheetButton<UnidadeMedidaImportRow>
              route={MODULE_ROUTE}
              bulkRoute={`${MODULE_ROUTE}/import`}
              queryInvalidationKeys={[QUERIES_KEYS_UNIDADEMEDIDA.LIST]}
              templateFileName="modelo-unidades-medida.csv"
              fields={[
                {
                  key: "nome",
                  label: "Nome",
                  required: true,
                  sample: "Quilograma",
                },
                {
                  key: "sigla",
                  label: "Sigla",
                  required: true,
                  sample: "kg",
                },
              ]}
            />
            {/*  </Feature> */}
          </Can>
        </div>
      }
    />
  );
};

"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ICargo, ICargoImportRow } from "@/types/cargos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/cargos/components/table-columns";
import { MODAL_KEYS_CARGO, QUERIES_KEYS_CARGO } from "@/features/(cadastros)/cargos/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/cargos/utils/module-utils";
import { ImportSpreadsheetButton } from "@/components/shared/import-spreadsheet-button";

export const TableCargo = () => {
  const { data = [], isPending } = useFetch<ICargo[]>({
    queryKey: [QUERIES_KEYS_CARGO.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_CARGO.FORM);


  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="cargos">*/}
          <Button onClick={() => modal.onOpen()}>
            <PlusIcon data-icon="inline-center" />
            Adicionar
          </Button>
          <ImportSpreadsheetButton<ICargoImportRow>
            route={MODULE_ROUTE}
            bulkRoute={`${MODULE_ROUTE}/import`}
            queryInvalidationKeys={[QUERIES_KEYS_CARGO.LIST]}
            templateFileName="modelo-cargo.csv"
            fields={[
              {
                key: "nome",
                label: "Nome",
                required: true,
                sample: "Supervisor",
              },

            ]}
          />
          {/*  </Feature> */}
        </Can>
      }
    />
  );
};

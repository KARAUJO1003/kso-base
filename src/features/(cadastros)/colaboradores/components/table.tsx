"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IColaborador, IColaboradorImportRow } from "@/types/colaboradores/types";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/colaboradores/components/table-columns";
import { MODAL_KEYS_COLABORADOR, QUERIES_KEYS_COLABORADOR } from "@/features/(cadastros)/colaboradores/utils/constants";
import { PERMISSIONS, MODULE_ROUTE } from "@/features/(cadastros)/colaboradores/utils/module-utils";
import { ImportSpreadsheetButton } from "@/components/shared/import-spreadsheet-button";

const normalizeImportRow = (row: IColaboradorImportRow) =>
  Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== "" && value !== undefined),
  ) as IColaboradorImportRow;

export const TableColaborador = () => {
  const { data = [], isPending } = useFetch<IColaborador[]>({
    queryKey: [QUERIES_KEYS_COLABORADOR.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_COLABORADOR.FORM);


  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <div className="flex flex-wrap items-center gap-2">
          <Can can={[PERMISSIONS.create]}>
            <Button onClick={() => modal.onOpen()}>
              <PlusIcon data-icon="inline-center" />
              Adicionar
            </Button>
            <ImportSpreadsheetButton<IColaboradorImportRow>
              route={MODULE_ROUTE}
              bulkRoute={`${MODULE_ROUTE}/import`}
              queryInvalidationKeys={[QUERIES_KEYS_COLABORADOR.LIST]}
              templateFileName="modelo-colaboradores.csv"
              transformRow={normalizeImportRow}
              fields={[
                {
                  key: "pessoa",
                  label: "Pessoa",
                  required: true,
                  sample: "João da Silva",
                  description: "nome da pessoa",
                },
                {
                  key: "gerencia",
                  label: "Gerência",
                  required: true,
                  sample: "Operacional",
                  description: "nome",
                },
                {
                  key: "setor",
                  label: "Setor",
                  required: true,
                  sample: "Recepção",
                  description: "nome",
                },
                {
                  key: "cargo",
                  label: "Cargo",
                  required: true,
                  sample: "Recepcionista",
                  description: "nome",
                },
                {
                  key: "centro_custo",
                  label: "Centro de Custo",
                  required: true,
                  sample: "Administrativo",
                  description: "nome",
                },
                {
                  key: "data_admissao",
                  label: "Data de Admissão",
                  required: true,
                  sample: "2026-05-23",
                  description: "AAAA-MM-DD",
                },
                { key: "ativo", label: "Status", sample: "ATIVO" },
                { key: "obs", label: "Observação", sample: "Turno da manhã" },
                {
                  key: "senha",
                  label: "Senha",
                  sample: "123456",
                  description: "opcional",
                },
              ]}
            />
          </Can>
        </div>
      }
    />
  );
};

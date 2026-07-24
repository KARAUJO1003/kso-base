"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IIten } from "@/types/itens/types";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/itens/components/table-columns";
import { MODAL_KEYS_ITEN, QUERIES_KEYS_ITEN } from "@/features/(cadastros)/itens/utils/constants";
import { PERMISSIONS, MODULE_ROUTE } from "@/features/(cadastros)/itens/utils/module-utils";
import { ImportSpreadsheetButton } from "@/components/shared/import-spreadsheet-button";

type ItenImportRow = {
  nome?: string;
  codigo_barras?: string;
  descricao?: string;
  validade?: string;
  vida_util_mes?: string | number;
  status?: string;
  ncm?: string;
  volume_compra?: string | number;
  volume_venda?: string | number;
  unidade_compra?: string;
  unidade_venda?: string;
  grupo_item?: string;
  sub_grupo_item?: string;
  fornecedor?: string;
  deposito?: string;
  posicao?: string;
  tabela_preco?: string;
  estoque_minimo?: string | number;
  estoque_maximo?: string | number;
  estoque_seguranca?: string | number;
  preco_unitario?: string | number;
  tipo_item?: string;
  componentes?: string;
  prato?: string;
  componente?: string;
  quantidade_por_unidade?: string | number;
};

const numberFields = [
  "vida_util_mes",
  "volume_compra",
  "volume_venda",
  "estoque_minimo",
  "estoque_maximo",
  "estoque_seguranca",
  "preco_unitario",
  "quantidade_por_unidade",
] as const;

const toNumber = (value: unknown) => {
  const normalizedValue = String(value ?? "")
    .replace(",", ".");
  const numberValue = Number(normalizedValue);

  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const removeEmptyValues = <T extends Record<string, unknown>>(values: T) =>
  Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== ""),
  ) as T;

export const TableIten = () => {
  const { data = [], isPending } = useFetch<IIten[]>({
    queryKey: [QUERIES_KEYS_ITEN.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_ITEN.FORM);

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <div className="flex flex-wrap items-center gap-2">
          <Can can={[PERMISSIONS.create]}>
            {/* <Feature flag="itens">*/}
            <Button onClick={() => modal.onOpen()}>
              <PlusIcon data-icon="inline-center" />
              Adicionar
            </Button>
            <ImportSpreadsheetButton<ItenImportRow>
              route={MODULE_ROUTE}
              bulkRoute={`${MODULE_ROUTE}/import`}
              queryInvalidationKeys={[QUERIES_KEYS_ITEN.LIST]}
              templateFileName="modelo-itens.csv"
              fields={[
                {
                  key: "nome",
                  label: "Nome",
                  sample: "Sabonete",
                },
                {
                  key: "codigo_barras",
                  label: "Código de barras/QR",
                  sample: "7891234567895",
                },
                {
                  key: "descricao",
                  label: "Descrição",
                  sample: "Sabonete glicerinado",
                },
                {
                  key: "validade",
                  label: "Validade",
                  sample: "2026-12-31",
                  description: "AAAA-MM-DD",
                },
                {
                  key: "vida_util_mes",
                  label: "Vida útil (meses)",
                  sample: 12,
                },
                { key: "status", label: "Status", sample: "ativo" },
                { key: "ncm", label: "NCM", sample: "34011190" },
                { key: "volume_compra", label: "Volume compra", sample: 1 },
                { key: "volume_venda", label: "Volume venda", sample: 1 },
                {
                  key: "unidade_compra",
                  label: "Unidade compra",
                  sample: "Unidade",
                  description: "nome",
                },
                {
                  key: "unidade_venda",
                  label: "Unidade venda",
                  sample: "Unidade",
                  description: "nome",
                },
                {
                  key: "grupo_item",
                  label: "Grupo",
                  sample: "Amenities",
                  description: "nome",
                },
                {
                  key: "sub_grupo_item",
                  label: "Subgrupo",
                  sample: "Higiene",
                  description: "nome",
                },
                {
                  key: "fornecedor",
                  label: "Fornecedor",
                  sample: "Fornecedor padrão",
                  description: "nome",
                },
                {
                  key: "deposito",
                  label: "Depósito",
                  sample: "Estoque principal",
                  description: "nome",
                },
                { key: "posicao", label: "Posição", sample: "A-01" },
                {
                  key: "tabela_preco",
                  label: "Tabela de preço",
                  sample: "Tabela padrão",
                  description: "nome",
                },
                { key: "estoque_minimo", label: "Estoque mínimo", sample: 0 },
                { key: "estoque_maximo", label: "Estoque máximo", sample: 0 },
                {
                  key: "estoque_seguranca",
                  label: "Estoque segurança",
                  sample: 0,
                },
                {
                  key: "preco_unitario",
                  label: "Preço unitário",
                  sample: "9,90",
                },
                {
                  key: "tipo_item",
                  label: "Tipo item",
                  sample: "simples",
                  description: "simples ou composto",
                },
                {
                  key: "componentes",
                  label: "Componentes",
                  sample: "Arroz:0,12|Feijão:0,10",
                  description: "nome:qtd separados por |",
                },
                {
                  key: "prato",
                  label: "Prato",
                  sample: "Prato feito de picanha",
                  description: "para ficha técnica",
                },
                {
                  key: "componente",
                  label: "Componente",
                  sample: "Picanha bovina porcionada",
                  description: "para ficha técnica",
                },
                {
                  key: "quantidade_por_unidade",
                  label: "Qtd por unidade",
                  sample: "0,25",
                  description: "para ficha técnica",
                },
              ]}
              transformRow={(row) => {
                const payload = removeEmptyValues({
                  ...row,
                  status: row.status || "ativo",
                });

                numberFields.forEach((field) => {
                  if (payload[field] !== undefined) {
                    payload[field] = toNumber(payload[field]);
                  }
                });

                return removeEmptyValues(payload);
              }}
            />
            {/*  </Feature> */}
          </Can>
        </div>
      }
    />
  );
};

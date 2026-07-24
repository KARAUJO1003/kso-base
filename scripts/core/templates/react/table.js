/**
 * Template for data table component
 * @module table
 */

/**
 * Generate table.tsx template
 * @param {object} params - Template parameters
 * @param {string} params.PASCAL - PascalCase module name
 * @param {string} params.KEBAB - kebab-case module name
 * @param {string} params.INTERFACE - Interface name
 * @param {string} params.UPPER - UPPER_CASE module name
 * @param {string} params.pageTitle - Page title
 * @param {string} params.typeFolderName - Types folder name
 * @returns {string} Table template
 */
export function tableTemplate(params) {
  const { PASCAL, KEBAB, INTERFACE, UPPER, pageTitle, typeFolderName } = params;

  return `"use client";
import { PlusIcon } from "lucide-react";
import { useFetch } from "@/hooks/use-crud";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ${INTERFACE} } from "@/types/${typeFolderName}/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { DataTable } from "@/components/extensions/datatable/datatable";
import { columns } from "@/features/(cadastros)/${KEBAB}/components/table-columns";
import { MODAL_KEYS_${UPPER}, QUERIES_KEYS_${UPPER} } from "@/features/(cadastros)/${KEBAB}/utils/constants";
import { PERMISSIONS, MODULE_ROUTE, MODULE_CONFIG } from "@/features/(cadastros)/${KEBAB}/utils/module-utils";

export const Table${PASCAL} = () => {
  const { data = [], isPending } = useFetch<${INTERFACE}[]>({
    queryKey: [QUERIES_KEYS_${UPPER}.LIST],
    route: MODULE_ROUTE,
  });

  const modal = useModalInstance(MODAL_KEYS_${UPPER}.FORM);
  

  return (
    <DataTable
      data={data}
      columns={columns()}
      isPending={isPending}
      toolbar={
        <Can can={[PERMISSIONS.create]}>
          {/* <Feature flag="${KEBAB}">*/}
            <Button onClick={() => modal.onOpen()}>
              <PlusIcon data-icon="inline-center" />
              Adicionar ${pageTitle}
            </Button>
         {/*  </Feature> */}
        </Can>
      }
    />
  );
};
`;
}

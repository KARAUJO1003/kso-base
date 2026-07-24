/**
 * Template for edit modal component
 * @module editar-modal
 */

/**
 * Generate edit modal template
 * @param {object} params - Template parameters
 * @param {string} params.PASCAL - PascalCase module name
 * @param {string} params.KEBAB - kebab-case module name
 * @param {string} params.INTERFACE - Interface name
 * @param {string} params.UPPER - UPPER_CASE module name
 * @param {string} params.typeFolderName - Types folder name
 * @returns {string} Edit modal template
 */
export function editarModalTemplate(params) {
  const { PASCAL, KEBAB, INTERFACE, UPPER, typeFolderName } = params;

  return `import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ${INTERFACE} } from "@/types/${typeFolderName}/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_${UPPER} } from "@/features/(cadastros)/${KEBAB}/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/${KEBAB}/utils/module-utils";

export const Editar${PASCAL} = ({ row }: { row: Row<${INTERFACE}> }) => {
  const modal = useModalInstance(MODAL_KEYS_${UPPER}.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="${KEBAB}"> */}
        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => modal.onOpen(row.original)}
        >
          <EditIcon data-icon="inline-center" />
        </Button>
      {/* </Feature> */}
    </Can>
  );
};
`;
}

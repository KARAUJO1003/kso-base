import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IGerencia } from "@/types/gerencia/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_GERENCIA } from "@/features/(cadastros)/gerencias/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/gerencias/utils/module-utils";

export const EditarGerencia = ({ row }: { row: Row<IGerencia> }) => {
  const modal = useModalInstance(MODAL_KEYS_GERENCIA.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="gerencia"> */}
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

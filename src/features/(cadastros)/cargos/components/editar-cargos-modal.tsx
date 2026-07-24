import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ICargo } from "@/types/cargos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_CARGO } from "@/features/(cadastros)/cargos/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/cargos/utils/module-utils";

export const EditarCargo = ({ row }: { row: Row<ICargo> }) => {
  const modal = useModalInstance(MODAL_KEYS_CARGO.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="cargos"> */}
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

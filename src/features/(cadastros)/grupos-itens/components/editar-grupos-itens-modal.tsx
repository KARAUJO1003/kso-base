import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IGrupoIten } from "@/types/grupos-itens/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_GRUPOITEN } from "@/features/(cadastros)/grupos-itens/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/grupos-itens/utils/module-utils";

export const EditarGrupoIten = ({ row }: { row: Row<IGrupoIten> }) => {
  const modal = useModalInstance(MODAL_KEYS_GRUPOITEN.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="grupos-itens"> */}
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

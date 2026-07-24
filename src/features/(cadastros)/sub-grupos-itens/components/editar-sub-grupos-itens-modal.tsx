import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ISubGrupoIten } from "@/types/sub-grupos-itens/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_SUBGRUPOITEN } from "@/features/(cadastros)/sub-grupos-itens/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/sub-grupos-itens/utils/module-utils";

export const EditarSubGrupoIten = ({ row }: { row: Row<ISubGrupoIten> }) => {
  const modal = useModalInstance(MODAL_KEYS_SUBGRUPOITEN.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="sub-grupos-itens"> */}
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

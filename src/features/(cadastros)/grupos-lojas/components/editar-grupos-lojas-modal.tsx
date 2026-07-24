import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IGrupoLoja } from "@/types/grupos-lojas/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_GRUPOLOJA } from "@/features/(cadastros)/grupos-lojas/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/grupos-lojas/utils/module-utils";

export const EditarGrupoLoja = ({ row }: { row: Row<IGrupoLoja> }) => {
  const modal = useModalInstance(MODAL_KEYS_GRUPOLOJA.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="grupos-lojas"> */}
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

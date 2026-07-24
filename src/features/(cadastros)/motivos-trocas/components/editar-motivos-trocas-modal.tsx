import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IMotivoTroca } from "@/types/motivos-trocas/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_MOTIVOTROCA } from "@/features/(cadastros)/motivos-trocas/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/motivos-trocas/utils/module-utils";

export const EditarMotivoTroca = ({ row }: { row: Row<IMotivoTroca> }) => {
  const modal = useModalInstance(MODAL_KEYS_MOTIVOTROCA.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="motivos-trocas"> */}
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

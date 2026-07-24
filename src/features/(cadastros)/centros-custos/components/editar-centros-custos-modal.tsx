import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ICentroCusto } from "@/types/centros-custos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_CENTROCUSTO } from "@/features/(cadastros)/centros-custos/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/centros-custos/utils/module-utils";

export const EditarCentroCusto = ({ row }: { row: Row<ICentroCusto> }) => {
  const modal = useModalInstance(MODAL_KEYS_CENTROCUSTO.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="centros-custos"> */}
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

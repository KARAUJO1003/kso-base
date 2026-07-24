import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IDeposito } from "@/types/deposito/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_DEPOSITO } from "@/features/(cadastros)/depositos/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/depositos/utils/module-utils";

export const EditarDeposito = ({ row }: { row: Row<IDeposito> }) => {
  const modal = useModalInstance(MODAL_KEYS_DEPOSITO.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="deposito"> */}
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

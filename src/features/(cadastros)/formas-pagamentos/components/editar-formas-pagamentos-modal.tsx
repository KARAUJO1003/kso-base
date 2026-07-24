import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IFormaPagamento } from "@/types/formas-pagamentos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_FORMAPAGAMENTO } from "@/features/(cadastros)/formas-pagamentos/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/formas-pagamentos/utils/module-utils";

export const EditarFormaPagamento = ({ row }: { row: Row<IFormaPagamento> }) => {
  const modal = useModalInstance(MODAL_KEYS_FORMAPAGAMENTO.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="formas-pagamentos"> */}
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

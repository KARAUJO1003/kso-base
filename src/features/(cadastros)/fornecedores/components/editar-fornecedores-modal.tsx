import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IFornecedor } from "@/types/fornecedores/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_FORNECEDOR } from "@/features/(cadastros)/fornecedores/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/fornecedores/utils/module-utils";

export const EditarFornecedor = ({ row }: { row: Row<IFornecedor> }) => {
  const modal = useModalInstance(MODAL_KEYS_FORNECEDOR.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="fornecedores"> */}
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

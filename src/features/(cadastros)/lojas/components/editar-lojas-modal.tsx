import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ILoja } from "@/types/lojas/types";
import { MODAL_KEYS_LOJA } from "@/features/(cadastros)/lojas/utils/constants";
import { PERMISSIONS } from "@/features/(cadastros)/lojas/utils/module-utils";

export const EditarLoja = ({ row }: { row: Row<ILoja> }) => {
  const modal = useModalInstance(MODAL_KEYS_LOJA.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="lojas"> */}
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

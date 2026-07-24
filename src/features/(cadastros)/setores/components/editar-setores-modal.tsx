import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { PERMISSIONS } from "@/features/(cadastros)/setores/utils/module-utils";
import { ISetor } from "@/types/setores/type";
import { MODAL_KEYS_SETOR } from "../utils/constants";

export const EditarSetor = ({ row }: { row: Row<ISetor> }) => {
  const modal = useModalInstance(MODAL_KEYS_SETOR.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="setores"> */}
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

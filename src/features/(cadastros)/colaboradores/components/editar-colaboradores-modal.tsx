import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IColaborador } from "@/types/colaboradores/types";
import { MODAL_KEYS_COLABORADOR } from "@/features/(cadastros)/colaboradores/utils/constants";
import { PERMISSIONS } from "@/features/(cadastros)/colaboradores/utils/module-utils";

export const EditarColaborador = ({ row }: { row: Row<IColaborador> }) => {
  const modal = useModalInstance(MODAL_KEYS_COLABORADOR.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="colaboradores"> */}
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

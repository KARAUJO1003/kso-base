import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IUnidadeMedida } from "@/types/unidade-medida/types";
import { MODAL_KEYS_UNIDADEMEDIDA } from "@/features/(cadastros)/unidade-medida/utils/constants";
import { PERMISSIONS } from "@/features/(cadastros)/unidade-medida/utils/module-utils";

export const EditarUnidadeMedida = ({ row }: { row: Row<IUnidadeMedida> }) => {
  const modal = useModalInstance(MODAL_KEYS_UNIDADEMEDIDA.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="unidade-medida"> */}
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

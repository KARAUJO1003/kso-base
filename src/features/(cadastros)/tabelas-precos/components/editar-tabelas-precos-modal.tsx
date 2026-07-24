import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ITabelasPrecos } from "@/types/tabelas-precos/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_TABELASPRECOS } from "@/features/(cadastros)/tabelas-precos/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/tabelas-precos/utils/module-utils";

export const EditarTabelasPrecos = ({ row }: { row: Row<ITabelasPrecos> }) => {
  const modal = useModalInstance(MODAL_KEYS_TABELASPRECOS.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="tabelas-precos"> */}
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

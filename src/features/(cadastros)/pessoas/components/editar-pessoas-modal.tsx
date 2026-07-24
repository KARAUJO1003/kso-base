import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IPessoa } from "@/types/pessoas/types";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODAL_KEYS_PESSOA } from "@/features/(cadastros)/pessoas/utils/constants";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/pessoas/utils/module-utils";

export const EditarPessoa = ({ row }: { row: Row<IPessoa> }) => {
  const modal = useModalInstance(MODAL_KEYS_PESSOA.FORM);
  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="pessoas"> */}
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

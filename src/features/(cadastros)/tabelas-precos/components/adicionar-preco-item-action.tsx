import { Button } from "@/components/ui/button";
import { BadgeDollarSignIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { ITabelasPrecos } from "@/types/tabelas-precos/types";
import { MODAL_KEYS_TABELASPRECOS } from "@/features/(cadastros)/tabelas-precos/utils/constants";
import { PERMISSIONS } from "@/features/(cadastros)/tabelas-precos/utils/module-utils";

export const AdicionarPrecoItemAction = ({
  row,
}: {
  row: Row<ITabelasPrecos>;
}) => {
  const modal = useModalInstance(MODAL_KEYS_TABELASPRECOS.PRICE_ITEM);

  return (
    <Can can={[PERMISSIONS.edit]}>
      <Button
        size="icon-sm"
        variant="outline"
        onClick={() => modal.onOpen(row.original)}
      >
        <BadgeDollarSignIcon data-icon="inline-center" />
        <span className="sr-only">Adicionar preço de item</span>
      </Button>
    </Can>
  );
};

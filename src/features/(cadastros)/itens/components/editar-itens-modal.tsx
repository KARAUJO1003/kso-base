import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Can } from "@/lib/auth/components/can";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IIten } from "@/types/itens/types";
import { MODAL_KEYS_ITEN } from "@/features/(cadastros)/itens/utils/constants";
import { MODULE_ROUTE, PERMISSIONS } from "@/features/(cadastros)/itens/utils/module-utils";
import { api } from "@/lib/axios-instance";
import { useState } from "react";
import { toast } from "sonner";

const toCurrencyValue = (value?: number | null) => {
  if (typeof value !== "number") return 0;
  return value;
};

export const EditarIten = ({ row }: { row: Row<IIten> }) => {
  const modal = useModalInstance(MODAL_KEYS_ITEN.FORM);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    const id = row.original._id;

    if (!id) {
      toast.error("Item sem identificador para edição.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get<IIten>(
        `${MODULE_ROUTE}/${id}`,
      );
      const item = {
        ...response.data,
        vida_util_mes: Number(response.data.vida_util_mes) || 0,
        deposito: response.data.item_estoque?.deposito,
        tabela_preco: response.data.item_preco?.tabela_preco,
        posicao: response.data?.item_estoque?.posicao || "",
        estoque_minimo: response.data?.item_estoque?.minimo || 0,
        estoque_maximo: response.data?.item_estoque?.maximo || 0,
        estoque_seguranca: response.data?.item_estoque?.seguranca || 0,
        preco_unitario: toCurrencyValue(response.data?.item_preco?.custo),
      }

      modal.onOpen(item);
    } catch {
      toast.error("Não foi possível carregar os dados do item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Can can={[PERMISSIONS.edit]}>
      {/* <Feature flag="itens"> */}
      <Button
        size="icon-sm"
        variant="outline"
        disabled={isLoading}
        onClick={handleEdit}
      >
        <EditIcon data-icon="inline-center" />
      </Button>
      {/* </Feature> */}
    </Can>
  );
};

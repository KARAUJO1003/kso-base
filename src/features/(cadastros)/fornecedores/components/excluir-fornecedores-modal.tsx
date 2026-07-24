import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { IFornecedor } from "@/types/fornecedores/types";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useDelete } from "@/hooks/use-crud";
import {
  QUERIES_KEYS_FORNECEDOR,
  MUTATION_KEYS_FORNECEDOR,
} from "@/features/(cadastros)/fornecedores/utils/constants";
import { Can } from "@/lib/auth/components/can";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODULE_ROUTE, MODULE_CONFIG, PERMISSIONS } from "@/features/(cadastros)/fornecedores/utils/module-utils";

export const ExcluirFornecedor = ({ row }: { row: Row<IFornecedor> }) => {
  const onDeleteMutation = useDelete({
    mutationKey: [MUTATION_KEYS_FORNECEDOR.DELETE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_FORNECEDOR.LIST],
  });

  return (
    <Can can={[PERMISSIONS.delete]}>
      {/* <Feature flag="fornecedores"> */}
        <AlertDialog>
        <AlertDialogTrigger
          render={<Button size="icon-sm" variant="outline" />}
        >
          <Trash2Icon data-icon="inline-center" />
        </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza absoluta?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente este registro e removerá seus dados de nossos servidores.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onDeleteMutation.mutate({
                    id: row.original._id,
                  })
                }
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      {/* </Feature> */}
    </Can>
  );
};

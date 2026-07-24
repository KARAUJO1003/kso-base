import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { IColaborador } from "@/types/colaboradores/types";
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
  QUERIES_KEYS_COLABORADOR,
  MUTATION_KEYS_COLABORADOR,
} from "@/features/(cadastros)/colaboradores/utils/constants";
import { Can } from "@/lib/auth/components/can";
import { MODULE_ROUTE, PERMISSIONS } from "@/features/(cadastros)/colaboradores/utils/module-utils";

export const ExcluirColaborador = ({ row }: { row: Row<IColaborador> }) => {
  const onDeleteMutation = useDelete({
    mutationKey: [MUTATION_KEYS_COLABORADOR.DELETE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_COLABORADOR.LIST],
  });

  return (
    <Can can={[PERMISSIONS.delete]}>
      {/* <Feature flag="colaboradores"> */}
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

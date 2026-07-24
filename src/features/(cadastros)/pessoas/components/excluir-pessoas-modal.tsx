import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { IPessoa } from "@/types/pessoas/types";
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
  QUERIES_KEYS_PESSOA,
  MUTATION_KEYS_PESSOA,
} from "@/features/(cadastros)/pessoas/utils/constants";
import { Can } from "@/lib/auth/components/can";
import { Feature } from "@/lib/feature-flags/components/feature-flag";
import { MODULE_ROUTE, MODULE_CONFIG, PERMISSIONS } from "@/features/(cadastros)/pessoas/utils/module-utils";

export const ExcluirPessoa = ({ row }: { row: Row<IPessoa> }) => {
  const pessoaId = row.original._id;
  const onDeleteMutation = useDelete({
    mutationKey: [MUTATION_KEYS_PESSOA.DELETE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_PESSOA.LIST],
  });

  if (!pessoaId) return null;

  return (
    <Can can={[PERMISSIONS.delete]}>
      {/* <Feature flag="pessoas"> */}
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
                    id: pessoaId,
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { useDelete } from "@/hooks/use-crud";

export const RolesConfirmDelete = () => {
  const {
    open,
    data: row,
    onOpen: onConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useModalInstance(MODAL_KEYS.DELETE_ROLE);

  const { mutateAsync: deleteRole, isPending } = useDelete({
    route: "/roles",
    mutationKey: ["delete-role"],
    queryInvalidationKeys: ["roles"],
  });

  const handleDelete = async () => {
    if (!row?._id) return;
    await deleteRole({ id: row._id });
    onCloseConfirmDelete();
  };
  return (
    <AlertDialog
      open={open}
      onOpenChange={() => {
        if (open) {
          onCloseConfirmDelete();
        } else {
          onConfirmDelete(row);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            registro e removerá seus dados de nossos servidores.
            <span>
              Você está prestes a excluir{" "}
              <strong className="bg-red-500/10 text-red-500 italic">
                &quot;{row?.name}&quot;
              </strong>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction

            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

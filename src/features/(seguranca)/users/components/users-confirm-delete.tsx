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
import { useDelete } from "@/hooks/use-crud";
import { MODAL_KEYS } from "../constants/modal-keys";

export const UsersConfirmDelete = () => {
  const {
    open,
    data: row,
    onOpen: onConfirmDelete,
    onClose: onCloseConfirmDelete,
  } = useModalInstance(MODAL_KEYS.DELETE_USER);

  const { mutateAsync: deleteUser, isPending } = useDelete({
    route: "/users",
    mutationKey: ["delete-user"],
    queryInvalidationKeys: ["users"],
  });

  const handleDelete = async () => {
    if (!row?._id) return;
    await deleteUser({ id: row._id });
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
                &quot;{row?.nome || row?.username}&quot;
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

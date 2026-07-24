"use client";

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
import { useDelete } from "@/hooks/use-crud";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { ISystem } from "../../interfaces/modules";

export const SystemsConfirmDelete = () => {
  const { open, data: row, onOpen, onClose } = useModalInstance<ISystem>(
    MODAL_KEYS.DELETE_SYSTEM,
  );

  const { mutateAsync: deleteSystem, isPending } = useDelete({
    route: "/sistemas",
    mutationKey: ["delete-system"],
    queryInvalidationKeys: ["systems"],
  });

  const handleDelete = async () => {
    if (!row?._id) return;
    await deleteSystem({ id: row._id });
    onClose();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) onOpen(row);
        else onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação excluirá permanentemente o sistema{" "}
            <strong className="bg-red-500/10 text-red-500 italic">
              &quot;{row?.name}&quot;
            </strong>
            .
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

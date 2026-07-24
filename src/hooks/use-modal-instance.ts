"use client";

import { useModal } from "@/providers/modal-provider";

// Hook personalizado para facilitar o uso de um modal específico
export function useModalInstance<T = any>(modalKey: string) {
  const { openModal, closeModal, updateModalData, isModalOpen, getModalData } =
    useModal();

  return {
    open: isModalOpen(modalKey),
    data: getModalData<T>(modalKey),
    onOpen: (data?: T) => openModal<T>(modalKey, data),
    onOpenChange: (open: boolean, data?: T) => {
      if (open) {
        openModal<T>(modalKey, data);
      } else {
        closeModal(modalKey);
      }
    },
    onClose: () => closeModal(modalKey),
    updateData: (data: T) => updateModalData<T>(modalKey, data),
  };
}

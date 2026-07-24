"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Tipos para o provider
type ModalState<T = any> = {
  isOpen: boolean;
  data?: T;
};

type ModalStore = {
  [key: string]: ModalState;
};

interface ModalContextType {
  modals: ModalStore;
  openModal: <T>(key: string, data?: T) => void;
  closeModal: (key: string) => void;
  updateModalData: <T>(key: string, data: T) => void;
  isModalOpen: (key: string) => boolean;
  getModalData: <T>(key: string) => T | undefined;
}

// Criação do contexto
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider component
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalStore>({});

  const openModal = <T,>(key: string, data?: T) => {
    setModals((prev) => ({
      ...prev,
      [key]: { isOpen: true, data },
    }));
  };

  const closeModal = (key: string) => {
    setModals((prev) => ({
      ...prev,
      [key]: { ...prev[key], isOpen: false, data: undefined },
    }));
  };

  const updateModalData = <T,>(key: string, data: T) => {
    setModals((prev) => ({
      ...prev,
      [key]: { ...prev[key], data },
    }));
  };

  const isModalOpen = (key: string): boolean => {
    return !!modals[key]?.isOpen;
  };

  const getModalData = <T,>(key: string): T | undefined => {
    return modals[key]?.data as T | undefined;
  };

  return (
    <ModalContext.Provider
      value={{
        modals,
        openModal,
        closeModal,
        updateModalData,
        isModalOpen,
        getModalData,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal deve ser usado dentro de um ModalProvider");
  }

  return context;
}

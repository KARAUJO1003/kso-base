"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormFields } from "@/components/shared/form-fields";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { IModulesSchema, modulesFormSchema } from "../../schemas/modules";
import { useCreate, useFetch, useUpdate } from "@/hooks/use-crud";
import { useEffect } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FieldGroup } from "@/components/ui/field";
import { ISystem } from "../../interfaces/modules";
import { IPermissions } from "../../interfaces/permissions";

const defaultFormValues: IModulesSchema = {
  name: "",
  sistema: "",
  permissoes: [],
};

const getId = (value: any) =>
  typeof value === "string" ? value : value?._id ? String(value._id) : "";

const getFormValues = (data?: any): IModulesSchema => ({
  name: data?.name || "",
  sistema: getId(data?.sistema),
  permissoes: (data?.permissoes || []).map(getId).filter(Boolean),
});

export function ModulesForm() {
  const { data: systems = [] } = useFetch<ISystem[]>({
    route: "/sistemas",
    queryKey: ["systems"],
  });
  const { data: permissions = [] } = useFetch<IPermissions[]>({
    route: "/permissoes",
    queryKey: ["permissions"],
  });
  const { mutateAsync: create, isPending: isCreating } = useCreate<IModulesSchema>({
    route: "/permissao-grupos",
    mutationKey: ["create-modules"],
    queryInvalidationKeys: ["permission-groups", "modules"],
  });
  const { mutateAsync: update, isPending: isUpdating } = useUpdate<IModulesSchema>({
    route: "/permissao-grupos",
    mutationKey: ["update-modules"],
    queryInvalidationKeys: ["permission-groups", "modules"],
  });

  const {
    data: updateData,
    onClose,
    onOpen,
    open,
  } = useModalInstance(MODAL_KEYS.CREATE_MODULE);
  const form = useForm<IModulesSchema>({
    resolver: zodResolver(modulesFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(getFormValues(updateData));
  }, [form, open, updateData]);

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (formData: IModulesSchema) => {
    if (updateData) {
      await update({ formData, id: updateData._id });
    } else {
      await create({ formData });
    }
    onClose();
    form.reset(defaultFormValues);
  };

  return (
    <div className="grid">
      <SheetHeader>
        <SheetTitle>{updateData ? "Editar" : "Criar"} Modulo</SheetTitle>
        <SheetDescription>
          Preencha os detalhes para o{" "}
          {updateData ? "modulo existente" : "novo modulo"}.
        </SheetDescription>
      </SheetHeader>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-6"
        >
          <FieldGroup>
            <FormFields.Input<IModulesSchema>
              name="name"
              label="Nome"
              placeholder="Digite o nome do grupo..."
            />
            <FormFields.Select<IModulesSchema, ISystem>
              name="sistema"
              label="Sistema"
              options={systems}
              itemToValue={(item) => item._id}
              itemToString={(item) => item.name}
              placeholder="Selecione o sistema"
            />
            <FormFields.MultiSelect<IModulesSchema, IPermissions>
              name="permissoes"
              label="Permissões"
              options={permissions}
              itemToValue={(item) => item._id}
              itemToString={(item) => item.name}
              placeholder="Selecione as permissões do grupo"
            />
          </FieldGroup>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {updateData ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEYS } from "../../constants/modal-keys";
import {
  IPermissionsSchema,
  permissionsFormSchema,
} from "../../schemas/permissions";
import { useCreate, useFetch, useUpdate } from "@/hooks/use-crud";
import { useEffect } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { IRoles } from "../../interfaces/roles";
import { IModules } from "../../interfaces/modules";
import { Badge } from "@/components/ui/badge";
import { FormFields } from "@/components/shared/form-fields";
import { FieldGroup } from "@/components/ui/field";

const defaultFormValues: IPermissionsSchema = {
  name: "",
  description: "",
};

const getFormValues = (data?: any): IPermissionsSchema => {
  if (!data) return defaultFormValues;

  return {
    name: data.name.includes(":")
      ? data.name.split(":")[1]
      : data.name,
    description: data.description || "",
  };
};

export function PermissionsForm() {
  const { mutateAsync: create, isPending: isCreating } = useCreate<IPermissionsSchema>({
    route: "/permissoes",
    mutationKey: ["create-permissions"],
    queryInvalidationKeys: ["permissions"],
  });
  const { mutateAsync: update, isPending: isUpdating } = useUpdate<IPermissionsSchema>({
    route: "/permissoes",
    mutationKey: ["update-permissions"],
    queryInvalidationKeys: ["permissions"],
  });
  const { data: optionsRoles, isPending: pendingRoles } = useFetch<IRoles[]>({
    route: "/roles",
    queryKey: ["options-roles"],
  });
  const { data: optionsModules, isPending: pendingModules } = useFetch<
    IModules[]
  >({
    route: "/permissao-grupos",
    queryKey: ["permission-groups"],
  });

  const {
    data: updateData,
    onClose,
    onOpen,
    open,
  } = useModalInstance(MODAL_KEYS.CREATE_PERMISSION);
  const form = useForm<IPermissionsSchema>({
    resolver: zodResolver(permissionsFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(getFormValues(updateData));
  }, [form, open, updateData?._id]);

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (data: IPermissionsSchema) => {
    const formData = {
      name: data.name,
      description: data.description,
    };
    if (updateData?._id) {
      await update({ formData, id: updateData._id });
    } else {
      create({ formData });

    }
    onClose();
    form.reset(defaultFormValues);
  };

  const permissionWatch = form.watch("name");

  return (
    <div className="grid">
      <SheetHeader>
        <SheetTitle>{updateData ? "Editar" : "Criar"} Permissão</SheetTitle>
        <SheetDescription>
          Preencha os detalhes para a{" "}
          {updateData ? "permissão existente" : "nova permissão"}.
        </SheetDescription>
      </SheetHeader>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-6"
        >
          <FieldGroup>
            <FormFields.Input<IPermissionsSchema>
              name="name"
              label="Nome"
              placeholder="exemplo: 'ver' | 'excluir' | 'editar' | outra..."
            />
            <FormFields.Textarea<IPermissionsSchema>
              name="description"
              label="Descrição"
              placeholder="Descreva quando esta permissão deve ser usada"
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

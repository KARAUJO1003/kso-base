"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormFields } from "@/components/shared/form-fields";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { FieldGroup } from "@/components/ui/field";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect } from "react";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { ISystem } from "../../interfaces/modules";
import { ISystemsSchema, systemsFormSchema } from "../../schemas/systems";

const defaultFormValues: ISystemsSchema = {
  codigo: undefined,
  name: "",
  description: "",
  url: "",
  image: "",
};

const getFormValues = (data?: ISystem | null): ISystemsSchema => ({
  codigo: data?.codigo as unknown as number | undefined,
  name: data?.name || "",
  description: data?.description || "",
  url: data?.url || "",
  image: data?.image || "",
});

export function SystemsForm() {
  const { data: updateData, onClose, open } = useModalInstance<ISystem>(
    MODAL_KEYS.CREATE_SYSTEM,
  );

  const form = useForm<ISystemsSchema>({
    resolver: zodResolver(systemsFormSchema) as any,
    defaultValues: defaultFormValues,
  });

  const { mutateAsync: create, isPending: isCreating } = useCreate<ISystemsSchema>({
    route: "/sistemas",
    mutationKey: ["create-systems"],
    queryInvalidationKeys: ["systems"],
  });
  const { mutateAsync: update, isPending: isUpdating } = useUpdate<ISystemsSchema>({
    route: "/sistemas",
    mutationKey: ["update-systems"],
    queryInvalidationKeys: ["systems"],
  });

  useEffect(() => {
    if (!open) return;
    form.reset(getFormValues(updateData));
  }, [form, open, updateData]);

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (formData: ISystemsSchema) => {
    if (updateData?._id) {
      await update({ formData, id: updateData._id });
    } else {
      await create({ formData });
    }
    form.reset(defaultFormValues);
    onClose();
  };

  return (
    <div className="grid">
      <SheetHeader>
        <SheetTitle>{updateData ? "Editar" : "Criar"} Sistema</SheetTitle>
        <SheetDescription>
          Cadastre o sistema usado para agrupar perfis e permissões.
        </SheetDescription>
      </SheetHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          <FieldGroup>
            <FormFields.Input<ISystemsSchema>
              name="codigo"
              label="Código"
              type="number"
              placeholder="Gerado automaticamente se vazio"
            />
            <FormFields.Input<ISystemsSchema>
              name="name"
              label="Nome"
              placeholder="Digite o nome do sistema"
            />
            <FormFields.Input<ISystemsSchema>
              name="url"
              label="URL"
              placeholder="/dashboard ou https://..."
            />
            <FormFields.Input<ISystemsSchema>
              name="image"
              label="Imagem"
              placeholder="URL da imagem ou ícone"
            />
            <FormFields.Textarea<ISystemsSchema>
              name="description"
              label="Descrição"
              placeholder="Descrição curta do sistema"
            />
          </FieldGroup>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {updateData ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

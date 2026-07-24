"use client";
import { useEffect } from "react";
import { useModalInstance } from "@/hooks/use-modal-instance";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_GRUPOITEN,
  QUERIES_KEYS_GRUPOITEN,
  MUTATION_KEYS_GRUPOITEN,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { siteConfig } from "@/config/site-config";
import { FormFields } from "@/components/shared/form-fields";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  image: z.custom<File>().nullable().optional(),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getGrupoItenFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
  image: null,
});

export const FormGrupoItenModal = () => {
  const modal = useModalInstance(MODAL_KEYS_GRUPOITEN.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Grupos de Itens</SheetTitle>
          <SheetDescription>
            Gerenciamento de Grupos de Itens.
          </SheetDescription>
        </SheetHeader>
        <FormGrupoIten />
      </SheetContent>
    </Sheet>
  );
};

const FormGrupoIten = () => {
  const modal = useModalInstance(MODAL_KEYS_GRUPOITEN.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getGrupoItenFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getGrupoItenFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const existingImageUrl = modal.data?.image
    ? `${siteConfig.baseUrlFiles}/${modal.data.image}`
    : undefined;

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_GRUPOITEN.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_GRUPOITEN.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_GRUPOITEN.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_GRUPOITEN.LIST],
  });
  const onSubmit = (values: FormSchemaType) => {
    const fd = new FormData();
    fd.append("nome", values.nome);
    if (values.image instanceof File) {
      fd.append("image", values.image);
    }
    if (modal.data?._id) {
      onUpdate.mutate({ formData: fd as any, id: modal.data._id });
    } else {
      onCreate.mutate({ formData: fd as any });
    }
    form.reset(getGrupoItenFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <FormProvider {...form}>
        <form id="form-grupos-itens" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFields.Input name="nome" label="Nome" />
            <FormFields.ImageUpload
              name="image"
              label="Imagem"
              previewUrl={existingImageUrl}
              className="max-w-sm"
              helperText="Use uma imagem horizontal para melhor visualização na tabela"
              description="A imagem é opcional e será usada para identificar o grupo na listagem."
            />
          </FieldGroup>
        </form>
      </FormProvider>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getGrupoItenFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-grupos-itens">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

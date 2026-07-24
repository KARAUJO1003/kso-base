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
import { useForm, FormProvider as Form } from "react-hook-form";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_SUBGRUPOITEN,
  QUERIES_KEYS_SUBGRUPOITEN,
  MUTATION_KEYS_SUBGRUPOITEN,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { FormFields } from "@/components/shared/form-fields";
import { siteConfig } from "@/config/site-config";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  imagem: z.custom<File>().nullable().optional(),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getSubGrupoItenFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
  imagem: null,
});

export const FormSubGrupoItenModal = () => {
  const modal = useModalInstance(MODAL_KEYS_SUBGRUPOITEN.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Sub Grupo de Itens</SheetTitle>
          <SheetDescription>
            Gerenciamento de Sub Grupo de Itens.
          </SheetDescription>
        </SheetHeader>
        <FormSubGrupoIten />
      </SheetContent>
    </Sheet>
  );
};

const FormSubGrupoIten = () => {
  const modal = useModalInstance(MODAL_KEYS_SUBGRUPOITEN.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getSubGrupoItenFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getSubGrupoItenFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const existingImageUrl = modal.data?.imagem
    ? `${siteConfig.baseUrlFiles}/${modal.data.imagem}`
    : undefined;
  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_SUBGRUPOITEN.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_SUBGRUPOITEN.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_SUBGRUPOITEN.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_SUBGRUPOITEN.LIST],
  });

  const onSubmit = (values: FormSchemaType) => {
    const fd = new FormData();
    fd.append("nome", values.nome);
    if (values.imagem instanceof File) {
      fd.append("imagem", values.imagem);
    }
    if (modal.data?._id) {
      onUpdate.mutate({
        formData: fd,
        id: modal.data._id,
      });
    } else {
      onCreate.mutate({
        formData: fd,
      });
    }
    form.reset(getSubGrupoItenFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <Form {...form}>
        <form id="form-sub-grupos-itens" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFields.Input name="nome" label="Nome" placeholder="Informe o nome do sub grupo de itens" />
            <FormFields.ImageUpload
              name="imagem"
              label="Imagem"
              previewUrl={existingImageUrl}
              className="max-w-sm"
              helperText="Use uma imagem horizontal para melhor visualização na tabela"
              description="A imagem é opcional e será usada para identificar o grupo na listagem."
            />
          </FieldGroup>
        </form>
      </Form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getSubGrupoItenFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-sub-grupos-itens">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

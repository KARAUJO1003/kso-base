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
import { FormProvider as Form, useForm } from "react-hook-form";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_MOTIVOTROCA,
  QUERIES_KEYS_MOTIVOTROCA,
  MUTATION_KEYS_MOTIVOTROCA,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { FormFields } from "@/components/shared/form-fields";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getMotivoTrocaFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
});

export const FormMotivoTrocaModal = () => {
  const modal = useModalInstance(MODAL_KEYS_MOTIVOTROCA.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Motivos de Trocas</SheetTitle>
          <SheetDescription>
            Gerenciamento de Motivos de Trocas.
          </SheetDescription>
        </SheetHeader>
        <FormMotivoTroca />
      </SheetContent>
    </Sheet>
  );
};

const FormMotivoTroca = () => {
  const modal = useModalInstance(MODAL_KEYS_MOTIVOTROCA.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getMotivoTrocaFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getMotivoTrocaFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_MOTIVOTROCA.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_MOTIVOTROCA.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_MOTIVOTROCA.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_MOTIVOTROCA.LIST],
  });

  const onSubmit = (values: FormSchemaType) => {
    if (modal.data?._id) {
      onUpdate.mutate({
        formData: values,
        id: modal.data._id,
      });
    } else {
      onCreate.mutate({
        formData: values,
      });
    }
    form.reset(getMotivoTrocaFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <Form {...form}>
        <form id="form-motivos-trocas" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFields.Input name="nome" label="Nome" required autoFocus />
          </FieldGroup>
        </form>
      </Form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getMotivoTrocaFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-motivos-trocas">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

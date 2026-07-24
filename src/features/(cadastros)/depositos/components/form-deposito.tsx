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
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider as Form, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_DEPOSITO,
  QUERIES_KEYS_DEPOSITO,
  MUTATION_KEYS_DEPOSITO,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { FormFields } from "@/components/shared/form-fields";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  ativo: z.boolean(),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getDepositoFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
  ativo: data?.ativo ?? true,
});

export const FormDepositoModal = () => {
  const modal = useModalInstance(MODAL_KEYS_DEPOSITO.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Depósito</SheetTitle>
          <SheetDescription>
            Gerenciamento de Depósitos.
          </SheetDescription>
        </SheetHeader>
        <FormDeposito />
      </SheetContent>
    </Sheet>
  );
};

const FormDeposito = () => {
  const modal = useModalInstance(MODAL_KEYS_DEPOSITO.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getDepositoFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getDepositoFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_DEPOSITO.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_DEPOSITO.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_DEPOSITO.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_DEPOSITO.LIST],
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
    form.reset(getDepositoFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <Form {...form}>
        <form id="form-deposito" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFields.Input name="nome" label="Nome" placeholder="Informe o nome" />
            <FormFields.Switch name="ativo" label="Status" />
          </FieldGroup>
        </form>
      </Form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getDepositoFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-deposito">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

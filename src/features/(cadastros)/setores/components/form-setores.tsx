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
import { Controller, useForm } from "react-hook-form";
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
  MODAL_KEYS_SETOR,
  QUERIES_KEYS_SETOR,
  MUTATION_KEYS_SETOR,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  descricao: z.string().optional(),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getSetorFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
  descricao: data?.descricao || "",
});

export const FormSetorModal = () => {
  const modal = useModalInstance(MODAL_KEYS_SETOR.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Setores</SheetTitle>
          <SheetDescription>
            Gerenciamento de Setores.
          </SheetDescription>
        </SheetHeader>
        <FormSetor />
      </SheetContent>
    </Sheet>
  );
};

const FormSetor = () => {
  const modal = useModalInstance(MODAL_KEYS_SETOR.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getSetorFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getSetorFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_SETOR.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_SETOR.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_SETOR.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_SETOR.LIST],
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
    form.reset(getSetorFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <form id="form-setores" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="nome"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nome">
                  Nome
                </FieldLabel>
                <Input
                  {...field}
                  id="nome"
                  aria-invalid={fieldState.invalid}
                  placeholder={`Informe o nome`}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="descricao"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="descricao">
                  Descrição
                </FieldLabel>
                <Input
                  {...field}
                  id="descricao"
                  aria-invalid={fieldState.invalid}
                  placeholder={`Informe a descrição`}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getSetorFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-setores">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

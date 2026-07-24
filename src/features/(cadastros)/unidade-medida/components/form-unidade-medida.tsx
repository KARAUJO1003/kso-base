"use client";
import { useEffect } from "react";
import { useModalInstance } from "@/hooks/use-modal-instance";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
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
  MODAL_KEYS_UNIDADEMEDIDA,
  QUERIES_KEYS_UNIDADEMEDIDA,
  MUTATION_KEYS_UNIDADEMEDIDA,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  sigla: z.string().min(1, "Sigla deve conter no mínimo 2 caracteres"),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getUnidadeMedidaFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
  sigla: data?.sigla || "",
});

export const FormUnidadeMedidaModal = () => {
  const modal = useModalInstance(MODAL_KEYS_UNIDADEMEDIDA.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Unidade de Medida</SheetTitle>
          <SheetDescription>
            Gerenciamento de Unidade de Medida.
          </SheetDescription>
        </SheetHeader>
        <FormUnidadeMedida />
      </SheetContent>
    </Sheet>
  );
};

const FormUnidadeMedida = () => {
  const modal = useModalInstance(MODAL_KEYS_UNIDADEMEDIDA.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getUnidadeMedidaFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getUnidadeMedidaFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_UNIDADEMEDIDA.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_UNIDADEMEDIDA.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_UNIDADEMEDIDA.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_UNIDADEMEDIDA.LIST],
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
    form.reset(getUnidadeMedidaFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <form id="form-unidade-medida" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* TODO: Componete de select de loja, abilitar com permissao de admin */}
          <Controller
            name="nome"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                <Input
                  {...field}
                  id="nome"
                  aria-invalid={fieldState.invalid}
                  placeholder="Informe o nome"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="sigla"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sigla">Sigla</FieldLabel>
                <Input
                  {...field}
                  id="sigla"
                  aria-invalid={fieldState.invalid}
                  placeholder="Informe a sigla"
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
      <Field
        orientation="horizontal"
        className="flex mt-auto py-2 sticky bottom-0"
      >
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getUnidadeMedidaFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-unidade-medida">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

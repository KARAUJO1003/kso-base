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
  MODAL_KEYS_GERENCIA,
  QUERIES_KEYS_GERENCIA,
  MUTATION_KEYS_GERENCIA,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getGerenciaFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
});

export const FormGerenciaModal = () => {
  const modal = useModalInstance(MODAL_KEYS_GERENCIA.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Gerências</SheetTitle>
          <SheetDescription>
            Gerenciamento de Gerências.
          </SheetDescription>
        </SheetHeader>
        <FormGerencia />
      </SheetContent>
    </Sheet>
  );
};

const FormGerencia = () => {
  const modal = useModalInstance(MODAL_KEYS_GERENCIA.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getGerenciaFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getGerenciaFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_GERENCIA.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_GERENCIA.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_GERENCIA.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_GERENCIA.LIST],
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
    form.reset(getGerenciaFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <form id="form-gerencia" onSubmit={form.handleSubmit(onSubmit)}>
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
                  placeholder="Informe o nome"
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
          onClick={() => form.reset(getGerenciaFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-gerencia">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

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
import { FormFields } from "@/components/shared/form-fields";
import { FormProvider as Form, useForm } from "react-hook-form";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_FORMAPAGAMENTO,
  QUERIES_KEYS_FORMAPAGAMENTO,
  MUTATION_KEYS_FORMAPAGAMENTO,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const formSchema = z
  .object({
    codigo: z.string().optional(),
    nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
    descricao: z.string().optional(),
    ativo: z.boolean().default(true),
    taxa: z.boolean().default(false),
    acrescimo_percentual: z.preprocess(
      emptyToUndefined,
      z.coerce.number().min(0, "Acréscimo não pode ser negativo").optional(),
    ),
  })
  .superRefine((values, ctx) => {
    if (values.taxa && !values.acrescimo_percentual) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["acrescimo_percentual"],
        message: "Informe o percentual da taxa",
      });
    }
  });
type FormSchemaType = z.infer<typeof formSchema>;

const getFormaPagamentoFormValues = (data?: any): FormSchemaType => ({
  codigo: data?.codigo || "",
  nome: data?.nome || "",
  descricao: data?.descricao || "",
  ativo: data?.ativo ?? true,
  taxa: data?.taxa ?? false,
  acrescimo_percentual: data?.acrescimo_percentual ?? 0,
});

export const FormFormaPagamentoModal = () => {
  const modal = useModalInstance(MODAL_KEYS_FORMAPAGAMENTO.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="top-0 sticky border-b bg-popover z-10">
          <SheetTitle>Formas de Pagamento</SheetTitle>
          <SheetDescription>
            Gerenciamento de Formas de Pagamento.
          </SheetDescription>
        </SheetHeader>
        <FormFormaPagamento />
      </SheetContent>
    </Sheet>
  );
};

const FormFormaPagamento = () => {
  const modal = useModalInstance(MODAL_KEYS_FORMAPAGAMENTO.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: getFormaPagamentoFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getFormaPagamentoFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);
  const hasTaxa = form.watch("taxa");

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_FORMAPAGAMENTO.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_FORMAPAGAMENTO.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_FORMAPAGAMENTO.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_FORMAPAGAMENTO.LIST],
  });

  const onSubmit = (values: FormSchemaType) => {
    const normalizedValues = {
      ...values,
      acrescimo_percentual: values.taxa
        ? Number(values.acrescimo_percentual || 0)
        : 0,
    };
    const formData = modal.data?._id
      ? normalizedValues
      : {
        ...normalizedValues,
        codigo: undefined,
      };

    if (modal.data?._id) {
      onUpdate.mutate({
        formData,
        id: modal.data._id,
      });
    } else {
      onCreate.mutate({
        formData,
      });
    }
    form.reset(getFormaPagamentoFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <Form {...form}>
        <form id="form-formas-pagamentos" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFields.Input<FormSchemaType>
              name="codigo"
              label="Código"
              placeholder="Gerado automaticamente"
              disabled
            />
            <FormFields.Input<FormSchemaType>
              name="nome"
              label="Nome"
              placeholder="Informe o nome"
            />
            <FormFields.Input<FormSchemaType>
              name="descricao"
              label="Descrição"
              placeholder="Informe a descrição"
            />
            <FormFields.Switch<FormSchemaType>
              name="ativo"
              label="Ativo"
            />
            <FormFields.Switch<FormSchemaType>
              name="taxa"
              label="Possui taxa"
            />
            <FormFields.Input<FormSchemaType>
              name="acrescimo_percentual"
              label="Acréscimo %"
              placeholder="Informe o percentual"
              type="number"
              disabled={!hasTaxa}
            />
          </FieldGroup>
        </form>
      </Form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getFormaPagamentoFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-formas-pagamentos">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

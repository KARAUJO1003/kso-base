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
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_FORNECEDOR,
  QUERIES_KEYS_FORNECEDOR,
  MUTATION_KEYS_FORNECEDOR,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { MODULE_ROUTE as MODULE_ROUTE_PESSOA } from '@features/(cadastros)/pessoas/utils/module-utils'
import { EStatusFornecedor, IFornecedor } from "@/types/fornecedores/types";
import { FormFields } from "@/components/shared/form-fields";
import { api, ApiListResponse } from "@/lib/axios-instance";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  pessoa: z.string().optional().nullable(),
  status: z.enum(EStatusFornecedor).optional(),
  informacoes: z.string().optional(),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getFornecedorFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
  pessoa: FormFields.getReferenceId(data?.pessoa) || null,
  status: data?.status || EStatusFornecedor.ATIVO,
  informacoes: data?.informacoes || "",
});

export const FormFornecedorModal = () => {
  const modal = useModalInstance(MODAL_KEYS_FORNECEDOR.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Fornecedores</SheetTitle>
          <SheetDescription>
            Gerenciamento de Fornecedores.
          </SheetDescription>
        </SheetHeader>
        <FormFornecedor />
      </SheetContent>
    </Sheet>
  );
};

const FormFornecedor = () => {
  const modal = useModalInstance(MODAL_KEYS_FORNECEDOR.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getFornecedorFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getFornecedorFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_FORNECEDOR.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_FORNECEDOR.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_FORNECEDOR.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_FORNECEDOR.LIST],
  });

  const loadPessoas = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal }
  ) => {
    const response = await api.get<ApiListResponse<IFornecedor>>(
      MODULE_ROUTE_PESSOA,
      { signal, params: { search, limit } }
    );
    return response.data.data || [];
  };

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
    form.reset(getFornecedorFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <Form {...form}>
        <form id="form-fornecedores" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFields.Input name="nome" label="Nome" />
            <FormFields.ComboboxSelect
              name="pessoa"
              label="Pessoa"
              loadOptions={loadPessoas}
              selectedOption={modal.data?.pessoa}
              renderSelectedOption={(option) => option.nome}
              renderOption={(option) => option.nome}
              labelKey="nome"
              valueKey="_id"
              limit={10}
              placeholder="Selecione a pessoa"

            />
            <FormFields.Select
              name="status"
              label="Status"
              options={[
                { label: "Ativo", value: EStatusFornecedor.ATIVO },
                { label: "Inativo", value: EStatusFornecedor.INATIVO },
              ]}
            />
            <FormFields.Textarea name="informacoes" label="Informações" />
          </FieldGroup>
        </form>
      </Form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getFornecedorFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-fornecedores">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

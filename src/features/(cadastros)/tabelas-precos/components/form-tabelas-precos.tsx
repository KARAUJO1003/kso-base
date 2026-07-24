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
  MODAL_KEYS_TABELASPRECOS,
  QUERIES_KEYS_TABELASPRECOS,
  MUTATION_KEYS_TABELASPRECOS,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { FormFields } from "@/components/shared/form-fields";
import { EStatusTabelaPreco } from "@/types/tabelas-precos/types";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  ativo: z.enum([EStatusTabelaPreco.ATIVO, EStatusTabelaPreco.INATIVO] as const, {
    message: "Status deve ser Ativo, Inativo ou Suspenso",
  }),
  data_validade: z.string().min(2, "Data Validade deve conter no mínimo 2 caracteres"),
});
type FormSchemaType = z.infer<typeof formSchema>;

const getTabelasPrecosFormValues = (data?: any): FormSchemaType => ({
  nome: data?.nome || "",
  ativo: data?.ativo || EStatusTabelaPreco.ATIVO,
  data_validade: data?.data_validade || "",
});

export const FormTabelasPrecosModal = () => {
  const modal = useModalInstance(MODAL_KEYS_TABELASPRECOS.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Tabela de Preço</SheetTitle>
          <SheetDescription>
            Gerenciamento de Tabelas de Preço.
          </SheetDescription>
        </SheetHeader>
        <FormTabelasPrecos />
      </SheetContent>
    </Sheet>
  );
};

const FormTabelasPrecos = () => {
  const modal = useModalInstance(MODAL_KEYS_TABELASPRECOS.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getTabelasPrecosFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getTabelasPrecosFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_TABELASPRECOS.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_TABELASPRECOS.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_TABELASPRECOS.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_TABELASPRECOS.LIST],
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
    form.reset(getTabelasPrecosFormValues());
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
      <Form {...form}>
        <form id="form-tabelas-precos" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormFields.Input name="nome" label="Nome" fieldClassName="col-span-full" />
            <FormFields.Input name="data_validade" label="Data Validade" type="date" />
            <FormFields.ComboboxSelect
              name="ativo"
              label="Status"
              options={[
                { label: "Ativo", value: EStatusTabelaPreco.ATIVO },
                { label: "Inativo", value: EStatusTabelaPreco.INATIVO },
              ]}
              placeholder="Selecione o status"
            />
          </FieldGroup>
        </form>
      </Form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getTabelasPrecosFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-tabelas-precos">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

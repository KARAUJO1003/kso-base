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
import { FormProvider, useForm } from "react-hook-form";
import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import { useLoadOptions } from "@/hooks/use-load-options";
import {
  MODAL_KEYS_COLABORADOR,
  QUERIES_KEYS_COLABORADOR,
  MUTATION_KEYS_COLABORADOR,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { FormFields } from "@/components/shared/form-fields";
import { IPessoa } from "@/types/pessoas/types";
import { IGerencia } from "@/types/gerencia/types";
import { ISetor } from "@/types/setores/type";
import { ICargo } from "@/types/cargos/types";
import { ICentroCusto } from "@/types/centros-custos/types";
import { IColaborador } from "@/types/colaboradores/types";
import { MODULE_ROUTE as MODULE_ROUTE_PESSOA } from "@/features/(cadastros)/pessoas/utils/module-utils";
import { MODULE_ROUTE as MODULE_ROUTE_GERENCIA } from "@/features/(cadastros)/gerencias/utils/module-utils";
import { MODULE_ROUTE as MODULE_ROUTE_SETOR } from "@/features/(cadastros)/setores/utils/module-utils";
import { MODULE_ROUTE as MODULE_ROUTE_CARGO } from "@/features/(cadastros)/cargos/utils/module-utils";
import { MODULE_ROUTE as MODULE_ROUTE_CENTRO_CUSTO } from "@/features/(cadastros)/centros-custos/utils/module-utils";

enum EStatusColaborador {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
}

const formSchema = z.object({
  pessoa: z.string().min(1, "Pessoa é obrigatória"),
  obs: z.string().optional(),
  ativo: z.enum(EStatusColaborador).optional(),
  gerencia: z.string().min(1, "Gerência é obrigatória"),
  setor: z.string().min(1, "Setor é obrigatório"),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  centro_custo: z.string().min(1, "Centro de custo é obrigatório"),
  data_admissao: z.string().min(1, "Data de admissão é obrigatória"),
  senha: z.string().optional(),
});
type FormSchemaType = z.infer<typeof formSchema>;

type ColaboradorFormData = IColaborador & {
  centro_custo?: ICentroCusto | string;
};

const formatDateInput = (date?: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const getColaboradorFormValues = (
  data?: ColaboradorFormData,
): FormSchemaType => ({
  pessoa: FormFields.getReferenceId(data?.pessoa),
  obs: data?.obs || "",
  ativo: (data?.ativo as EStatusColaborador) || EStatusColaborador.ATIVO,
  gerencia: FormFields.getReferenceId(data?.gerencia),
  setor: FormFields.getReferenceId(data?.setor),
  cargo: FormFields.getReferenceId(data?.cargo),
  centro_custo: FormFields.getReferenceId(data?.centro_custo),
  data_admissao: formatDateInput(data?.data_admissao),
  senha: "",
});

export const FormColaboradorModal = () => {
  const modal = useModalInstance(MODAL_KEYS_COLABORADOR.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto" side="bottom">
        <SheetHeader className="top-0 sticky">
          <SheetTitle>Colaboradores</SheetTitle>
          <SheetDescription>Gerenciamento de Colaboradores.</SheetDescription>
        </SheetHeader>
        <FormColaborador />
      </SheetContent>
    </Sheet>
  );
};

const FormColaborador = () => {
  const modal = useModalInstance<ColaboradorFormData>(
    MODAL_KEYS_COLABORADOR.FORM,
  );
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getColaboradorFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getColaboradorFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  // Hooks simplificados para carregar opções
  const loadPessoas = useLoadOptions<IPessoa>({ route: MODULE_ROUTE_PESSOA });
  const loadGerencias = useLoadOptions<IGerencia>({
    route: MODULE_ROUTE_GERENCIA,
  });
  const loadSetores = useLoadOptions<ISetor>({ route: MODULE_ROUTE_SETOR });
  const loadCargos = useLoadOptions<ICargo>({ route: MODULE_ROUTE_CARGO });
  const loadCentrosCustos = useLoadOptions<ICentroCusto>({
    route: MODULE_ROUTE_CENTRO_CUSTO,
  });

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_COLABORADOR.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_COLABORADOR.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_COLABORADOR.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_COLABORADOR.LIST],
  });

  const onSubmit = (values: FormSchemaType) => {
    const formData = {
      ...values,
      senha: values.senha || undefined,
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
    form.reset(getColaboradorFormValues());
    modal.onClose();
  };

  const OPTIONS_STATUS = [
    { label: "Ativo", value: EStatusColaborador.ATIVO },
    { label: "Inativo", value: EStatusColaborador.INATIVO },
  ];

  return (
    <div className="flex flex-col gap-y-6 mx-auto px-6 h-full container">
      <FormProvider {...form}>
        <form id="form-colaboradores" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-4">
            <FormFields.AsyncCombobox<FormSchemaType, IPessoa>
              name="pessoa"
              label="Pessoa"
              placeholder="Selecione a pessoa"
              onSearch={loadPessoas}
              getOptionLabel={(opt) => opt?.nome ?? ""}
              getOptionValue={(opt) => opt?._id ?? ""}
              fieldClassName="col-span-2"
            />
            <FormFields.Select
              name="ativo"
              label="Status"
              options={OPTIONS_STATUS}
              itemToStringValue={(item: any) => item?.value}
              fieldClassName="col-span-2"
              renderOption={(option) =>
                option?.value === EStatusColaborador.ATIVO ? "Ativo" : "Inativo"
              }
            />

            <FormFields.AsyncCombobox<FormSchemaType, IGerencia>
              name="gerencia"
              label="Gerência"
              placeholder="Selecione as gerências"
              getOptionLabel={(opt) => opt?.nome ?? ""}
              getOptionValue={(opt) => opt?._id ?? ""}
              onSearch={loadGerencias}
              fieldClassName="col-span-2"
            />

            <FormFields.AsyncCombobox<FormSchemaType, ISetor>
              name="setor"
              label="Setor"
              placeholder="Selecione as setor"
              getOptionLabel={(opt) => opt?.nome ?? ""}
              getOptionValue={(opt) => opt?._id ?? ""}
              onSearch={loadSetores}
              fieldClassName="col-span-2"
            />
            <FormFields.AsyncCombobox<FormSchemaType, ICargo>
              name="cargo"
              label="Cargo"
              placeholder="Selecione o cargo"
              onSearch={loadCargos}
              getOptionLabel={(opt) => opt?.nome ?? ""}
              getOptionValue={(opt) => opt?._id ?? ""}
              fieldClassName="col-span-2"
            />
            <FormFields.AsyncCombobox<FormSchemaType, ICentroCusto>
              name="centro_custo"
              label="Centro de Custo"
              placeholder="Selecione o centro de custo"
              onSearch={loadCentrosCustos}
              getOptionLabel={(opt) => opt?.nome ?? ""}
              getOptionValue={(opt) => opt?._id ?? ""}
              fieldClassName="col-span-2"
            />
            <FormFields.Input
              type="date"
              name="data_admissao"
              label="Data de Admissão"
              fieldClassName="col-span-2"
            />
            <FormFields.Input
              name="senha"
              type="password"
              label="Senha"
              fieldClassName="col-span-2"
            />
            <FormFields.Textarea
              name="obs"
              label="Observação"
              fieldClassName="col-span-full"
            />
          </FieldGroup>
        </form>
      </FormProvider>
      <Field
        orientation="horizontal"
        className="bottom-0 sticky flex mt-auto py-2"
      >
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getColaboradorFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-colaboradores">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

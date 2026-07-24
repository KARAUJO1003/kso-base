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
import {
  MODAL_KEYS_ITEN,
  QUERIES_KEYS_ITEN,
  MUTATION_KEYS_ITEN,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { FormFields } from "@/components/shared/form-fields";

import { api, ApiListResponse } from "@/lib/axios-instance";
import { IGrupoIten } from "@/types/grupos-itens/types";
import { ETipoItem, IIten } from "@/types/itens/types";
import { IUnidadeMedida } from "@/types/unidade-medida/types";
import { IDeposito } from "@/types/deposito/types";
import { ITabelasPrecos } from "@/types/tabelas-precos/types";
import { EStatusItem } from "@/types/items/types";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useStore } from "@/contexts/store-context";
import { AuthStore } from "@/types/store";

const itemComponenteSchema = z.object({
  item: z.string().min(1, "Item é obrigatório"),
  quantidade: z.coerce
    .number()
    .min(0.0001, "Quantidade deve ser maior que zero"),
  selected_item: z.any().optional(),
});

const formSchema = z
  .object({
    nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
    codigo_barras: z.string().optional(),
    descricao: z
      .string()
      .min(2, "Descrição deve conter no mínimo 2 caracteres"),
    validade: z.string().min(2, "Validade deve conter no mínimo 2 caracteres"),
    status: z.string().min(2, "Status deve conter no mínimo 2 caracteres"),
    tipo_item: z.enum(Object.values(ETipoItem)),
    componentes: z.array(itemComponenteSchema).optional(),
    ncm: z.string().optional(),
    grupo_item: z.string().optional(),
    vida_util_mes: z.number().nullable().optional(),
    volume_venda: z.number().optional(),
    sub_grupo_item: z.string().optional(),
    volume_compra: z.number().optional(),
    unidade_venda: z.string().optional(),
    unidade_compra: z.string().optional(),
    fornecedor: z.string().optional(),
    deposito: z.string().optional(),
    loja: z.string().optional(),
    tabela_preco: z.string().optional(),
    posicao: z.string().optional(),
    estoque_minimo: z.number().nullable().optional(),
    estoque_maximo: z.number().nullable().optional(),
    estoque_seguranca: z.number().nullable().optional(),
    preco_unitario: z.number().nullable().optional(),
  })
  .superRefine((values, ctx) => {
    if (
      values.tipo_item === ETipoItem.COMPOSTO &&
      !values.componentes?.length
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Adicione ao menos um componente",
        path: ["componentes"],
      });
    }
  });
type FormSchemaType = z.infer<typeof formSchema>;

const removeEmptyValues = (values: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  ) as FormSchemaType;

const getReferenceId = (value: unknown) =>
  FormFields.getReferenceId(
    value as
      | { _id?: string; id?: string; value?: string }
      | string
      | number
      | null
      | undefined,
  );

const itemLabel = (item?: Partial<IIten> | null) =>
  item ? `${item.codigo || ""} ${item.nome || ""}`.trim() : "";

const normalizeComponentes = (item?: IIten | null) =>
  (item?.componentes || []).map((componente) => {
    const selectedItem =
      typeof componente.item === "object" ? componente.item : undefined;

    return {
      item: getReferenceId(componente.item),
      quantidade: Number(componente.quantidade || 0),
      selected_item: selectedItem,
    };
  });

const getItenFormValues = (
  data?: IIten,
  defaults?: Pick<AuthStore, "_id" | "deposito_default" | "tabela_preco_default"> | null,
): FormSchemaType => ({
  nome: data?.nome || "",
  codigo_barras: data?.codigo_barras || "",
  descricao: data?.descricao || "",
  validade: data?.validade
    ? new Date(data.validade).toISOString().split("T")[0]
    : "",
  status: data?.status || EStatusItem.ATIVO,
  tipo_item: data?.tipo_item || ETipoItem.SIMPLES,
  componentes: normalizeComponentes(data),
  ncm: data?.ncm || "",
  grupo_item: FormFields.getReferenceId(data?.grupo_item),
  vida_util_mes: data?.vida_util_mes || 0,
  sub_grupo_item: FormFields.getReferenceId(data?.sub_grupo_item),
  unidade_venda: FormFields.getReferenceId(data?.unidade_venda),
  unidade_compra: FormFields.getReferenceId(data?.unidade_compra),
  volume_venda: data?.volume_venda || 1,
  volume_compra: data?.volume_compra || 1,
  fornecedor: FormFields.getReferenceId(data?.fornecedor),
  loja: FormFields.getReferenceId(data?.loja || defaults),
  deposito: FormFields.getReferenceId(data?.deposito || defaults?.deposito_default),
  tabela_preco: FormFields.getReferenceId(
    data?.tabela_preco || defaults?.tabela_preco_default,
  ),
  posicao: data?.posicao || "",
  estoque_minimo: data?.estoque_minimo || 0,
  estoque_maximo: data?.estoque_maximo || 0,
  estoque_seguranca: data?.estoque_seguranca || 0,
  preco_unitario: data?.preco_unitario || 0,
});

export const FormItenModal = () => {
  const modal = useModalInstance(MODAL_KEYS_ITEN.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="h-[90vh] max-h-[90vh] overflow-y-auto" side="bottom">
        <div className="top-0 z-20 sticky flex bg-popover border-b w-full">
          <div className="flex justify-between items-center mx-auto container">
            <SheetHeader>
              <SheetTitle>Itens</SheetTitle>
              <SheetDescription>Gerenciamento de Itens.</SheetDescription>
            </SheetHeader>
            <Field orientation="horizontal" className="flex gap-3 w-fit">
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={() => modal.onClose()}
              >
                Fechar
              </Button>
              <Button size="lg" type="submit" form="form-itens">
                Salvar
              </Button>
            </Field>
          </div>
        </div>
        <FormIten />
      </SheetContent>
    </Sheet>
  );
};

const FormIten = () => {
  const modal = useModalInstance<IIten>(MODAL_KEYS_ITEN.FORM);
  const { selectedStore } = useStore();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: getItenFormValues(modal.data, selectedStore),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getItenFormValues(modal.data, selectedStore));
  }, [
    form,
    modal.open,
    modal.data?._id,
    selectedStore?._id,
    selectedStore?.deposito_default,
    selectedStore?.tabela_preco_default,
  ]);

  const loadGruposItens = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<IGrupoIten>>(
      "/grupos-itens",
      { signal, params: { search, limit } },
    );
    return response.data.data || [];
  };

  const loadSubGruposItens = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<IGrupoIten>>(
      "/sub-grupos-itens",
      { signal, params: { search, limit } },
    );
    return response.data.data || [];
  };

  const loadUnidadesMedidas = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<IUnidadeMedida>>(
      "/unidades-medidas",
      { signal, params: { search, limit } },
    );

    return response.data?.data || [];
  };

  const loadDepositos = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<IDeposito>>("/depositos", {
      signal,
      params: { search, limit },
    });

    return response.data?.data || [];
  };

  const loadTabelasPrecos = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<ITabelasPrecos>>(
      "/tabela-precos",
      { signal, params: { search, limit } },
    );

    return response.data?.data || [];
  };

  const loadItensSimples = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<IIten>>("/itens", {
      signal,
      params: { search, limit },
    });

    return (response.data?.data || []).filter(
      (item) =>
        item.tipo_item !== ETipoItem.COMPOSTO && item._id !== modal.data?._id,
    );
  };

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_ITEN.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_ITEN.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_ITEN.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_ITEN.LIST],
  });

  const onSubmit = (values: FormSchemaType) => {
    const formData = removeEmptyValues({
      ...values,
      componentes:
        values.tipo_item === ETipoItem.COMPOSTO
          ? (values.componentes || []).map((componente) => ({
              item: componente.item,
              quantidade: Number(componente.quantidade || 0),
            }))
          : [],
    });

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
    form.reset(getItenFormValues(undefined, selectedStore));
    modal.onClose();
  };

  const tipoItem = form.watch("tipo_item");
  const componentes = form.watch("componentes") || [];

  const addComponente = () => {
    form.setValue(
      "componentes",
      [...componentes, { item: "", quantidade: 1, selected_item: undefined }],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const removeComponente = (index: number) => {
    form.setValue(
      "componentes",
      componentes.filter((_, componenteIndex) => componenteIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <div className="flex flex-col gap-y-6 pb-10 px-6 h-full container mx-auto">
      <FormProvider {...form}>
        <form id="form-itens" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormFields.Input name="nome" label="Nome" />
            <FormFields.Input
              name="codigo_barras"
              label="Código de barras/QR"
              placeholder="Escaneie ou digite o código"
              fieldClassName="lg:col-span-2"
            />
            <FormFields.Textarea
              name="descricao"
              label="Descrição"
              fieldClassName="sm:col-span-2 lg:col-span-3"
            />

            <FormFields.Select
              name="status"
              label="Status"
              options={[
                { label: "Ativo", value: EStatusItem.ATIVO },
                { label: "Inativo", value: EStatusItem.INATIVO },
                { label: "Suspenso", value: EStatusItem.SUSPENSO },
              ]}
            />
            <FormFields.Select
              name="tipo_item"
              label="Tipo do Item"
              options={[
                { label: "Simples", value: ETipoItem.SIMPLES },
                { label: "Composto", value: ETipoItem.COMPOSTO },
              ]}
            />
            <FormFields.Input name="validade" label="Validade" type="date" />
            <FormFields.Input
              name="vida_util_mes"
              label="Vida Útil (meses)"
              type="number"
            />

            <FormFields.Autocomplete<any, IGrupoIten>
              name="grupo_item"
              label="Grupo de Itens"
              loadOptions={loadGruposItens}
              selectedOption={modal.data?.grupo_item as any}
              renderOption={(option) => option.nome}
              getOptionLabel={(option) => option?.nome || ""}
              getOptionValue={(option) => option?._id || ""}
              placeholder="Selecione o grupo de itens"
              openOnInputClick
            />

            <FormFields.Autocomplete<any, IGrupoIten>
              name="sub_grupo_item"
              label="Subgrupo de Itens"
              loadOptions={loadSubGruposItens}
              selectedOption={modal.data?.sub_grupo_item as any}
              renderOption={(option) => option.nome}
              getOptionLabel={(option) => option?.nome || ""}
              getOptionValue={(option) => option?._id || ""}
              limit={10}
              placeholder="Selecione o subgrupo de itens"
              openOnInputClick
            />

            <FormFields.Number name="volume_compra" label="Volume de Compra" />
            <FormFields.Autocomplete<any, IUnidadeMedida>
              name="unidade_compra"
              label="Unidade de Compra"
              loadOptions={loadUnidadesMedidas}
              selectedOption={modal.data?.unidade_compra as any}
              renderOption={(option) => `${option.codigo} ${option.nome}`}
              getOptionLabel={(option) => option?.nome || ""}
              getOptionValue={(option) => option?._id || ""}
              limit={10}
              placeholder="Selecione a unidade"
              openOnInputClick
            />

            <FormFields.Number name="volume_venda" label="Volume de Venda" />

            <FormFields.Autocomplete<any, IUnidadeMedida>
              name="unidade_venda"
              label="Unidade de Venda"
              loadOptions={loadUnidadesMedidas}
              selectedOption={modal.data?.unidade_venda as any}
              renderOption={(option) => `${option.codigo} ${option.nome}`}
              getOptionLabel={(option) => option?.nome || ""}
              getOptionValue={(option) => option?._id || ""}
              placeholder="Selecione a unidade"
              openOnInputClick
            />

            <FormFields.Autocomplete<any, ITabelasPrecos>
              name="tabela_preco"
              label="Tabela de Preço"
              loadOptions={loadTabelasPrecos}
              selectedOption={
                (modal.data?.tabela_preco ||
                  selectedStore?.tabela_preco_default) as any
              }
              renderOption={(option) => `${option.codigo} ${option.nome}`}
              placeholder="Selecione a tabela de preço"
              openOnInputClick
            />

            <FormFields.Autocomplete<any, IDeposito>
              name="deposito"
              label="Depósito"
              loadOptions={loadDepositos}
              selectedOption={
                (modal.data?.deposito || selectedStore?.deposito_default) as any
              }
              renderOption={(option) => `${option.codigo} ${option.nome}`}
              placeholder="Selecione o depósito"
              openOnInputClick
            />

            <FormFields.Input name="posicao" label="Posição" type="text" />

            <FormFields.Input
              name="preco_unitario"
              label="Preço Unitário"
              type="number"
              prefix="R$"
              currency
            />
            <FormFields.Number
              name="estoque_minimo"
              label="Estoque Mínimo"
            />
            <FormFields.Number
              name="estoque_maximo"
              label="Estoque Máximo"
            />
            <FormFields.Number
              name="estoque_seguranca"
              label="Estoque de Segurança"
              fieldClassName="sm:col-span-2 lg:col-span-2"
            />

            {tipoItem === "composto" && (
              <Field className="sm:col-span-2 lg:col-span-3 rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">Componentes</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addComponente}
                  >
                    <PlusIcon data-icon="inline-center" />
                    Adicionar
                  </Button>
                </div>
                <div className="grid gap-3">
                  {componentes.map((componente, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-end gap-3"
                    >
                      <FormFields.Autocomplete<FormSchemaType, IIten>
                        name={`componentes.${index}.item` as any}
                        label="Item"
                        loadOptions={loadItensSimples}
                        selectedOption={componente.selected_item}
                        renderOption={(option) => itemLabel(option)}
                        getOptionLabel={(option) => option?.nome || ""}
                        getOptionValue={(option) => option?._id || ""}
                        placeholder="Selecione o item"
                        fieldClassName="flex-1"
                        onValueChange={(value, option) => {
                          form.setValue(
                            `componentes.${index}.item` as any,
                            value,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          );
                          form.setValue(
                            `componentes.${index}.selected_item` as any,
                            option,
                            {
                              shouldDirty: true,
                            },
                          );
                        }}
                        openOnInputClick
                      />
                      <FormFields.Input
                        name={`componentes.${index}.quantidade` as any}
                        label="Quantidade"
                        type="number"
                        step="0.0001"
                        fieldClassName="sm:w-40"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeComponente(index)}
                      >
                        <Trash2Icon />
                        <span className="sr-only">Remover componente</span>
                      </Button>
                    </div>
                  ))}
                  {!componentes.length && (
                    <div className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                      Nenhum componente adicionado.
                    </div>
                  )}
                </div>
                {form.formState.errors.componentes?.message && (
                  <p className="mt-2 text-sm text-destructive">
                    {form.formState.errors.componentes.message}
                  </p>
                )}
              </Field>
            )}
          </FieldGroup>
        </form>
      </FormProvider>
    </div>
  );
};

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
import { Controller, FormProvider, useForm } from "react-hook-form";
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
  MODAL_KEYS_LOJA,
  QUERIES_KEYS_LOJA,
  MUTATION_KEYS_LOJA,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import { useStore } from "@/contexts/store-context";
import { ILoja, StatusLoja, TipoLoja } from "@/types/lojas/types";
import { FormFields } from "@/components/shared/form-fields";
import { api, ApiListResponse } from "@/lib/axios-instance";
import { IDeposito } from "@/types/deposito/types";
import { ITabelasPrecos } from "@/types/tabelas-precos/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MUTATION_KEYS_TABELASPRECOS,
  QUERIES_KEYS_TABELASPRECOS,
} from "../../tabelas-precos/utils/constants";
import {
  MUTATION_KEYS_DEPOSITO,
  QUERIES_KEYS_DEPOSITO,
} from "../../depositos/utils/constants";
import { buildLojaFormData } from "../utils/loja-branding-form";
import { resolveAssetUrl } from "@/lib/asset-url";
import { siteConfig } from "@/config/site-config";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Informe uma cor hexadecimal válida");

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve conter no mínimo 2 caracteres"),
  sigla: z.string().min(2, "Sigla deve conter no mínimo 2 caracteres"),
  tipo: z.enum(TipoLoja).optional(),
  status: z.enum(StatusLoja).optional(),
  loja_grupo: z.string().optional(),
  deposito_default: z.string().optional(),
  tabela_preco_default: z.string().optional(),
  cor_primaria: hexColorSchema,
  cor_secundaria: hexColorSchema,
  cor_contraste: hexColorSchema,
  logo: z.custom<File>().nullable().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const getLojaFormValues = (data?: ILoja): FormSchemaType => ({
  nome: data?.nome || "",
  sigla: data?.sigla || "",
  status: data?.status || StatusLoja.ATIVO,
  deposito_default: FormFields.getReferenceId(data?.deposito_default),
  tabela_preco_default: FormFields.getReferenceId(data?.tabela_preco_default),
  cor_primaria: data?.branding?.cor_primaria || "#D8142A",
  cor_secundaria: data?.branding?.cor_secundaria || "#FDE8EC",
  cor_contraste: data?.branding?.cor_contraste || "#FFFFFF",
  logo: null,
});

export const FormLojaModal = () => {
  const modal = useModalInstance<ILoja>(MODAL_KEYS_LOJA.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={(open) => modal.onOpenChange(open)}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0">
          <SheetTitle>Lojas</SheetTitle>
          <SheetDescription>Gerenciamento de lojas e identidade visual.</SheetDescription>
        </SheetHeader>
        <FormLoja />
      </SheetContent>
    </Sheet>
  );
};

const FormLoja = () => {
  const { QUERY_KEY } = useStore();
  const modal = useModalInstance<ILoja>(MODAL_KEYS_LOJA.FORM);
  const lojaId = modal.data?._id;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: getLojaFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getLojaFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const loadDepositos = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<IDeposito>>("/depositos", {
      signal,
      params: { search, limit, ...(lojaId ? { loja: lojaId } : {}) },
    });

    return response.data?.data || [];
  };

  const loadTabelasPrecos = async (
    search: string,
    { limit, signal }: { limit: number; signal: AbortSignal },
  ) => {
    const response = await api.get<ApiListResponse<ITabelasPrecos>>(
      "/tabela-precos",
      {
        signal,
        params: { search, limit, ...(lojaId ? { loja: lojaId } : {}) },
      },
    );

    return response.data?.data || [];
  };

  const onCreateDeposito = useCreate({
    mutationKey: [QUERIES_KEYS_DEPOSITO.LIST, MUTATION_KEYS_DEPOSITO.CREATE],
    route: "/depositos",
    queryInvalidationKeys: [QUERIES_KEYS_LOJA.LIST, QUERY_KEY[0]],
  });

  const onCreateTabelaPreco = useCreate({
    mutationKey: [
      QUERIES_KEYS_TABELASPRECOS.LIST,
      MUTATION_KEYS_TABELASPRECOS.CREATE,
    ],
    route: "/tabela-precos",
    queryInvalidationKeys: [QUERIES_KEYS_LOJA.LIST, QUERY_KEY[0]],
  });

  const onCreate = useCreate<FormData>({
    mutationKey: [MUTATION_KEYS_LOJA.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_LOJA.LIST, QUERY_KEY[0]],
  });

  const onUpdate = useUpdate<FormData>({
    mutationKey: [MUTATION_KEYS_LOJA.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_LOJA.LIST, QUERY_KEY[0]],
  });

  const onSubmit = (values: FormSchemaType) => {
    const formData = buildLojaFormData(values);

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

    form.reset(getLojaFormValues());
    modal.onClose();
  };

  const primaryColor = form.watch("cor_primaria");
  const secondaryColor = form.watch("cor_secundaria");
  const contrastColor = form.watch("cor_contraste");

  return (
    <div className="flex h-full flex-col gap-y-6 px-6">
      <FormProvider {...form}>
        <form id="form-lojas" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field key={field.value} data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    {...field}
                    name="status"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={StatusLoja.ATIVO}>Ativo</SelectItem>
                      <SelectItem value={StatusLoja.INATIVO}>
                        Inativo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <FormFields.ComboboxSelect<FormSchemaType, IDeposito>
              name="deposito_default"
              label="Depósito Padrão"
              loadOptions={loadDepositos}
              selectedOption={modal.data?.deposito_default}
              renderSelectedOption={(option) =>
                `${option.codigo} ${option.nome}`.trim()
              }
              renderOption={(option) => `${option.codigo} ${option.nome}`.trim()}
              labelKey="nome"
              valueKey="_id"
              limit={10}
              placeholder="Selecione o depósito padrão"
              onCreateOption={(search) => {
                onCreateDeposito.mutate({
                  formData: { nome: search, loja: lojaId },
                });
              }}
              renderCreateOption={(search) => `Criar "${search}"`}
              creatingMessage="Criando depósito..."
            />
            <FormFields.ComboboxSelect<FormSchemaType, ITabelasPrecos>
              name="tabela_preco_default"
              label="Tabela de Preço Padrão"
              loadOptions={loadTabelasPrecos}
              selectedOption={modal.data?.tabela_preco_default}
              renderSelectedOption={(option) =>
                `${option.codigo} ${option.nome}`.trim()
              }
              renderOption={(option) => `${option.codigo} ${option.nome}`.trim()}
              labelKey="nome"
              valueKey="_id"
              limit={10}
              placeholder="Selecione a tabela de preço padrão"
              onCreateOption={(search) => {
                onCreateTabelaPreco.mutate({
                  formData: { nome: search, loja: lojaId },
                });
              }}
              renderCreateOption={(search) => `Criar "${search}"`}
              creatingMessage="Criando tabela de preço..."
            />

            <div className="grid gap-4 rounded-lg border p-4">
              <div>
                <h3 className="text-sm font-medium">Identidade visual</h3>
                <p className="text-xs text-muted-foreground">
                  Essas configurações serão aplicadas quando a loja estiver
                  selecionada.
                </p>
              </div>

              <FormFields.ImageUpload
                name="logo"
                label="Logo"
                previewUrl={resolveAssetUrl(
                  modal.data?.branding?.logo_url,
                  siteConfig.baseUrlFiles,
                )}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                maxSizeMB={5}
                helperText="PNG, JPG, WEBP ou SVG"
                description="Prefira uma imagem horizontal ou quadrada com fundo transparente."
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <FormFields.Input
                  name="cor_primaria"
                  label="Cor primária"
                  type="color"
                  className="h-11 p-1"
                />
                <FormFields.Input
                  name="cor_secundaria"
                  label="Cor secundária"
                  type="color"
                  className="h-11 p-1"
                />
                <FormFields.Input
                  name="cor_contraste"
                  label="Cor de contraste"
                  type="color"
                  className="h-11 p-1"
                />
              </div>

              <div
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
                style={{
                  backgroundColor: secondaryColor,
                  borderColor: primaryColor,
                  color: primaryColor,
                }}
              >
                <div>
                  <p className="text-sm font-semibold">Prévia da paleta</p>
                  <p className="text-xs opacity-80">{modal.data?.nome || "Loja"}</p>
                </div>
                <span
                  className="rounded-md px-3 py-2 text-xs font-medium"
                  style={{
                    backgroundColor: primaryColor,
                    color: contrastColor,
                  }}
                >
                  Ação principal
                </span>
              </div>
            </div>
          </FieldGroup>
        </form>
      </FormProvider>
      <Field
        orientation="horizontal"
        className="sticky bottom-0 mt-auto flex py-2"
      >
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset(getLojaFormValues())}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-lojas">
          Salvar
        </Button>
      </Field>
    </div>
  );
};

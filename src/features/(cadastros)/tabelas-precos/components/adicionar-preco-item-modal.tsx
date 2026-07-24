"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { BadgeDollarSignIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { FormFields } from "@/components/shared/form-fields";
import { useCreate, useFetch } from "@/hooks/use-crud";
import { useLoadOptions } from "@/hooks/use-load-options";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { IIten, IItemPreco } from "@/types/itens/types";
import { ITabelasPrecos } from "@/types/tabelas-precos/types";
import { QUERIES_KEYS_ITEN } from "@/features/(cadastros)/itens/utils/constants";
import {
  MODAL_KEYS_TABELASPRECOS,
  MUTATION_KEYS_TABELASPRECOS,
  QUERIES_KEYS_TABELASPRECOS,
} from "../utils/constants";

const formSchema = z.object({
  item: z.string().min(1, "Item é obrigatório"),
  venda: z.coerce.number().min(0, "Preço de venda deve ser maior ou igual a zero"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const defaultFormValues: FormSchemaType = {
  item: "",
  venda: 0,
};

const formatItemLabel = (item?: Partial<IIten> | null) =>
  item
    ? [item.codigo, item.codigo_barras ? `[${item.codigo_barras}]` : "", item.nome]
        .filter(Boolean)
        .join(" ")
    : "";

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));

const itemPrecoLabel = (preco: IItemPreco) =>
  typeof preco.item === "object" ? formatItemLabel(preco.item) : "-";

export const AdicionarPrecoItemModal = () => {
  const modal = useModalInstance<ITabelasPrecos>(
    MODAL_KEYS_TABELASPRECOS.PRICE_ITEM,
  );

  return (
    <Dialog
      open={modal.open}
      onOpenChange={(open) => {
        if (open) {
          modal.onOpen(modal.data);
          return;
        }
        modal.onClose();
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeDollarSignIcon className="size-5" />
            Adicionar preço de item
          </DialogTitle>
          <DialogDescription>
            {modal.data
              ? `Tabela: ${modal.data.codigo || ""} ${modal.data.nome || ""}`.trim()
              : "Selecione um item e informe o preço de venda."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <FormAdicionarPrecoItem />
          <ListaPrecosItens />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={modal.onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="form-adicionar-preco-item">
            Salvar preço
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FormAdicionarPrecoItem = () => {
  const modal = useModalInstance<ITabelasPrecos>(
    MODAL_KEYS_TABELASPRECOS.PRICE_ITEM,
  );
  const loadItens = useLoadOptions<IIten>({ route: "/itens" });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: defaultFormValues,
  });

  const onUpsert = useCreate({
    mutationKey: [MUTATION_KEYS_TABELASPRECOS.UPSERT_PRICE_ITEM],
    route: "item-precos/upsert",
    queryInvalidationKeys: [
      QUERIES_KEYS_TABELASPRECOS.ITEM_PRECOS,
      QUERIES_KEYS_TABELASPRECOS.LIST,
      QUERIES_KEYS_ITEN.LIST,
    ],
    onSuccess: () => {
      form.reset(defaultFormValues);
    },
  });

  const onSubmit = (values: FormSchemaType) => {
    if (!modal.data?._id) return;

    onUpsert.mutate({
      formData: {
        item: values.item,
        tabela_preco: modal.data._id,
        venda: values.venda,
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form id="form-adicionar-preco-item" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormFields.Autocomplete<FormSchemaType, IIten>
            name="item"
            label="Item"
            loadOptions={loadItens}
            renderOption={(option) => formatItemLabel(option)}
            getOptionLabel={(option) => formatItemLabel(option)}
            getOptionValue={(option) => option._id || ""}
            placeholder="Selecione o item"
            preloadOptionsOnOpen
            openOnInputClick
          />
          <FormFields.Input
            name="venda"
            label="Preço de venda"
            currency
            prefix="R$"
          />
        </FieldGroup>
      </form>
    </FormProvider>
  );
};

const ListaPrecosItens = () => {
  const modal = useModalInstance<ITabelasPrecos>(
    MODAL_KEYS_TABELASPRECOS.PRICE_ITEM,
  );
  const tabelaPrecoId = modal.data?._id;
  const { data = [], isPending } = useFetch<IItemPreco[]>({
    queryKey: [QUERIES_KEYS_TABELASPRECOS.ITEM_PRECOS, tabelaPrecoId],
    route: "item-precos",
    enabled: Boolean(tabelaPrecoId),
    config: {
      params: {
        tabela_preco: tabelaPrecoId,
        limit: 100,
      },
    },
  });

  return (
    <section className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-medium text-sm">Itens cadastrados nesta tabela</h3>
        <span className="text-muted-foreground text-xs">
          {isPending ? "Carregando..." : `${data.length} item(ns)`}
        </span>
      </div>
      <div className="max-h-72 overflow-auto">
        {data.length ? (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background text-muted-foreground">
              <tr className="[&>th]:px-4 [&>th]:py-2 [&>th]:text-left">
                <th>Item</th>
                <th className="w-36">Preço</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((preco) => (
                <tr key={preco._id} className="[&>td]:px-4 [&>td]:py-2">
                  <td className="font-medium">{itemPrecoLabel(preco)}</td>
                  <td>{formatCurrency(preco.venda)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            {isPending
              ? "Carregando itens..."
              : "Nenhum item cadastrado para esta tabela."}
          </div>
        )}
      </div>
    </section>
  );
};

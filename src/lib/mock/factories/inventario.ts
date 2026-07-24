import { faker, fakeId, fakeTimestamps, pickOne, maybe, sequentialCodigo } from "./helpers";
import type { IUnidadeMedida } from "@/types/unidade-medida/types";
import type { ILoja } from "@/types/lojas/types";
import type { IGrupoIten } from "@/types/grupos-itens/types";
import type { ISubGrupoIten } from "@/types/sub-grupos-itens/types";
import type { IDeposito } from "@/types/deposito/types";
import type { ITabelasPrecos } from "@/types/tabelas-precos/types";
import { EStatusTabelaPreco } from "@/types/tabelas-precos/types";
import type { IFormaPagamento } from "@/types/formas-pagamentos/types";
import type { IMotivoTroca } from "@/types/motivos-trocas/types";
import type { IFornecedor } from "@/types/fornecedores/types";
import { ETipoItem, IIten } from "@/types/itens/types";
import { EStatusItem } from "@/types/items/types";

export function createUnidadeMedida(index: number, lojas: ILoja[]): IUnidadeMedida {
  const [nome, sigla] = faker.helpers.arrayElement([
    ["Unidade", "UN"],
    ["Caixa", "CX"],
    ["Quilograma", "KG"],
    ["Litro", "LT"],
    ["Metro", "MT"],
    ["Par", "PR"],
  ]);
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("UM", index),
    loja: pickOne(lojas),
    nome,
    sigla,
    ...fakeTimestamps(),
  };
}

export function createGrupoItem(index: number): IGrupoIten {
  const nome = faker.helpers.arrayElement([
    "Bebidas",
    "Alimentos",
    "Limpeza",
    "Higiene",
    "Eletrônicos",
    "Vestuário",
    "Papelaria",
  ]);
  return {
    _id: fakeId(),
    nome: `${nome} ${index + 1}`,
    avatar: faker.image.urlPicsumPhotos({ width: 64, height: 64 }),
    ...fakeTimestamps(),
  };
}

export function createSubGrupoItem(index: number): ISubGrupoIten {
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("SGI", index),
    nome: `${faker.commerce.department()} ${index + 1}`,
    ...fakeTimestamps(),
  };
}

export function createDeposito(index: number): IDeposito {
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("DEP", index),
    nome: `Depósito ${faker.location.city()}`,
    ativo: "true",
    ...fakeTimestamps(),
  };
}

export function createTabelaPreco(index: number): ITabelasPrecos {
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("TP", index),
    nome: faker.helpers.arrayElement([
      "Tabela Padrão",
      "Tabela Atacado",
      "Tabela Varejo",
      "Tabela Promocional",
      "Tabela E-commerce",
    ]),
    ativo: faker.helpers.arrayElement([
      EStatusTabelaPreco.ATIVO,
      EStatusTabelaPreco.INATIVO,
    ]),
    data_validade: faker.date.future({ years: 1 }).toISOString(),
    ...fakeTimestamps(),
  };
}

export function createFormaPagamento(index: number): IFormaPagamento {
  const nome = faker.helpers.arrayElement([
    "Dinheiro",
    "PIX",
    "Cartão de Crédito",
    "Cartão de Débito",
    "Boleto",
    "Transferência",
  ]);
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("FP", index),
    nome,
    descricao: `Pagamento via ${nome.toLowerCase()}`,
    ativo: true,
    taxa: faker.datatype.boolean(),
    acrescimo_percentual: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
    ...fakeTimestamps(),
  };
}

export function createMotivoTroca(index: number): IMotivoTroca {
  const nome = faker.helpers.arrayElement([
    "Produto com defeito",
    "Tamanho incorreto",
    "Arrependimento",
    "Produto errado enviado",
    "Não gostou",
  ]);
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("MT", index),
    nome: `${nome}`,
    ...fakeTimestamps(),
  };
}

export function createItem(
  index: number,
  ctx: {
    gruposItens: IGrupoIten[];
    unidadesMedida: IUnidadeMedida[];
    depositos: IDeposito[];
    lojas: ILoja[];
    tabelasPrecos: ITabelasPrecos[];
    fornecedores: IFornecedor[];
  },
): IIten {
  const nome = faker.commerce.productName();
  const compra = faker.number.float({ min: 5, max: 300, fractionDigits: 2 });
  const margem = faker.number.float({ min: 1.2, max: 2.5, fractionDigits: 2 });
  const venda = Number((compra * margem).toFixed(2));

  return {
    _id: fakeId(),
    codigo: sequentialCodigo("ITM", index, 5),
    codigo_barras: faker.string.numeric(13),
    nome,
    descricao: faker.commerce.productDescription(),
    tipo_item: ETipoItem.SIMPLES,
    unidade_compra: pickOne(ctx.unidadesMedida)._id,
    unidade_venda: pickOne(ctx.unidadesMedida)._id,
    fornecedor: maybe(
      { _id: pickOne(ctx.fornecedores)._id, nome: pickOne(ctx.fornecedores).nome },
      0.8,
    ),
    loja: pickOne(ctx.lojas)._id,
    grupo_item: pickOne(ctx.gruposItens),
    deposito: pickOne(ctx.depositos),
    tabela_preco: pickOne(ctx.tabelasPrecos),
    item_preco: {
      _id: fakeId(),
      compra,
      custo: compra,
      venda,
      venda_vista: venda,
      venda_prazo: Number((venda * 1.05).toFixed(2)),
    },
    item_estoque: {
      _id: fakeId(),
      estoque: faker.number.int({ min: 0, max: 500 }),
      disponivel: faker.number.int({ min: 0, max: 500 }),
      minimo: faker.number.int({ min: 5, max: 20 }),
      maximo: faker.number.int({ min: 100, max: 800 }),
    },
    ncm: faker.string.numeric(8),
    preco_unitario: venda,
    status: faker.helpers.arrayElement([
      EStatusItem.ATIVO,
      EStatusItem.ATIVO,
      EStatusItem.ATIVO,
      EStatusItem.INATIVO,
      EStatusItem.SUSPENSO,
    ]),
    ...fakeTimestamps(),
  };
}

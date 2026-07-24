import { faker, fakeId, fakeTimestamps, pickOne, sequentialCodigo, maybe } from "./helpers";
import type { IPessoa } from "@/types/pessoas/types";
import type { ILoja } from "@/types/lojas/types";
import { TipoLoja, StatusLoja } from "@/types/lojas/types";
import type { IGrupoLoja } from "@/types/grupos-lojas/types";
import type { ISetor } from "@/types/setores/type";
import type { IGerencia } from "@/types/gerencia/types";
import type { ICargo } from "@/types/cargos/types";
import type { IColaborador } from "@/types/colaboradores/types";
import type { ICentroCusto } from "@/types/centros-custos/types";
import type { IFornecedor } from "@/types/fornecedores/types";
import { EStatusFornecedor } from "@/types/fornecedores/types";

export function createPessoa(index: number): IPessoa {
  const tipo = faker.helpers.arrayElement(["FISICA", "JURIDICA"] as const);
  const isPJ = tipo === "JURIDICA";
  const nome = isPJ ? faker.company.name() : faker.person.fullName();

  return {
    _id: fakeId(),
    id_seq: index + 1,
    tipo,
    nome,
    apelido: isPJ ? undefined : faker.person.firstName(),
    cpf_cnpj: isPJ ? faker.string.numeric(14) : faker.string.numeric(11),
    estado_civil: isPJ
      ? undefined
      : faker.helpers.arrayElement([
          "SOLTEIRO",
          "CASADO",
          "DIVORCIADO",
          "VIUVO",
          "UNIAO_ESTAVEL",
        ] as const),
    casa_propria: isPJ ? undefined : faker.datatype.boolean(),
    escolaridade: isPJ
      ? undefined
      : faker.helpers.arrayElement([
          "Ensino Médio",
          "Ensino Superior",
          "Pós-graduação",
        ]),
    sexo: isPJ ? undefined : faker.helpers.arrayElement(["M", "F"]),
    razao_social: isPJ ? `${nome} LTDA` : undefined,
    nome_fantasia: isPJ ? nome : undefined,
    inscricao_estadual: isPJ ? faker.string.numeric(9) : undefined,
    contatos_pessoa: [
      {
        _id: fakeId(),
        id_seq: 1,
        nome,
        setor: isPJ ? "Comercial" : undefined,
        email: faker.internet.email({ firstName: nome.split(" ")[0] }).toLowerCase(),
        telefone: faker.phone.number({ style: "national" }),
        celular: faker.phone.number({ style: "national" }),
        isPrincipal: true,
      },
    ],
    enderecos_pessoa: [
      {
        _id: fakeId(),
        id_seq: 1,
        identificacao: "Principal",
        cep: faker.location.zipCode("#####-###"),
        logradouro: faker.location.street(),
        numero: faker.location.buildingNumber(),
        bairro: faker.location.county(),
        cidade: faker.location.city(),
        estado: faker.location.state({ abbreviated: true }),
        isPrincipal: true,
      },
    ],
    ...fakeTimestamps(),
  };
}

export function createGrupoLoja(index: number): IGrupoLoja {
  const nome = faker.helpers.arrayElement([
    "Região Sul",
    "Região Sudeste",
    "Região Nordeste",
    "Franquias",
    "Lojas Próprias",
  ]);
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("GL", index),
    nome: `${nome} ${index + 1}`,
    ...fakeTimestamps(),
  };
}

export function createGerencia(index: number): IGerencia {
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("GER", index),
    nome: faker.helpers.arrayElement([
      "Gerência Comercial",
      "Gerência Operações",
      "Gerência Financeira",
      "Gerência de Pessoas",
      "Gerência de TI",
    ]),
    ...fakeTimestamps(),
  };
}

export function createCargo(index: number): ICargo {
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("CAR", index),
    nome: faker.person.jobTitle(),
    ...fakeTimestamps(),
  };
}

export function createCentroCusto(index: number): ICentroCusto {
  const nome = faker.helpers.arrayElement([
    "Administrativo",
    "Comercial",
    "Logística",
    "Marketing",
    "TI",
  ]);
  return {
    _id: fakeId(),
    nome: `${nome} ${index + 1}`,
    descricao: `Centro de custo — ${nome}`,
    ...fakeTimestamps(),
  };
}

export function createLoja(index: number, gruposLojas: IGrupoLoja[]): ILoja {
  const cidade = faker.location.city();
  return {
    _id: fakeId(),
    pessoa: null,
    nome: `Loja ${cidade}`,
    tipo: index === 0 ? TipoLoja.MATRIZ : TipoLoja.FILIAL,
    sigla: cidade.slice(0, 3).toUpperCase(),
    status: StatusLoja.ATIVO,
    loja_grupo: maybe(pickOne(gruposLojas)?._id, 0.8) ?? null,
    deposito_default: null,
    tabela_preco_default: null,
    updated_by: null,
    created_by: "seed",
    codigo: sequentialCodigo("LJ", index, 3),
    branding: {
      cor_primaria: faker.color.rgb(),
      cor_secundaria: faker.color.rgb(),
      cor_contraste: "#FFFFFF",
    },
    ...fakeTimestamps(),
  };
}

export function createSetor(index: number, lojas: ILoja[]): ISetor {
  const nome = faker.helpers.arrayElement([
    "Recepção",
    "Estoque",
    "Vendas",
    "Caixa",
    "Retaguarda",
  ]);
  return {
    _id: fakeId(),
    loja: pickOne(lojas),
    codigo: sequentialCodigo("SET", index),
    nome: `${nome} ${index + 1}`,
    descricao: `Setor de ${nome.toLowerCase()}`,
    ...fakeTimestamps(),
  };
}

export function createColaborador(
  index: number,
  ctx: {
    pessoas: IPessoa[];
    gerencias: IGerencia[];
    setores: ISetor[];
    cargos: ICargo[];
    centrosCusto: ICentroCusto[];
  },
): IColaborador {
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("COL", index),
    pessoa: pickOne(ctx.pessoas),
    obs: maybe(faker.lorem.sentence(), 0.3) ?? "",
    ativo: faker.helpers.arrayElement(["true", "false"]),
    gerencia: pickOne(ctx.gerencias),
    setor: pickOne(ctx.setores),
    cargo: pickOne(ctx.cargos),
    centro_custo: maybe(pickOne(ctx.centrosCusto), 0.7),
    data_admissao: faker.date.past({ years: 5 }).toISOString(),
    ...fakeTimestamps(),
  };
}

export function createFornecedor(
  index: number,
  ctx: { pessoas: IPessoa[]; lojas: ILoja[] },
): IFornecedor {
  return {
    _id: fakeId(),
    codigo: sequentialCodigo("FOR", index),
    pessoa: pickOne(ctx.pessoas),
    nome: faker.company.name(),
    status: faker.helpers.arrayElement([
      EStatusFornecedor.ATIVO,
      EStatusFornecedor.INATIVO,
    ]),
    loja: pickOne(ctx.lojas),
    ...fakeTimestamps(),
  };
}

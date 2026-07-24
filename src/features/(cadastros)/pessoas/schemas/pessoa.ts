import { z } from "zod";

const errorRequired = "Campo obrigatório";

export enum ETipoPessoa {
  FISICA = "FISICA",
  JURIDICA = "JURIDICA",
  ESTRANGEIRA = "ESTRANGEIRA",
  GOVERNO = "GOVERNO",
}

export enum EEstadoCivil {
  SOLTEIRO = "SOLTEIRO",
  CASADO = "CASADO",
  DIVORCIADO = "DIVORCIADO",
  VIUVO = "VIUVO",
  SEPARADO = "SEPARADO",
  UNIAO_ESTAVEL = "UNIAO_ESTAVEL",
}

export const formEndereco = z.object({
  _id: z.string().optional(),
  id_seq: z.number().optional(),
  identificacao: z.string({ error: errorRequired }),
  cep: z.string().min(8).max(9, {
    message: "CEP é obrigatório",
  }),
  logradouro: z.string({ error: errorRequired }),
  numero: z.string({ error: errorRequired }),
  complemento: z.string({ error: errorRequired }),
  bairro: z.string({ error: errorRequired }),
  cidade: z.string({ error: errorRequired }),
  estado: z.string({ error: errorRequired }),
  isPrincipal: z.boolean().optional(),
});

export const formContato = z.object({
  _id: z.string().optional(),
  id_seq: z.number().optional(),
  nome: z.string({ error: errorRequired }),
  setor: z.string({ error: errorRequired }),
  email: z.string({ error: errorRequired }),
  telefone: z.string({ error: errorRequired }),
  celular: z.string({ error: errorRequired }),
  isPrincipal: z.boolean().optional(),
});

export const pessoaFisicaSchema = z.object({
  _id: z.string().optional(),
  nome: z.string({ error: errorRequired }).min(3, {
    message: "Nome é obrigatório",
  }),
  apelido: z.string({ error: errorRequired }),
  cpf_cnpj: z.string({ error: errorRequired }),
  tipo: z.literal(ETipoPessoa.FISICA),
  estado_civil: z.enum(EEstadoCivil, { error: errorRequired }).nullable(),
  conjuge: z
    .object({
      value: z.string().optional(),
      label: z.string().optional(),
    })
    .optional()
    .nullable(),
  casa_propria: z.boolean().optional(),
  valor_aluguel: z.number().optional(),
  escolaridade: z.string({ error: errorRequired }),
  banco: z.string().optional(),
  profissao: z
    .object({
      _id: z.string().optional(),
      nome: z.string().optional(),
      codigo: z.string().optional(),
    })
    .optional(),
  pcd: z.boolean().optional(),
  sexo: z.string().optional(),
  contatos_pessoa: z
    .array(formContato, {
      error: "Você deve cadastrar pelo menos um contato.",
    })
    .optional(),
  enderecos_pessoa: z
    .array(formEndereco, {
      error: "Você deve cadastrar pelo menos um endereço.",
    })
    .optional(),
});

export const pessoaJuridicaSchema = z.object({
  tipo: z.literal(ETipoPessoa.JURIDICA),
  cpf_cnpj: z.string({ error: errorRequired }),
  razao_social: z.string({ error: errorRequired }),
  nome_fantasia: z.string({ error: errorRequired }),
  inscricao_estadual: z.string({ error: errorRequired }),
  inscricao_municipal: z.string({ error: errorRequired }),
  regime_tributario: z.string({ error: errorRequired }),
  cnae: z.string({ error: errorRequired }),
  contatos_pessoa: z
    .array(formContato, {
      error: "Você deve cadastrar pelo menos um contato.",
    })
    .optional(),
  enderecos_pessoa: z
    .array(formEndereco, {
      error: "Você deve cadastrar pelo menos um endereço.",
    })
    .optional(),
});

export const pessoaSchema = z.discriminatedUnion("tipo", [
  pessoaFisicaSchema,
  pessoaJuridicaSchema,
]);

export type PessoaFormType = z.infer<typeof pessoaSchema>;

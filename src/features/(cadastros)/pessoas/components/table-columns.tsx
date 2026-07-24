import { IPessoa } from "@/types/pessoas/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EditarPessoa } from "@/features/(cadastros)/pessoas/components/editar-pessoas-modal";
import { ExcluirPessoa } from "@/features/(cadastros)/pessoas/components/excluir-pessoas-modal";
import { createColumnBuilder } from "@/components/extensions/datatable/column-builder";
import { EEstadoCivil, ETipoPessoa } from "../schemas/pessoa";

const colBuilder = createColumnBuilder<IPessoa>();

const tipoPessoaLabels: Record<ETipoPessoa, string> = {
  [ETipoPessoa.FISICA]: "Pessoa Física",
  [ETipoPessoa.JURIDICA]: "Pessoa Jurídica",
  [ETipoPessoa.ESTRANGEIRA]: "Estrangeira",
  [ETipoPessoa.GOVERNO]: "Governo",
};

const estadoCivilLabels: Record<EEstadoCivil, string> = {
  [EEstadoCivil.SOLTEIRO]: "Solteiro",
  [EEstadoCivil.CASADO]: "Casado",
  [EEstadoCivil.DIVORCIADO]: "Divorciado",
  [EEstadoCivil.VIUVO]: "Viúvo",
  [EEstadoCivil.SEPARADO]: "Separado",
  [EEstadoCivil.UNIAO_ESTAVEL]: "União Estável",
};

const getContatoPrincipal = (row: IPessoa) => {
  return (
    row.contatos_pessoa?.find((contato) => contato.isPrincipal) ??
    row.contatos_pessoa?.[0]
  );
};

const getEnderecoPrincipal = (row: IPessoa) => {
  return (
    row.enderecos_pessoa?.find((endereco) => endereco.isPrincipal) ??
    row.enderecos_pessoa?.[0]
  );
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return undefined;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const columns = (): ColumnDef<IPessoa, any>[] => [
  colBuilder({ acessor: "tipo" })
    .variant("badge")
    .header("Tipo")
    .colors({
      [ETipoPessoa.FISICA]: {
        label: tipoPessoaLabels[ETipoPessoa.FISICA],
        className: "border-none bg-green-500/20 text-green-600",
      },
      [ETipoPessoa.JURIDICA]: {
        label: tipoPessoaLabels[ETipoPessoa.JURIDICA],
        className: "border-none bg-blue-500/20 text-sky-600",
      },
      [ETipoPessoa.ESTRANGEIRA]: {
        label: tipoPessoaLabels[ETipoPessoa.ESTRANGEIRA],
        className: "border-none bg-amber-500/20 text-amber-600",
      },
      [ETipoPessoa.GOVERNO]: {
        label: tipoPessoaLabels[ETipoPessoa.GOVERNO],
        className: "border-none bg-zinc-500/20 text-zinc-600",
      },
    }),
  colBuilder({ acessor: "nome" })
    .variant("text")
    .header("Nome Completo")
    .cell({ highlight: true }),
  colBuilder({ acessor: "apelido" })
    .variant("text")
    .header("Apelido")
    .cell({ highlight: true }),
  colBuilder({ acessor: "razao_social" })
    .variant("text")
    .header("Razão Social")
    .cell({ highlight: true }),
  colBuilder({ acessor: "nome_fantasia" })
    .variant("text")
    .header("Nome Fantasia")
    .cell({ highlight: true }),
  colBuilder({ acessor: "cpf_cnpj" })
    .variant("text")
    .header("CPF/CNPJ")
    .cell({ highlight: true }),
  colBuilder({ acessor: "sexo" }).variant("text").header("Sexo"),
  colBuilder({ acessor: "estado_civil" })
    .variant("text")
    .format((value) => estadoCivilLabels[value as EEstadoCivil] ?? value)
    .header("Estado Civil"),
  colBuilder({ acessor: "escolaridade" })
    .variant("text")
    .header("Escolaridade"),
  colBuilder({ acessor: "casa_propria" })
    .variant("boolean")
    .header("Casa Própria")
    .colors({
      Sim: "green",
      Não: "zinc",
    }),
  colBuilder({ acessor: "valor_aluguel" })
    .variant("number")
    .format((value) => formatCurrency(value as number))
    .header("Valor do Aluguel"),
  colBuilder({ acessor: "banco" }).variant("text").header("Banco"),
  colBuilder({ acessor: "pcd" }).variant("boolean").header("PCD").colors({
    Sim: "blue",
    Não: "zinc",
  }),
  colBuilder({ acessor: "inscricao_estadual" })
    .variant("text")
    .header("Inscrição Estadual"),
  colBuilder({ acessor: "inscricao_municipal" })
    .variant("text")
    .header("Inscrição Municipal"),
  colBuilder({ acessor: "regime_tributario" })
    .variant("text")
    .header("Regime Tributário"),
  colBuilder({ acessor: "cnae" }).variant("text").header("CNAE"),
  colBuilder({
    id: "contato_nome",
    acessor: (row) => getContatoPrincipal(row)?.nome,
  })
    .variant("text")
    .header("Contato Nome")
    .cell({ highlight: true }),
  colBuilder({
    id: "contato_setor",
    acessor: (row) => getContatoPrincipal(row)?.setor,
  })
    .variant("text")
    .header("Contato Setor"),
  colBuilder({
    id: "contato_email",
    acessor: (row) => getContatoPrincipal(row)?.email,
  })
    .variant("text")
    .header("Contato Email")
    .cell({ highlight: true }),
  colBuilder({
    id: "contato_telefone",
    acessor: (row) => getContatoPrincipal(row)?.telefone,
  })
    .variant("text")
    .header("Contato Telefone"),
  colBuilder({
    id: "contato_celular",
    acessor: (row) => getContatoPrincipal(row)?.celular,
  })
    .variant("text")
    .header("Contato Celular"),
  colBuilder({
    id: "contato_principal",
    acessor: (row) => getContatoPrincipal(row)?.isPrincipal,
  })
    .variant("boolean")
    .header("Contato Principal")
    .colors({
      Sim: "green",
      Não: "zinc",
    }),
  colBuilder({
    id: "endereco_identificacao",
    acessor: (row) => getEnderecoPrincipal(row)?.identificacao,
  })
    .variant("text")
    .header("Endereço Identificação"),
  colBuilder({
    id: "endereco_cep",
    acessor: (row) => getEnderecoPrincipal(row)?.cep,
  })
    .variant("text")
    .header("Endereço CEP"),
  colBuilder({
    id: "endereco_logradouro",
    acessor: (row) => getEnderecoPrincipal(row)?.logradouro,
  })
    .variant("text")
    .header("Endereço Logradouro")
    .cell({ highlight: true }),
  colBuilder({
    id: "endereco_numero",
    acessor: (row) => getEnderecoPrincipal(row)?.numero,
  })
    .variant("text")
    .header("Endereço Número"),
  colBuilder({
    id: "endereco_complemento",
    acessor: (row) => getEnderecoPrincipal(row)?.complemento,
  })
    .variant("text")
    .header("Endereço Complemento"),
  colBuilder({
    id: "endereco_bairro",
    acessor: (row) => getEnderecoPrincipal(row)?.bairro,
  })
    .variant("text")
    .header("Endereço Bairro"),
  colBuilder({
    id: "endereco_cidade",
    acessor: (row) => getEnderecoPrincipal(row)?.cidade,
  })
    .variant("text")
    .header("Endereço Cidade"),
  colBuilder({
    id: "endereco_estado",
    acessor: (row) => getEnderecoPrincipal(row)?.estado,
  })
    .variant("text")
    .header("Endereço UF"),
  colBuilder({
    id: "endereco_principal",
    acessor: (row) => getEnderecoPrincipal(row)?.isPrincipal,
  })
    .variant("boolean")
    .header("Endereço Principal")
    .colors({
      Sim: "green",
      Não: "zinc",
    }),
  colBuilder({ acessor: (row) => row.createdAt, id: "createdAt" })
    .variant("dateTime")
    .format("dd/MM/yy HH:mm")
    .header("Criado em"),
  colBuilder({ acessor: (row) => row.updatedAt, id: "updatedAt" })
    .variant("dateTime")
    .format("dd/MM/yy HH:mm")
    .header("Atualizado em"),
  colBuilder({ acessor: "actions" })
    .header("Ações", { defaultPinned: "right", canHiddenColumn: false })
    .actions([
      {
        label: "Editar",
        render: (row: Row<IPessoa>) => <EditarPessoa row={row} />,
      },
      {
        label: "Excluir",
        render: (row: Row<IPessoa>) => <ExcluirPessoa row={row} />,
      },
    ]),
];

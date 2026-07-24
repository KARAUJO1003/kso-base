export interface LojaBrandingFormData {
  nome: string;
  sigla: string;
  status?: string;
  tipo?: string;
  loja_grupo?: string;
  deposito_default?: string;
  tabela_preco_default?: string;
  cor_primaria: string;
  cor_secundaria: string;
  cor_contraste: string;
  logo?: File | null;
}

function appendOptional(
  formData: FormData,
  field: string,
  value?: string | null,
) {
  if (value) formData.append(field, value);
}

export function buildLojaFormData(values: LojaBrandingFormData) {
  const formData = new FormData();

  formData.append("nome", values.nome);
  formData.append("sigla", values.sigla);
  appendOptional(formData, "status", values.status);
  appendOptional(formData, "tipo", values.tipo);
  appendOptional(formData, "loja_grupo", values.loja_grupo);
  appendOptional(formData, "deposito_default", values.deposito_default);
  appendOptional(
    formData,
    "tabela_preco_default",
    values.tabela_preco_default,
  );
  formData.append(
    "branding",
    JSON.stringify({
      cor_primaria: values.cor_primaria,
      cor_secundaria: values.cor_secundaria,
      cor_contraste: values.cor_contraste,
    }),
  );

  if (typeof File !== "undefined" && values.logo instanceof File) {
    formData.append("logo", values.logo);
  }

  return formData;
}

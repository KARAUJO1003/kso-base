import assert from "node:assert/strict";
import test from "node:test";

import { buildLojaFormData } from "./loja-branding-form";

test("serializes store data, branding and logo as multipart", async () => {
  const logo = new File(["logo"], "logo.png", { type: "image/png" });
  const formData = buildLojaFormData({
    nome: "Loja Centro",
    sigla: "LC",
    status: "ATIVO",
    deposito_default: "deposito-1",
    tabela_preco_default: "tabela-1",
    cor_primaria: "#2563EB",
    cor_secundaria: "#DBEAFE",
    cor_contraste: "#FFFFFF",
    logo,
  });

  assert.equal(formData.get("nome"), "Loja Centro");
  assert.equal(formData.get("status"), "ATIVO");
  assert.deepEqual(JSON.parse(String(formData.get("branding"))), {
    cor_primaria: "#2563EB",
    cor_secundaria: "#DBEAFE",
    cor_contraste: "#FFFFFF",
  });

  const serializedLogo = formData.get("logo");
  assert.ok(serializedLogo instanceof File);
  assert.equal(serializedLogo.name, "logo.png");
});

test("omits empty optional references and logo", () => {
  const formData = buildLojaFormData({
    nome: "Loja Centro",
    sigla: "LC",
    status: "ATIVO",
    deposito_default: "",
    tabela_preco_default: undefined,
    cor_primaria: "#D8142A",
    cor_secundaria: "#FDE8EC",
    cor_contraste: "#FFFFFF",
    logo: null,
  });

  assert.equal(formData.has("deposito_default"), false);
  assert.equal(formData.has("tabela_preco_default"), false);
  assert.equal(formData.has("logo"), false);
});

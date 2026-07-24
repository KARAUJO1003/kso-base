"use client";
import { useModalInstance } from "@/hooks/use-modal-instance";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider as Form, useFieldArray } from "react-hook-form";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_PESSOA,
  QUERIES_KEYS_PESSOA,
  MUTATION_KEYS_PESSOA,
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";
import {
  pessoaSchema,
  PessoaFormType,
  ETipoPessoa,
  EEstadoCivil,
} from "../schemas/pessoa";
import { FormFields } from "@/components/shared/form-fields";
import { Fragment, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { CNPJ_MASK, CPF_MASK } from "@/lib/input-masks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getPessoaFormValues = (data?: Partial<PessoaFormType>): PessoaFormType =>
  ({
    ...data,
    tipo: ETipoPessoa.FISICA,
  }) as PessoaFormType;

const FormPessoa = () => {
  const modal = useModalInstance(MODAL_KEYS_PESSOA.FORM);
  const form = useForm<PessoaFormType>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: getPessoaFormValues(modal.data),
  });

  useEffect(() => {
    if (!modal.open) return;

    form.reset(getPessoaFormValues(modal.data));
  }, [form, modal.open, modal.data?._id]);

  const tipo = form.watch("tipo");

  const {
    fields: contatosFields,
    append: appendContato,
    remove: removeContato,
  } = useFieldArray({
    control: form.control,
    name: "contatos_pessoa" as any,
  });

  const {
    fields: enderecosFields,
    append: appendEndereco,
    remove: removeEndereco,
  } = useFieldArray({
    control: form.control,
    name: "enderecos_pessoa" as any,
  });

  // Estados temporários para formulários
  const [novoContato, setNovoContato] = useState({
    nome: "",
    setor: "",
    email: "",
    telefone: "",
    celular: "",
    isPrincipal: false,
  });

  const [novoEndereco, setNovoEndereco] = useState({
    identificacao: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    isPrincipal: false,
  });

  const handleAdicionarContato = () => {
    if (novoContato.nome && novoContato.email) {
      appendContato(novoContato);
      setNovoContato({
        nome: "",
        setor: "",
        email: "",
        telefone: "",
        celular: "",
        isPrincipal: false,
      });
    }
  };

  const handleAdicionarEndereco = () => {
    if (novoEndereco.identificacao && novoEndereco.cep) {
      appendEndereco(novoEndereco);
      setNovoEndereco({
        identificacao: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        isPrincipal: false,
      });
    }
  };

  useEffect(() => {
    if (tipo === ETipoPessoa.FISICA) {
      form.setValue("razao_social" as any, undefined);
      form.setValue("nome_fantasia" as any, undefined);
      form.setValue("inscricao_estadual" as any, undefined);
      form.setValue("inscricao_municipal" as any, undefined);
      form.setValue("regime_tributario" as any, undefined);
      form.setValue("cnae" as any, undefined);
    } else if (tipo === ETipoPessoa.JURIDICA) {
      form.setValue("nome" as any, undefined);
      form.setValue("apelido" as any, null);
      form.setValue("estado_civil" as any, undefined);
      form.setValue("conjuge" as any, undefined);
      form.setValue("casa_propria" as any, false);
      form.setValue("valor_aluguel" as any, undefined);
      form.setValue("escolaridade" as any, undefined);
      form.setValue("banco" as any, undefined);
      form.setValue("profissao" as any, undefined);
      form.setValue("pcd" as any, false);
      form.setValue("sexo" as any, undefined);
      form.setValue("contatos_pessoa" as any, undefined);
      form.setValue("enderecos_pessoa" as any, undefined);
    }
    form.setValue("cpf_cnpj" as any, "");
  }, [tipo]);

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_PESSOA.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_PESSOA.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_PESSOA.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_PESSOA.LIST],
  });

  const onSubmit = (values: PessoaFormType) => {
    if (modal.data?._id) {
      onUpdate.mutate({
        formData: values,
        id: modal.data._id,
      });
    } else {
      onCreate.mutate({
        formData: values,
      });
    }
    form.reset(getPessoaFormValues());
    modal.onClose();
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-6 mx-auto px-6 pb-10 h-full container">
        <form
          id="form-pessoas"
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-8 grid sm:grid-cols-2"
        >
          <FieldGroup className="space-y-6">
            <FormFields.RadioGroup<PessoaFormType>
              name="tipo"
              label="Tipo de Pessoa"
              orientation="horizontal"
              options={[
                { value: ETipoPessoa.FISICA, label: "Pessoa Física" },
                { value: ETipoPessoa.JURIDICA, label: "Pessoa Jurídica" },
              ]}
            />

            {tipo === ETipoPessoa.FISICA && (
              <Fragment key={tipo}>
                <FieldSet>
                  <div className="flex justify-center items-center gap-6 w-full">
                    <Separator className="shrink" />
                    <FieldLegend className="text-nowrap">
                      Dados Pessoais
                    </FieldLegend>
                    <Separator className="shrink" />
                  </div>
                  <FormFields.Input<PessoaFormType>
                    name="nome"
                    label="Nome Completo"
                    placeholder="Informe o nome completo"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="apelido"
                    label="Apelido"
                    placeholder="Informe o apelido"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="cpf_cnpj"
                    label="CPF"
                    placeholder="000.000.000-00"
                    mask={CPF_MASK}
                  />

                  <FormFields.Select<PessoaFormType, string>
                    name="sexo"
                    label="Sexo"
                    options={["Masculino", "Feminino", "Outro"]}
                    placeholder="Selecione o sexo"
                  />
                </FieldSet>

                <FieldSet>
                  <div className="flex justify-center items-center gap-6 w-full">
                    <Separator className="shrink" />
                    <FieldLegend className="text-nowrap">
                      Informações Complementares
                    </FieldLegend>
                    <Separator className="shrink" />
                  </div>
                  <FormFields.Select<PessoaFormType>
                    name="estado_civil"
                    label="Estado Civil"
                    options={Object.values(EEstadoCivil)}
                    placeholder="Informe o estado civil"
                  />
                  <FormFields.Input<PessoaFormType>
                    name="escolaridade"
                    label="Escolaridade"
                    placeholder="Informe a escolaridade"
                  />
                </FieldSet>

                <FieldSet>
                  <div className="flex justify-center items-center gap-6 w-full">
                    <Separator className="shrink" />
                    <FieldLegend className="text-nowrap">
                      Dados Residenciais
                    </FieldLegend>
                    <Separator className="shrink" />
                  </div>
                  <FormFields.Switch<PessoaFormType>
                    name="casa_propria"
                    label="Casa Própria"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="valor_aluguel"
                    label="Valor do Aluguel"
                    placeholder="0,00"
                    currency
                    prefix="R$"
                  />
                </FieldSet>

                <FieldSet>
                  <div className="flex justify-center items-center gap-6 w-full">
                    <Separator className="shrink" />
                    <FieldLegend className="text-nowrap">
                      Informações Adicionais
                    </FieldLegend>
                    <Separator className="shrink" />
                  </div>
                  <FormFields.Input<PessoaFormType>
                    name="banco"
                    label="Banco"
                    placeholder="Informe o banco"
                  />
                  <FormFields.Switch<PessoaFormType>
                    name="pcd"
                    label="PCD (Pessoa com Deficiência)"
                  />
                </FieldSet>
              </Fragment>
            )}

            {tipo === ETipoPessoa.JURIDICA && (
              <Fragment key={tipo}>
                <FieldSet>
                  <div className="flex justify-center items-center gap-6 w-full">
                    <Separator className="shrink" />
                    <FieldLegend className="text-nowrap">
                      Dados Empresariais
                    </FieldLegend>
                    <Separator className="shrink" />
                  </div>
                  <FormFields.Input<PessoaFormType>
                    name="razao_social"
                    label="Razão Social"
                    placeholder="Informe a razão social"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="nome_fantasia"
                    label="Nome Fantasia"
                    placeholder="Informe o nome fantasia"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="cpf_cnpj"
                    label="CNPJ"
                    placeholder="00.000.000/0000-00"
                    mask={CNPJ_MASK}
                  />
                </FieldSet>

                <FieldSet>
                  <div className="flex justify-center items-center gap-6 w-full">
                    <Separator className="shrink" />
                    <FieldLegend className="text-nowrap">
                      Informações Fiscais
                    </FieldLegend>
                    <Separator className="shrink" />
                  </div>
                  <FormFields.Input<PessoaFormType>
                    name="inscricao_estadual"
                    label="Inscrição Estadual"
                    placeholder="Informe a inscrição estadual"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="inscricao_municipal"
                    label="Inscrição Municipal"
                    placeholder="Informe a inscrição municipal"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="regime_tributario"
                    label="Regime Tributário"
                    placeholder="Informe o regime tributário"
                  />

                  <FormFields.Input<PessoaFormType>
                    name="cnae"
                    label="CNAE"
                    placeholder="Informe o CNAE"
                  />
                </FieldSet>
              </Fragment>
            )}
          </FieldGroup>
          <FieldGroup className="space-y-6">
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList>
                <TabsTrigger className="min-w-32" value="contacts">
                  Contatos
                </TabsTrigger>
                <TabsTrigger className="min-w-32" value="addresses">
                  Endereços
                </TabsTrigger>
              </TabsList>
              <TabsContent value="contacts">
                <FieldSet>
                  <div className="space-y-4 bg-muted/20 p-4 border rounded-lg">
                    <h4 className="font-medium text-sm">
                      Adicionar Novo Contato
                    </h4>

                    <div className="gap-3 grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Nome *</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Nome do contato"
                          value={novoContato.nome}
                          onChange={(e) =>
                            setNovoContato({
                              ...novoContato,
                              nome: e.target.value,
                            })
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel>Setor</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Setor do contato"
                          value={novoContato.setor}
                          onChange={(e) =>
                            setNovoContato({
                              ...novoContato,
                              setor: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <div className="gap-3 grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Email *</FieldLabel>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          value={novoContato.email}
                          onChange={(e) =>
                            setNovoContato({
                              ...novoContato,
                              email: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Telefone</FieldLabel>
                        <Input
                          type="text"
                          placeholder="(00) 0000-0000"
                          value={novoContato.telefone}
                          onChange={(e) =>
                            setNovoContato({
                              ...novoContato,
                              telefone: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <div className="gap-3 grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Celular</FieldLabel>
                        <Input
                          type="text"
                          placeholder="(00) 00000-0000"
                          value={novoContato.celular}
                          onChange={(e) =>
                            setNovoContato({
                              ...novoContato,
                              celular: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field
                        orientation="horizontal"
                        className="items-center gap-2"
                      >
                        <Checkbox
                          checked={novoContato.isPrincipal}
                          onCheckedChange={(checked) =>
                            setNovoContato({
                              ...novoContato,
                              isPrincipal: checked as boolean,
                            })
                          }
                        />
                        <FieldLabel>Contato Principal</FieldLabel>
                      </Field>
                    </div>

                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      onClick={handleAdicionarContato}
                      className="w-full"
                    >
                      + Adicionar Contato à Lista
                    </Button>
                  </div>

                  {contatosFields.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 font-medium text-sm">
                        Contatos Adicionados ({contatosFields.length})
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Setor</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Celular</TableHead>
                            <TableHead className="text-center">
                              Principal
                            </TableHead>
                            <TableHead className="text-center">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contatosFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium">
                                {form.watch(
                                  `contatos_pessoa.${index}.nome` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `contatos_pessoa.${index}.setor` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `contatos_pessoa.${index}.email` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `contatos_pessoa.${index}.telefone` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `contatos_pessoa.${index}.celular` as any,
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {form.watch(
                                  `contatos_pessoa.${index}.isPrincipal` as any,
                                )
                                  ? "Sim"
                                  : "Não"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="lg"
                                  onClick={() => removeContato(index)}
                                >
                                  Remover
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {contatosFields.length === 0 && (
                    <p className="py-4 text-muted-foreground text-sm text-center">
                      Nenhum contato adicionado. Preencha o formulário acima e
                      clique em &quot;Adicionar Contato à Lista&quot;.
                    </p>
                  )}
                </FieldSet>
              </TabsContent>
              <TabsContent value="addresses">
                {" "}
                <FieldSet>
                  <div className="space-y-4 bg-muted/20 p-4 border rounded-lg">
                    <h4 className="font-medium text-sm">
                      Adicionar Novo Endereço
                    </h4>
                    <div className="gap-3 grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Identificação *</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Ex: Casa, Trabalho"
                          value={novoEndereco.identificacao}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              identificacao: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>CEP *</FieldLabel>
                        <Input
                          type="text"
                          placeholder="00000-000"
                          value={novoEndereco.cep}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              cep: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Logradouro</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Rua, Avenida, etc"
                        value={novoEndereco.logradouro}
                        onChange={(e) =>
                          setNovoEndereco({
                            ...novoEndereco,
                            logradouro: e.target.value,
                          })
                        }
                      />
                    </Field>

                    <div className="gap-3 grid sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Número</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Nº"
                          value={novoEndereco.numero}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              numero: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Complemento</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Apto, Bloco, etc"
                          value={novoEndereco.complemento}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              complemento: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <div className="gap-3 grid sm:grid-cols-3">
                      <Field>
                        <FieldLabel>Bairro</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Bairro"
                          value={novoEndereco.bairro}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              bairro: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Cidade</FieldLabel>
                        <Input
                          type="text"
                          placeholder="Cidade"
                          value={novoEndereco.cidade}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              cidade: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Estado</FieldLabel>
                        <Input
                          type="text"
                          placeholder="UF"
                          maxLength={2}
                          value={novoEndereco.estado}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              estado: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <Field
                      orientation="horizontal"
                      className="items-center gap-2"
                    >
                      <Checkbox
                        checked={novoEndereco.isPrincipal}
                        onCheckedChange={(checked) =>
                          setNovoEndereco({
                            ...novoEndereco,
                            isPrincipal: checked as boolean,
                          })
                        }
                      />
                      <FieldLabel>Endereço Principal</FieldLabel>
                    </Field>

                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      onClick={handleAdicionarEndereco}
                      className="w-full"
                    >
                      + Adicionar Endereço à Lista
                    </Button>
                  </div>

                  {enderecosFields.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 font-medium text-sm">
                        Endereços Adicionados ({enderecosFields.length})
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Identificação</TableHead>
                            <TableHead>CEP</TableHead>
                            <TableHead>Logradouro</TableHead>
                            <TableHead>Número</TableHead>
                            <TableHead>Bairro</TableHead>
                            <TableHead>Cidade</TableHead>
                            <TableHead>UF</TableHead>
                            <TableHead className="text-center">
                              Principal
                            </TableHead>
                            <TableHead className="text-center">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enderecosFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium">
                                {form.watch(
                                  `enderecos_pessoa.${index}.identificacao` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `enderecos_pessoa.${index}.cep` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `enderecos_pessoa.${index}.logradouro` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `enderecos_pessoa.${index}.numero` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `enderecos_pessoa.${index}.bairro` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `enderecos_pessoa.${index}.cidade` as any,
                                )}
                              </TableCell>
                              <TableCell>
                                {form.watch(
                                  `enderecos_pessoa.${index}.estado` as any,
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {form.watch(
                                  `enderecos_pessoa.${index}.isPrincipal` as any,
                                )
                                  ? "Sim"
                                  : "Não"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeEndereco(index)}
                                >
                                  Remover
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {enderecosFields.length === 0 && (
                    <p className="py-4 text-muted-foreground text-sm text-center">
                      Nenhum endereço adicionado. Preencha o formulário acima e
                      clique em &quot;Adicionar Endereço à Lista&quot;.
                    </p>
                  )}
                </FieldSet>
              </TabsContent>
            </Tabs>
          </FieldGroup>
        </form>
      </div>
    </Form>
  );
};

export const FormPessoaModal = () => {
  const modal = useModalInstance(MODAL_KEYS_PESSOA.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent
        className="h-[90vh] max-h-[90vh] overflow-y-auto"
        side="bottom"
      >
        <div className="top-0 z-20 sticky flex bg-popover border-b w-full">
          <div className="flex justify-between items-center mx-auto container">
            <SheetHeader>
              <SheetTitle>Pessoas</SheetTitle>
              <SheetDescription>Gerenciamento de Pessoas.</SheetDescription>
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
              <Button size="lg" type="submit" form="form-pessoas">
                Salvar
              </Button>
            </Field>
          </div>
        </div>
        <FormPessoa />
      </SheetContent>
    </Sheet>
  );
};

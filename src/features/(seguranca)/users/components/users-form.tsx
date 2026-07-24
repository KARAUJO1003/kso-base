"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useCreate, useFetch, useUpdate } from "@/hooks/use-crud";
import { FormFields } from "@/components/shared/form-fields";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { cn } from "@/lib/utils";
import { MODAL_KEYS } from "../constants/modal-keys";
import { IUsers } from "../interfaces/users";
import { IRoles } from "../interfaces/roles";
import { ILoja } from "@/types/lojas/types";
import { ISetor } from "@/types/setores/type";

interface ISistema {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  url?: string;
}

interface IPermissao {
  _id: string;
  name: string;
  description?: string;
}

interface IGrupoPermissoes {
  _id: string;
  name: string;
  slug: string;
  sistema?: ISistema;
  permissoes: IPermissao[];
}

const userPermissionsSchema = z.object({
  permissoes: z.array(z.string()).optional(),
  grupo: z.string().optional(),
});

const profileSchema = z.object({
  sistema: z.string().optional(),
  pagina_inicial: z.string().optional(),
  tempo_expiracao_token: z.string().optional(),
  permissoes_grupos: z.array(userPermissionsSchema).optional(),
});

const formSchema = z.object({
  username: z.string().min(2, "Usuário deve conter no mínimo 2 caracteres"),
  nome: z.string().optional(),
  apelido: z.string().optional(),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  avatar_url: z.string().optional(),
  status: z.enum(["ATIVO", "INATIVO", "BLOQUEADO"]).optional(),
  loja: z.string().optional(),
  lojas_associadas: z.array(z.string()).optional(),
  setor: z.string().optional(),
  role: z.string().optional(),
  sistema_ativo: z.string().optional(),
  profiles: z.array(profileSchema).optional(),
});

type FormData = z.infer<typeof formSchema>;
type UserProfileForm = NonNullable<FormData["profiles"]>[number];

const emptyValues: FormData = {
  username: "",
  nome: "",
  apelido: "",
  email: "",
  password: "",
  avatar_url: "",
  status: "ATIVO",
  loja: "",
  lojas_associadas: [],
  setor: "",
  role: "",
  sistema_ativo: "",
  profiles: [],
};

const getId = (value: any) =>
  typeof value === "string" ? value : value?._id ? String(value._id) : "";

export function UsersForm() {
  const { data: updateData, onClose, open } = useModalInstance<IUsers>(
    MODAL_KEYS.CREATE_USER,
  );

  const { data: optionsGruposPermissions = [] } = useFetch<IGrupoPermissoes[]>({
    queryKey: ["permission-groups"],
    route: "/permissao-grupos",
  });

  const { data: optionsSistemas = [] } = useFetch<ISistema[]>({
    queryKey: ["systems"],
    route: "/sistemas",
  });

  const { data: optionsRoles = [] } = useFetch<IRoles[]>({
    queryKey: ["roles"],
    route: "/roles",
  });
  const { data: optionsLojas = [] } = useFetch<ILoja[]>({
    queryKey: ["lojas"],
    route: "/lojas",
  });
  const { data: optionsSetores = [] } = useFetch<ISetor[]>({
    queryKey: ["setores"],
    route: "/setores",
  });

  const [selectedSistema, setSelectedSistema] = React.useState("");

  React.useEffect(() => {
    if (optionsSistemas.length && !selectedSistema) {
      setSelectedSistema(optionsSistemas[0]._id);
    }
  }, [optionsSistemas, selectedSistema]);

  const formValues = useMemo<FormData>(() => {
    if (!updateData) return emptyValues;

    return {
      username: updateData.username || "",
      nome: updateData.nome || "",
      apelido: updateData.apelido || "",
      email: updateData.email || "",
      password: "",
      avatar_url: updateData.avatar_url || "",
      status: updateData.status || "ATIVO",
      loja: getId(updateData.loja),
      lojas_associadas: (updateData.lojas_associadas || [])
        .map(getId)
        .filter(Boolean),
      setor: getId(updateData.setor),
      role: getId(updateData.role),
      sistema_ativo: "",
      profiles: (updateData.profiles || []).map((profile) => ({
        sistema: getId(profile.sistema),
        pagina_inicial: profile.pagina_inicial || "",
        tempo_expiracao_token: profile.tempo_expiracao_token || "",
        permissoes_grupos: (profile.permissoes_grupos || []).map((item) => ({
          grupo: getId(item.grupo),
          permissoes: (item.permissoes || []).map(getId).filter(Boolean),
        })),
      })),
    };
  }, [updateData]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  });

  React.useEffect(() => {
    if (!open) return;

    form.reset(formValues);
  }, [form, formValues, open]);

  React.useEffect(() => {
    if (!open || !selectedSistema) return;

    form.setValue("sistema_ativo", selectedSistema, { shouldDirty: false });
  }, [form, open, selectedSistema]);

  const watchedProfiles = form.watch("profiles");
  const watchedRole = form.watch("role");

  const selectedSistemaData = optionsSistemas.find(
    (sistema) => sistema._id === selectedSistema,
  );

  const selectedRole = optionsRoles.find((role) => role._id === watchedRole);
  const isAdminSelected = selectedRole?.name?.toLowerCase().startsWith("admin");

  const gruposSistema = optionsGruposPermissions.filter(
    (grupo) => grupo.sistema?._id === selectedSistema,
  );

  const getProfilePermissoes = useCallback(
    (sistemaId: string) => {
      const profile = (watchedProfiles || []).find(
        (item) => item.sistema === sistemaId,
      );
      return profile?.permissoes_grupos || [];
    },
    [watchedProfiles],
  );

  const updateProfile = useCallback(
    (sistemaId: string, nextProfile: Partial<UserProfileForm>) => {
      const current = form.getValues("profiles") || [];
      const index = current.findIndex((item) => item.sistema === sistemaId);
      const updated = [...current];

      if (index >= 0) {
        updated[index] = { ...updated[index], ...nextProfile, sistema: sistemaId };
      } else {
        updated.push({
          sistema: sistemaId,
          pagina_inicial: "/",
          tempo_expiracao_token: "8h",
          permissoes_grupos: [],
          ...nextProfile,
        });
      }

      form.setValue("profiles", updated, { shouldDirty: true });
    },
    [form],
  );

  const updateProfilePermissoes = useCallback(
    (
      sistemaId: string,
      permissoes_grupos: z.infer<typeof userPermissionsSchema>[],
    ) => {
      updateProfile(sistemaId, { permissoes_grupos });
    },
    [updateProfile],
  );

  const updateProfileField = useCallback(
    (
      sistemaId: string,
      field: "pagina_inicial" | "tempo_expiracao_token",
      value: string,
    ) => {
      updateProfile(sistemaId, { [field]: value });
    },
    [updateProfile],
  );

  const getProfileField = useCallback(
    (sistemaId: string, field: "pagina_inicial" | "tempo_expiracao_token") => {
      const profile = (watchedProfiles || []).find(
        (item) => item.sistema === sistemaId,
      );
      return profile?.[field] || "";
    },
    [watchedProfiles],
  );

  const isPermissaoChecked = useCallback(
    (sistemaId: string, grupoId: string, permissaoId: string) => {
      const grupoEntry = getProfilePermissoes(sistemaId).find(
        (item) => item.grupo === grupoId,
      );
      return grupoEntry?.permissoes?.includes(permissaoId) ?? false;
    },
    [getProfilePermissoes],
  );

  const togglePermissao = useCallback(
    (
      sistemaId: string,
      grupoId: string,
      permissaoId: string,
      checked: boolean,
    ) => {
      const currentPerms = [...getProfilePermissoes(sistemaId)];
      const grupoIndex = currentPerms.findIndex((item) => item.grupo === grupoId);

      if (checked) {
        if (grupoIndex >= 0) {
          const permissoes = currentPerms[grupoIndex].permissoes || [];
          currentPerms[grupoIndex] = {
            ...currentPerms[grupoIndex],
            permissoes: permissoes.includes(permissaoId)
              ? permissoes
              : [...permissoes, permissaoId],
          };
        } else {
          currentPerms.push({ grupo: grupoId, permissoes: [permissaoId] });
        }
      } else if (grupoIndex >= 0) {
        const permissoes = (currentPerms[grupoIndex].permissoes || []).filter(
          (id) => id !== permissaoId,
        );
        if (permissoes.length) {
          currentPerms[grupoIndex] = {
            ...currentPerms[grupoIndex],
            permissoes,
          };
        } else {
          currentPerms.splice(grupoIndex, 1);
        }
      }

      updateProfilePermissoes(sistemaId, currentPerms);
    },
    [getProfilePermissoes, updateProfilePermissoes],
  );

  const toggleGrupo = useCallback(
    (sistemaId: string, grupo: IGrupoPermissoes, checked: boolean) => {
      const currentPerms = [...getProfilePermissoes(sistemaId)];
      const grupoIndex = currentPerms.findIndex((item) => item.grupo === grupo._id);

      if (checked) {
        const permissoes = grupo.permissoes.map((item) => item._id);
        if (grupoIndex >= 0) {
          currentPerms[grupoIndex] = {
            ...currentPerms[grupoIndex],
            permissoes,
          };
        } else {
          currentPerms.push({ grupo: grupo._id, permissoes });
        }
      } else if (grupoIndex >= 0) {
        currentPerms.splice(grupoIndex, 1);
      }

      updateProfilePermissoes(sistemaId, currentPerms);
    },
    [getProfilePermissoes, updateProfilePermissoes],
  );

  const getGrupoCheckedState = useCallback(
    (sistemaId: string, grupo: IGrupoPermissoes) => {
      const grupoEntry = getProfilePermissoes(sistemaId).find(
        (item) => item.grupo === grupo._id,
      );
      const selected = grupoEntry?.permissoes?.length || 0;

      return {
        checked: selected > 0,
        indeterminate: selected > 0 && selected < grupo.permissoes.length,
        selected,
      };
    },
    [getProfilePermissoes],
  );

  const getPermissoesCount = useCallback(
    (sistemaId: string) => {
      const selected = getProfilePermissoes(sistemaId).reduce(
        (total, grupo) => total + (grupo.permissoes?.length || 0),
        0,
      );
      const total = optionsGruposPermissions
        .filter((grupo) => grupo.sistema?._id === sistemaId)
        .reduce((acc, grupo) => acc + (grupo.permissoes?.length || 0), 0);
      return { selected, total };
    },
    [getProfilePermissoes, optionsGruposPermissions],
  );

  const aplicarPermissoesDaRole = useCallback(
    (role: IRoles) => {
      if (!role.permissoes_grupos?.length) return;

      const profiles = optionsSistemas
        .map((sistema) => {
          const permissoes_grupos = optionsGruposPermissions
            .filter((grupo) => grupo.sistema?._id === sistema._id)
            .map((grupo) => {
              const roleGroup = role.permissoes_grupos?.find(
                (item) => getId(item.grupo) === grupo._id,
              );
              return {
                grupo: grupo._id,
                permissoes:
                  roleGroup?.permissoes?.map(getId).filter(Boolean) || [],
              };
            })
            .filter((item) => item.permissoes.length > 0);

          return {
            sistema: sistema._id,
            pagina_inicial: "/",
            tempo_expiracao_token: "8h",
            permissoes_grupos,
          };
        })
        .filter((profile) => profile.permissoes_grupos.length > 0);

      form.setValue("profiles", profiles, { shouldDirty: true });
      toast.info("Permissões da role aplicadas.");
    },
    [form, optionsGruposPermissions, optionsSistemas],
  );

  const { mutateAsync: createUser, isPending: isCreating } = useCreate<FormData>({
    route: "/users",
    mutationKey: ["create-users"],
    queryInvalidationKeys: ["users"],
  });

  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdate<FormData>({
    route: "/users",
    mutationKey: ["update-users"],
    queryInvalidationKeys: ["users"],
  });

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (values: FormData) => {
    if (!updateData?._id && !values.password) {
      form.setError("password", {
        type: "manual",
        message: "Senha é obrigatória para novo usuário",
      });
      return;
    }

    const { sistema_ativo: _sistemaAtivo, ...submitValues } = values;
    const passwordDirty = form.getFieldState("password").isDirty;
    const payload = {
      ...submitValues,
      password:
        updateData?._id && !passwordDirty ? undefined : submitValues.password,
    };

    if (updateData?._id) {
      await updateUser({ formData: payload, id: updateData._id });
    } else {
      await createUser({ formData: payload });
    }

    form.reset(emptyValues);
    onClose();
  };

  return (
    <FormProvider {...form}>
      <Tabs
        data-orientation="vertical"
        className="w-full"
        value={selectedSistema}
        onValueChange={setSelectedSistema}
      >
      <form
        id="form-users"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full grid-cols-1 gap-6 py-6 md:grid-cols-[360px_1fr]"
      >
        <FieldGroup className="min-w-0">
          <FieldSet>
            <FieldGroup>
              <FormFields.Input<FormData>
                name="username"
                label="Usuário"
                placeholder="Informe o usuário de login"
                autoComplete="off"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FormFields.Input<FormData>
                  name="nome"
                  label="Nome"
                  placeholder="Nome completo"
                  autoComplete="off"
                />
                <FormFields.Input<FormData>
                  name="apelido"
                  label="Apelido"
                  placeholder="Como prefere ser chamado"
                  autoComplete="off"
                />
              </div>

              <FormFields.Input<FormData>
                name="email"
                label="Email"
                type="email"
                placeholder="Informe o email"
                autoComplete="off"
              />

              <FormFields.Input<FormData>
                name="password"
                label="Senha"
                type="password"
                placeholder={
                  updateData?._id
                    ? "Preencha apenas para alterar"
                    : "Informe a senha"
                }
                autoComplete="new-password"
              />

              <FormFields.Input<FormData>
                name="avatar_url"
                label="Avatar"
                placeholder="URL da imagem do usuário"
                autoComplete="off"
              />

              <FormFields.NativeSelect<
                FormData,
                { value: string; label: string }
              >
                name="status"
                label="Status"
                options={[
                  { value: "ATIVO", label: "Ativo" },
                  { value: "INATIVO", label: "Inativo" },
                  { value: "BLOQUEADO", label: "Bloqueado" },
                ]}
                placeholder="Selecione o status"
              />

              <FieldSeparator />

              <FormFields.NativeSelect<FormData, ILoja>
                name="loja"
                label="Loja principal"
                options={optionsLojas}
                itemToValue={(item) => item._id}
                itemToString={(item) => item.nome}
                placeholder="Selecione a loja"
              />

              <FormFields.MultiSelect<FormData, ILoja>
                name="lojas_associadas"
                label="Lojas associadas"
                options={optionsLojas}
                itemToValue={(item) => item._id}
                itemToString={(item) => item.nome}
                placeholder="Selecione as lojas"
              />

              <FormFields.NativeSelect<FormData, ISetor>
                name="setor"
                label="Setor"
                options={optionsSetores}
                itemToValue={(item) => item._id || ""}
                itemToString={(item) =>
                  item.nome || item.descricao || item.codigo || ""
                }
                placeholder="Selecione o setor"
              />

              <FormFields.NativeSelect<FormData, IRoles>
                name="role"
                label="Role"
                options={optionsRoles}
                itemToValue={(item) => item._id}
                itemToString={(item) => item.name}
                placeholder="Selecione a role"
              />

              <Field className="rounded-md border bg-muted/40 p-3">
                <FieldLabel>Permissões da role</FieldLabel>
                <FieldDescription>
                  {selectedRole
                    ? "Aplique as permissões da role selecionada quando quiser sobrescrever as permissões por sistema."
                    : "Selecione uma role para habilitar a aplicação de permissões."}
                </FieldDescription>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <span className="text-muted-foreground text-sm">
                      Role selecionada
                    </span>
                    <div className="mt-1">
                      {selectedRole ? (
                        <Badge variant="secondary">{selectedRole.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Nenhuma
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={!selectedRole?.permissoes_grupos?.length}
                    onClick={() => {
                      if (selectedRole) aplicarPermissoesDaRole(selectedRole);
                    }}
                  >
                    Aplicar permissões
                  </Button>
                </div>
              </Field>

              <FieldSeparator />

              <FormFields.NativeSelect<FormData, ISistema>
                name="sistema_ativo"
                label="Sistema"
                options={optionsSistemas}
                itemToValue={(item) => item._id}
                itemToString={(sistema) => {
                    const count = getPermissoesCount(sistema._id);
                    return count.selected > 0
                      ? `${sistema.name} (${count.selected}/${count.total})`
                      : sistema.name;
                  }}
                placeholder="Selecione o sistema"
                onChange={(event) => setSelectedSistema(event.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                Configure página inicial, expiração de token e permissões para o
                sistema selecionado.
              </p>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>

        <FieldGroup className="min-w-0">
          <FieldSet>
            <FieldLegend>
              Perfil para{" "}
              <span className="text-primary">
                {selectedSistemaData?.name || "sistema"}
              </span>
            </FieldLegend>
            <FieldDescription>
              Selecione permissões específicas para o sistema ativo.
            </FieldDescription>

            <TabsContent value={selectedSistema} className="mt-4">
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor={`pagina_inicial_${selectedSistema}`}>
                      Página inicial
                    </FieldLabel>
                    <Input
                      id={`pagina_inicial_${selectedSistema}`}
                      value={getProfileField(selectedSistema, "pagina_inicial")}
                      onChange={(event) => {
                        const sanitized = event.target.value
                          .replace(/[^a-zA-Z0-9\-_\/]/g, "")
                          .replace(/\/{2,}/g, "/")
                          .replace(/^\//, "");
                        updateProfileField(
                          selectedSistema,
                          "pagina_inicial",
                          `/${sanitized}`,
                        );
                      }}
                      placeholder="/dashboard"
                      autoComplete="off"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`tempo_expiracao_${selectedSistema}`}>
                      Expiração do token
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={`tempo_expiracao_${selectedSistema}`}
                        type="number"
                        min={1}
                        value={
                          getProfileField(
                            selectedSistema,
                            "tempo_expiracao_token",
                          ).replace(/[smhd]$/, "") || "8"
                        }
                        onChange={(event) => {
                          const num = event.target.value.replace(/\D/g, "");
                          const unit =
                            getProfileField(
                              selectedSistema,
                              "tempo_expiracao_token",
                            ).match(/[smhd]$/)?.[0] || "h";
                          updateProfileField(
                            selectedSistema,
                            "tempo_expiracao_token",
                            num ? `${num}${unit}` : "",
                          );
                        }}
                        placeholder="8"
                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <ButtonGroup>
                        {(["s", "m", "h", "d"] as const).map((unit) => {
                          const currentUnit =
                            getProfileField(
                              selectedSistema,
                              "tempo_expiracao_token",
                            ).match(/[smhd]$/)?.[0] || "h";
                          return (
                            <InputGroupButton
                              key={unit}
                              size="icon-xs"
                              type="button"
                              variant={currentUnit === unit ? "default" : "secondary"}
                              onClick={() => {
                                const num =
                                  getProfileField(
                                    selectedSistema,
                                    "tempo_expiracao_token",
                                  ).replace(/[smhd]$/, "") || "8";
                                updateProfileField(
                                  selectedSistema,
                                  "tempo_expiracao_token",
                                  `${num}${unit}`,
                                );
                              }}
                            >
                              {unit}
                            </InputGroupButton>
                          );
                        })}
                      </ButtonGroup>
                    </InputGroup>
                  </Field>
                </div>

                <Alert className="my-2 border-emerald-500/30 bg-emerald-500/10">
                  <AlertDescription>
                    Selecione um grupo inteiro ou expanda para marcar permissões
                    específicas.
                  </AlertDescription>
                </Alert>

                <FieldGroup className="rounded-lg border p-2">
                  {gruposSistema.length ? (
                    <Accordion disabled={isAdminSelected}>
                      {gruposSistema.map((grupo) => {
                        const state = getGrupoCheckedState(selectedSistema, grupo);
                        return (
                          <AccordionItem
                            key={grupo._id}
                            value={grupo._id}
                            disabled={isAdminSelected}
                          >
                            <div className="flex items-center gap-3 rounded-md px-2 py-2">
                              <Checkbox
                                checked={state.checked}
                                disabled={isAdminSelected}
                                data-indeterminate={state.indeterminate}
                                onCheckedChange={(checked) =>
                                  toggleGrupo(
                                    selectedSistema,
                                    grupo,
                                    Boolean(checked),
                                  )
                                }
                                className={cn(
                                  state.indeterminate &&
                                    "border-primary bg-primary/40",
                                )}
                              />
                              <AccordionTrigger className="py-0 hover:no-underline">
                                <span className="text-left">
                                  Permissões em {grupo.name}
                                </span>
                                <Badge variant="outline" className="ml-auto mr-2">
                                  {state.selected}/{grupo.permissoes.length}
                                </Badge>
                              </AccordionTrigger>
                            </div>
                            <AccordionContent className="space-y-1 px-4 pb-4">
                              {grupo.permissoes.map((permissao) => (
                                <label
                                  key={permissao._id}
                                  className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-2 hover:bg-accent"
                                >
                                  <Checkbox
                                    checked={isPermissaoChecked(
                                      selectedSistema,
                                      grupo._id,
                                      permissao._id,
                                    )}
                                    disabled={isAdminSelected}
                                    onCheckedChange={(checked) =>
                                      togglePermissao(
                                        selectedSistema,
                                        grupo._id,
                                        permissao._id,
                                        Boolean(checked),
                                      )
                                    }
                                  />
                                  <span className="grid gap-1">
                                    <span className="font-mono text-sm">
                                      {grupo.slug}:{permissao.name}
                                    </span>
                                    {permissao.description && (
                                      <span className="text-muted-foreground text-xs">
                                        {permissao.description}
                                      </span>
                                    )}
                                  </span>
                                </label>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>
                          Nenhum grupo de permissões para este sistema
                        </EmptyTitle>
                        <EmptyDescription>
                          Cadastre grupos de permissões vinculados ao sistema
                          selecionado.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  )}
                </FieldGroup>
              </FieldGroup>
            </TabsContent>
          </FieldSet>
        </FieldGroup>

        <Field
          orientation="horizontal"
          className="sticky bottom-0 col-span-full mt-auto bg-background/90 py-3 backdrop-blur"
        >
          <Button
            className="flex-1"
            type="button"
            variant="outline"
            onClick={() => {
              const firstSistema = optionsSistemas[0]?._id || "";
              setSelectedSistema(firstSistema);
              form.reset({ ...emptyValues, sistema_ativo: firstSistema });
            }}
          >
            Limpar
          </Button>
          <Button
            className="flex-1"
            type="submit"
            form="form-users"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </Field>
      </form>
      </Tabs>
    </FormProvider>
  );
}

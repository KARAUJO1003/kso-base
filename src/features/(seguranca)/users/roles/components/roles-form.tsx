"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormFields } from "@/components/shared/form-fields";
import { useModalInstance } from "@/hooks/use-modal-instance";
import { MODAL_KEYS } from "../../constants/modal-keys";
import { IRolesSchema, rolesFormSchema } from "../../schemas/roles";
import { useCreate, useFetch, useUpdate } from "@/hooks/use-crud";
import { useEffect } from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FieldGroup } from "@/components/ui/field";
import { IModules } from "../../interfaces/modules";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const defaultFormValues: IRolesSchema = {
  name: "",
  permissoes_grupos: [],
};

const getId = (value: any) =>
  typeof value === "string" ? value : value?._id ? String(value._id) : "";

const getFormValues = (data?: any): IRolesSchema => ({
  name: data?.name || "",
  permissoes_grupos: (data?.permissoes_grupos || [])
    .map((item: any) => ({
      grupo: getId(item.grupo),
      permissoes: (item.permissoes || []).map(getId).filter(Boolean),
    }))
    .filter((item: { grupo: string }) => Boolean(item.grupo)),
});

export function RolesForm() {
  const { data: grupos = [] } = useFetch<IModules[]>({
    route: "/permissao-grupos",
    queryKey: ["permission-groups"],
  });
  const { mutateAsync: create, isPending: isCreating } = useCreate<IRolesSchema>({
    route: "/roles",
    mutationKey: ["create-roles"],
    queryInvalidationKeys: ["roles"],
  });
  const { mutateAsync: update, isPending: isUpdating } = useUpdate<IRolesSchema>({
    route: "/roles",
    mutationKey: ["update-roles"],
    queryInvalidationKeys: ["roles"],
  });

  const {
    data: updateData,
    onClose,
    onOpen,
    open,
  } = useModalInstance(MODAL_KEYS.CREATE_ROLE);
  const form = useForm<IRolesSchema>({
    resolver: zodResolver(rolesFormSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(getFormValues(updateData));
  }, [form, open, updateData]);

  const selectedGroups = form.watch("permissoes_grupos") || [];
  const isSubmitting = isCreating || isUpdating;

  const setGroupPermissions = (grupoId: string, permissoes: string[]) => {
    const current = form.getValues("permissoes_grupos") || [];
    const withoutGroup = current.filter((item) => item.grupo !== grupoId);
    const next = permissoes.length
      ? [...withoutGroup, { grupo: grupoId, permissoes }]
      : withoutGroup;
    form.setValue("permissoes_grupos", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const getSelectedPermissions = (grupoId: string) =>
    selectedGroups.find((item) => item.grupo === grupoId)?.permissoes || [];

  const onSubmit = async (formData: IRolesSchema) => {
    if (updateData) {
      await update({ formData, id: updateData._id });
    } else {
      await create({ formData });
    }
    onClose();
    form.reset(defaultFormValues);
  };

  return (
    <div className="grid">
      <SheetHeader>
        <SheetTitle>{updateData ? "Editar" : "Criar"} Role</SheetTitle>
        <SheetDescription>
          Preencha os detalhes para o{" "}
          {updateData ? "papel existente" : "novo papel"}.
        </SheetDescription>
      </SheetHeader>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 py-6 p-4"
        >
          <FieldGroup>
            <FormFields.Input<IRolesSchema>
              name="name"
              label="Nome"
              placeholder="Digite o nome da role..."
            />
            <div className="space-y-3 rounded-lg border p-3">
              <div className="font-medium text-sm">Permissões por grupo</div>
              {grupos.length ? (
                grupos.map((grupo) => {
                  const selected = getSelectedPermissions(grupo._id);
                  const permissionIds = (grupo.permissoes || [])
                    .map(getId)
                    .filter(Boolean);
                  const allChecked =
                    permissionIds.length > 0 &&
                    selected.length === permissionIds.length;

                  return (
                    <div key={grupo._id} className="rounded-md border p-3">
                      <label className="flex items-center gap-3">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={(checked) =>
                            setGroupPermissions(
                              grupo._id,
                              checked ? permissionIds : [],
                            )
                          }
                        />
                        <span className="font-medium">{grupo.name}</span>
                        <Badge variant="outline" className="ml-auto">
                          {selected.length}/{permissionIds.length}
                        </Badge>
                      </label>
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {(grupo.permissoes || []).map((permissao: any) => {
                          const permissaoId = getId(permissao);
                          return (
                            <label
                              key={permissaoId}
                              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                            >
                              <Checkbox
                                checked={selected.includes(permissaoId)}
                                onCheckedChange={(checked) => {
                                  const next = checked
                                    ? [...new Set([...selected, permissaoId])]
                                    : selected.filter((id) => id !== permissaoId);
                                  setGroupPermissions(grupo._id, next);
                                }}
                              />
                              <span className="text-sm">
                                {typeof permissao === "object"
                                  ? permissao.name
                                  : permissao}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-sm">
                  Cadastre grupos de permissão antes de configurar roles.
                </p>
              )}
            </div>
          </FieldGroup>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {updateData ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

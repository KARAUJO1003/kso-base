# Fluxo de Permissões do Frontend

Este fluxo protege o sistema em três camadas:

- **Página:** `AuthGuard` bloqueia acesso direto por URL.
- **Menu/sidebar:** `permission` remove itens sem acesso.
- **Botões e ações:** `Can` oculta ações sem permissão por padrão.

## Formato das permissões

Use permissões locais dentro de um `AuthGuard` com `groupSlug`:

```tsx
<AuthGuard groupSlug="usuarios" can={["ver"]}>
  <Can can={["criar"]}>
    <Button>Criar</Button>
  </Can>
</AuthGuard>
```

Use permissões completas no menu/sidebar:

```ts
{
  title: "Usuários",
  url: "/users",
  permission: "usuarios:ver",
}
```

A normalização também aceita permissões completas dentro do `AuthGuard` e do `Can`. Assim, `<Can can={["usuarios:criar"]}>` dentro de `AuthGuard groupSlug="usuarios"` continua validando `usuarios:criar`, sem gerar `usuarios:usuarios:criar`.

## Páginas

Proteja páginas com `AuthGuard`. Sem `fallback`, usuário não autenticado gera `unauthorized()` e usuário sem permissão gera `forbidden()`.

```tsx
import { AuthGuard } from "@/lib/auth";
import { MODULE_CONFIG, PERMISSIONS } from "@/features/example/utils/module-utils";

export default function Page() {
  return (
    <AuthGuard groupSlug={MODULE_CONFIG.moduleSlug} can={[PERMISSIONS.view]}>
      <ExampleFeature />
    </AuthGuard>
  );
}
```

Use `mode="any"` quando qualquer permissão da lista liberar o acesso:

```tsx
<AuthGuard groupSlug="relatorios" can={["ver", "exportar"]} mode="any">
  <RelatoriosFeature />
</AuthGuard>
```

## Botões e ações

Use `Can` dentro da página protegida. O padrão é ocultar a ação quando o usuário não tem permissão.

```tsx
import { Can } from "@/lib/auth";

<Can can={["criar"]}>
  <Button>Criar</Button>
</Can>

<Can can={["editar"]}>
  <Button>Editar</Button>
</Can>

<Can can={["excluir"]}>
  <Button variant="destructive">Excluir</Button>
</Can>
```

Use `fallback` apenas quando precisar mostrar uma ação bloqueada:

```tsx
<Can can={["editar"]} fallback={<Button disabled>Editar</Button>}>
  <Button>Editar</Button>
</Can>
```

## Menu/sidebar

Configure permissões completas no `sidebar-menu.config.ts`.

```ts
{
  title: "Estoque",
  url: "/relatorios/consulta-estoque",
  permission: "consulta-estoque:ver",
}
```

Para múltiplas permissões:

```ts
{
  title: "Financeiro",
  url: "/financeiro",
  permission: ["entradas:ver", "saidas:ver"],
  permissionMode: "any",
}
```

O menu continua respeitando `featureFlag`. Um item com filhos só aparece se ele e ao menos um filho passarem nas validações.

## Module utils

Cada módulo deve manter seus slugs e permissões em `utils/module-utils.ts`.

```ts
export const PERMISSIONS = {
  view: "ver",
  create: "criar",
  edit: "editar",
  delete: "excluir",
} as const;

export const MODULE_CONFIG = {
  moduleSlug: "usuarios",
} as const;
```

## Regra prática

- Página: `<AuthGuard groupSlug={MODULE_CONFIG.moduleSlug} can={[PERMISSIONS.view]}>`.
- Botões: `<Can can={[PERMISSIONS.create]}>`.
- Menu: `permission: "usuarios:ver"`.
- Admin (`isAdmin`) tem acesso total.

---
name: kso-base-design-system
description: Design-system rules for kso-base. Use when Codex creates or reviews UI, shadcn components, Tailwind classes, cn usage, globals.css, theme tokens, components/ui, components/ds, variants, forms, buttons, drawers, sheets, cards, layout spacing, or visual consistency.
---

# kso-base Design System

## Core Rules

- Do not modify `src/components/ui` to add app-specific variants or behavior.
- Create app variants, wrappers and composed primitives in `src/components/ds`.
  Create the folder before the first DS wrapper if it is still missing.
- Keep `src/themes/globals.css` close to the shadcn base. Move app-specific
  tokens, utilities and component CSS into imported files.
- Use semantic tokens first: `background`, `foreground`, `muted`, `accent`,
  `primary`, `destructive`, `border`, `input`, `ring`, `brand` and app tokens
  already present.
- Add new CSS variables only when the value is repeated and meaningful across
  modules.
- Brand/theme values live in `src/themes/brand.css` (base layer, neutral token
  names — never client/product names). `globals.css` is the semantic layer and
  should not need per-client edits. See `docs/ui-layers.md` and `DESIGN.md`.
- Non-color branding (title, description, social links, dev-facing name)
  lives in `src/config/brand.config.ts`, sourced from `NEXT_PUBLIC_BRAND_*` env
  vars — never hardcode a client/product name in a component.

## Tailwind And Classes

- Use `cn()` for class composition.
- Prefer object conditional form: `cn(base, { "classes": condition })`.
- Avoid raw one-off colors when a token exists.
- Avoid scattering spacing patterns such as `container mx-auto` across drawers
  and forms; move repeated layout rules to DS components.
- Keep icon buttons stable in size and use lucide icons when available.

## Component Direction

- Build composition-friendly components with `Root`, named parts or slots when
  customization matters.
- Avoid long prop lists for layout components. Prefer compound components,
  local context or a controller hook when several parts share the same state.
- Inherit props from the base component or native element with
  `ComponentProps`, `ComponentPropsWithRef` or appropriate generic types.
- Keep presentational components independent from router, API calls and feature
  permissions.
- Prefer DS wrappers for repeated sheet/drawer headers, actions, field sections,
  summary cards and table actions.
- Reuse existing project components before adding new variants or wrappers.
- For side panels that combine viewing and creating records, prefer `Card` for
  framing, `Tabs` for modes, `ScrollArea` for long lists, `Empty`/`Skeleton` for
  states, `Badge` for status/priority and `FormFields` for inputs.
- When using the shadcn sidebar block as page chrome, compose it in the route
  layout with `SidebarProvider`, `Sidebar` and `SidebarInset` instead of placing
  the shell inside feature content.

## Shadcn Upgrade Safety

- Treat `components/ui` as replaceable by the shadcn CLI.
- Put custom variants in `components/ds`.
- Keep global token changes isolated so shadcn updates can be applied with
  minimal conflict.
- When adding a shadcn component, inspect existing wrappers before changing the
  generated base component.

---
name: kso-base-architecture
description: Architecture guidance for the kso-base Next.js project. Use when Codex plans, reviews, or implements feature modules, app routes, hooks, providers, shared components, upgrade-readiness work, or any change that may affect boundaries between src/app, src/features, src/components, src/hooks, src/lib, and project scripts.
---

# kso-base Architecture

## Workflow

1. Inspect the existing feature or nearest similar module before changing code.
2. Keep `src/app` routes thin: route files should compose layouts, permission
   gates and feature entrypoints.
3. Put business modules in `src/features`. Keep module-specific components,
   constants, schemas, utils and table definitions inside the feature.
4. Put reusable UI primitives in `src/components/ds` or existing shared/layout
   folders, not in a specific feature.
5. Put cross-feature hooks in `src/hooks` only when they are generic enough to
   reuse.
6. Put pure utilities and framework-independent helpers in `src/lib`.
7. Before passing many props through component layers, consider a custom hook,
   local feature context, compound components or another pattern that keeps
   ownership clear.
8. Reuse existing project components, hooks and patterns before creating new
   primitives.
9. Prefer incremental extraction over broad refactors.

## Boundaries

- `src/app`: routing, params, metadata, layout composition and permissions.
- `src/features`: domain modules, feature UI, forms, table columns, modals,
  queries/mutations, local constants and local helpers.
- `src/components/ui`: shadcn/base components only.
- `src/components/ds`: app-level variants, wrappers and composed components.
  Create this folder before adding the first DS wrapper if it is still missing.
- `src/components/shared`: legacy/shared components that may later graduate to
  `ds` when they become design-system primitives.
- `src/hooks`: generic client hooks such as CRUD, modal, debounce, options and
  stable refs.
- `src/providers`: app-level contexts; keep state machines small and explicit.
- `src/modules/registry.ts`: single source of truth per business module (route,
  icon, permission, feature flag, default-enabled). Sidebar and per-client
  module toggles (`NEXT_PUBLIC_DISABLED_MODULES`) read from here — never
  duplicate this data elsewhere.
- `src/lib/feature-flags`: toggles for whole modules and for heavy optional
  subsystems (`websocket`, `pwa`, `offline`). `offline` is a stub by design —
  see `src/lib/offline/utils.ts` before enabling it.
- `scripts`: generators, audits and project automation.

## Props And Composition

- Avoid components with broad prop lists when the values belong to one feature
  flow.
- Use a local feature context when sibling components need the same controller
  state and actions.
- Use custom hooks when the logic is reusable or when UI should stay
  presentational.
- Use compound components such as `Header.Root`, `Header.Identity` and
  `Header.Actions` when the caller should arrange named parts.
- For operational side panels inside a feature, keep the panel owned by the
  feature and back it with a local hook/context instead of widening parent props.
- If a sidebar defines the route shell, put `SidebarProvider`, `Sidebar` and
  `SidebarInset` in the route `layout.tsx`; keep feature content focused on the
  main screen body.
- Do not hide unrelated global state in context just to avoid props; keep the
  context scoped to the feature or repeated pattern.

## State And Effects

- Use `useState` for simple independent local values.
- Use `useReducer` when four or more state values move together, when transitions
  have names, or when a modal/form/table flow becomes hard to reason about.
- Avoid `useEffect` for derived state. Prefer derived values, query options,
  form defaults, callbacks or reducer actions.
- Keep IO and server/cache behavior in hooks or services, not deeply embedded in
  presentational components.

## Upgrade Readiness

- Avoid framework APIs outside their intended layer.
- Keep client components as small as practical.
- Avoid global CSS dependencies for local component behavior.
- Prefer typed contracts and small composition boundaries over implicit coupling.
- Do not introduce broad aliases, monkey patches or framework-specific wrappers
  unless they solve a repeated problem.

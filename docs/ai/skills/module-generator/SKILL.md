---
name: kso-base-module-generator
description: Module scaffolding and generator guidance for kso-base. Use when Codex creates, reviews, updates, or documents feature modules, generate-module scripts, module templates, feature.tsx entrypoints, permissions, routes, CRUD screens, table/form/modal file layout, or plug-and-play architecture.
---

# kso-base Module Generator

## Target Shape

Each business module should be plug-and-play under `src/features` and keep its
own UI, constants, schemas and helpers local unless they become shared patterns.

Typical feature files:

- `feature.tsx`
- `components/table.tsx`
- `components/table-columns.tsx`
- form components such as `components/form-*.tsx`
- modal/action components such as edit/delete/create flows
- `utils/constants.ts`
- `utils/module-utils.ts`

## Module Registry

Every module (generated or hand-built) must have exactly one entry in
`src/modules/registry.ts` (`key`, `label`, `route`, `icon`, `category`,
`permissionBase`, `featureFlag`, `defaultEnabled`). `src/config/sidebar-menu.config.ts`
derives the sidebar from this registry — never hand-add a sidebar item outside
of it. To disable a module per client/deploy, add its `key` to
`NEXT_PUBLIC_DISABLED_MODULES` (comma-separated) instead of removing code.

## Naming

- Use clear module constants such as `MODULE_ROUTE`, `MODULE_CONFIG`,
  `PERMISSIONS`, query keys, mutation keys and modal keys.
- Keep component names aligned with the module name.
- Use Portuguese domain names when that is already the local convention.
- Avoid generic names that hide domain intent.

## Generation Rules

- Generated modules should use the same form, table, modal and CRUD patterns as
  the strongest existing features.
- Generated tables should prefer `createColumnBuilder`.
- Generated forms should use `FormProvider`, `FormFields`, `FieldGroup`, zod and
  typed default values.
- Generated pages should keep `src/app` route files thin.
- Generated variants must not modify `src/components/ui`.

## Template Evolution

- Update generator templates only after identifying repeated manual work in at
  least two modules or a clear architectural rule.
- Keep generated code conservative and easy to upgrade with Next/React.
- Prefer small optional hooks or DS components over large generated files.
- Add standards checks in warning mode before enforcing.

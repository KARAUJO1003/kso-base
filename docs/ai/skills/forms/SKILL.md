---
name: kso-base-forms
description: Form architecture for kso-base. Use when Codex creates, reviews, or refactors forms, drawers, sheets, validation schemas, react-hook-form usage, zod schemas, FormFields, FieldGroup, useCrud mutations, useLoadOptions, modalInstance flows, useState/useReducer decisions, or reusable form components.
---

# kso-base Forms

## Standard Stack

- Use `react-hook-form` with `zod` for validation.
- Use `FormProvider` for composed forms.
- Use `FormFields` from `src/components/shared/form-fields.tsx` for typed field
  wrappers.
- Use shadcn `Field`, `FieldGroup`, `FieldSet`, `FieldLegend` and related
  primitives for form structure.
- Use `useCrud` mutation hooks for standard create/update/delete behavior.
- Use `useLoadOptions` for async options instead of duplicating option loading.

## Layout

- Sheet/drawer forms should have consistent header, content and action areas.
- Compact forms inside operational panels should still use `FormProvider`,
  `FormFields` and `FieldGroup`; avoid raw input groups just because the form is
  small.
- Prefer actions in the header/right side or a consistent sticky action region
  when that is the local pattern.
- Avoid duplicating `container mx-auto` and repeated spacing in each form. Move
  repeated layout to DS form/sheet components when extracting.
- Keep complex sections as small subcomponents and pass typed form context or
  explicit props.

## State

- Use `useState` for independent UI values such as one open flag or one selected
  item.
- Use `useReducer` for related modal/form flows, staged item builders, multiple
  field-array helpers, report filters or wizard-like transitions.
- Avoid `watch` and `setValue` chains when the same behavior can be modeled with
  `useFieldArray`, computed values, controlled field wrappers or reducer
  actions.
- Avoid `useEffect` for simple derived state.

## Reusable Components

- Prefer generic components that inherit base/native props.
- Use composition pattern for sections, action bars, grouped fields and repeatable
  item editors.
- Keep feature-specific schemas and normalization inside the feature.
- Promote repeated patterns to `src/components/ds` only after they are reused or
  clearly design-system level.

## Review Checklist

- Form schema matches defaults and submit payload.
- Create/update modes share one typed path where possible.
- Loading, disabled and pending states are visible.
- Drawer/sheet close behavior does not lose data unexpectedly.
- Field labels, descriptions and errors come from the form primitives.

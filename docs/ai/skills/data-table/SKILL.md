---
name: kso-base-data-table
description: Data table standards for kso-base. Use when Codex creates, reviews, or refactors tables, columns, filters, TanStack Table usage, DataTable, createColumnBuilder, selection, actions, pagination, highlighted search text, or reusable table behavior inside feature modules.
---

# kso-base Data Table

## Standard Stack

- Use `DataTable` from `src/components/extensions/datatable/datatable.tsx`.
- Prefer `createColumnBuilder<TData>()` from
  `src/components/extensions/datatable/column-builder.tsx` for new columns.
- Keep table columns in the feature, usually `components/table-columns.tsx`.
- Keep feature table composition in `components/table.tsx`.
- Keep filters functional and typed; avoid UI-only filters that do not affect the
  table state.

## Column Rules

- Use typed accessors and column helpers instead of repeating manual column
  boilerplate.
- Use `DataTableColumnHeader` consistently for sortable headers.
- Use standard highlight behavior for searchable text.
- Keep row actions small and delegate modal opening to the feature table or modal
  hooks.
- Avoid embedding large business workflows inside cell renderers.

## Feature Integration

- Query keys, mutation keys, modal keys and route constants should stay near the
  feature.
- Table components should receive data and loading state explicitly.
- Avoid mixing API fetching, report generation and table rendering in one large
  component.
- Prefer reusable filter builders or DS table controls when the same filter shape
  appears across modules.

## Review Checklist

- Columns are typed and stable.
- Sorting and filtering match visible headers/controls.
- Row actions use existing modal patterns.
- Empty, loading and pagination states are handled by the table system.
- New table patterns can be copied by the module generator.

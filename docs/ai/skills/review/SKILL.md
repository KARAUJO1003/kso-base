---
name: kso-base-review
description: Review checklist for kso-base. Use when Codex is asked to review code, find out-of-standard areas, identify SOLID or clean-code issues, audit UI consistency, evaluate Next/React upgrade readiness, or propose improvements without changing application behavior.
---

# kso-base Review

## Review Order

1. Identify behavioral bugs and regressions first.
2. Check architecture boundaries and module ownership.
3. Check design-system rules and shadcn upgrade safety.
4. Check forms, tables, hooks and state management.
5. Check tests, validation gaps and upgrade risks.

## Architecture Checks

- `src/app` route files should stay thin.
- Business modules should live under `src/features`.
- Shared components should not depend on feature-specific APIs.
- Providers should not grow uncontrolled state stores.
- Large components should be split by responsibility.

## Clean Code And SOLID

- Prefer single-purpose components and hooks.
- Prefer typed contracts over `any`.
- Prefer composition over hard-coded variants.
- Flag components with many props and recommend a custom hook, local context,
  compound component or narrower component boundary.
- Prefer reducer state machines for complex UI flows.
- Avoid duplicating table columns, form sections, sheet layouts and option
  loaders.

## Design-System Checks

- No app-specific variants inside `src/components/ui`.
- Conditional classes should use `cn({ "classes": condition })`.
- Repeated UI patterns should move toward `src/components/ds`.
- New UI should reuse existing components and hooks before introducing another
  abstraction.
- Raw Tailwind colors and one-off spacing should be justified.
- Global CSS should not accumulate local component behavior.

## Upgrade Checks

- Watch for unnecessary `use client` boundaries.
- Avoid framework internals and unstable APIs.
- Keep shadcn components replaceable.
- Keep Tailwind tokens centralized.
- Ensure important flows have tests or clear manual verification steps.

## Output Style

- Lead with findings and risks.
- Include file paths and line references when reviewing concrete code.
- Separate high-confidence problems from suggestions.
- Recommend incremental fixes that preserve behavior.

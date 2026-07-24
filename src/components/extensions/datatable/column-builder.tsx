import * as React from "react";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column";
import { Highlight } from "@/components/extensions/search-highlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Accessor<TData, TValue> =
  | keyof TData
  | ((row: TData) => TValue)
  | "actions";

type ColumnVariant =
  | "text"
  | "date"
  | "dateTime"
  | "badge"
  | "tags"
  | "actions"
  | "boolean"
  | "number";

type HeaderOptions = {
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  defaultPinned?: "left" | "right";
  canHiddenColumn?: boolean;
};

type CellOptions<TData, TValue> = {
  highlight?: boolean;
  className?: string;
  emptyValue?: React.ReactNode;
  render?: (
    value: TValue,
    row: TData,
    context: CellRenderContext<TData, TValue>,
  ) => React.ReactNode;
};

type CellRenderContext<TData, TValue> = {
  row: Row<TData>;
  value: TValue;
  filterValue: string;
};

type ActionItem<TData> = {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  render?: (row: Row<TData>) => React.ReactNode;
  onClick?: (row: TData, tableRow: Row<TData>) => void;
};

type BadgeColor =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "zinc";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

type BadgeConfig = {
  label?: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

type FilterOption = {
  label?: string | boolean | number | null;
  value?: string | boolean | number | null;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
};

type ColumnBuilder<TData, TValue> = ColumnDef<TData, TValue> & {
  header: any;
  cell: any;
  variant: (variant: ColumnVariant) => ColumnBuilder<TData, TValue>;
  format: (
    format: string | ((value: TValue, row: TData) => React.ReactNode),
  ) => ColumnBuilder<TData, TValue>;
  colors: (
    colors: Record<string, BadgeColor | BadgeConfig>,
  ) => ColumnBuilder<TData, TValue>;
  actions: (actions: ActionItem<TData>[]) => ColumnBuilder<TData, TValue>;
  metaOptions: (
    meta: NonNullable<ColumnDef<TData, TValue>["meta"]>,
  ) => ColumnBuilder<TData, TValue>;
  options: (
    options: Partial<ColumnDef<TData, TValue>>,
  ) => ColumnBuilder<TData, TValue>;
  filterOptions: (options: FilterOption[]) => ColumnBuilder<TData, TValue>;
};

type ColumnState<TData, TValue> = {
  variant: ColumnVariant;
  title?: string;
  headerOptions?: HeaderOptions;
  format?: string | ((value: TValue, row: TData) => React.ReactNode);
  cell?: CellOptions<TData, TValue>;
  colors: Record<string, BadgeColor | BadgeConfig>;
  actions: ActionItem<TData>[];
};

type CreateColumnArgs<TData, TValue> = {
  accessor?: Accessor<TData, TValue>;
  acessor?: Accessor<TData, TValue>;
  id?: string;
};

const badgeColorClasses: Record<Exclude<BadgeColor, BadgeVariant>, string> = {
  blue: " bg-sky-500/10 text-sky-700",
  green: " bg-emerald-500/10 text-emerald-700",
  red: " bg-red-500/10 text-red-700",
  yellow: " bg-amber-500/10 text-amber-700",
  zinc: " bg-zinc-500/10 text-zinc-700",
};

const badgeVariantsSet = new Set<BadgeVariant>([
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
]);

function resolveAccessorId<TData, TValue>(
  accessor: Accessor<TData, TValue>,
  id?: string,
) {
  if (id) return id;
  if (typeof accessor === "string") return accessor;
  const inferredKey = accessor
    .toString()
    .match(/(?:row|\w+)\.([A-Za-z_$][\w$]*)/)?.[1];

  if (inferredKey) return inferredKey;

  return undefined;
}

function isEmptyValue(value: unknown) {
  return value === null || value === undefined || value === "";
}

function formatValue<TData, TValue>(
  value: TValue,
  row: TData,
  state: ColumnState<TData, TValue>,
) {
  if (isEmptyValue(value)) return value;

  if (typeof state.format === "function") {
    return state.format(value, row);
  }

  if (state.variant === "date" || state.variant === "dateTime") {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return value as React.ReactNode;

    return formatDate(date, state.format ?? "dd/MM/yy HH:mm", { locale: ptBR });
  }

  if (state.variant === "boolean") {
    return value ? "Sim" : "Não";
  }

  return value as React.ReactNode;
}

function getBadgeConfig<TData, TValue>(
  value: React.ReactNode,
  state: ColumnState<TData, TValue>,
): BadgeConfig {
  const key = String(value);
  const config = state.colors[key];

  if (!config) return { label: value, variant: "secondary" };

  if (typeof config === "string") {
    if (badgeVariantsSet.has(config as BadgeVariant)) {
      return { label: value, variant: config as BadgeVariant };
    }

    return {
      label: value,
      variant: "outline",
      className: badgeColorClasses[config as keyof typeof badgeColorClasses],
    };
  }

  return {
    label: config.label ?? value,
    variant: config.variant ?? "outline",
    className: config.className,
  };
}

function renderValue<TData, TValue>(
  value: TValue,
  row: Row<TData>,
  state: ColumnState<TData, TValue>,
  filterValue: string,
) {
  const formattedValue = formatValue(value, row.original, state);
  const emptyValue = state.cell?.emptyValue ?? null;

  if (state.cell?.render) {
    return state.cell.render(value, row.original, {
      row,
      value,
      filterValue,
    });
  }

  if (isEmptyValue(formattedValue)) return emptyValue;

  if (state.variant === "badge" || state.variant === "boolean") {
    const config = getBadgeConfig(formattedValue, state);
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  }

  if (state.variant === "tags") {
    const values = Array.isArray(formattedValue)
      ? formattedValue
      : [formattedValue];
    return (
      <div className="flex flex-wrap items-center gap-1">
        {values.filter(Boolean).map((tag) => {
          const config = getBadgeConfig(tag, state);
          return (
            <Badge
              key={String(tag)}
              variant={config.variant}
              className={config.className}
            >
              {config.label}
            </Badge>
          );
        })}
      </div>
    );
  }

  const content =
    state.cell?.highlight || state.variant === "text" ? (
      <Highlight
        search={filterValue ?? ""}
        className={cn("", state.cell?.className)}
      >
        {formattedValue as string | number}
      </Highlight>
    ) : (
      <span className={state.cell?.className}>{formattedValue}</span>
    );

  return <div className="flex items-center gap-3">{content}</div>;
}

function renderActions<TData, TValue>(
  row: Row<TData>,
  state: ColumnState<TData, TValue>,
) {
  return (
    <div className="flex items-center gap-1">
      {state.actions.map((action) => {
        if (action.render) {
          return (
            <React.Fragment key={action.label}>
              {action.render(row)}
            </React.Fragment>
          );
        }

        return (
          <Button
            key={action.label}
            type="button"
            size="sm"
            variant="ghost"
            className={action.className}
            onClick={() => action.onClick?.(row.original, row)}
          >
            {action.icon}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

export function createColumnBuilder<TData>() {
  return function col<TValue = unknown>(
    args: CreateColumnArgs<TData, TValue>,
  ): ColumnBuilder<TData, TValue> {
    const accessor = args.accessor ?? args.acessor;

    if (!accessor) {
      throw new Error("Informe accessor ou acessor ao criar a coluna.");
    }

    const id = resolveAccessorId(accessor, args.id);
    const state: ColumnState<TData, TValue> = {
      variant: "text",
      colors: {},
      actions: [],
    };

    const column = {} as ColumnBuilder<TData, TValue>;

    Object.assign(column, {
      id,
      ...(typeof accessor === "function"
        ? { accessorFn: accessor }
        : { accessorKey: String(accessor) }),
      enableSorting: true,
      enableColumnFilter: true,
      meta: {},
      header: (arg: any, options?: HeaderOptions) => {
        if (typeof arg === "string") {
          state.title = arg;
          state.headerOptions = options;
          column.enableSorting = options?.sortable ?? column.enableSorting;
          column.enableColumnFilter =
            options?.filterable ?? column.enableColumnFilter;
          column.meta = { ...column.meta, headerTitle: arg };

          if (options?.filterable === false) {
            column.meta = { ...column.meta, filterVariant: "disabled" };
          }

          return column;
        }

        return (
          <DataTableColumnHeader
            title={state.title ?? id ?? ""}
            column={arg.column}
            table={arg.table}
            className={state.headerOptions?.className}
            defaultPinned={state.headerOptions?.defaultPinned}
            canHiddenColumn={state.headerOptions?.canHiddenColumn}
            disabled={state.headerOptions?.sortable === false}
          />
        );
      },
      cell: (arg: any) => {
        const maybeOptions = arg as CellOptions<TData, TValue>;
        if (!arg?.row || !arg?.getValue) {
          state.cell = maybeOptions;
          return column;
        }

        const context = arg as {
          row: Row<TData>;
          getValue: () => TValue;
          cell: {
            column: {
              getFilterValue: () => unknown;
            };
          };
        };

        if (!context.row.original) return null;
        if (state.variant === "actions") {
          return renderActions(context.row, state);
        }

        return renderValue(
          context.getValue(),
          context.row,
          state,
          context.cell.column.getFilterValue() as string,
        );
      },
    });

    column.variant = (variant) => {
      state.variant = variant;

      if (variant === "actions") {
        column.id = column.id ?? "actions";
        column.enableSorting = false;
        column.enableColumnFilter = false;
        column.meta = {
          ...column.meta,
          isActions: true,
          filterVariant: "disabled",
        };
      }

      if (variant === "badge" || variant === "tags" || variant === "boolean") {
        column.meta = { ...column.meta, filterVariant: "select" };
      }

      if (variant === "date" || variant === "dateTime") {
        column.filterFn = (row, columnId, value) => {
          const rawValue = row.getValue<TValue>(columnId);
          const formattedValue = formatValue(rawValue, row.original, state);

          return String(formattedValue ?? "")
            .toLowerCase()
            .includes(String(value ?? "").toLowerCase());
        };
      }

      return column;
    };

    column.format = (format) => {
      state.format = format;
      return column;
    };

    column.colors = (colors) => {
      state.colors = colors;
      return column;
    };

    column.actions = (actions) => {
      state.actions = actions;
      return column.variant("actions");
    };

    column.metaOptions = (meta) => {
      column.meta = { ...column.meta, ...meta };
      return column;
    };

    column.options = (options) => {
      Object.assign(column, options);
      return column;
    };

    column.filterOptions = (options) => {
      column.meta = { ...column.meta, filterOptions: options };
      return column;
    };

    return column;
  };
}

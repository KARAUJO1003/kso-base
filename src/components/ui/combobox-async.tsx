"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Loader2, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

type PrimitiveItem = string;

function defaultGetOptionLabel<T>(item: T): string {
  if (typeof item === "string") return item;
  if (typeof item === "object" && item !== null && "label" in item) {
    return String((item as { label: unknown }).label);
  }
  return String(item);
}

function defaultGetOptionValue<T>(item: T): string {
  if (typeof item === "string") return item;
  if (typeof item === "object" && item !== null) {
    if ("value" in item) return String((item as { value: unknown }).value);
    if ("id" in item) return String((item as { id: unknown }).id);
  }
  return String(item);
}

type AsyncComboboxValue<T, M extends boolean | undefined> = M extends true
  ? T[]
  : T | null;

export type AsyncComboboxProps<
  T,
  M extends boolean | undefined = false,
> = {
  value?: AsyncComboboxValue<T, M>;
  defaultValue?: AsyncComboboxValue<T, M>;
  onValueChange?: (value: AsyncComboboxValue<T, M>) => void;

  multiple?: M;
  items?: T[];
  placeholder?: string;
  emptyText?: string;
  loadingText?: string;
  searchDelay?: number;

  getOptionLabel?: (item: T) => string;
  getOptionValue?: (item: T) => string;
  renderOption?: (item: T) => React.ReactNode;
  renderValue?: (values: T[]) => React.ReactNode;
  maxVisibleChips?: number;

  onSearch?: (query: string) => Promise<T[]>;
  creatable?: boolean;
  onCreate?: (query: string) => Promise<T> | T;

  className?: string;
  disabled?: boolean;
};

export function AsyncCombobox<
  T = PrimitiveItem,
  M extends boolean | undefined = false,
>({
  value,
  defaultValue,
  onValueChange,
  multiple,
  items: initialItems = [],
  placeholder = "Buscar...",
  emptyText = "Nenhum registro encontrado",
  loadingText = "Buscando...",
  searchDelay = 300,
  getOptionLabel = defaultGetOptionLabel,
  getOptionValue = defaultGetOptionValue,
  renderOption,
  renderValue,
  maxVisibleChips = 2,
  onSearch,
  creatable = false,
  onCreate,
  className,
  disabled,
}: AsyncComboboxProps<T, M>) {
  const [items, setItems] = React.useState<T[]>(initialItems);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = React.useState(false);

  const debouncedSearch = useDebounce(inputValue, searchDelay);

  // Memoiza initialItems para evitar loop infinito quando não é passado
  const stableInitialItems = React.useMemo(
    () => initialItems,
    [initialItems.length],
  );

  // Memoiza as funções para evitar re-renders
  const memoizedGetOptionLabel = React.useCallback(getOptionLabel, []);
  const memoizedGetOptionValue = React.useCallback(getOptionValue, []);

  const hasExactItem = items.some(
    (item) =>
      memoizedGetOptionLabel(item).toLowerCase() ===
      debouncedSearch.trim().toLowerCase(),
  );

  const canCreate =
    creatable &&
    !!onCreate &&
    !!debouncedSearch.trim() &&
    !isLoading &&
    !hasExactItem;

  React.useEffect(() => {
    setItems(stableInitialItems);
  }, [stableInitialItems]);

  // Carrega opções iniciais ao abrir o combobox
  React.useEffect(() => {
    if (!onSearch || !isOpen || hasLoadedInitial) return;

    let ignore = false;
    const searchFn = onSearch;

    async function loadInitialItems() {
      setIsLoading(true);

      try {
        const result = await searchFn("");

        if (!ignore) {
          setItems(result);
          setHasLoadedInitial(true);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitialItems();

    return () => {
      ignore = true;
    };
  }, [isOpen, onSearch, hasLoadedInitial]);

  React.useEffect(() => {
    if (!onSearch) return;

    const query = debouncedSearch.trim();

    if (!query) {
      // Se não tem query E ainda não carregou inicialmente, não faz nada
      // Deixa o outro useEffect (que depende de isOpen) carregar
      if (!hasLoadedInitial) {
        setItems(stableInitialItems);
        return;
      }

      // Se já tinha carregado E agora limpou, faz uma nova busca vazia
      let ignore = false;
      const searchFn = onSearch;

      async function reloadItems() {
        setIsLoading(true);

        try {
          const result = await searchFn("");

          if (!ignore) {
            setItems(result);
          }
        } finally {
          if (!ignore) {
            setIsLoading(false);
          }
        }
      }

      reloadItems();

      return () => {
        ignore = true;
      };
    }

    let ignore = false;
    const searchFn = onSearch;

    async function searchItems() {
      setIsLoading(true);

      try {
        const result = await searchFn(query);

        if (!ignore) {
          setItems(result);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    searchItems();

    return () => {
      ignore = true;
    };
  }, [debouncedSearch, onSearch, stableInitialItems, hasLoadedInitial]);

  async function handleCreate() {
    if (!onCreate) return;

    const createdItem = await onCreate(inputValue.trim());

    setItems((currentItems) => [createdItem, ...currentItems]);

    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      onValueChange?.([...currentValue, createdItem] as AsyncComboboxValue<
        T,
        M
      >);
      return;
    }

    onValueChange?.(createdItem as AsyncComboboxValue<T, M>);
    setInputValue(memoizedGetOptionLabel(createdItem));
  }

  const handleValueChange = React.useCallback(
    (nextValue: AsyncComboboxValue<T, M>) => {
      onValueChange?.(nextValue);

      // Detecta se o valor foi limpo
      const isCleared = multiple
        ? Array.isArray(nextValue) && nextValue.length === 0
        : nextValue === null;

      if (isCleared && onSearch) {
        // Reseta o estado para forçar uma nova busca
        setHasLoadedInitial(false);
        setInputValue("");
      }
    },
    [onValueChange, multiple, onSearch],
  );

  return (
    <BaseCombobox.Root
      items={items}
      value={value as never}
      defaultValue={defaultValue as never}
      multiple={multiple}
      disabled={disabled}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      onValueChange={(nextValue) =>
        handleValueChange(nextValue as AsyncComboboxValue<T, M>)
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      itemToStringLabel={memoizedGetOptionLabel}
      itemToStringValue={memoizedGetOptionValue}
      isItemEqualToValue={(item, selectedItem) =>
        memoizedGetOptionValue(item) === memoizedGetOptionValue(selectedItem)
      }
      filter={onSearch ? null : undefined}
      autoHighlight
    >
      {multiple ? (
        renderValue && Array.isArray(value) ? (
          <InputGroup className={cn("w-auto", className)}>
            <div className="flex flex-1 items-center px-3 h-8">
              {renderValue(value)}
            </div>
            <BaseCombobox.Input className="sr-only" placeholder={placeholder} />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                render={
                  <BaseCombobox.Trigger
                    aria-label="Abrir opções"
                    className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </BaseCombobox.Trigger>
                }
                data-slot="input-group-button"
                disabled={disabled}
              />
              <BaseCombobox.Clear
                aria-label="Limpar seleção"
                render={<InputGroupButton variant="ghost" size="icon-xs" />}
                disabled={disabled}
              >
                <X className="pointer-events-none" />
              </BaseCombobox.Clear>
            </InputGroupAddon>
          </InputGroup>
        ) : (
          <BaseCombobox.Chips
            className={cn(
              "flex items-center gap-1 bg-background dark:bg-input/30 bg-clip-padding px-2.5 has-data-[slot=combobox-chip]:px-1 border border-input has-aria-invalid:border-destructive focus-within:border-ring dark:has-aria-invalid:border-destructive/50 rounded-lg has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 focus-within:ring-3 focus-within:ring-ring/50 dark:has-aria-invalid:ring-destructive/40 h-8 overflow-hidden text-sm transition-colors",
              className,
            )}
          >
            {Array.isArray(value) && (
              <>
                {value.slice(0, maxVisibleChips).map((selectedValue) => (
                  <BaseCombobox.Chip
                    key={memoizedGetOptionValue(selectedValue)}
                    data-slot="combobox-chip"
                    className="flex justify-center items-center gap-1 bg-secondary has-disabled:opacity-50 px-2 py-1 has-data-[slot=combobox-chip-remove]:pr-0 rounded-md w-fit h-6 font-medium text-secondary-foreground text-xs whitespace-nowrap has-disabled:cursor-not-allowed has-disabled:pointer-events-none shrink-0"
                  >
                    {memoizedGetOptionLabel(selectedValue)}
                    <BaseCombobox.ChipRemove
                      render={<Button variant="ghost" size="icon-xs" />}
                      className="opacity-70 hover:opacity-100 rounded-sm"
                      data-slot="combobox-chip-remove"
                    >
                      <X className="size-3 pointer-events-none" />
                    </BaseCombobox.ChipRemove>
                  </BaseCombobox.Chip>
                ))}
                {value.length > maxVisibleChips && (
                  <span className="inline-flex items-center bg-muted px-2 py-1 rounded-md h-6 font-medium text-muted-foreground text-xs shrink-0">
                    +{value.length - maxVisibleChips} mais
                  </span>
                )}
              </>
            )}
            <BaseCombobox.Input
              data-slot="combobox-chip-input"
              className="flex-1 bg-transparent outline-none min-w-16 placeholder:text-muted-foreground"
              placeholder={placeholder}
            />
          </BaseCombobox.Chips>
        )
      ) : (
        <InputGroup className={cn("w-auto", className)}>
          <BaseCombobox.Input
            render={<InputGroupInput disabled={disabled} />}
            placeholder={placeholder}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              render={
                <BaseCombobox.Trigger
                  aria-label="Abrir opções"
                  className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )}
                </BaseCombobox.Trigger>
              }
              data-slot="input-group-button"
              disabled={disabled}
            />
            <BaseCombobox.Clear
              aria-label="Limpar seleção"
              render={<InputGroupButton variant="ghost" size="icon-xs" />}
              disabled={disabled}
            >
              <X className="pointer-events-none" />
            </BaseCombobox.Clear>
          </InputGroupAddon>
        </InputGroup>
      )}

      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={6} className="z-50 isolate">
          <BaseCombobox.Popup className="group/combobox-content relative max-h-(--available-height)  max-w-(--available-width) min-w-[calc(var(--anchor-width)+(--spacing(7)))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 w-fit">
            {isLoading ? (
              <div className="hidden group-data-empty/combobox-content:flex justify-center py-2 w-full text-muted-foreground text-sm text-center">
                {loadingText}
              </div>
            ) : (
              <>
                <BaseCombobox.Empty className="hidden group-data-empty/combobox-content:flex justify-center py-2 w-full text-muted-foreground text-sm text-center">
                  {emptyText}
                </BaseCombobox.Empty>

                {canCreate && (
                  <div className="p-1">
                    <button
                      type="button"
                      onClick={handleCreate}
                      className="relative flex items-center gap-2 hover:bg-accent py-1 pr-8 pl-1.5 rounded-md outline-hidden w-full text-sm hover:text-accent-foreground cursor-default select-none"
                    >
                      <Plus className="size-4 shrink-0" />
                      Criar &quot;{inputValue.trim()}&quot;
                    </button>
                  </div>
                )}

                <BaseCombobox.List className="p-1 data-empty:p-0 max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--available-height)-(--spacing(9))))] overflow-y-auto overscroll-contain scroll-py-1 no-scrollbar">
                  {(item: T) => (
                    <BaseCombobox.Item
                      key={memoizedGetOptionValue(item)}
                      value={item}
                      className="relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                      {renderOption?.(item) ?? memoizedGetOptionLabel(item)}
                      <BaseCombobox.ItemIndicator
                        render={
                          <span className="right-2 absolute flex justify-center items-center size-4 pointer-events-none" />
                        }
                      >
                        <Check className="pointer-events-none" />
                      </BaseCombobox.ItemIndicator>
                    </BaseCombobox.Item>
                  )}
                </BaseCombobox.List>
              </>
            )}
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}

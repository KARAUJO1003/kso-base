"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

type ComboboxSelectOption = {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  keywords?: string
}

type ComboboxSelectOptionValue = object | string | number
type ComboboxSelectKey<TOption> = TOption extends object
  ? Extract<keyof TOption, string>
  : never
type ComboboxSelectValueKey<TOption> = {
  [Key in ComboboxSelectKey<TOption>]: TOption[Key] extends
  | string
  | number
  | boolean
  | null
  | undefined
  ? Key
  : never
}[ComboboxSelectKey<TOption>]
type ComboboxSelectBooleanKey<TOption> = {
  [Key in ComboboxSelectKey<TOption>]: TOption[Key] extends
  | boolean
  | null
  | undefined
  ? Key
  : never
}[ComboboxSelectKey<TOption>]

type ComboboxSelectLoadContext = {
  limit: number
  signal: AbortSignal
}

type ComboboxSelectCreateContext = {
  search: string
  multiple: boolean
}

type ComboboxSelectCommonProps<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
> = {
  options?: TOption[]
  loadOptions?: (
    search: string,
    context: ComboboxSelectLoadContext
  ) => Promise<TOption[]>
  selectedOptions?: TOption[]
  valueKey?: ComboboxSelectValueKey<TOption>
  labelKey?: ComboboxSelectKey<TOption>
  descriptionKey?: ComboboxSelectKey<TOption>
  disabledKey?: ComboboxSelectBooleanKey<TOption>
  keywordsKey?: ComboboxSelectKey<TOption>
  renderSelectedOption?: (option: TOption, value: string) => React.ReactNode
  renderOption?: (option: TOption) => React.ReactNode
  onCreateOption?: (
    search: string,
    context: ComboboxSelectCreateContext
  ) => void | TOption | null | undefined | Promise<void | TOption | null | undefined>
  renderCreateOption?: (search: string) => React.ReactNode
  creatingMessage?: string
  limit?: number
  debounceMs?: number
  minSearchLength?: number
  placeholder?: string
  emptyMessage?: string
  loadingMessage?: string
  errorMessage?: string
  minSearchMessage?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
  contentClassName?: string
  listClassName?: string
}

type ComboboxSelectSingleProps<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
> = ComboboxSelectCommonProps<TOption> & {
  multiple?: false
  value?: string | TOption | null
  defaultValue?: string | TOption | null
  onValueChange?: (value: string, option: TOption | undefined) => void
}

type ComboboxSelectMultipleProps<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
> = ComboboxSelectCommonProps<TOption> & {
  multiple: true
  value?: Array<string | TOption>
  defaultValue?: Array<string | TOption>
  onValueChange?: (value: string[], options: TOption[]) => void
}

type ComboboxSelectProps<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
> =
  | ComboboxSelectSingleProps<TOption>
  | ComboboxSelectMultipleProps<TOption>

const isObjectOption = (option: unknown): option is Record<string, unknown> =>
  typeof option === "object" && option !== null

const getKeyValue = <TOption extends ComboboxSelectOptionValue>(
  option: TOption,
  key: ComboboxSelectKey<TOption> | undefined,
  fallbackKeys: string[]
) => {
  if (!isObjectOption(option)) return undefined
  if (key && key in option) return option[key]

  for (const fallbackKey of fallbackKeys) {
    if (fallbackKey in option) return option[fallbackKey]
  }

  return undefined
}

const toText = (value: unknown) => {
  if (value === null || value === undefined) return ""
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return ""
}

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const isOptionValue = <TOption extends ComboboxSelectOptionValue>(
  value: string | TOption | null | undefined
): value is TOption =>
  value !== null && value !== undefined && typeof value !== "string"

const selectedValueToArray = (value: string) => (value ? [value] : [])

function ComboboxSelect<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
>(props: ComboboxSelectProps<TOption>) {
  const {
    options = [],
    loadOptions,
    selectedOptions = [],
    valueKey,
    labelKey,
    descriptionKey,
    disabledKey,
    keywordsKey,
    renderSelectedOption,
    renderOption,
    onCreateOption,
    renderCreateOption,
    creatingMessage = "Criando...",
    limit = 20,
    debounceMs = 300,
    minSearchLength = 0,
    placeholder = "Selecione...",
    emptyMessage = "Nenhum resultado encontrado.",
    loadingMessage = "Buscando...",
    errorMessage = "Não foi possível carregar as opções.",
    minSearchMessage,
    disabled = false,
    invalid = false,
    className,
    contentClassName,
    listClassName,
  } = props

  const multiple = props.multiple === true
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [loadedOptions, setLoadedOptions] = React.useState<TOption[]>([])
  const [selectedOptionCache, setSelectedOptionCache] = React.useState<
    TOption[]
  >([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const debouncedSearch = useDebounce(search, debounceMs)

  const getOptionValue = React.useCallback(
    (option: TOption) =>
      toText(
        getKeyValue(option, valueKey, ["value", "_id", "id", "codigo"]) ??
        option
      ),
    [valueKey]
  )

  const getOptionLabel = React.useCallback(
    (option: TOption): React.ReactNode => {
      const label = getKeyValue(option, labelKey, [
        "label",
        "nome",
        "name",
        "descricao",
        "description",
      ])
      if (React.isValidElement(label)) return label
      return toText(label) || getOptionValue(option)
    },
    [getOptionValue, labelKey]
  )

  const getOptionDescription = React.useCallback(
    (option: TOption) =>
      getKeyValue(option, descriptionKey, ["description", "descricao", "sigla"]),
    [descriptionKey]
  )

  const getOptionDisabled = React.useCallback(
    (option: TOption) =>
      Boolean(getKeyValue(option, disabledKey, ["disabled"])),
    [disabledKey]
  )

  const getOptionText = React.useCallback(
    (option: TOption) =>
      [
        getOptionValue(option),
        toText(
          getKeyValue(option, labelKey, [
            "label",
            "nome",
            "name",
            "descricao",
            "description",
          ])
        ),
        toText(
          getKeyValue(option, descriptionKey, [
            "description",
            "descricao",
            "sigla",
          ])
        ),
        toText(getKeyValue(option, keywordsKey, ["keywords"])),
      ].join(" "),
    [descriptionKey, getOptionValue, keywordsKey, labelKey]
  )

  const rawSingleValue = !multiple ? props.value ?? props.defaultValue : null
  const rawMultipleValue = multiple
    ? props.value ?? props.defaultValue ?? []
    : []
  const selectedOptionsFromValue = React.useMemo(() => {
    if (multiple) {
      return rawMultipleValue.filter(isOptionValue<TOption>)
    }

    return isOptionValue<TOption>(rawSingleValue) ? [rawSingleValue] : []
  }, [multiple, rawMultipleValue, rawSingleValue])

  const normalizedSingleValue = !multiple
    ? isOptionValue<TOption>(rawSingleValue)
      ? getOptionValue(rawSingleValue)
      : rawSingleValue ?? ""
    : ""
  const normalizedMultipleValue = multiple
    ? rawMultipleValue.map((item) =>
      isOptionValue<TOption>(item) ? getOptionValue(item) : item
    )
    : []

  const renderSelectedLabel = React.useCallback(
    (option: TOption, value: string) =>
      renderSelectedOption?.(option, value) ?? getOptionLabel(option),
    [getOptionLabel, renderSelectedOption]
  )

  const visibleOptions = React.useMemo(() => {
    if (loadOptions) return loadedOptions.slice(0, limit)

    const normalizedSearch = normalizeText(debouncedSearch)

    return options
      .filter((option) =>
        normalizeText(getOptionText(option)).includes(normalizedSearch)
      )
      .slice(0, limit)
  }, [
    debouncedSearch,
    getOptionText,
    limit,
    loadOptions,
    loadedOptions,
    options,
  ])

  const shouldShowMinSearchMessage =
    debouncedSearch.length < minSearchLength && !isLoading

  const optionByValue = React.useMemo(() => {
    const map = new Map<string, TOption>()

    for (const option of [
      ...selectedOptions,
      ...selectedOptionsFromValue,
      ...selectedOptionCache,
      ...options,
      ...visibleOptions,
    ]) {
      map.set(getOptionValue(option), option)
    }

    return map
  }, [
    getOptionValue,
    options,
    selectedOptionCache,
    selectedOptionsFromValue,
    selectedOptions,
    visibleOptions,
  ])

  const getValueLabel = React.useCallback(
    (value: string) => {
      const option = optionByValue.get(value)
      return option ? toText(renderSelectedLabel(option, value)) : value
    },
    [optionByValue, renderSelectedLabel]
  )

  const createSearch = debouncedSearch.trim()
  const normalizedCreateSearch = normalizeText(createSearch)
  const hasExactOptionMatch = React.useMemo(() => {
    if (!normalizedCreateSearch) return false

    return Array.from(optionByValue.values()).some((option) => {
      const optionValueText = getOptionValue(option)
      const optionValue = normalizeText(optionValueText)
      const optionLabel = normalizeText(toText(getOptionLabel(option)))
      const selectedLabel = normalizeText(
        toText(renderSelectedLabel(option, optionValueText))
      )

      return (
        optionValue === normalizedCreateSearch ||
        optionLabel === normalizedCreateSearch ||
        selectedLabel === normalizedCreateSearch
      )
    })
  }, [
    getOptionLabel,
    getOptionValue,
    normalizedCreateSearch,
    optionByValue,
    renderSelectedLabel,
  ])

  const canCreateOption =
    Boolean(onCreateOption) &&
    Boolean(createSearch) &&
    !isLoading &&
    !hasError &&
    !shouldShowMinSearchMessage &&
    visibleOptions.length === 0 &&
    !hasExactOptionMatch

  const cacheSelectedOption = React.useCallback(
    (option: TOption) => {
      const value = getOptionValue(option)

      setSelectedOptionCache((current) => [
        ...current.filter((item) => getOptionValue(item) !== value),
        option,
      ])

      return value
    },
    [getOptionValue]
  )

  const selectedValues = React.useMemo(
    () =>
      multiple
        ? normalizedMultipleValue
        : selectedValueToArray(normalizedSingleValue),
    [multiple, normalizedMultipleValue, normalizedSingleValue]
  )

  const comboboxItems = React.useMemo(() => {
    const values = new Set(visibleOptions.map(getOptionValue))

    for (const value of selectedValues) {
      values.add(value)
    }

    return Array.from(values)
  }, [getOptionValue, selectedValues, visibleOptions])

  React.useEffect(() => {
    if (!open || !loadOptions) return

    if (debouncedSearch.length < minSearchLength) {
      setLoadedOptions([])
      setHasError(false)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    setIsLoading(true)
    setHasError(false)

    loadOptions(debouncedSearch, { limit, signal: controller.signal })
      .then((items) => {
        if (!controller.signal.aborted) {
          setLoadedOptions(items.slice(0, limit))
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoadedOptions([])
          setHasError(true)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [debouncedSearch, limit, loadOptions, minSearchLength, open])

  const messageForMinSearch =
    minSearchMessage ?? `Digite ao menos ${minSearchLength} caracteres.`

  const content = (
    <ComboboxSelectContent
      options={visibleOptions}
      isLoading={isLoading}
      isCreating={isCreating}
      hasError={hasError}
      errorMessage={errorMessage}
      loadingMessage={loadingMessage}
      creatingMessage={creatingMessage}
      emptyMessage={
        shouldShowMinSearchMessage ? messageForMinSearch : emptyMessage
      }
      canCreateOption={canCreateOption}
      createOptionLabel={
        renderCreateOption?.(createSearch) ?? `Criar "${createSearch}"`
      }
      onCreateOption={async () => {
        if (!onCreateOption || !createSearch || isCreating) return

        setIsCreating(true)

        try {
          const createdOption = await onCreateOption(createSearch, {
            search: createSearch,
            multiple,
          })

          if (!createdOption) return

          const createdValue = cacheSelectedOption(createdOption)

          if (multiple) {
            const selectedValues = Array.from(
              new Set([...normalizedMultipleValue, createdValue])
            )
            const selectedByValue = new Map(optionByValue)
            selectedByValue.set(createdValue, createdOption)

            props.onValueChange?.(
              selectedValues,
              selectedValues.flatMap((item) => {
                const option = selectedByValue.get(item)
                return option ? [option] : []
              })
            )
          } else {
            props.onValueChange?.(createdValue, createdOption)
          }

          setSearch("")
        } catch {
          setHasError(true)
        } finally {
          setIsCreating(false)
        }
      }}
      contentClassName={contentClassName}
      listClassName={listClassName}
      getOptionValue={getOptionValue}
      getOptionLabel={getOptionLabel}
      getOptionDescription={getOptionDescription}
      getOptionDisabled={getOptionDisabled}
      renderOption={renderOption}
    />
  )

  if (multiple) {
    const value = normalizedMultipleValue

    return (
      <Combobox
        items={comboboxItems}
        multiple
        disabled={disabled}
        itemToStringLabel={getValueLabel}
        itemToStringValue={(item) => item}
        value={props.value === undefined ? undefined : normalizedMultipleValue}
        defaultValue={
          props.value === undefined ? normalizedMultipleValue : undefined
        }
        onOpenChange={setOpen}
        onInputValueChange={setSearch}
        onValueChange={(nextValue) => {
          const selectedValues = Array.isArray(nextValue) ? nextValue : []
          setSelectedOptionCache((current) => {
            const currentByValue = new Map(
              current.map((option) => [getOptionValue(option), option])
            )

            for (const item of selectedValues) {
              const option = optionByValue.get(item)
              if (option) currentByValue.set(item, option)
            }

            return selectedValues.flatMap((item) => {
              const option = currentByValue.get(item)
              return option ? [option] : []
            })
          })
          props.onValueChange?.(
            selectedValues,
            selectedValues.flatMap((item) => {
              const option = optionByValue.get(item)
              return option ? [option] : []
            })
          )
        }}
      >
        <ComboboxChips className={className} aria-invalid={invalid}>
          <ComboboxValue>
            {value.map((item) => {
              const option = optionByValue.get(item)

              return (
                <ComboboxChip key={item}>
                  {option ? renderSelectedLabel(option, item) : item}
                </ComboboxChip>
              )
            })}
          </ComboboxValue>
          <ComboboxChipsInput placeholder={placeholder} disabled={disabled} />
        </ComboboxChips>
        {content}
      </Combobox>
    )
  }

  const selectedValue = normalizedSingleValue
  const selectedOption = selectedValue
    ? optionByValue.get(selectedValue)
    : undefined
  const displayValue =
    open || search
      ? search
      : selectedOption
        ? getValueLabel(selectedValue)
        : ""

  return (
    <Combobox
      items={comboboxItems}
      disabled={disabled}
      itemToStringLabel={getValueLabel}
      itemToStringValue={(item) => item}
      value={props.value === undefined ? undefined : normalizedSingleValue}
      defaultValue={
        props.value === undefined ? normalizedSingleValue : undefined
      }
      onOpenChange={setOpen}
      onInputValueChange={setSearch}
      onValueChange={(nextValue) => {
        const selectedValue = nextValue ?? ""
        const option = optionByValue.get(selectedValue)

        if (option) {
          cacheSelectedOption(option)
        }

        setSearch("")
        props.onValueChange?.(selectedValue, optionByValue.get(selectedValue))
      }}
    >
      <ComboboxInput
        value={displayValue}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid}
        showClear
      />
      {content}
    </Combobox>
  )
}

function ComboboxSelectContent<TOption extends ComboboxSelectOptionValue>({
  options,
  isLoading,
  isCreating,
  hasError,
  errorMessage,
  loadingMessage,
  creatingMessage,
  emptyMessage,
  canCreateOption,
  createOptionLabel,
  onCreateOption,
  contentClassName,
  listClassName,
  getOptionValue,
  getOptionLabel,
  getOptionDescription,
  getOptionDisabled,
  renderOption,
}: {
  options: TOption[]
  isLoading: boolean
  isCreating: boolean
  hasError: boolean
  errorMessage: string
  loadingMessage: string
  creatingMessage: string
  emptyMessage: string
  canCreateOption: boolean
  createOptionLabel: React.ReactNode
  onCreateOption: () => void
  contentClassName?: string
  listClassName?: string
  getOptionValue: (option: TOption) => string
  getOptionLabel: (option: TOption) => React.ReactNode
  getOptionDescription: (option: TOption) => unknown
  getOptionDisabled: (option: TOption) => boolean
  renderOption?: (option: TOption) => React.ReactNode
}) {
  return (
    <ComboboxContent className={cn("p-0", contentClassName)}>
      {isLoading && (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
          <Spinner />
          {loadingMessage}
        </div>
      )}
      {isCreating && (
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
          <Spinner />
          {creatingMessage}
        </div>
      )}
      <ComboboxEmpty>
        {canCreateOption ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 text-left"
            disabled={isCreating}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onCreateOption}
          >
            <PlusIcon />
            <span className="min-w-0 truncate">{createOptionLabel}</span>
          </Button>
        ) : hasError ? (
          errorMessage
        ) : isLoading || isCreating ? (
          null
        ) : (
          emptyMessage
        )}
      </ComboboxEmpty>
      <ComboboxList className={listClassName}>
        {options.map((option, index) => {
          const description = getOptionDescription(option)

          return (
            <ComboboxItem
              key={getOptionValue(option)}
              index={index}
              value={getOptionValue(option)}
              disabled={getOptionDisabled(option)}
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">
                  {renderOption?.(option) ?? getOptionLabel(option)}
                </span>
                {!renderOption && Boolean(description) && (
                  <span className="truncate text-xs text-muted-foreground">
                    {toText(description)}
                  </span>
                )}
              </span>
            </ComboboxItem>
          )
        })}
      </ComboboxList>
    </ComboboxContent>
  )
}

type ComboboxCreatableProps<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
> = ComboboxSelectProps<TOption> & {
  onCreateOption: NonNullable<
    ComboboxSelectCommonProps<TOption>["onCreateOption"]
  >
}

type ComboboxSingleProps<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
> = Omit<ComboboxSelectSingleProps<TOption>, "multiple">

type ComboboxMultipleProps<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
> = Omit<ComboboxSelectMultipleProps<TOption>, "multiple">

function ComboboxSingle<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
>(props: ComboboxSingleProps<TOption>) {
  return <ComboboxSelect<TOption> {...props} multiple={false} />
}

function ComboboxMultiple<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
>(props: ComboboxMultipleProps<TOption>) {
  return <ComboboxSelect<TOption> {...props} multiple />
}

function ComboboxCreatable<
  TOption extends ComboboxSelectOptionValue = ComboboxSelectOption,
>(props: ComboboxCreatableProps<TOption>) {
  return <ComboboxSelect<TOption> {...props} />
}

export {
  ComboboxSelect,
  ComboboxSingle,
  ComboboxMultiple,
  ComboboxCreatable,
  type ComboboxSelectLoadContext,
  type ComboboxSelectCreateContext,
  type ComboboxSelectOption,
  type ComboboxSingleProps,
  type ComboboxMultipleProps,
  type ComboboxSelectSingleProps,
  type ComboboxSelectMultipleProps,
  type ComboboxCreatableProps,
  type ComboboxSelectProps,
}

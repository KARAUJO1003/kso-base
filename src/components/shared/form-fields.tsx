"use client";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useFormContext,
  FieldValues,
  Path,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ComponentProps,
  ComponentPropsWithRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
  type MultiSelectValue,
} from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";
import {
  ComboboxSelect,
  type ComboboxSelectProps,
} from "@/components/ui/combobox-select";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  AsyncCombobox,
  type AsyncComboboxProps,
} from "@/components/ui/combobox-async";
import {
  Autocomplete as ReuiAutocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/reui/autocomplete";
import { useDebounce } from "@/hooks/use-debounce";
import { LoaderCircleIcon } from "lucide-react";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
} from "../reui/number-field";

type FieldOption<TOption = string> = {
  value: string;
  label: string;
  disabled?: boolean;
  item?: TOption;
};

type FieldFormInputProps<T extends FieldValues = any> = ComponentPropsWithRef<
  typeof Input
> & {
  label?: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
  prefix?: ReactNode;
  mask?: string;
  saveMaskedValue?: boolean;
  returnAsNumber?: boolean;
  currency?: boolean;
  currencyLocale?: string;
  currencyFractionDigits?: number;
};

type MaskedInputElementProps = ComponentPropsWithRef<typeof Input> & {
  mask?: string;
  saveMaskedValue?: boolean;
  returnAsNumber?: boolean;
  currency?: boolean;
  currencyLocale?: string;
  currencyFractionDigits?: number;
};

type FieldFormImageUploadProps<T extends FieldValues = any> = Omit<
  ComponentProps<typeof ImageUpload>,
  "value" | "onChange"
> & {
  label?: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
  description?: ReactNode;
};

const maskTokenHandlers = {
  "#": {
    matches: (value: string) => /\d/.test(value),
    transform: (value: string) => value,
  },
  S: {
    matches: (value: string) => /[a-z]/i.test(value),
    transform: (value: string) => value,
  },
  N: {
    matches: (value: string) => /[a-z0-9]/i.test(value),
    transform: (value: string) => value,
  },
  A: {
    matches: (value: string) => /[a-z]/i.test(value),
    transform: (value: string) => value.toUpperCase(),
  },
  a: {
    matches: (value: string) => /[a-z]/i.test(value),
    transform: (value: string) => value.toLowerCase(),
  },
  X: {
    matches: (value: string) => /[a-z0-9]/i.test(value),
    transform: (value: string) => value.toUpperCase(),
  },
  x: {
    matches: (value: string) => /[a-z0-9]/i.test(value),
    transform: (value: string) => value.toLowerCase(),
  },
} satisfies Record<
  string,
  {
    matches: (value: string) => boolean;
    transform: (value: string) => string;
  }
>;

const isMaskToken = (value: string): value is keyof typeof maskTokenHandlers =>
  value in maskTokenHandlers;

const applyMask = (value: unknown, mask?: string) => {
  const rawValue = String(value ?? "");

  if (!mask || !rawValue) return rawValue;

  let rawIndex = 0;
  let maskedValue = "";

  for (const maskChar of mask) {
    if (rawIndex >= rawValue.length) break;

    if (!isMaskToken(maskChar)) {
      maskedValue += maskChar;
      continue;
    }

    const handler = maskTokenHandlers[maskChar];

    while (rawIndex < rawValue.length) {
      const rawChar = rawValue[rawIndex];
      rawIndex += 1;

      if (handler.matches(rawChar)) {
        maskedValue += handler.transform(rawChar);
        break;
      }
    }
  }

  return maskedValue;
};

const parseCurrencyInput = (value: string, fractionDigits = 2) => {
  const digits = value.replace(/\D/g, "");

  if (!digits) return undefined;

  return Number(digits) / 10 ** fractionDigits;
};

const applyCurrencyMask = (value: string | number): string => {
  const numericValue =
    typeof value === "string"
      ? parseInt(value.replace(/\D/g, "") || "0")
      : value;

  const amount = numericValue;

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currency: "BRL",
    style: "currency",
  });
};

const formatCurrencyValue = (
  value: unknown,
  locale = "pt-BR",
  fractionDigits = 2,
) => {
  if (value === undefined || value === null || value === "") return "";

  const parseNumericValue = (rawValue: string) => {
    const trimmedValue = rawValue.trim();

    if (!trimmedValue) return undefined;

    const cleanValue = trimmedValue.replace(/[^\d,.-]/g, "");
    const normalizedValue = cleanValue.includes(",")
      ? cleanValue.replace(/\./g, "").replace(",", ".")
      : cleanValue;
    const parsedValue = Number(normalizedValue);

    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  };

  const numericValue =
    typeof value === "number" ? value : parseNumericValue(String(value));

  if (numericValue === undefined || Number.isNaN(numericValue)) return "";

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numericValue);
};

const extractMaskValue = (value: string, mask: string) => {
  let valueIndex = 0;
  let unmaskedValue = "";

  for (const maskChar of mask) {
    if (valueIndex >= value.length) break;

    if (!isMaskToken(maskChar)) {
      if (value[valueIndex] === maskChar) {
        valueIndex += 1;
      }
      continue;
    }

    const handler = maskTokenHandlers[maskChar];

    while (valueIndex < value.length) {
      const valueChar = value[valueIndex];
      valueIndex += 1;

      if (handler.matches(valueChar)) {
        unmaskedValue += handler.transform(valueChar);
        break;
      }
    }
  }

  return unmaskedValue;
};

const toOption = <TOption,>(
  item: TOption,
  itemToString?: (item: TOption) => string,
  itemToValue?: (item: TOption) => string,
): FieldOption<TOption> => {
  const optionLike =
    typeof item === "object" && item !== null
      ? (item as Partial<FieldOption>)
      : undefined;

  const label = itemToString
    ? itemToString(item)
    : typeof optionLike?.label === "string"
      ? optionLike.label
      : typeof item === "string"
        ? item
        : String(item);

  const value = itemToValue
    ? itemToValue(item)
    : typeof optionLike?.value === "string"
      ? optionLike.value
      : typeof item === "string"
        ? item
        : String(item);

  return { value, label, disabled: optionLike?.disabled, item };
};

const getSelectOptionValue = <TOption,>(
  item: TOption,
  itemToStringValue?: (item: TOption) => string,
) => {
  if (itemToStringValue && item != null) return itemToStringValue(item);

  const optionLike =
    typeof item === "object" && item !== null
      ? (item as Partial<FieldOption>)
      : undefined;

  if (
    optionLike &&
    "value" in optionLike &&
    "label" in optionLike &&
    optionLike.value != null
  ) {
    return String(optionLike.value);
  }

  return String(item ?? "");
};

const getSelectOptionLabel = <TOption,>(
  item: TOption,
  itemToStringLabel?: (item: TOption) => string,
) => {
  if (itemToStringLabel && item != null) return itemToStringLabel(item);

  const optionLike =
    typeof item === "object" && item !== null
      ? (item as Partial<FieldOption>)
      : undefined;

  if (optionLike?.label != null) return String(optionLike.label);
  if (optionLike?.value != null) return String(optionLike.value);

  return String(item ?? "");
};

const handleInputChange =
  (fieldOnChange: (value: unknown) => void, props: MaskedInputElementProps) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (props.type === "file") {
        const files = event.target.files;
        fieldOnChange(
          props.multiple ? Array.from(files ?? []) : (files?.[0] ?? null),
        );
        props.onChange?.(event);
        return;
      }

      if (props.type === "number" || props.type === "range") {
        fieldOnChange(
          event.target.value === "" ? undefined : event.target.valueAsNumber,
        );
        props.onChange?.(event);
        return;
      }

      if (props.currency) {
        fieldOnChange(
          parseCurrencyInput(event.target.value, props.currencyFractionDigits),
        );
        props.onChange?.(event);
        return;
      }

      if (props.mask === "currency") {
        const unmaskedValue = event.target.value.replace(/\D/g, "");
        fieldOnChange(
          (props.saveMaskedValue ?? true)
            ? applyCurrencyMask(unmaskedValue)
            : parseInt(unmaskedValue) || 0,
        );
        props.onChange?.(event);
        return;
      }

      if (props.mask) {
        const maskedValue = applyMask(event.target.value, props.mask);
        const unmaskedValue = extractMaskValue(maskedValue, props.mask);

        fieldOnChange(
          props.returnAsNumber
            ? parseInt(unmaskedValue) || 0
            : (props.saveMaskedValue ?? true)
              ? maskedValue
              : unmaskedValue,
        );
        props.onChange?.(event);
        return;
      }

      if (props.returnAsNumber) {
        fieldOnChange(parseInt(event.target.value) || 0);
        props.onChange?.(event);
        return;
      }

      fieldOnChange(event);
      props.onChange?.(event);
    };

const FieldFormInput = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  defaultValue,
  prefix,
  mask,
  saveMaskedValue = true,
  returnAsNumber,
  currency,
  currencyLocale = "pt-BR",
  currencyFractionDigits = 2,
  ...props
}: FieldFormInputProps<T>) => {
  const form = useFormContext<T>();

  const isCurrencyMask = mask === "currency";
  const inputType = currency || isCurrencyMask ? "text" : props.type;
  const inputMode = currency || isCurrencyMask ? "numeric" : props.inputMode;
  const fieldValue = (value: unknown) => {
    if (props.type === "file") return undefined;
    if (isCurrencyMask) return applyCurrencyMask(String(value ?? 0));
    if (currency) {
      return formatCurrencyValue(value, currencyLocale, currencyFractionDigits);
    }
    return applyMask(value, mask);
  };
  const inputChangeProps = {
    ...props,
    type: inputType,
    mask,
    saveMaskedValue,
    returnAsNumber,
    currency,
    currencyLocale,
    currencyFractionDigits,
  };

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          className={cn(fieldClassName)}
          data-invalid={fieldState.invalid}
          data-field={name}
        >
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          {prefix ? (
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>{prefix}</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...props}
                type={inputType}
                inputMode={inputMode}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={fieldValue(field.value)}
                onChange={handleInputChange(field.onChange, inputChangeProps)}
                id={name}
                aria-invalid={fieldState.invalid}
                autoComplete={props.autoComplete ?? "off"}
              />
            </InputGroup>
          ) : (
            <Input
              {...props}
              type={inputType}
              inputMode={inputMode}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              value={fieldValue(field.value)}
              onChange={handleInputChange(field.onChange, inputChangeProps)}
              id={name}
              aria-invalid={fieldState.invalid}
              autoComplete={props.autoComplete ?? "off"}
            />
          )}
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormSlider = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  valueType = "single",
  min = 0,
  max = 100,
  ...props
}: Omit<
  ComponentPropsWithRef<typeof Slider>,
  "value" | "defaultValue" | "onValueChange"
> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
  valueType?: "single" | "range";
}) => {
  const form = useFormContext<T>();

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const value =
          valueType === "range"
            ? Array.isArray(field.value)
              ? field.value
              : [min, max]
            : [typeof field.value === "number" ? field.value : min];

        return (
          <Field
            className={cn(fieldClassName)}
            data-invalid={fieldState.invalid}
          >
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            <Slider
              {...props}
              id={name}
              name={field.name}
              min={min}
              max={max}
              value={value}
              onValueChange={(nextValue) => {
                const values = Array.isArray(nextValue)
                  ? nextValue
                  : [nextValue];
                field.onChange(valueType === "range" ? values : values[0]);
              }}
              aria-invalid={fieldState.invalid}
            />
            {showError && fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};

const FieldFormOTP = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  maxLength = 6,
  ...props
}: Omit<
  ComponentPropsWithRef<typeof InputOTP>,
  "value" | "onChange" | "children" | "render"
> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
}) => {
  const form = useFormContext<T>();

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <InputOTP
            {...props}
            id={name}
            name={field.name}
            maxLength={maxLength}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={fieldState.invalid}
          >
            <InputOTPGroup>
              {Array.from({ length: maxLength }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormSelect = <T extends FieldValues = any, TOption = any>({
  name,
  label,
  options = [],
  fieldClassName,
  contentClassName,
  contentPortal,
  contentPositionerClassName,
  placeholder,
  showError = true,
  renderOption,
  itemToString,
  itemToValue,
  itemToStringValue,
  itemToStringLabel,
  ...props
}: Omit<
  ComponentPropsWithRef<typeof Select>,
  "onValueChange" | "defaultValue" | "value"
> & {
  label?: string;
  fieldClassName?: string;
  name: Path<T>;
  options?: TOption[];
  contentClassName?: string;
  contentPortal?: boolean;
  contentPositionerClassName?: string;
  placeholder?: string;
  showError?: boolean;
  renderOption?: (option: TOption) => ReactNode;
  itemToString?: (item: TOption) => string;
  itemToValue?: (item: TOption) => string;
  itemToStringValue?: (item: TOption) => string;
  itemToStringLabel?: (item: TOption) => string;
}) => {
  const form = useFormContext<T>();
  const valueToString = itemToStringValue ?? itemToValue;
  const labelToString = itemToStringLabel ?? itemToString;

  const getSelectedOption = (value: unknown) => {
    if (value == null || value === "") return null;

    return (
      options.find((option) => {
        if (Object.is(option, value)) return true;

        return getSelectOptionValue(option, valueToString) === String(value);
      }) ?? (value as TOption)
    );
  };

  const renderSelectedOption = (option: TOption) =>
    renderOption?.(option) ?? getSelectOptionLabel(option, labelToString);

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          className={cn(fieldClassName)}
          data-invalid={fieldState.invalid}
          data-field={name}
        >
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Select<TOption, boolean>
            {...props}
            name={name}
            items={options as any}
            itemToStringLabel={labelToString as any}
            itemToStringValue={valueToString as any}
            value={getSelectedOption(field.value) as any}
            onValueChange={(value) => {
              field.onChange(
                value == null
                  ? value
                  : getSelectOptionValue(value as TOption, valueToString),
              );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder || label}>
                {(value) => renderSelectedOption(value as TOption)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              className={contentClassName}
              portal={contentPortal}
              positionerClassName={contentPositionerClassName}
            >
              {options.map((option, idx) => (
                <SelectItem key={idx} value={option}>
                  {renderSelectedOption(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormNativeSelect = <T extends FieldValues = any, TOption = string>({
  name,
  label,
  options = [],
  fieldClassName,
  placeholder,
  showError = true,
  itemToString,
  itemToValue,
  ...props
}: Omit<ComponentPropsWithRef<typeof NativeSelect>, "defaultValue"> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  options?: TOption[];
  placeholder?: string;
  showError?: boolean;
  itemToString?: (item: TOption) => string;
  itemToValue?: (item: TOption) => string;
}) => {
  const form = useFormContext<T>();
  const normalizedOptions = options.map((option) =>
    toOption(option, itemToString, itemToValue),
  );

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <NativeSelect
            {...props}
            id={name}
            name={field.name}
            ref={field.ref}
            value={field.value ?? ""}
            onBlur={field.onBlur}
            onChange={(event) => {
              field.onChange(event.target.value);
              props.onChange?.(event);
            }}
            aria-invalid={fieldState.invalid}
          >
            {placeholder && (
              <NativeSelectOption value="">{placeholder}</NativeSelectOption>
            )}
            {normalizedOptions.map((option) => (
              <NativeSelectOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormMultiSelect = <T extends FieldValues = any, TOption = string>({
  label,
  name,
  fieldClassName,
  options = [],
  placeholder,
  showError = true,
  itemToString,
  itemToValue,
  ...props
}: Omit<
  ComponentPropsWithRef<typeof MultiSelector>,
  "values" | "onValuesChange"
> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  options?: TOption[];
  placeholder?: string;
  showError?: boolean;
  itemToString?: (item: TOption) => string;
  itemToValue?: (item: TOption) => string;
}) => {
  const form = useFormContext<T>();
  const normalizedOptions = options.map((option) =>
    toOption(option, itemToString, itemToValue),
  );

  const getSelectedOptions = (value: unknown): MultiSelectValue[] => {
    if (!Array.isArray(value)) return [];

    return value.map((selected) => {
      if (
        typeof selected === "object" &&
        selected !== null &&
        "value" in selected &&
        "label" in selected
      ) {
        return selected as MultiSelectValue;
      }

      const found = normalizedOptions.find(
        (option) => option.value === selected,
      );
      return found ?? { value: String(selected), label: String(selected) };
    });
  };

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <MultiSelector
            {...props}
            values={getSelectedOptions(field.value)}
            onValuesChange={(values) =>
              field.onChange(values.map((value) => value.value))
            }
          >
            <MultiSelectorTrigger
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
            >
              <MultiSelectorInput placeholder={placeholder ?? label} />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {normalizedOptions.map((option) => (
                  <MultiSelectorItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

type FieldFormComboboxSelectProps<
  T extends FieldValues,
  TOption extends object | string | number,
> = (ComboboxSelectProps<TOption> extends infer TProps
  ? TProps extends ComboboxSelectProps<TOption>
  ? Omit<TProps, "value" | "defaultValue">
  : never
  : never) & {
    label: string;
    fieldClassName?: string;
    name: Path<T>;
    showError?: boolean;
    selectedOption?: ReferenceValue<TOption>;
  };

type FieldFormAsyncComboboxProps<
  T extends FieldValues,
  TOption extends object | string | number,
  TMultiple extends boolean | undefined = false,
> = Omit<
  AsyncComboboxProps<TOption, TMultiple>,
  "value" | "defaultValue" | "onValueChange"
> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
  selectedOption?: ReferenceValue<TOption>;
  selectedOptions?: ReferenceValue<TOption>[];
  onValueChange?: (
    value: TMultiple extends true ? string[] : string | null,
    option: TMultiple extends true ? TOption[] : TOption | null,
  ) => void;
};

type AutocompleteLoadOptions<TOption> = (
  search: string,
  options: { limit: number; signal: AbortSignal },
) => Promise<TOption[]>;

type FieldFormAutocompleteProps<
  T extends FieldValues,
  TOption extends object | string | number,
> = Omit<
  ComponentPropsWithRef<typeof AutocompleteInput>,
  "children" | "defaultValue" | "onChange" | "value"
> & {
  label?: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
  loadOptions: AutocompleteLoadOptions<TOption>;
  limit?: number;
  debounceMs?: number;
  minSearchLength?: number;
  selectedOption?: TOption | null;
  selectedOptions?: TOption[];
  getOptionLabel?: (item: TOption) => string;
  getOptionValue?: (item: TOption) => string;
  renderOption?: (item: TOption) => ReactNode;
  onValueChange?: (value: string | null, option: TOption | null) => void;
  preloadOptionsOnOpen?: boolean;
  openOnInputClick?: boolean;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode | ((search: string) => ReactNode);
  errorMessage?: ReactNode;
  minSearchMessage?: ReactNode | ((minLength: number) => ReactNode);
  statusMessage?: (results: TOption[], search: string) => ReactNode;
  contentClassName?: string;
  listClassName?: string;
  statusClassName?: string;
};

type ReferenceObject = {
  _id?: string | number;
  id?: string | number;
  value?: string | number;
};

type ReferenceValue<TOption> = TOption | string | number | null | undefined;
type ReferenceArrayValue<TOption> =
  | ReferenceValue<TOption>
  | ReferenceValue<TOption>[];

export function getReferenceId(value: ReferenceValue<ReferenceObject>) {
  if (!value) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return String(value._id ?? value.id ?? value.value ?? "");
}

export function getReferenceOption<TOption extends object | string | number>(
  value: ReferenceValue<TOption>,
) {
  if (!value || typeof value === "string" || typeof value === "number") {
    return [];
  }

  return [value];
}

const getReferenceOptions = <TOption extends object | string | number>(
  value: ReferenceArrayValue<TOption>,
) => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => getReferenceOption(item));
  }

  return getReferenceOption(value);
};

const normalizeReferenceValue = (value: unknown) =>
  getReferenceId(value as ReferenceValue<ReferenceObject>);

const normalizeReferenceValues = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) =>
      getReferenceId(item as ReferenceValue<ReferenceObject>),
    )
    : [];

const getAsyncComboboxSelectedOption = <
  TOption extends object | string | number,
>(
  value: unknown,
  options: TOption[],
  getOptionValue?: (item: TOption) => string,
) => {
  if (value == null || value === "") return null;
  if (typeof value === "object") return value as TOption;

  const valueId = String(value);

  return (
    options.find((option) => {
      const optionId =
        getOptionValue?.(option) ?? getReferenceId(option as any);
      return optionId === valueId;
    }) ?? null
  );
};

const getAsyncComboboxSelectedOptions = <
  TOption extends object | string | number,
>(
  value: unknown,
  options: TOption[],
  getOptionValue?: (item: TOption) => string,
) => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const option = getAsyncComboboxSelectedOption(
      item,
      options,
      getOptionValue,
    );

    return option ? [option] : [];
  });
};

const defaultAutocompleteGetOptionLabel = <TOption,>(item: TOption) => {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  if (item && typeof item === "object") {
    const option = item as {
      label?: unknown;
      nome?: unknown;
      name?: unknown;
      codigo?: unknown;
      value?: unknown;
    };

    return String(
      option.label ??
      option.nome ??
      option.name ??
      option.codigo ??
      option.value ??
      "",
    );
  }

  return String(item ?? "");
};

const defaultAutocompleteGetOptionValue = <TOption,>(item: TOption) => {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  if (item && typeof item === "object") {
    const option = item as {
      _id?: unknown;
      id?: unknown;
      value?: unknown;
      codigo?: unknown;
      label?: unknown;
      nome?: unknown;
      name?: unknown;
    };

    return String(
      option._id ??
      option.id ??
      option.value ??
      option.codigo ??
      option.label ??
      option.nome ??
      option.name ??
      "",
    );
  }

  return String(item ?? "");
};

const mergeAutocompleteOptions = <TOption extends object | string | number>(
  optionGroups: TOption[][],
  getOptionValue: (item: TOption) => string,
) => {
  const seen = new Set<string>();
  const options: TOption[] = [];

  for (const group of optionGroups) {
    for (const option of group) {
      const value = getOptionValue(option);

      if (seen.has(value)) continue;

      seen.add(value);
      options.push(option);
    }
  }

  return options;
};

const normalizeAutocompleteSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const filterAutocompleteOptions = <TOption extends object | string | number>(
  options: TOption[],
  search: string,
  getOptionLabel: (item: TOption) => string,
  getOptionValue: (item: TOption) => string,
) => {
  const normalizedSearch = normalizeAutocompleteSearchText(search);

  if (!normalizedSearch) return options;

  return options.filter((option) => {
    const searchableText = normalizeAutocompleteSearchText(
      `${getOptionLabel(option)} ${getOptionValue(option)}`,
    );

    return searchableText.includes(normalizedSearch);
  });
};

const getAutocompleteSelectedOption = <
  TOption extends object | string | number,
>(
  value: unknown,
  options: TOption[],
  getOptionValue: (item: TOption) => string,
) => {
  if (value == null || value === "") return null;
  if (typeof value === "object") return value as TOption;

  const valueId = String(value);

  return options.find((option) => getOptionValue(option) === valueId) ?? null;
};

function AutocompleteFieldControl<
  T extends FieldValues,
  TOption extends object | string | number,
>({
  field,
  fieldState,
  referenceOptions,
  loadOptions,
  limit = 10,
  debounceMs = 300,
  minSearchLength = 1,
  getOptionLabel,
  getOptionValue,
  renderOption,
  onValueChange,
  label,
  placeholder,
  loadingMessage,
  emptyMessage,
  errorMessage,
  minSearchMessage,
  statusMessage,
  contentClassName,
  listClassName,
  statusClassName,
  disabled,
  showClear,
  showTrigger,
  preloadOptionsOnOpen,
  openOnInputClick,
  onBlur,
  ...props
}: Omit<
  FieldFormAutocompleteProps<T, TOption>,
  "fieldClassName" | "name" | "selectedOption" | "selectedOptions" | "showError"
> & {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  referenceOptions: TOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<TOption[]>([]);
  const [cachedOptions, setCachedOptions] = useState<TOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ReactNode>(null);
  const preloadedOptionsRef = useRef<TOption[]>([]);
  const debouncedSearchValue = useDebounce(searchValue, debounceMs);

  const optionLabel = getOptionLabel ?? defaultAutocompleteGetOptionLabel;
  const optionValue = getOptionValue ?? defaultAutocompleteGetOptionValue;
  const options = mergeAutocompleteOptions(
    [
      referenceOptions,
      cachedOptions,
      preloadedOptionsRef.current,
      searchResults,
    ],
    optionValue,
  );
  const selectedOption = getAutocompleteSelectedOption(
    field.value,
    options,
    optionValue,
  );

  const lastSyncedFieldValueRef = useRef(field.value);

  useEffect(() => {
    if (field.value === lastSyncedFieldValueRef.current) return;
    lastSyncedFieldValueRef.current = field.value;

    if (field.value == null || field.value === "") {
      setSearchValue("");
      return;
    }

    if (selectedOption) {
      setSearchValue(optionLabel(selectedOption));
    }
  }, [field.value, optionLabel, selectedOption]);

  useEffect(() => {
    if (disabled) return;

    const query = debouncedSearchValue.trim();
    const shouldPreloadOptions =
      preloadOptionsOnOpen && isOpen && query.length === 0;
    const shouldSearchOptions = isOpen && query.length >= minSearchLength;

    if (!shouldPreloadOptions && !shouldSearchOptions) {
      setSearchResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const requestQuery = shouldPreloadOptions ? "" : query;
    const controller = new AbortController();
    let ignore = false;

    setIsLoading(true);
    setError(null);

    loadOptions(requestQuery, { limit, signal: controller.signal })
      .then((results) => {
        if (ignore) return;

        if (shouldPreloadOptions) {
          preloadedOptionsRef.current = results;
          setSearchResults(results);
          return;
        }

        const localMatches = filterAutocompleteOptions(
          mergeAutocompleteOptions(
            [referenceOptions, cachedOptions, preloadedOptionsRef.current],
            optionValue,
          ),
          query,
          optionLabel,
          optionValue,
        );

        setSearchResults(
          mergeAutocompleteOptions([results, localMatches], optionValue),
        );
      })
      .catch((err) => {
        if (ignore || controller.signal.aborted) return;
        setSearchResults([]);
        setError(errorMessage ?? "Não foi possível carregar os resultados.");
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [
    debouncedSearchValue,
    disabled,
    errorMessage,
    isOpen,
    limit,
    loadOptions,
    minSearchLength,
    preloadOptionsOnOpen,
  ]);

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);

    if (!value) {
      field.onChange(null);
      onValueChange?.(null, null);
    }
  };

  const handleSelectOption = (option: TOption) => {
    const value = optionValue(option);

    setCachedOptions((currentOptions) => [option, ...currentOptions]);
    setSearchValue(optionLabel(option));
    field.onChange(value);
    onValueChange?.(value, option);
  };

  const renderStatus = () => {
    const query = searchValue.trim();
    const isShowingPreloadedOptions =
      preloadOptionsOnOpen && isOpen && query.length === 0;

    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <LoaderCircleIcon className="size-4 animate-spin" />
          {loadingMessage ?? "Buscando..."}
        </div>
      );
    }

    if (error) return error;

    if (query.length < minSearchLength && !isShowingPreloadedOptions) {
      return typeof minSearchMessage === "function"
        ? minSearchMessage(minSearchLength)
        : (minSearchMessage ??
          `Digite ao menos ${minSearchLength} caracteres para buscar.`);
    }

    if (!searchResults.length) {
      return typeof emptyMessage === "function"
        ? emptyMessage(query)
        : (emptyMessage ??
          (query
            ? `Nenhum resultado encontrado para "${query}".`
            : "Nenhum resultado encontrado."));
    }

    return (
      statusMessage?.(searchResults, query) ??
      `${searchResults.length} resultado${searchResults.length === 1 ? "" : "s"
      } encontrado${searchResults.length === 1 ? "" : "s"}`
    );
  };

  const shouldRenderPopup =
    !disabled &&
    (isOpen || searchValue.trim().length > 0 || isLoading || Boolean(error));

  return (
    <ReuiAutocomplete
      items={searchResults}
      value={searchValue}
      onValueChange={handleSearchValueChange}
      onOpenChange={setIsOpen}
      openOnInputClick={openOnInputClick}
      itemToStringValue={optionLabel}
      filter={null}
      autoHighlight="always"
    >
      <AutocompleteInput
        {...props}
        id={field.name}
        name={field.name}
        placeholder={placeholder ?? label}
        disabled={disabled}
        showClear={showClear}
        showTrigger={showTrigger}
        aria-invalid={fieldState.invalid}
        onBlur={(event) => {
          field.onBlur();
          onBlur?.(event);
        }}
      />
      {shouldRenderPopup && (
        <AutocompleteContent className={contentClassName}>
          <AutocompleteStatus className={statusClassName}>
            {renderStatus()}
          </AutocompleteStatus>
          <AutocompleteList className={listClassName}>
            {(option: TOption) => (
              <AutocompleteItem
                key={optionValue(option)}
                value={option}
                className="rounded-lg"
                onClick={() => handleSelectOption(option)}
              >
                {renderOption?.(option) ?? optionLabel(option)}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      )}
    </ReuiAutocomplete>
  );
}

const FieldFormAutocomplete = <
  T extends FieldValues = any,
  TOption extends object | string | number = string,
>({
  label,
  name,
  fieldClassName,
  showError = true,
  selectedOption,
  selectedOptions,
  limit = 10,
  debounceMs = 300,
  minSearchLength = 1,
  showClear = true,
  showTrigger = true,
  preloadOptionsOnOpen = true,
  openOnInputClick = false,
  ...props
}: FieldFormAutocompleteProps<T, TOption>) => {
  const form = useFormContext<T>();
  const referenceOptions = [
    ...(selectedOptions ?? []),
    ...(selectedOption ? [selectedOption] : []),
  ];

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          className={cn(fieldClassName)}
          data-invalid={fieldState.invalid}
          data-field={name}
        >
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <AutocompleteFieldControl<T, TOption>
            {...props}
            field={field}
            fieldState={fieldState}
            referenceOptions={referenceOptions}
            label={label}
            limit={limit}
            debounceMs={debounceMs}
            minSearchLength={minSearchLength}
            showClear={showClear}
            showTrigger={showTrigger}
            preloadOptionsOnOpen={preloadOptionsOnOpen}
            openOnInputClick={openOnInputClick}
          />
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormComboboxSelect = <
  T extends FieldValues = any,
  TOption extends object | string | number = string,
>({
  label,
  name,
  fieldClassName,
  showError = true,
  selectedOption,
  ...props
}: FieldFormComboboxSelectProps<T, TOption>) => {
  const form = useFormContext<T>();
  const selectedOptions = getReferenceOptions([
    ...(Array.isArray(props.selectedOptions)
      ? props.selectedOptions
      : props.selectedOptions
        ? [props.selectedOptions]
        : []),
    selectedOption,
  ]);

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          {props.multiple ? (
            <ComboboxSelect<TOption>
              {...props}
              multiple
              invalid={fieldState.invalid}
              selectedOptions={[
                ...selectedOptions,
                ...getReferenceOptions(
                  field.value as ReferenceArrayValue<TOption>,
                ),
              ]}
              value={normalizeReferenceValues(field.value)}
              onValueChange={(value, options) => {
                field.onChange(value);
                props.onValueChange?.(value, options);
              }}
            />
          ) : (
            <ComboboxSelect<TOption>
              {...props}
              invalid={fieldState.invalid}
              selectedOptions={[
                ...selectedOptions,
                ...getReferenceOptions(field.value as ReferenceValue<TOption>),
              ]}
              value={normalizeReferenceValue(field.value)}
              onValueChange={(value, option) => {
                field.onChange(value || null);
                props.onValueChange?.(value, option);
              }}
            />
          )}
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormAsyncCombobox = <
  T extends FieldValues = any,
  TOption extends object | string | number = string,
  TMultiple extends boolean | undefined = false,
>({
  label,
  name,
  fieldClassName,
  showError = true,
  selectedOption,
  selectedOptions,
  maxVisibleChips = 2,
  ...props
}: FieldFormAsyncComboboxProps<T, TOption, TMultiple>) => {
  const form = useFormContext<T>();
  const [cachedOptions, setCachedOptions] = useState<TOption[]>([]);
  const getOptionValue =
    props.getOptionValue ??
    ((item: TOption) =>
      getReferenceId(item as ReferenceValue<ReferenceObject>));
  const referenceOptions = getReferenceOptions([
    ...(selectedOptions ?? []),
    selectedOption,
  ]);

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const options = [
          ...referenceOptions,
          ...cachedOptions,
          ...getReferenceOptions(field.value as ReferenceArrayValue<TOption>),
        ];

        return (
          <Field
            className={cn(fieldClassName)}
            data-invalid={fieldState.invalid}
          >
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            {props.multiple ? (
              <AsyncCombobox<TOption, true>
                {...(props as Omit<
                  AsyncComboboxProps<TOption, true>,
                  "value" | "defaultValue" | "onValueChange"
                >)}
                multiple
                getOptionValue={getOptionValue}
                className={cn(props.className)}
                value={getAsyncComboboxSelectedOptions(
                  field.value,
                  options,
                  getOptionValue,
                )}
                onValueChange={(value) => {
                  const nextValue = value.map((option) =>
                    getOptionValue(option),
                  );

                  setCachedOptions(value);
                  field.onChange(nextValue);
                  props.onValueChange?.(
                    nextValue as TMultiple extends true
                    ? string[]
                    : string | null,
                    value as TMultiple extends true
                    ? TOption[]
                    : TOption | null,
                  );
                }}
                disabled={props.disabled}
              />
            ) : (
              <AsyncCombobox<TOption>
                {...(props as Omit<
                  AsyncComboboxProps<TOption>,
                  "value" | "defaultValue" | "onValueChange"
                >)}
                getOptionValue={getOptionValue}
                className={cn(props.className)}
                value={getAsyncComboboxSelectedOption(
                  field.value,
                  options,
                  getOptionValue,
                )}
                onValueChange={(value) => {
                  const nextValue = value ? getOptionValue(value) : null;

                  setCachedOptions(value ? [value] : []);
                  field.onChange(nextValue);
                  props.onValueChange?.(
                    nextValue as TMultiple extends true
                    ? string[]
                    : string | null,
                    value as TMultiple extends true
                    ? TOption[]
                    : TOption | null,
                  );
                }}
                disabled={props.disabled}
              />
            )}
            {showError && fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};

const FieldFormCheckbox = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  ...props
}: ComponentPropsWithRef<typeof Checkbox> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
}) => {
  const form = useFormContext<T>();
  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Checkbox
            {...props}
            id={name}
            name={field.name}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
            className="max-w-4"
          />
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormRadioGroup = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  options = [],
  showError = true,
  orientation = "vertical",
  ...props
}: ComponentPropsWithRef<typeof Select> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  options?: { value: string; label: string }[];
  showError?: boolean;
  orientation?: "horizontal" | "vertical";
}) => {
  const form = useFormContext<T>();

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <RadioGroup
            name={field.name}
            value={field.value ?? ""}
            onValueChange={field.onChange}
            aria-orientation={orientation}
          >
            {options.map((option) => (
              <FieldLabel
                key={option.value}
                htmlFor={`${name}-${option.value}`}
              >
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldTitle>{option.label}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormSwitch = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  flexReverse,
  orientation = "horizontal",
  ...props
}: ComponentPropsWithRef<typeof Checkbox> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
  flexReverse?: boolean;
  orientation?: "horizontal" | "vertical";
}) => {
  const form = useFormContext<T>();
  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field: { value = false, ...field }, fieldState }) => (
        <Field
          orientation={orientation}
          data-invalid={fieldState.invalid}
          className={cn(
            "my-4",
            {
              "bg-input/30 rounded-lg hover:bg-input/60 px-3 min-h-8 flex has-[>[data-slot=field-content]]:items-center space-y-0 border":
                orientation === "horizontal",
              "flex-row-reverse ": flexReverse && orientation === "horizontal",
              "flex-col-reverse": flexReverse && orientation === "vertical",
            },
            fieldClassName,
          )}
        >
          <FieldContent>
            <FieldLabel className="w-full h-full" htmlFor={name}>
              {label}
            </FieldLabel>
          </FieldContent>
          <Switch
            id={name}
            name={field.name}
            checked={value ?? false}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormToggle = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  ...props
}: ComponentPropsWithRef<typeof Toggle> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
}) => {
  const form = useFormContext<T>();
  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
          </FieldContent>
          <Toggle
            id={name}
            name={field.name}
            pressed={field.value ?? false}
            onPressedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormToggleGroup = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  options = [],
  showError = true,
  ...props
}: Omit<ComponentPropsWithRef<typeof ToggleGroup>, "onValueChange"> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  options?: { value: string; label: string }[];
  showError?: boolean;
}) => {
  const form = useFormContext<T>();

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
          </FieldContent>
          <ToggleGroup
            {...props}
            aria-invalid={fieldState.invalid}
            onValueChange={field.onChange}
            value={field.value ?? [""]}
          >
            {options.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                id={`${name}-${option.value}`}
                aria-invalid={fieldState.invalid}
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

const FieldFormTextArea = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  defaultValue,
  ...props
}: ComponentPropsWithRef<typeof Textarea> & {
  label: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
}) => {
  const form = useFormContext<T>();
  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Textarea
            {...props}
            {...field}
            value={field.value ?? ""}
            id={name}
            aria-invalid={fieldState.invalid}
            autoComplete="off"
          />
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
const FieldFormNumber = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  min,
  max,
  step = 1,
  ...props
}: Omit<
  ComponentPropsWithRef<typeof NumberField>,
  "value" | "defaultValue" | "onValueChange"
> & {
  label?: string;
  fieldClassName?: string;
  name: Path<T>;
  showError?: boolean;
}) => {
  const form = useFormContext<T>();
  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const value = typeof field.value === "number" ? field.value : null;

        return (
          <Field
            className={cn(fieldClassName)}
            data-invalid={fieldState.invalid}
            data-field={name}
          >
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            <NumberField
              {...props}
              id={name}
              value={value}
              onValueChange={(nextValue) => {
                field.onChange(nextValue);
              }}
              min={min}
              max={max}
              step={step}
              aria-invalid={fieldState.invalid}
            >
              <NumberFieldGroup>
                <NumberFieldDecrement type="button" />
                <NumberFieldInput />
                <NumberFieldIncrement type="button" />
              </NumberFieldGroup>
            </NumberField>
            {showError && fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};

const FieldFormImageUpload = <T extends FieldValues = any>({
  label,
  name,
  fieldClassName,
  showError = true,
  description,
  ...props
}: FieldFormImageUploadProps<T>) => {
  const form = useFormContext<T>();

  return (
    <Controller<T>
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field className={cn(fieldClassName)} data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <ImageUpload
            {...props}
            value={(field.value as File | null | undefined) ?? null}
            onChange={field.onChange}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {showError && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};

export const FormFields = {
  getReferenceId,
  getReferenceOption,
  Input: FieldFormInput,
  Select: FieldFormSelect,
  NativeSelect: FieldFormNativeSelect,
  MultiSelect: FieldFormMultiSelect,
  Autocomplete: FieldFormAutocomplete,
  ComboboxSelect: FieldFormComboboxSelect,
  AsyncCombobox: FieldFormAsyncCombobox,
  Checkbox: FieldFormCheckbox,
  RadioGroup: FieldFormRadioGroup,
  Switch: FieldFormSwitch,
  Toggle: FieldFormToggle,
  ToggleGroup: FieldFormToggleGroup,
  Textarea: FieldFormTextArea,
  Number: FieldFormNumber,
  ImageUpload: FieldFormImageUpload,
  Slider: FieldFormSlider,
  OTP: FieldFormOTP,
};

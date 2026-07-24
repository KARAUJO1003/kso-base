/**
 * Template for form modal component
 * @module form-modal
 */

/**
 * Generate form modal template
 * @param {object} params - Template parameters
 * @param {string} params.PASCAL - PascalCase module name
 * @param {string} params.KEBAB - kebab-case module name
 * @param {string} params.UPPER - UPPER_CASE module name
 * @param {string} params.pageTitle - Page title
 * @param {string} params.pageDescription - Page description
 * @param {string} params.mainFieldName - Main field name
 * @param {string} params.mainFieldLabel - Main field label
 * @returns {string} Form modal template
 */
export function formModalTemplate(params) {
  const {
    PASCAL,
    KEBAB,
    UPPER,
    pageTitle,
    pageDescription,
    mainFieldName,
    mainFieldLabel,
    fields,
  } = params;

  const resolvedFields =
    fields && fields.length > 0
      ? fields
      : [{ name: mainFieldName, label: mainFieldLabel }];

  const zodFields = resolvedFields
    .map(
      (f) =>
        `  ${f.name}: z.string().min(2, "${f.label} deve conter no mínimo 2 caracteres")`,
    )
    .join(",\n");

  const defaultValues = resolvedFields
    .map((f) => `      ${f.name}: ""`)
    .join(",\n");

  const valuesEntries = resolvedFields
    .map((f) => `      ${f.name}: modal.data?.${f.name} || ""`)
    .join(",\n");

  const controllers = resolvedFields
    .map(
      (f) => `<FormFields.Input<FormSchemaType>
                name="${f.name}"
                label="${f.label}"
                placeholder="Informe o ${f.label.toLowerCase()}"
              />`,
    )
    .join("\n");

  return `"use client";
import { useModalInstance } from "@/hooks/use-modal-instance";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet"
import * as z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFields } from "@/components/shared/form-fields";
import { Controller, FormProvider as Form, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreate, useUpdate } from "@/hooks/use-crud";
import {
  MODAL_KEYS_${UPPER},
  QUERIES_KEYS_${UPPER},
  MUTATION_KEYS_${UPPER},
} from "../utils/constants";
import { MODULE_ROUTE } from "../utils/module-utils";

const formSchema = z.object({
${zodFields},
});
type FormSchemaType = z.infer<typeof formSchema>;

export const Form${PASCAL}Modal = () => {
  const modal = useModalInstance(MODAL_KEYS_${UPPER}.FORM);
  return (
    <Sheet open={modal.open} onOpenChange={modal.onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-card z-10">
          <SheetTitle>${pageTitle}</SheetTitle>
          <SheetDescription>
            ${pageDescription}
          </SheetDescription>
        </SheetHeader>
        <Form${PASCAL} />
      </SheetContent>
    </Sheet>
  );
};

const Form${PASCAL} = () => {
  const modal = useModalInstance(MODAL_KEYS_${UPPER}.FORM);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
${defaultValues},
    },
    values: {
${valuesEntries},
    },
  });

  const onCreate = useCreate({
    mutationKey: [MUTATION_KEYS_${UPPER}.CREATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_${UPPER}.LIST],
  });

  const onUpdate = useUpdate({
    mutationKey: [MUTATION_KEYS_${UPPER}.UPDATE],
    route: MODULE_ROUTE,
    queryInvalidationKeys: [QUERIES_KEYS_${UPPER}.LIST],
  });

  const onSubmit = (values: FormSchemaType) => {
    if (modal.data?._id) {
      onUpdate.mutate({
        formData: values,
        id: modal.data._id,
      });
    } else {
      onCreate.mutate({
        formData: values,
      });
    }
    form.reset();
    modal.onClose();
  };

  return (
    <div className="flex flex-col gap-y-6 px-6 h-full">
     <Form {...form}>
        <form id="form-${KEBAB}" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
  ${controllers}
          </FieldGroup>
        </form>
      </Form>
      <Field orientation="horizontal" className="flex mt-auto py-2 sticky bottom-0 bg-card z-10">
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Limpar
        </Button>
        <Button className="flex-1" type="submit" form="form-${KEBAB}">
          Salvar
        </Button>
      </Field>
    </div>
  );
};
`;
}

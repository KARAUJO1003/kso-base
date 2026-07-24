"use client";

import { Trash2Icon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CardFrame } from "@/components/ui/card";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type FieldArrayTableField = {
  id: string;
};

type FieldArrayTableHeader = {
  key: string;
  render?: ReactNode;
  className?: string;
};

type FieldArrayTableContentProps<TField extends FieldArrayTableField> = Omit<
  ComponentProps<typeof CardFrame>,
  "children"
> & {
  fields: TField[];
  headers: FieldArrayTableHeader[];
  emptyMessage: ReactNode;
  children: (field: TField, index: number) => ReactNode;
  tableClassName?: string;
  emptyClassName?: string;
};

function Root({ className, ...props }: ComponentProps<typeof FieldSet>) {
  return (
    <FieldSet
      className={cn(
        "bg-accent/50 p-8 border border-border/50 rounded-xl",
        className,
      )}
      {...props}
    />
  );
}

function Header({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4",
        className,
      )}
      {...props}
    />
  );
}

function HeaderContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col", className)} {...props} />;
}

function Title(props: ComponentProps<typeof FieldLegend>) {
  return <FieldLegend {...props} />;
}

function Description({
  className,
  ...props
}: ComponentProps<typeof FieldDescription>) {
  return (
    <FieldDescription className={cn("text-balance", className)} {...props} />
  );
}

function Action({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex justify-start items-center shrink-0", className)}
      {...props}
    />
  );
}

function Content<TField extends FieldArrayTableField>({
  fields,
  headers,
  emptyMessage,
  children,
  className,
  tableClassName,
  emptyClassName,
  ...props
}: FieldArrayTableContentProps<TField>) {
  return (
    <CardFrame className={cn("w-full", className)} {...props}>
      <Table variant="card" className={cn("w-full", tableClassName)}>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.key} className={header.className}>
                {header.render}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length > 0 ? (
            fields.map((field, index) => children(field, index))
          ) : (
            <EmptyRow colSpan={headers.length} className={emptyClassName}>
              {emptyMessage}
            </EmptyRow>
          )}
        </TableBody>
      </Table>
    </CardFrame>
  );
}

function EmptyRow({
  colSpan,
  className,
  children,
  ...props
}: ComponentProps<typeof TableCell> & {
  colSpan: number;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={cn("h-24 text-muted-foreground text-center", className)}
        {...props}
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

function RemoveButton({
  className,
  children = "Remover",
  ...props
}: Omit<ComponentProps<typeof Button>, "type" | "variant">) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full text-destructive hover:text-destructive",
        className,
      )}
      {...props}
    >
      <Trash2Icon data-icon="inline-start" />
      <span>{children}</span>
    </Button>
  );
}

export const FieldArrayTable = {
  Root,
  Header,
  HeaderContent,
  Title,
  Description,
  Action,
  Content,
  EmptyRow,
  RemoveButton,
};

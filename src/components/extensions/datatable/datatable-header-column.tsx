"use client";
import { Column, Table } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { IconEyeOff } from "@tabler/icons-react";
import { PinIcon, PinOffIcon, SlidersHorizontalIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { DataTableColumnsToggle } from "./datatable-columns-toggle";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  table?: Table<TData>;
  title: string;
  defaultPinned?: "left" | "right";
  canHiddenColumn?: boolean;
  disabled?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  table,
  title,
  className,
  defaultPinned,
  canHiddenColumn = true,
  disabled = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  useEffect(() => {
    if (defaultPinned) {
      column.pin(defaultPinned); // Define o pin com base na flag ao montar o componente
    }
  }, [defaultPinned, column]);

  const showColumnsToggle = useCallback(handleShowColumnsToggle, [table]);
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  function handleShowColumnsToggle() {
    if (table) {
      return (
        <DataTableColumnsToggle table={table} side="bottom">
          <DropdownMenuItem className="flex justify-between gap-4">
            Colunas
            <SlidersHorizontalIcon className={cn(["mr-2 h-3.5 w-3.5 "])} />
          </DropdownMenuItem>
        </DataTableColumnsToggle>
      );
    }
    return null;
  }

  const isActions = column.id === "actions" || column.id === "expander";

  return (
    <div className={cn("flex items-center space-x-2 w-full")}>
      <DropdownMenu>
        <DropdownMenuTrigger
          nativeButton={!isActions}
          render={
            isActions ? (
              <div className={cn("flex w-full min-h-9", className)}></div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                title={title}
                className={cn(
                  [
                    "min-h-9 flex w-full justify-between gap-2 capitalize rounded-none data-[state=open]:bg-accent focus-visible:ring-transparent",
                  ],
                  className,
                )}
              />
            )
          }
        >
          {!isActions && (
            <div className="flex items-center gap-2 w-full">
              {column.getIsPinned() && (
                <PinIcon
                  className={cn(["ml-2 size-3.5 text-muted-foreground"])}
                />
              )}
              <span className="truncate">{title}</span>
              {column.getIsSorted() === "desc" ? (
                <ArrowDownIcon className="ml-2 w-4 h-4" />
              ) : column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 w-4 h-4" />
              ) : (
                <ChevronDownIcon className="ml-auto w-4 h-4" />
              )}
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.id !== "actions" && (
            <>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(false)}
                className={cn({
                  "text-muted-foreground": column.getIsSorted() !== "asc",
                  "text-blue-500": column.getIsSorted() === "asc",
                })}
              >
                <ArrowUpIcon className={cn(["mr-2 h-3.5 w-3.5"])} />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(true)}
                className={cn({
                  "text-muted-foreground": column.getIsSorted() !== "desc",
                  "text-blue-500": column.getIsSorted() === "desc",
                })}
              >
                <ArrowDownIcon className="mr-2 w-3.5 h-3.5" />
                Desc
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {showColumnsToggle()}
              {canHiddenColumn && (
                <DropdownMenuItem onClick={() => column.toggleVisibility()}>
                  Ocultar coluna
                  <IconEyeOff className="mr-2 ml-auto w-3.5 h-3.5 text-muted-foreground" />
                </DropdownMenuItem>
              )}
            </>
          )}
          <DropdownMenuItem
            // disabled={!!defaultPinned}
            onClick={() => column.pin("right")}
            className={cn(["text-foreground flex justify-between gap-4"], {
              "text-blue-500":
                defaultPinned === "right" || column.getIsPinned() === "right",
            })}
          >
            Fixa Direita
            <PinIcon
              className={cn(["mr-2 h-3.5 w-3.5 text-muted-foreground"], {
                "fill-blue-500 text-blue-500":
                  defaultPinned === "right" || column.getIsPinned() === "right",
              })}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            // disabled={!!defaultPinned}
            onClick={() => column.pin("left")}
            className={cn(["text-foreground flex justify-between gap-4"], {
              "text-blue-500":
                defaultPinned === "left" || column.getIsPinned() === "left",
            })}
          >
            Fixa Esquerda
            <PinIcon
              className={cn(["mr-2 h-3.5 w-3.5 text-muted-foreground"], {
                "fill-blue-500 text-blue-500":
                  defaultPinned === "left" || column.getIsPinned() === "left",
              })}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!column.getIsPinned()}
            onClick={() => column.pin(false)}
            className="flex justify-between gap-4"
          >
            Desafixar
            <PinOffIcon className={cn(["mr-2 h-3.5 w-3.5 "])} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { Settings2Icon } from "lucide-react";

export const DataTableColumnsToggle = ({
  table,
  columnTitles,
  className = "",
  children,
  side,
  align = "end",
}: {
  children?: React.ReactNode;
  table: Table<any>;
  columnTitles?: Record<string, string>;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) => {
  function formatColumnId(value: string): string {
    return value.replace(/_/g, " ");
  }

  return (
    <div>
      <DropdownMenu>
        {children ? (
          <DropdownMenuTrigger render={children as any}></DropdownMenuTrigger>
        ) : (
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className={cn("ml-auto", className)}
              />
            }
          >
            <span className="sr-only">Configurações de colunas</span>
            <Settings2Icon className="w-4 h-4" />
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent
          align={align}
          side={side}
          className="max-h-72 overflow-y-auto"
        >
          {table
            .getAllColumns()
            .filter((column: any) => column.getCanHide())
            .map((column: any) => {
              const columnTitleAux = columnTitles
                ? columnTitles[formatColumnId(column.id).replace(/\s+/g, "_")]
                : formatColumnId(column.id);
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnTitleAux}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

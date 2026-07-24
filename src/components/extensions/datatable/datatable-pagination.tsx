import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}
export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const { pageSize, pageIndex } = table.getState().pagination;
  const sizeTotal = table.getRowCount();
  const pageCount = Math.max(table.getPageCount(), 1);

  const itemsForPage = pageSize * (pageIndex + 1);

  return (
    <div className="flex sm:flex-row flex-col-reverse justify-between items-center gap-4 sm:gap-8 p-1 w-full overflow-auto">
      <div className="flex-1 text-muted-foreground text-sm whitespace-nowrap">
        {itemsForPage > sizeTotal ? sizeTotal : itemsForPage} de {sizeTotal}{" "}
        linha(s).
      </div>
      <div className="flex sm:flex-row flex-col-reverse items-center gap-4 sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm whitespace-nowrap">
            Linhas por página
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="bg-transparent w-[4.5rem] h-8">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-center items-center font-medium text-sm">
          Página {sizeTotal ? pageIndex + 1 : 0} de {sizeTotal ? pageCount : 0}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Ir para a primeira página"
            variant="outline"
            className="hidden lg:flex p-0 size-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon
              className="size-4"
              aria-hidden="true"
            />
          </Button>
          <Button
            aria-label="Ir para a página anterior"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon
              className="size-4"
              aria-hidden="true"
            />
          </Button>
          <Button
            aria-label="Ir para a próxima página"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon
              className="size-4"
              aria-hidden="true"
            />
          </Button>
          <Button
            aria-label="Ir para a última página"
            variant="outline"
            size="icon"
            className="hidden lg:flex size-8"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon
              className="size-4"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

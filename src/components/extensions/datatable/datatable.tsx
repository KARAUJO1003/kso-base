"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table as TableType,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DataTableColumnsToggle } from "./datatable-columns-toggle";
import { DataTableFilters } from "./datatable-filters";
import { DataTablePagination } from "./datatable-pagination";
import { DataTableSkeleton } from "./datatable-skeleton";

type FilterOptionsReturnType = {
  icon?: React.ReactNode;
  label?: string | boolean | number | null;
  value?: string | boolean | number | null;
  className?: string;
  disabled?: boolean;
}[];

// Extend ColumnMeta to allow cellClassName
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData = unknown, TValue = unknown> {
    cellClassName?: string;
    filterVariant?: "text" | "select" | "disabled" | "combobox" | any;
    headerClassName?: string;
    headerTitle?: string;
    headerIcon?: React.ReactNode;
    filterOptions?: FilterOptionsReturnType;
    isActions?: boolean;
  }
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-2px 0 2px -2px hsl(var(--border)) inset"
      : isFirstRightPinnedColumn
        ? "2px 0 2px -2px hsl(var(--border)) inset"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    backgroundColor: "hsl(var(--background))",
  };
};

interface DataTableProps<TData, TValue> {
  columns?: ColumnDef<TData, TValue>[];
  data?: TData[];
  tableContext?: TableType<TData>;
  toolbar?: React.ReactNode | ((table: TableType<TData>) => React.ReactNode);
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement;
  hiddePaginationBar?: boolean;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  sizePagination?: 10 | 20 | 30 | 40 | 50 | 0 | number;
  hiddenColumnsToggle?: boolean;
  exportTableFn?: (data: TData[]) => React.ReactNode | void;
  canQuerySearchParams?: boolean;
  columnTitles?: any;
  className?: string;
  showFooter?: boolean;
  footerClassName?: string;
  defaultSorting?: SortingState;
  pageSizeOptions?: number[];
  isPending?: boolean;
}
/*************  ✨ Codeium Command ⭐  *************/
/**
 * DataTableGlobal is a component that renders a data table with advanced features
 * such as sorting, filtering, pagination, and column visibility toggling.
 * 
 * @template TData - The type of data being passed to the table.

/******  493cf095-15d1-4b11-a194-92fcc5231332  *******/
export const DataTable = <TData, TValue>({
  data = [],
  tableContext,
  columns = [],
  columnTitles,
  defaultSorting = [],
  toolbar,
  className,
  exportTableFn,
  getRowCanExpand, // default: () => false
  renderSubComponent,
  hiddePaginationBar = false,
  hiddenColumnsToggle = false,
  sizePagination = 10,
  canQuerySearchParams = false,
  showFooter = false,
  footerClassName,
  pageSizeOptions,
  isPending,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: sizePagination,
  });
  const [queryUpdate, setQueryUpdate] = React.useState<Record<string, any>>({});
  const [debounceTimer, setDebounceTimer] =
    React.useState<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateSearchQuery = (updatedQuery: any) => {
    setQueryUpdate(updatedQuery);

    // Clear any existing debounce timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set a new timer
    const newTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      Object.keys(updatedQuery).forEach((key) => {
        if (updatedQuery[key]) {
          params.set(key, updatedQuery[key]);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(updatedPath);
    }, 500); // Delay of 500ms (adjust as needed)

    setDebounceTimer(newTimer);
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const generatedTable = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: !hiddePaginationBar ? setPagination : undefined,
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    ...(!hiddePaginationBar && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: (e: any) => {
      if (canQuerySearchParams) {
        e().forEach((filter: any) => {
          updateSearchQuery({ [filter.id]: filter.value });
        });
      }
      setColumnFilters(e);
    },
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(!hiddePaginationBar && { pagination }),
    },
    initialState: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Use sempre o hook, e só sobrescreva se tableContext existir
  const table = tableContext ?? generatedTable;
  const rowModels = table?.getRowModel().rows;

  if (isPending) {
    return (
      // <div className="flex justify-center items-center py-10 w-full">
      // </div>
      <DataTableSkeleton columnCount={5} cellWidths={["100%"]} />
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-end gap-4">
        {exportTableFn &&
          (exportTableFn(
            table.getFilteredRowModel().rows.map((r) => r.original),
          ) ||
            null)}
        {typeof toolbar === "function" ? toolbar(table) : toolbar || null}

        {!hiddenColumnsToggle && !toolbar && (
          <DataTableColumnsToggle table={table} columnTitles={columnTitles} />
        )}
      </div>
      <div className={cn("mt-2 border rounded-md overflow-x-auto", className)}>
        <Table className="relative w-full">
          <TableHeader className="top-0 min-w-full">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow
                key={index}
                // className="!border-b"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    className="relative bg-transparent backdrop-blur-md px-0 h-fit"
                    key={index}
                    style={{
                      width: header.getSize(),
                      ...getCommonPinningStyles(header.column),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col justify-between">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanFilter() ? (
                          <div className="flex bg-muted-foreground/10 mt-auto p-0 border-t">
                            <DataTableFilters column={header.column} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {rowModels?.length ? (
              rowModels.map((row, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableRow
                      key={index}
                      className="data-[expanded=true]:bg-primary-accent/20! hover:bg-muted/40!"
                      data-state={row.getIsSelected() && "selected"}
                      data-expanded={row.getIsExpanded()}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const pinned = cell.column.getIsPinned();
                        const isPinned =
                          pinned === "left" || pinned === "right";
                        return (
                          <TableCell
                            // className="bg-background"
                            key={index}
                            style={{ ...getCommonPinningStyles(cell.column) }}
                            className={cn(
                              "bg-background p-1.5",
                              cell.column.columnDef.meta?.cellClassName,
                              {
                                "p-0! h-auto backdrop-blur-3xl!": isPinned,
                              },
                            )}
                          >
                            <div
                              className={cn({
                                "border-l!": pinned === "right",
                                "border-r!": pinned === "left",
                                "bg-background-surface-100 flex-1 flex h-full p-1.5 ":
                                  isPinned,
                              })}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {renderSubComponent && (
                      <AnimatePresence initial={false}>
                        {row.getIsExpanded() && row.getCanExpand() && (
                          <motion.tr
                            key="expanded-row"
                            // initial={{ opacity: 0, height: 0 }}
                            // animate={{ opacity: 1, height: "auto" }}
                            // exit={{ opacity: 0, height: 0 }}
                            // transition={{ duration: 0.1, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <TableCell
                              colSpan={row.getVisibleCells().length}
                              className="p-0"
                              style={{ padding: 0, border: 0 }}
                            >
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.1,
                                  ease: "easeInOut",
                                }}
                                style={{ overflow: "hidden" }}
                              >
                                {renderSubComponent({ row })}
                              </motion.div>
                            </TableCell>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {showFooter &&
            table
              .getFooterGroups()
              .some((footerGroup) =>
                footerGroup.headers.some(
                  (header) =>
                    !header.isPlaceholder && header.column.columnDef.footer,
                ),
              ) && (
              <TableFooter className={footerClassName}>
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ ...getCommonPinningStyles(header.column) }}
                        className={cn(
                          "bg-muted/50 font-medium",
                          header.column.columnDef.meta?.cellClassName,
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext(),
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            )}
        </Table>
      </div>
      {hiddePaginationBar ? null : (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
};

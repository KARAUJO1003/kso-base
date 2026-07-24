import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The number of columns in the table.
   * @type number
   */
  columnCount: number;

  /**
   * The number of rows in the table.
   * @default 10
   * @type number | undefined
   */
  rowCount?: number;

  /**
   * The width of each cell in the table.
   * The length of the array should be equal to the columnCount.
   * Any valid CSS width value is accepted.
   * @default ["auto"]
   * @type string[] | undefined
   */
  cellWidths?: string[];

  /**
   * Flag to show the pagination bar.
   * @default true
   * @type boolean | undefined
   */
  withPagination?: boolean;

  /**
   * Flag to prevent the table cells from shrinking.
   * @default false
   * @type boolean | undefined
   */
  shrinkZero?: boolean;
}

export function DataTableSkeleton(props: DataTableSkeletonProps) {
  const {
    columnCount,
    rowCount = 10,
    cellWidths = ["auto"],
    withPagination = true,
    shrinkZero = false,
    className,
    ...skeletonProps
  } = props;

  return (
    <div
      className={cn("w-full space-y-2.5 overflow-auto", className)}
      {...skeletonProps}
    >
      <div className="flex justify-end items-center space-x-2 p-1 w-full overflow-auto">
        <Skeleton className="mr-auto w-[6.5rem] h-7" />
        <Skeleton className="w-[5.5rem] h-7" />
        <Skeleton className="w-20 h-7" />
        <Skeleton className="hidden lg:flex w-[6.25rem] h-7" />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow
                key={i}
                className="hover:bg-transparent"
              >
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : "auto",
                    }}
                  >
                    <Skeleton className="w-full h-6" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow
                key={i}
                className="hover:bg-transparent"
              >
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cellWidths[j],
                      minWidth: shrinkZero ? cellWidths[j] : "auto",
                    }}
                  >
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className="flex justify-between items-center gap-4 sm:gap-8 p-1 w-full overflow-auto">
          <Skeleton className="w-40 h-7 shrink-0" />
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-24 h-7" />
              <Skeleton className="w-[4.5rem] h-7" />
            </div>
            <div className="flex justify-center items-center font-medium text-sm">
              <Skeleton className="w-20 h-7" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="hidden lg:block size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="size-7" />
              <Skeleton className="hidden lg:block size-7" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

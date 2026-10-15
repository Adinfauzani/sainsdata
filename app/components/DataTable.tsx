'use client'

import * as React from 'react'
import {
  useTable,
  FlexRender,
  type ColumnVisibilityState,
  type RowData,
  type SortingState,
} from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Search,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { dataTableFeatures, type DataTableColumn } from '@/components/data-table-features'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type { DataTableColumn, DataTableFeatures } from '@/components/data-table-features'

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  /** Client-side search over the raw rows. Receives a lower-cased query. */
  searchFilter?: (row: TData, query: string) => boolean
  searchPlaceholder?: string
  /** Extra controls rendered at the end of the toolbar. */
  toolbar?: React.ReactNode
  emptyMessage?: string
  initialPageSize?: number
  className?: string
}

/**
 * Reusable data table following the shadcn/ui data-table guide (TanStack Table
 * v9 + the `<Table />` primitives). Search stays client-side so the same
 * markup works for the public and dashboard views.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  searchFilter,
  searchPlaceholder = 'Cari…',
  toolbar,
  emptyMessage = 'Tidak ada data.',
  initialPageSize = 10,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  })
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !searchFilter) return data
    return data.filter((row) => searchFilter(row, q))
  }, [data, query, searchFilter])

  // The page index is clamped while rendering so filtering or deleting rows can
  // never leave the table pointing at a page that no longer exists.
  const pageSize = pagination.pageSize
  const pageCount = Math.max(Math.ceil(filtered.length / pageSize), 1)
  const pageIndex = Math.min(pagination.pageIndex, pageCount - 1)

  const table = useTable({
    features: dataTableFeatures,
    data: filtered,
    columns,
    state: { sorting, pagination: { pageIndex, pageSize }, columnVisibility },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
  })

  const rows = table.getRowModel().rows
  const firstRow = filtered.length === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow = Math.min(firstRow + pageSize - 1, filtered.length)
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide())

  return (
    <div className={className}>
      {searchFilter || toolbar || hideableColumns.length ? (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {searchFilter ? (
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="ps-9"
              />
            </div>
          ) : null}

          <div className="ms-auto flex flex-wrap items-center gap-2">
            {toolbar}
            {hideableColumns.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Columns3 />
                    Kolom
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {hideableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      onSelect={(event) => event.preventDefault()}
                      className="capitalize"
                    >
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/60">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="-ms-2 data-[state=open]:bg-muted"
                        onClick={() =>
                          header.column.toggleSorting(header.column.getIsSorted() === 'asc')
                        }
                      >
                        <FlexRender header={header} />
                        {header.column.getIsSorted() === 'asc' ? (
                          <ArrowUp className="text-foreground" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ArrowDown className="text-foreground" />
                        ) : (
                          <ArrowUpDown className="text-muted-foreground/70" />
                        )}
                      </Button>
                    ) : (
                      <FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} className="transition-colors hover:bg-muted/40">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top whitespace-normal">
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filtered.length === 0
            ? 'Tidak ada data'
            : `Menampilkan ${firstRow}–${lastRow} dari ${filtered.length} data`}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Baris</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[4.5rem]" aria-label="Jumlah baris per halaman">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm font-medium">
            Halaman {pageIndex + 1} dari {pageCount}
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Halaman pertama</span>
              <ChevronsLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Halaman sebelumnya</span>
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Halaman berikutnya</span>
              <ChevronRight />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Halaman terakhir</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

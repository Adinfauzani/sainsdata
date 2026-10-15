import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'

/**
 * TanStack Table v9 is feature-based: anything not registered here is
 * tree-shaken out of the bundle. `text`/`alphanumeric` power the implicit
 * `sortFn: 'auto'` used by the string columns of the document and instrument
 * tables.
 */
export const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData>

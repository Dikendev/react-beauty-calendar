import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type Table as TStack,
    type VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

interface UseTanstackTable<T> {
    data: T[];
    columns: ColumnDef<T>[];
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    setPagination: React.Dispatch<
        React.SetStateAction<{
            pageIndex: number;
            pageSize: number;
        }>
    >;
    setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
    setRowSelection: React.Dispatch<React.SetStateAction<object>>;
    sorting?: SortingState | undefined;
    columnFilters?: ColumnFiltersState | undefined;
    columnVisibility?: VisibilityState | undefined;
    rowSelection?: RowSelectionState | undefined;
    pagination?: PaginationState | undefined;
}

const useTanstackTable = <T>({
    data,
    columns,
    setSorting,
    setColumnFilters,
    setPagination,
    setColumnVisibility,
    setRowSelection,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    pagination,
}: UseTanstackTable<T>): TStack<T> => {
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableMultiRowSelection: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    return table;
};

export default useTanstackTable;

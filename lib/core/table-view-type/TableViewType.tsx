// import {
//     type ColumnDef,
//     type ColumnFiltersState,
//     type SortingState,
//     type VisibilityState,
//     getCoreRowModel,
//     useReactTable,
// } from "@tanstack/react-table";

// import { flexRender } from "@tanstack/react-table";
// import { ArrowUpDown } from "lucide-react";
// import { useEffect, useState } from "react";
// import type { Procedure } from "../../@types";
// import type { Booking } from "../../@types/booking";
// import useGlobalStore from "../../hooks/use-global-store";
// import Columns from "../../pages/forms/table/Columns";
// import { DateUtils } from "../../utils/date-utils";
// import BadgeCustom from "../BadgeCustom";
// import { Button } from "../ui/Button";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "../ui/Table";

// interface TableViewTypeProps {
//     bookings: Booking[];
// }

// const TableViewType = ({ bookings }: TableViewTypeProps) => {
//     const [tableData, setTableData] = useState<Booking[]>(bookings);

//     const { daysOfWeek } = useGlobalStore();

//     const [sorting, setSorting] = useState<SortingState>([]);
//     const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//     const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
//         {},
//     );

//     const [pagination, setPagination] = useState({
//         pageIndex: 0,
//         pageSize: 5,
//     });

//     const bookingMockAccessor: ColumnDef<Booking>[] = [
//         {
//             accessorKey: "id",
//             id: "id",
//             header: ({ column }) => {
//                 return (
//                     <Button
//                         variant="ghost"
//                         onClick={() =>
//                             column.toggleSorting(column.getIsSorted() === "asc")
//                         }
//                     >
//                         Id
//                         <ArrowUpDown className="ml-2 h-4 w-2" />
//                     </Button>
//                 );
//             },
//             cell: ({ row }) => (
//                 <div className="lowercase">{row.getValue("id")}</div>
//             ),
//         },
//         {
//             accessorKey: "client.profile.name",
//             id: "client.profile.name",
//             header: () => <div className="text-right">Client</div>,
//             cell: ({ row }) => {
//                 return (
//                     <div className="text-right font-medium">
//                         {row.getValue("client.profile.name")}
//                     </div>
//                 );
//             },
//         },
//         {
//             accessorKey: "procedures",
//             id: "procedures",
//             header: () => <div className="text-right">procedures</div>,
//             cell: ({ row }) => {
//                 const procedures = row.getValue<Procedure[]>("procedures");
//                 return procedures.map((procedure) => (
//                     <BadgeCustom name={procedure.name} />
//                 ));
//             },
//         },
//         {
//             accessorKey: "payment.type",
//             id: "payment_type",
//             header: () => <div className="text-right">Payment Type</div>,
//             cell: ({ row }) => {
//                 return (
//                     <div className="text-right font-medium">
//                         {row.getValue("payment_type")}
//                     </div>
//                 );
//             },
//         },
//         {
//             accessorKey: "payment.total",
//             id: "payment_total",
//             header: () => <div className="text-right">Total</div>,
//             cell: ({ row }) => {
//                 return (
//                     <div className="text-right font-medium">
//                         {row.getValue("payment_total")}
//                     </div>
//                 );
//             },
//         },
//         {
//             accessorKey: "startAt",
//             id: "startAt",
//             header: () => <div className="text-right">startAt</div>,
//             cell: ({ row }) => {
//                 const date = row.getValue("startAt") as Date;

//                 return (
//                     <div className="text-right font-medium">
//                         {DateUtils.dateToString(date)}
//                     </div>
//                 );
//             },
//         },
//         {
//             accessorKey: "finishAt",
//             id: "finishAt",
//             header: () => <div className="text-right">finishAt</div>,
//             cell: ({ row }) => {
//                 const date = row.getValue("finishAt") as Date;

//                 return (
//                     <div className="text-right font-medium">
//                         {DateUtils.dateToString(date)}
//                     </div>
//                 );
//             },
//         },
//     ];

//     const bookingColumns = Columns<Booking>({
//         keyToCopy: "name",
//         accessors: bookingMockAccessor,
//     });

//     const table = useReactTable({
//         data: tableData,
//         columns: bookingMockAccessor,
//         onSortingChange: setSorting,
//         onColumnFiltersChange: setColumnFilters,
//         onPaginationChange: setPagination,
//         getCoreRowModel: getCoreRowModel(),
//     });

//     useEffect(() => {
//         setTableData(bookings);
//     }, [bookings, daysOfWeek]);

//     if (bookings.length === 0) {
//         return <div>No bookings</div>;
//     }

//     return (
//         <div className="rounded-md border">
//             <Table>
//                 <TableHeader>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                         <TableRow key={headerGroup.id}>
//                             {headerGroup.headers.map((header) => {
//                                 return (
//                                     <TableHead key={header.id}>
//                                         {header.isPlaceholder
//                                             ? null
//                                             : flexRender(
//                                                   header.column.columnDef
//                                                       .header,
//                                                   header.getContext(),
//                                               )}
//                                     </TableHead>
//                                 );
//                             })}
//                         </TableRow>
//                     ))}
//                 </TableHeader>
//                 <TableBody>
//                     {table.getRowModel().rows?.length ? (
//                         table.getRowModel().rows.map((row) => (
//                             <TableRow
//                                 key={row.id}
//                                 data-state={row.getIsSelected() && "selected"}
//                             >
//                                 {row.getVisibleCells().map((cell) => (
//                                     <TableCell key={cell.id}>
//                                         {flexRender(
//                                             cell.column.columnDef.cell,
//                                             cell.getContext(),
//                                         )}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell
//                                 colSpan={bookingColumns.length}
//                                 className="h-24 text-center"
//                             >
//                                 No results.
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// };

// export default TableViewType;

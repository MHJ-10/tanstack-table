import { useState } from "react";
import mockData from "../services/data.json";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowPinningState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { User } from "../types";
import Filter from "./Filter";
import PinnedRow from "./PinnedRow";

type Person = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.display({
    id: "Row Pin",
    header: () => <span>Row Pin</span>,
    cell: ({ row }) =>
      row.getIsPinned() ? (
        <button onClick={() => row.pin(false)}>❌</button>
      ) : (
        <div className="flex gap-1">
          <button onClick={() => row.pin("top")}>⬆️</button>
          <button onClick={() => row.pin("bottom")}>⬇️</button>
        </div>
      ),
  }),
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <div>
        <span>select</span>
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      </div>
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelper.accessor((row) => row.email, {
    id: "email",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Email</span>,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelper.accessor("phone", {
    header: () => "Phone",
    cell: (info) => info.getValue(),
    meta: {
      filterVariant: "text",
    },
    enableSorting: false,
  }),
];

type ColumnFilter = {
  id: string;
  value: unknown;
};
type ColumnFiltersState = ColumnFilter[];

type Pagination = {
  pageIndex: number;
  pageSize: number;
};

const Table = () => {
  const [data, setData] = useState<User[]>(() => [...mockData]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnPinning, setConlumnPinning] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
      sorting,
      columnPinning,
      columnVisibility,
      pagination,
      rowSelection,
      rowPinning,
    },
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnPinningChange: setConlumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onRowPinningChange: setRowPinning,
    keepPinnedRows: true,
    enableRowPinning: true,
  });

  return (
    <div className="flex flex-col h-screen max-w-4xl gap-3 mx-auto py-4">
      <div className="bg-green-300 w-full flex flex-row justify-between items-center text-xl border-2 border-gray-400 p-2 rounded-md">
        <span>Table Visibility: </span>
        <label>
          <input
            type="checkbox"
            checked={table.getIsAllColumnsVisible()}
            onChange={table.getToggleAllColumnsVisibilityHandler()}
          />
          Toggle All
        </label>
        {table.getAllColumns().map((col) => (
          <label>
            <input
              type="checkbox"
              checked={col.getIsVisible()}
              onChange={col.getToggleVisibilityHandler()}
            />
            {col.id}
          </label>
        ))}
      </div>
      <div className="space-x-2">
        <button
          className="py-2 px-4 bg-blue-500 disabled:bg-blue-200"
          disabled={!table.getState().sorting.length}
          onClick={() => table.resetSorting(true)}
        >
          Reset Sorting
        </button>
        {!!table.getSelectedRowModel().rows.length && (
          <button
            className="py-2 px-4 bg-blue-500 text-white"
            onClick={() => {
              const selectedRowIds = table
                .getSelectedRowModel()
                .rows.map((row) => row.original.id);
              const updatedData = data.filter(
                (d) => !selectedRowIds.includes(d.id)
              );
              setRowSelection({});
              setData(updatedData);
            }}
          >
            Delete Selected Rows
          </button>
        )}
      </div>
      <table className="border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b text-gray-800 uppercase"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 pr-2 py-4 font-medium text-left"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                  <div className="flex flex-col gap-2 [&>div]:w-full">
                    {header.column.getCanFilter() ? (
                      <Filter column={header.column} />
                    ) : null}
                    <div className="flex justify-between items-center">
                      {header.column.getIsPinned() !== "left" && (
                        <button onClick={() => header.column.pin("left")}>
                          {"<"}
                        </button>
                      )}
                      {header.column.getIsPinned() !== "right" && (
                        <button onClick={() => header.column.pin("right")}>
                          {">"}
                        </button>
                      )}
                      {header.column.getIsPinned() && (
                        <button onClick={() => header.column.pin(false)}>
                          X
                        </button>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getTopRows().map((row) => (
            <PinnedRow key={row.id} row={row} table={table} />
          ))}
          {table.getCenterRows().map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 pt-[14px] pb-[18px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {table.getBottomRows().map((row) => (
            <PinnedRow key={row.id} row={row} table={table} />
          ))}
        </tbody>
      </table>
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-4">
          <button
            className="border-2 px-2 bg-blue-500 disabled:bg-blue-200"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="border-2 px-2 bg-blue-500 disabled:bg-blue-200"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
          <button
            className="border-2 px-2 bg-blue-500 disabled:bg-blue-200"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <button
            className="border-2 px-2 bg-blue-500 disabled:bg-blue-200"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <div className="space-x-2">
          <label htmlFor="page-input">Go to page:</label>
          <input
            id="page-input"
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = +e.target.value - 1;
              table.setPageIndex(
                page > table.getPageCount() ? table.getPageCount() - 1 : page
              );
            }}
            min={1}
            max={table.getPageCount()}
          />
        </div>
        <div className="space-x-2">
          <label htmlFor="select-page-size">Page Size</label>
          <select
            id="select-page-size"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(+e.target.value)}
          >
            {[4, 5, 8, 10].map((num) => (
              <option>{num}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Table;

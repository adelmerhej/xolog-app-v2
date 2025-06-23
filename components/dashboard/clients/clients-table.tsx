"use client";

import React, { useMemo, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { saveAs } from "file-saver";

type Client = {
  FullName: string;
  PhoneNumber: string;
  MobileNumber: string;
  Email: string;
  Address: string;
  Website: string;
  Activities: string;
  Rating: string;
  ActiveDate: string; // ISO date string
};

const defaultData: Client[] = [
  {
    FullName: "John Doe",
    PhoneNumber: "123-456-7890",
    MobileNumber: "987-654-3210",
    Email: "john@example.com",
    Address: "123 Main St",
    Website: "https://example.com",
    Activities: "Sales",
    Rating: "5",
    ActiveDate: "2024-05-20",
  },
  // Add more sample clients as needed
];

export default function ClientsTable() {
  const [data, setData] = useState(() => [...defaultData]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: "FullName",
        header: "Full Name",
      },
      {
        accessorKey: "PhoneNumber",
        header: "Phone",
      },
      {
        accessorKey: "MobileNumber",
        header: "Mobile",
      },
      {
        accessorKey: "Email",
        header: "Email",
      },
      {
        accessorKey: "Address",
        header: "Address",
      },
      {
        accessorKey: "Website",
        header: "Website",
        cell: ({ getValue }) => (
          <a href={getValue() as string} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            {getValue() as string}
          </a>
        ),
      },
      {
        accessorKey: "Activities",
        header: "Activities",
      },
      {
        accessorKey: "Rating",
        header: "Rating",
      },
      {
        accessorKey: "ActiveDate",
        header: "Active Date",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDuplicate(row.original)}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  function handleAddNew() {
    alert("Add new client - implement form or modal");
  }

  function handleEdit(client: Client) {
    alert(`Edit client: ${client.FullName}`);
  }

  function handleDuplicate(client: Client) {
    const duplicated = { ...client };
    duplicated.FullName += " (Copy)";
    setData((d) => [...d, duplicated]);
  }

  function handleDelete(client: Client) {
    if (confirm(`Delete client: ${client.FullName}?`)) {
      setData((d) => d.filter((c) => c !== client));
    }
  }

  function handleExportCSV() {
    const headers = columns
      .filter((col) => col.id !== "actions")
      .map((col) => col.header?.toString() || (typeof col.id === "string" ? col.id : "") || "");
    const rows = table.getFilteredRowModel().rows.map((row) =>
      headers.map((header) => {
        const col = columns.find(
          (c) => (c.header === header || (typeof c.id === "string" && c.id === header)) && c.id !== "actions"
        );
        if (!col) return "";
        const accessor = typeof col.id === "string" ? col.id : "";
        return row.getValue(accessor);
      })
    );

    let csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map((val) => `"${val}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "clients-export.csv");
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search clients..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            Export CSV
          </Button>
          <Button onClick={handleAddNew}>Add New</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-left">
                  {header.isPlaceholder
                    ? null
                    : (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: "▲",
                          desc: "▼",
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                No clients found.
              </TableCell>
            </TableRow>
          )}

          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

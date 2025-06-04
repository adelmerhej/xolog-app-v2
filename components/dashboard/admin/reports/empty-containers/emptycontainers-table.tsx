/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useMemo } from "react";
import { IEmptyContainer } from "@/types/reports/IEmptyContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TotalProfitComponent() {
  const [jobs, setJobs] = useState<IEmptyContainer[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [grandTotalProfit, setGrandTotalProfit] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // When switching from mobile to desktop, show all columns
      if (!mobile && isMobile) {
        const newVisibility: VisibilityState = {};
        table.getAllLeafColumns().forEach((col) => {
          newVisibility[col.id] = true;
        });
        setColumnVisibility(newVisibility);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Presets for column visibility
  const presets = [
    {
      name: "All",
      columns: [
        "OrderNo",
        "JobNo",
        "ReferenceNo",
        "JobDate",
        "DepartmentName",
        "CustomerName",
        "Ata",
        "TejrimDate",
        "Mbol",
        "dtCntrToCnee",
        "ContainerNo",
        "CarrierName",
        "UserName",
        "Notes",
        "ArrivalDays",
        "TejrimDays",
        "DiffCntrToCnee",
        "Departure",
        "Destination",
        "ArrivalDays",
        "TejrimDays",
        "DiffCntrToCnee"

      ],
    },
    {
      name: "Default",
      columns: [
        "JobNo",
        "Ata",
        "TejrimDate",
        "Mbol",
        "CustomerName",
        "dtCntrToCnee",
        "ContainerNo",
        "CarrierName",
        "UserName",
        "Notes",
        "ArrivalDays",
        "TejrimDays",
        "DiffCntrToCnee"
      ],
    },
    {
      name: "Minimal",
      columns: [
        "JobNo",
        "ATA",
        "TejrimDate",
        "CustomerName",
        "dtCntrToCnee",
        "ContainerNo",
        "CarrierName",
        "ArrivalDays",
        "TejrimDays",
      ],
    },
    {
      name: "Mobile",
      columns: ["JobNo", "CustomerName", "ArrivalDays", "TejrimDays"],
    },
  ];

  // Define columns
  const columns = useMemo<ColumnDef<IEmptyContainer>[]>(
    () => [
      {
        accessorKey: "JobNo",
        header: "Job No",
      },
      {
        accessorKey: "Ata",
        header: "ATA",
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return "";
          const date = new Date(value as string);
          return isNaN(date.getTime())
            ? ""
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
        },
      },
      {
        accessorKey: "TejrimDate",
        header: "Tejrim Date",
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return "";
          const date = new Date(value as string);
          return isNaN(date.getTime())
            ? ""
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
        },
      },
      {
        accessorKey: "Mbol",
        header: "MBL",
        cell: ({ getValue }) => (
          <div className="whitespace-normal min-w-[120px] max-w-[200px] line-clamp-2">
            {getValue() as string}
          </div>
        ),
      },

      {
        accessorKey: "CustomerName",
        header: "Customer",
      },
      {
        accessorKey: "dtCntrToCnee",
        header: "Cntr To Cnee",
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return "";
          const date = new Date(value as string);
          return isNaN(date.getTime())
            ? ""
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
        },
      },
      {
        accessorKey: "ContainerNo",
        header: "Container No",
      },
      {
        accessorKey: "CarrierName",
        header: "Carrier Name",
      },
      {
        accessorKey: "UserName",
        header: "User",
      },
      {
        accessorKey: "Notes",
        header: "Notes",
        cell: ({ getValue }) => (
          <div className="whitespace-normal min-w-[120px] max-w-[200px] line-clamp-2">
            {getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "ArrivalDays",
        header: "ArrivalDays",
      },
      {
        accessorKey: "TejrimDays",
        header: "TejrimDays",
      },
      {
        accessorKey: "DiffCntrToCnee",
        header: "Cntr to Cnee",
      },
      {
        accessorKey: "Departure",
        header: "Departure",
      },
      {
        accessorKey: "Destination",
        header: "Destination",
      },
    ],
    []
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/reports/admin/empty-container?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`
        );
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();

        if (Array.isArray(data.data)) {
          setJobs(data.data);
          setTotalCount(data.pagination.total);
          setGrandTotalProfit(data.pagination.grandTotalProfit ?? 0);
        } else {
          console.error("Invalid API response", data);
          setJobs([]);
          setTotalCount(0);
          setGrandTotalProfit(0);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
        setTotalCount(0);
        setGrandTotalProfit(0);
      }
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  // Initialize table
  const table = useReactTable({
    data: jobs,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  // Apply Default preset on initial load
  useEffect(() => {
    const defaultPreset = presets.find((p) => p.name === "Default");
    if (defaultPreset) {
      const newVisibility: VisibilityState = {};
      table.getAllLeafColumns().forEach((col) => {
        newVisibility[col.id] = defaultPreset.columns.includes(col.id);
      });
      setColumnVisibility(newVisibility);
    }
  }, []);

  // Apply mobile preset on mobile detection
  useEffect(() => {
    if (isMobile) {
      const mobilePreset = presets.find((p) => p.name === "Mobile");
      if (mobilePreset) {
        const newVisibility: VisibilityState = {};
        table.getAllLeafColumns().forEach((col) => {
          newVisibility[col.id] = mobilePreset.columns.includes(col.id);
        });
        setColumnVisibility(newVisibility);
      }
    }
  }, [isMobile]);

  return (
    <div className="w-full p-2 mx-auto space-y-4">
      <div className="text-xs text-muted-foreground">
        Total rows: {totalCount} | Page{" "}
        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} |
        Rows per page: {table.getState().pagination.pageSize}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Input
          placeholder="Search all columns..."
          className="w-full md:max-w-sm"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Presets</DropdownMenuLabel>
              <div className="flex flex-wrap gap-1 px-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => {
                      const newVisibility: VisibilityState = {};
                      table.getAllLeafColumns().forEach((col) => {
                        newVisibility[col.id] = preset.columns.includes(col.id);
                      });
                      setColumnVisibility(newVisibility);
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="relative w-full overflow-auto rounded-md border">
        <div className="block w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none whitespace-nowrap px-2 py-2 text-xs sticky top-0 bg-background"
                        style={{
                          minWidth: header.id === "Notes" ? "120px" : "80px",
                          maxWidth: header.id === "Notes" ? "200px" : undefined,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-2 py-2 text-xs"
                        style={{
                          minWidth: cell.column.id === "Notes" ? "120px" : "80px",
                          maxWidth: cell.column.id === "Notes" ? "200px" : undefined,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-xs"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
        <span className="flex items-center gap-1 text-sm">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50, 200, 1000].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
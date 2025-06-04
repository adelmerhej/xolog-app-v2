/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useMemo } from "react";
import { ITotalProfit } from "@/types/reports/ITotalProfit";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function JobStatusComponent() {
  const [jobs, setJobs] = useState<ITotalProfit[]>([]);
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

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["New"]);
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

  const departments = [
    "Import",
    "Export",
    "Clearance",
    "Land Freight",
    "Sea Cross",
  ];
  const statuses = ["New", "FullPaid", "Delivered", "Cancelled"];

  // Presets for column visibility
  const presets = [
    {
      name: "Default",
      columns: [
        "JobDate",
        "JobNo",
        "ReferenceNo",
        "CustomerName",
        "PaymentDate",
        "MemberOf",
        "ATA",
        "ETA",
        "Arrival",
        "StatusType",
        "TotalProfit",
      ],
    },
    {
      name: "Minimal",
      columns: [
        "JobDate",
        "JobNo",
        "ReferenceNo",
        "CustomerName",
        "PaymentDate",
        "StatusType",
        "TotalProfit",
      ],
    },
    {
      name: "Mobile",
      columns: ["JobNo", "CustomerName", "StatusType", "TotalProfit"],
    },
  ];

  
  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartments((prev) => {
      const isSelected = prev.includes(dept);
      const newSelection = isSelected
        ? prev.filter((d) => d !== dept)
        : [...prev, dept];
      return newSelection;
    });
  };

  const handleStatusesChange = (status: string) => {
    setSelectedStatuses((prev) => {
      const isSelected = prev.includes(status);
      const newSelection = isSelected
        ? prev.filter((d) => d !== status)
        : [...prev, status];
      return newSelection;
    });
  };

  const filteredJobs = jobs;

  // Define columns
  const columns = useMemo<ColumnDef<ITotalProfit>[]>(
    () => [
      {
        accessorKey: "JobDate",
        header: "Job Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
      {
        accessorKey: "JobNo",
        header: "Job No",
      },
      {
        accessorKey: "ReferenceNo",
        header: "Reference",
      },
      {
        accessorKey: "CustomerName",
        header: "Customer",
      },
      {
        accessorKey: "PaymentDate",
        header: "Payment Date",
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
        accessorKey: "MemberOf",
        header: "MemberOf",
      },
      {
        id: "Arrival",
        header: "Arrival",
        cell: ({ row }) => {
          const ata = row.original.ATA;
          const eta = row.original.ETA;
          const value = ata || eta;
          if (!value) return "";
          const date = new Date(String(value));
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
        accessorKey: "StatusType",
        header: "Status",
      },
      {
        accessorKey: "TotalProfit",
        header: "Profit",
        cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
      },
    ],
    []
  );

  //Calculate total profit
  const totalProfitSum = useMemo(
    () =>
      filteredJobs.reduce(
        (sum, job) =>
          sum +
          (typeof job.TotalProfit === "number"
            ? job.TotalProfit
            : Number(job.TotalProfit) || 0),
        0
      ),
    [filteredJobs]
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", String(pagination.pageIndex + 1));
        queryParams.set("limit", String(pagination.pageSize));

        if (selectedDepartments.length > 0) {
          queryParams.set("departments", selectedDepartments.join(","));
        }

        if (selectedStatuses.length > 0) {
          queryParams.set("status", selectedStatuses.join(","));
        }

        const res = await fetch(`/api/reports/admin/job-status?${queryParams}`);
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
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    selectedDepartments,
    selectedStatuses,
  ]);

  // Initialize table
  const table = useReactTable({
    data: filteredJobs,
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
    <div className="w-full max-w-full mx-auto space-y-4 text-sm">
      <div className="text-xs text-muted-foreground">
        Total rows: {totalCount} | Page{" "}
        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} |
        Rows per page: {table.getState().pagination.pageSize}
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Search all columns..."
          className="max-w-sm"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <div className="flex items-center gap-4">
          {/* Department Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Department
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Departments</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dept-all"
                    checked={selectedDepartments.length === 0}
                    onCheckedChange={() => setSelectedDepartments([])}
                  />
                  <Label className="text-sm font-normal" htmlFor="dept-all">
                    All
                  </Label>
                </div>
                {departments.map((dept) => (
                  <div key={dept} className="flex items-center space-x-2 mt-1">
                    <Checkbox
                      id={`dept-${dept}`}
                      checked={selectedDepartments.includes(dept)}
                      onCheckedChange={() => handleDepartmentChange(dept)}
                    />
                    <Label
                      className="text-sm font-normal"
                      htmlFor={`dept-${dept}`}
                    >
                      {dept}
                    </Label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Statuses</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-all"
                    checked={selectedStatuses.length === 0}
                    onCheckedChange={() => setSelectedStatuses([])}
                  />
                  <Label className="text-sm font-normal" htmlFor="status-all">
                    All
                  </Label>
                </div>
                {statuses.map((status) => (
                  <div
                    key={status}
                    className="flex items-center space-x-2 mt-1"
                  >
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => handleStatusesChange(status)}
                    />
                    <Label
                      className="text-sm font-normal"
                      htmlFor={`status-${status}`}
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
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

          <div className="flex gap-6">
            <div className="flex items-center">
              <span className="text-sm">Page profit:</span>
              <span className="ml-2 font-semibold text-green-700">
                $
                {totalProfitSum.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">Grand total:</span>
              <span className="ml-2 font-semibold text-blue-700">
                $
                {grandTotalProfit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border w-full overflow-auto max-w-[calc(100vw-2rem)] text-sm">
         <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={canSort ? "cursor-pointer select-none whitespace-nowrap px-2 py-2 text-xs" : ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {isSorted === "asc" && " 🔼"}
                      {isSorted === "desc" && " 🔽"}
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
                    <TableCell key={cell.id} className="whitespace-nowrap min-w-[80px] px-2 py-2 text-xs">
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
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

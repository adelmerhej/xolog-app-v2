/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState, useMemo } from "react";
import { IClientInvoice } from "@/types/reports/IClientInvoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function ClientInvoiceComponent() {
  const [jobs, setJobs] = useState<IClientInvoice[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isMobile, setIsMobile] = useState(false);

  const [selectedJobsStatus, setSelectedJobsStatus] = useState<string[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState<string[]>([]);  

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
      name: "Default",
      columns: [
        "JobNo",
        "QuotationNo",
        "Mbl",
        "InvoiceNo",
        "DueDate",
        "TotalInvoiceAmount",
        "POL",
        "POD",
        "Volume",
        "Consignee",
        "Eta",
        "Etd",
        "Atd",
        "Ata",
        "Status",
      ],
    },
    {
      name: "Minimal",
      columns: [
        "JobNo",
        "QuotationNo",
        "CustomerName",
        "InvoiceNo",
        "DueDate",
        "TotalInvoiceAmount",
        "Status",
      ],
    },
    {
      name: "Mobile",
      columns: ["JobNo", "CustomerName", "InvoiceNo", "TotalInvoiceAmount"],
    },
  ];

  //Presets Job Status
  const statuses = [
    "TO BELOADED",
    "ON BOARD",
    "ARRIVED PENDING",
    "CLOSED",
    "Full Paid Not Closed",
    "With Draft",
  ];

  //Presets Invoice Status
  const invoiceStatuses = [
    "Invoices",
    "Draft",
  ];

  // Define columns
  const columns = useMemo<ColumnDef<IClientInvoice>[]>(
    () => [
      {
        accessorKey: "JobNo",
        header: "Job No",
      },
      {
        accessorKey: "QuotationNo",
        header: "Quotation No",
      },
      {
        accessorKey: "Mbl>",
        header: "MBL",
        cell: ({ getValue }) => (
          <div className="whitespace-normal min-w-[120px] max-w-[100px] line-clamp-3">
            {getValue() as string}
  </div>
        ),
      },
      {
        accessorKey: "InvoiceNo",
        header: "Invoice No",
      },
      {
        accessorKey: "DueDate",
        header: "Due Date",
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
        accessorKey: "TotalInvoiceAmount",
        header: "Total Invoice",
        cell: ({ getValue }) => {
          const value = Number(getValue());
          return `$${value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "Consignee",
        header: "Customer",
      },
      {
        accessorKey: "Salesman",
        header: "Salesman",
      },      {
        accessorKey: "POL",
        header: "POL",
      },
      {
        accessorKey: "POD",
        header: "POD",
      },
      {
        accessorKey: "Volume",
        header: "Volume",
      },
      {
        accessorKey: "Etd",
        header: "ETD",
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
        accessorKey: "Eta",
        header: "ETA",
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
        accessorKey: "Atd",
        header: "ATD",
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
        accessorKey: "Status",
        header: "Status",
      },
    ],
    []
  );

  //Calculate Total Invoice Amount
  const TotalInvoiceAmountSum = useMemo(
    () =>
      jobs.reduce(
        (sum, job) =>
          sum +
          (typeof job.TotalInvoiceAmount === "number"
            ? job.TotalInvoiceAmount
            : Number(job.TotalInvoiceAmount) || 0),
        0
      ),
    [jobs]
  );

  // Fetch data
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/reports/admin/client-invoice?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize
        }&filterinvoices=${invoiceFilter.join(",")}&filterjobs=${selectedJobsStatus.join(",")}&search=${globalFilter}`
      );
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setJobs(data.data);
        setTotalCount(data.pagination.total);
        setGrandTotal(data.pagination.grandTotalInvoices ?? 0);
  } else {
        console.error("Invalid API response", data);
        setJobs([]);
        setTotalCount(0);
        setGrandTotal(0);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setTotalCount(0);
      setGrandTotal(0);
    }
  };

  fetchData();
}, [pagination.pageIndex, pagination.pageSize, invoiceFilter, selectedJobsStatus, globalFilter]);

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

const handleJobsStatusesChange = (status: string) => {
  setSelectedJobsStatus((prev) => {
    const isSelected = prev.includes(status);
    const newSelection = isSelected
      ? prev.filter((d) => d !== status)
      : [...prev, status];
    return newSelection;
  });
  // Reset to first page when filters change
  setPagination(prev => ({...prev, pageIndex: 0}));
};

const handleInvoicesStatusesChange = (invoiceStatus: string) => {
  setInvoiceFilter((prev) => {
    const isSelected = prev.includes(invoiceStatus);
    const newSelection = isSelected
      ? prev.filter((d) => d !== invoiceStatus)
      : [...prev, invoiceStatus];
    return newSelection;
  });
  // Reset to first page when filters change
  setPagination(prev => ({...prev, pageIndex: 0}));
};

  return (
    <div className="w-full max-w-full mx-auto space-y-4 text-sm">
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
        <div className="flex">
          <div>
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
                      id="Jobs-status-all"
                      checked={selectedJobsStatus.length === 0}
                      onCheckedChange={() => setSelectedJobsStatus([])}
                    />
                    <Label className="text-sm font-normal" htmlFor="Jobs-status-all">
                      All
                    </Label>
                  </div>
                  {statuses.map((status) => (
                    <div
                      key={status}
                      className="flex items-center space-x-2 mt-1"
                    >
                      <Checkbox
                        id={`Jobs-status-all-${status}`}
                        checked={selectedJobsStatus.includes(status)}
                        onCheckedChange={() => handleJobsStatusesChange(status)}
                      />
                      <Label
                        className="text-sm font-normal"
                        htmlFor={`Jobs-status-all-${status}`}
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            {/* All, Invoices, Draft Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Invoices
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Invoices Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="Inv-status-all"
                      checked={invoiceFilter.length === 0}
                      onCheckedChange={() => setInvoiceFilter([])}
                    />
                    <Label className="text-sm font-normal" htmlFor="Inv-status-all">
                      All
                    </Label>
                  </div>
                  {invoiceStatuses.map((invoiceStatus) => (
                    <div
                      key={invoiceStatus}
                      className="flex items-center space-x-2 mt-1"
                    >
                      <Checkbox
                        id={`invstatus-${invoiceStatus}`}
                        checked={invoiceFilter.includes(invoiceStatus)}
                        onCheckedChange={() => handleInvoicesStatusesChange(invoiceStatus)}
                      />
                      <Label
                        className="text-sm font-normal"
                        htmlFor={`invstatus-${invoiceStatus}`}
                      >
                        {invoiceStatus}
                      </Label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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

          <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            <div className="flex items-center">
              <span className="text-sm">Page total:</span>
              <span className="ml-2 font-semibold text-green-700">
                $
                {TotalInvoiceAmountSum.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">Grand total:</span>
              <span className="ml-2 font-semibold text-blue-700">
                $
                {grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border w-full overflow-auto max-w-[calc(100vw-2rem)]">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer select-none whitespace-nowrap px-2 py-2 text-xs"
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
                      className="whitespace-nowrap min-w-[80px] px-2 py-2 text-xs"
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

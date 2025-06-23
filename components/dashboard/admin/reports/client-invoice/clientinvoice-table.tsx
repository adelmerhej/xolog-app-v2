/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Grid,
  GridColumn as Column,
  GridCustomCellProps,
} from "@progress/kendo-react-grid";
import { createPortal } from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import {
  DropDownButton,
  DropDownButtonItemClickEvent,
} from "@progress/kendo-react-buttons";
import { IClientInvoice } from "@/types/reports/IClientInvoice";
import {
  TotalsCell,
  ColumnMenu,
  PersonCell,
  ProgressCell,
  RatingCell,
  CountryCell,
} from "@/components/data-table/custom-cells";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";

const loadingPanelMarkup = (
  <div className="k-loading-mask">
    <span className="k-loading-text">Loading</span>
    <div className="k-loading-image" />
    <div className="k-loading-color" />
  </div>
);

const LoadingPanel = (props: { gridRef: any }) => {
  const { gridRef } = props;
  const gridContent =
    gridRef.current && gridRef.current.querySelector(".k-grid-content");
  return gridContent
    ? createPortal(loadingPanelMarkup, gridContent)
    : loadingPanelMarkup;
};

interface PageState {
  skip: number;
  take: number;
}

// Helper function to format dates
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Define all possible columns
const allColumns = [
  { field: "JobNo", title: "Job#", width: "150px", visible: true },
  { field: "QuotationNo", title: "Quotation#", visible: true },
  { field: "Mbl", title: "MBL", visible: false },
  { field: "InvoiceNo", title: "Invoice#", visible: true },
  {
    field: "DueDate",
    title: "Due Date",
    visible: true,
    format: "date",
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.DueDate)}</td>;
      },
    },
  },
  { field: "POL", title: "POL", visible: true },
  { field: "POD", title: "POD", visible: true },
  { field: "Volume", title: "Volume", visible: false },
  { field: "Consignee", title: "Consignee", visible: true },
  {
    field: "Etd",
    title: "ETD",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Etd)}</td>;
      },
    },
  },
  {
    field: "Eta",
    title: "ETA",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Eta)}</td>;
      },
    },
  },
  {
    field: "Atd",
    title: "ATD",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Atd)}</td>;
      },
    },
  },
  {
    field: "Ata",
    title: "ATA",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Ata)}</td>;
      },
    },
  },
  { field: "StatusType", title: "StatusType", visible: true },
  { field: "Status", title: "Status", visible: false },
  {
    field: "TotalInvoiceAmount",
    title: "Totals",
    visible: true,
    columnMenu: ColumnMenu,
    cells: { data: TotalsCell },
    width: "150px",
  },
];

export default function ClientInvoiceComponent() {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<IClientInvoice[]>([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedJobsStatus, setSelectedJobsStatus] = useState<string[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState<string[]>([]);
  const [columns, setColumns] = useState(allColumns);
  const [pageSizeValue, setPageSizeValue] = React.useState<
    number | string | undefined
  >();
  const [grandTotalProfit, setGrandTotalProfit] = useState(0);
  const [grandTotalInvoices, setGrandTotalInvoices] = useState(0);

    // Initialize date range for filtering
    const [selectedDateRange, setSelectedDateRange] = useState({
      from: new Date(new Date().getFullYear(), 0, 1), // Jan 1st of current year
      to: new Date(),
    });

  const DATA_ITEM_KEY = "id";

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setShowLoading(true);

      // Format date range for API request
      const startDate = selectedDateRange.from
      ? formatDate(selectedDateRange.from)
      : "";
      const endDate = selectedDateRange.to
      ? formatDate(selectedDateRange.to)
      : "";

      const res = await fetch(
        `/api/reports/admin/client-invoice?page=${pagination.pageIndex + 1}&limit=${
          pagination.pageSize
        }&filterinvoices=${invoiceFilter.join(",")}&filterjobs=${selectedJobsStatus.join(",")}&search=${globalFilter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setJobs(data.data);
        setTotalCount(data.pagination.total);
        setGrandTotalProfit(data.pagination.grandTotalProfit ?? 0);
        setGrandTotal(data.pagination.grandTotalInvoices ?? 0);
        setGrandTotalInvoices(data.pagination.grandTotalInvoices ?? 0);
        setShowLoading(false);
      } else {
        console.error("Invalid API response", data);
        setJobs([]);
        setTotalCount(0);
        setGrandTotalProfit(0);
        setGrandTotal(0);
        setGrandTotalInvoices(0);
        setShowLoading(false);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setTotalCount(0);
      setGrandTotalProfit(0);
      setGrandTotal(0);
      setGrandTotalInvoices(0);
      setShowLoading(false);
    }
  }, [selectedDateRange.from, selectedDateRange.to, pagination.pageIndex, 
    pagination.pageSize, invoiceFilter, selectedJobsStatus, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    invoiceFilter,
    selectedJobsStatus,
    globalFilter,
    fetchData,
  ]);

  // Toggle column visibility
  const toggleColumnVisibility = (field: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.field === field
          ? { ...column, visible: !column.visible }
          : column
      )
    );
  };

  // Render column selector dropdown
  const renderColumnSelector = () => {
    return (
      <DropDownButton
        text="Columns"
        themeColor={"base"}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
        items={columns.map((column) => ({
          text: column.title,
          selected: column.visible,
          id: column.field,
        }))}
        onItemClick={(e: DropDownButtonItemClickEvent) => {
          toggleColumnVisibility(e.item.id);
        }}
      />
    );
  };

  //Calculate totals
  const totalInvoiceAmount = useMemo(
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

  return (
    <>
      {/* Info Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-xs text-muted-foreground mt-2">
          Total rows: {totalCount} | Page {pagination.pageIndex + 1} of{" "}
          {Math.ceil(totalCount / pagination.pageSize)} | Rows per page:{" "}
          {pagination.pageSize}
        </div>

        {/* Right-aligned totals */}
        <div className="flex flex-col md:flex-row gap-4 text-sm font-medium ">
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <div className="flex items-center text-xs">
              <span>Page profit:</span>
              <span className="ml-2 font-semibold text-green-700">
                $
                {grandTotalProfit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center text-xs">
              <span>Total Invoices:</span>
              <span className="ml-2 font-semibold text-blue-700">
                $
                {totalInvoiceAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>{" "}
            <div className="flex items-center text-xs">
              <span>Grand total:</span>
              <span className="ml-2 font-semibold text-blue-700">
                $
                {grandTotalInvoices.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {renderColumnSelector()}
          {/* {renderDepartmentsSelector()}
          {renderCheckFullpaidSelector()}  */}

            {/* Date Range Picker */}
            <div className="flex flex-col md:flex-row gap-4 justify-start ml-2">
              <CalendarDatePicker
                className="text-xs"
                date={{
                  from: selectedDateRange.from,
                  to: selectedDateRange.to,
                }}
                onDateSelect={(range) => {
                  setSelectedDateRange(range);
                  fetchData();
                }}
                variant="outline"
                numberOfMonths={2}
              />
            </div>
            {/* END Date Range Picker*/}                   
        </div>
      </div>

      {/* GRID */}
      <div ref={gridRef} className="text-sm">
        {showLoading ? <LoadingPanel gridRef={gridRef} /> : null}

        <Grid
          data={jobs}
          dataItemKey={DATA_ITEM_KEY}
          style={{
            height: "650px",
            fontSize: "0.75rem",
          }}
          autoProcessData={true}
          sortable={{ mode: "multiple" }}
          groupable={true}
          selectable={false}
          filterable={true}
          defaultTake={200}
          defaultSkip={0}
          pageable={{
            buttonCount: 4,
            type: "numeric",
            info: true,
            pageSizes: [10, 50, 100, 200, 1000],
            pageSizeValue: pageSizeValue,
          }}
        >
          {columns
            .filter((c) => c.visible)
            .map((column) => (
              <Column
                key={column.field}
                field={column.field}
                title={column.title}
                width={column.width}
                cells={
                  column.cells || {
                    data: (props: GridCustomCellProps) => {
                      const { dataItem, field } = props;

                      if (!dataItem || !field) {
                        return null;
                      }

                      return (
                        <td style={{ fontSize: "0.75rem" }}>
                          {dataItem[field as keyof IClientInvoice]}
                        </td>
                      );
                    },
                  }
                }
              />
            ))}
        </Grid>
      </div>
      {/* END GRID */}
    </>
  );
}

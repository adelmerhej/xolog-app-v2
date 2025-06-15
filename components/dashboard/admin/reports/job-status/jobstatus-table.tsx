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
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { IJobStatus } from "@/types/reports/IJobStatus";
import {
  TotalsCell,
  ColumnMenu,
  PersonCell,
  ProgressCell,
  RatingCell,
  CountryCell,
  TotalProfitCell,
} from "@/components/data-table/custom-cells";


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
  {
    field: "JobDate",
    title: "Job Date",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.JobDate)}</td>;
      },
    },
  },
  { field: "JobNo", title: "Job#", width: "100px", visible: true },
  { field: "ReferenceNo", title: "Reference#", visible: true },

  { field: "CustomerName", title: "Customer", width: "150px", visible: true },
  {
    field: "PaymentDate",
    title: "Payment Date",
    width: "120px",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.PaymentDate)}</td>;
      },
    },
  },
  { field: "MemberOf", title: "Member Of", visible: true },
  {
    field: "ATA",
    title: "ATA",
    width: "120px",
    visible: false,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.ATA)}</td>;
      },
    },
  },
  {
    field: "ETA",
    title: "ETA",
    width: "120px",
    visible: false,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.ETA)}</td>;
      },
    },
  },
  {
    field: "Arrival",
    title: "Arrival",
    width: "120px",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Arrival)}</td>;
      },
    },
  },
  { field: "StatusType", title: "Status", width: "100px", visible: true },
  {
    field: "TotalProfit",
    title: "Total Profit",
    visible: true,
    columnMenu: ColumnMenu,
    cells: { data: TotalProfitCell },
    width: "150px",
    // Add footer cell if you want to show the sum at the bottom
    // footerCell: () => (
    //   <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
    //     ${grandTotalProfit.toLocaleString(undefined, {
    //       minimumFractionDigits: 2,
    //       maximumFractionDigits: 2,
    //     })}
    //   </td>
    // )
  },
];

export default function JobStatusComponent() {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<IJobStatus[]>([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [columns, setColumns] = useState(allColumns);
  const [isMobile, setIsMobile] = useState(false);
  const [pageSizeValue, setPageSizeValue] = React.useState<
    number | string | undefined
  >();
  const [grandTotalProfit, setGrandTotalProfit] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("New");

  // Pass grandTotalProfit to the TotalProfit column
  const updatedColumns = useMemo(() => {
    return columns.map((column) => {
      if (column.field === "TotalProfit") {
        return {
          ...column,
          footerCell: (props: any) => (
            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
              ${props.grandTotalProfit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          )
        };
      }
      return column;
    });
  }, [columns, grandTotalProfit]);

  const DATA_ITEM_KEY = "id";

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // Set mobile-friendly columns
        setColumns((prevColumns) =>
          prevColumns.map((column) => ({
            ...column,
            visible: [
              "JobNo",
              "CustomerName",
              "StatusType",
              "TotalProfit",
            ].includes(column.field),
          }))
        );
      } else {
        // Reset to default visible columns
        setColumns((prevColumns) =>
          prevColumns.map((column) => ({
            ...column,
            visible:
              allColumns.find((c) => c.field === column.field)?.visible ||
              false,
          }))
        );
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setShowLoading(true);
      const status = statusFilter === "All" ? "" : statusFilter;

      // Build the API URL with status if needed
      let apiUrl = `/api/reports/admin/job-status?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}&search=${globalFilter}`;
      if (status) {
        apiUrl += `&status=${encodeURIComponent(status)}`;
      }

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();

      if (Array.isArray(data.data)) {
        setJobs(data.data);
        setTotalCount(data.pagination.total);
        setGrandTotalProfit(data.pagination.grandTotalProfit ?? 0);
        setShowLoading(false);
      } else {
        console.error("Invalid API response", data);
        setJobs([]);
        setTotalCount(0);
        setShowLoading(false);
        setGrandTotalProfit(0);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setTotalCount(0);
      setShowLoading(false);
      setGrandTotalProfit(0);
    }
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, fetchData]);

  // Debug: Log jobs data to check TotalProfit
  // useEffect(() => {
  //   if (jobs && jobs.length > 0) {
  //     console.log('Jobs data:', jobs.map(j => ({ JobNo: j.JobNo, TotalProfit: j.TotalProfit })));
  //   } else {
  //     console.log('No jobs data or empty jobs array');
  //   }
  // }, [jobs]);

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
  // Toggle status visibility
  const toggleStatusFilter = (status: string) => {
    setStatusFilter(status);
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

  // Render status selector dropdown
  const statusOptions = [
    { text: "All", value: "All" },
    { text: "New", value: "New" },
    { text: "FullPaid", value: "FullPaid" },
    { text: "Delivered", value: "Delivered" },
    { text: "Cancelled", value: "Cancelled" },
  ];
  const renderStatusSelector = () => {
    return (
      <div style={{ marginBottom: "20px", marginLeft: "10px", minWidth: 150 }}>
        <DropDownList
          data={statusOptions}
          textField="text"
          dataItemKey="value"
          value={statusOptions.find(option => option.value === statusFilter)}
          onChange={e => toggleStatusFilter(e.value.value)}
        />
      </div>
    );
  };
  //


  // Filter the jobs based on status
const filteredJobs = useMemo(() => {
  if (statusFilter === "All") return jobs;
  return jobs.filter(job => {
    const jobStatus = job.StatusType;
    switch (statusFilter) {
      case "New":
        return jobStatus === "New";
      case "FullPaid":
        return jobStatus === "New" && job.PendingInvoices === 0;
      case "Delivered":
        return jobStatus === "Delivered";
      case "Cancelled":
        return jobStatus === "Cancelled";
      default:
        return true;
    }
  });
}, [jobs, statusFilter]);


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


  return (
    <>
      <div className="text-xs text-muted-foreground mt-2">
        Total rows: {totalCount} | Page {pagination.pageIndex + 1} of{" "}
        {Math.ceil(totalCount / pagination.pageSize)} | Rows per page:{" "}
        {pagination.pageSize}
      </div>
      {/* <div className="text-xs text-muted-foreground">
        Total Profit: ${totalProfitSum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div> */}

      {/* Buttons */}
      <div className="flex justify-between">
        <div className="flex justify-start">
          <Button onClick={fetchData} style={{ marginBottom: 20 }}>
            Reload Data
          </Button>
          {renderColumnSelector()}
          {renderStatusSelector()}
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
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

      {/* GRID */}
      <div ref={gridRef} className="text-sm">
        {showLoading ? <LoadingPanel gridRef={gridRef} /> : null}

        <Grid
          data={filteredJobs}
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
                        <td style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                          {dataItem[field as keyof IJobStatus]}
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

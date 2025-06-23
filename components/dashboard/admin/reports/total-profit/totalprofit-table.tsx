/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { process } from "@progress/kendo-data-query";
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
import {
  ColumnMenu,
  TotalProfitCell,
} from "@/components/data-table/custom-cells";
import { ITotalProfit } from "@/types/reports/ITotalProfit";
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

//Pagination customize
interface PageState {
  skip: number;
  take: number;
}
const initialDataState: PageState = { skip: 0, take: 10 };

//Pagination customize

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
    field: "JobNo",
    title: "Job#",
    width: "130px",
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "JobDate",
    title: "Job Date",
    width: "110px",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.JobDate)}</td>;
      },
    },
    filterable: {
      operators: {
        date: {
          eq: "Is equal to",
          gte: "Is after or equal to",
          lte: "Is before or equal to",
        },
      },
    },
  },
  {
    field: "CustomerName",
    title: "Customer Name#",
    width: "250px",
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "ConsigneeName",
    title: "Consignee Name",
    width: "150px",
    visible: false,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "ReferenceNo",
    title: "Reference#",
    width: "125px",
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "StatusType",
    title: "Status Type",
    width: "125px",
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "Arrival",
    title: "ETA/ATA",
    width: "120px",
    visible: true, // Make sure it's visible
    sortable: true, // Enable sorting
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        // Show ATA if exists, otherwise ETA
        const value = dataItem.ATA ? dataItem.ATA : dataItem.ETA;
        return <td>{formatDate(value)}</td>;
      },
    },
    filterable: {
      operators: {
        date: {
          eq: "Is equal to",
          gte: "Is after or equal to",
          lte: "Is before or equal to",
        },
      },
    },
  },
  {
    field: "CountryOfDeparture",
    title: "Country",
    width: "100px",
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "Departure",
    title: "Departure",
    width: "100px",
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "Destination",
    title: "Destination",
    width: "100px",
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "vessel",
    title: "vessel",
    width: "150px",
    visible: false,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "UserName",
    title: "UserName",
    width: "150px",
    visible: false,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "Notes",
    title: "Notes",
    width: "150px",
    visible: false,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    },
  },
  {
    field: "TotalProfit",
    title: "Total Profit",
    visible: true,
    columnMenu: ColumnMenu,
    cells: { data: TotalProfitCell },
    width: "100px",
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

export default function TotalProfitComponent() {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<ITotalProfit[]>([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [columns, setColumns] = useState(allColumns);
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = React.useState<PageState>(initialDataState);
  const [pageSizeValue, setPageSizeValue] = React.useState<
    number | string | undefined
  >();
  const [grandTotalProfit, setGrandTotalProfit] = useState(0);
  
  // Initialize date range for filtering
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // Jan 1st of current year
    to: new Date(),
  });

  const data = process(jobs, { skip: page.skip, take: page.take });

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
              "ArrivalDays",
              "TejrimDays",
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

      // Format date range for API request
      const startDate = selectedDateRange.from
      ? formatDate(selectedDateRange.from)
      : "";
      const endDate = selectedDateRange.to
      ? formatDate(selectedDateRange.to)
      : "";

      const res = await fetch(
        `/api/reports/admin/total-profit?
        page=${pagination.pageIndex + 1}
        &limit=${pagination.pageSize}
        &search=${globalFilter}
        &startDate=${startDate}
        &endDate=${endDate}`,
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
        setShowLoading(false);
        setGrandTotalProfit(data.pagination.grandTotalProfit ?? 0);
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
  }, [selectedDateRange.from, selectedDateRange.to, pagination.pageIndex, 
    pagination.pageSize, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, fetchData]);

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

  //Calculate total profit
  const totalProfitSum = useMemo(
    () =>
      jobs.reduce(
        (sum, job) =>
          sum +
          (typeof job.TotalProfit === "number"
            ? job.TotalProfit
            : Number(job.TotalProfit) || 0),
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
                {totalProfitSum.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center text-xs">
              <span>Total profit:</span>
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
                          {dataItem[field as keyof ITotalProfit]}
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

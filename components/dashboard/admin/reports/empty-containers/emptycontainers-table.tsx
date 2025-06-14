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
import { IEmptyContainer } from "@/types/reports/IEmptyContainer";

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
    field: "OrderNo",
    title: "Order#",
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
    field: "JobNo",
    title: "Job#",
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
    field: "ReferenceNo",
    title: "Reference#",
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
    field: "JobDate",
    title: "Job Date",
    visible: false,
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
    field: "DepartmentName",
    title: "Department",
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
    field: "CustomerName",
    title: "Customer",
    width: "150px",
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
    field: "Ata",
    title: "ATA",
    width: "120px",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Ata)}</td>;
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
    field: "TejrimDate",
    title: "Tejrim Date",
    width: "120px",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.TejrimDate)}</td>;
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
    field: "Mbol",
    title: "MBL",
    width: "150px",
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
    field: "dtCntrToCnee",
    title: "Cntr To Cnee",
    width: "120px",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.dtCntrToCnee)}</td>;
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
    field: "ContainerNo",
    title: "Container No",
    width: "120px",
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
  { field: "CarrierName", title: "Carrier", width: "150px", visible: false },
  { field: "UserName", title: "User", width: "100px", visible: false },
  {
    field: "Notes",
    title: "Notes",
    width: "200px",
    visible: false,
    cells: {
      data: (props: GridCustomCellProps) => (
        <td className="whitespace-normal min-w-[120px] max-w-[200px] line-clamp-2">
          {props.dataItem.Notes}
        </td>
      ),
    },
  },
  {
    field: "ArrivalDays",
    title: "Arrival Days",
    width: "100px",
    visible: true,
  },
  { field: "TejrimDays", title: "Tejrim Days", width: "100px", visible: true },
  {
    field: "DiffCntrToCnee",
    title: "Cntr to Cnee",
    width: "120px",
    visible: true,
  },
  { field: "Departure", title: "Departure", width: "120px", visible: false },
  {
    field: "Destination",
    title: "Destination",
    width: "150px",
    visible: false,
  },
];

export default function EmptyContainersComponent() {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<IEmptyContainer[]>([]);
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

      const res = await fetch(
        `/api/reports/admin/empty-container?
        page=${pagination.pageIndex + 1}
        &limit=${pagination.pageSize}
        &search=${globalFilter}`,
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
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

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
      <div className="text-xs text-muted-foreground mt-2">
        Total rows: {totalCount} | Page {pagination.pageIndex + 1} of{" "}
        {Math.ceil(totalCount / pagination.pageSize)} | Rows per page:{" "}
        {pagination.pageSize}
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <div className="flex justify-start">
          <Button onClick={fetchData} style={{ marginBottom: 20 }}>
            Reload Data
          </Button>
          {renderColumnSelector()}
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
          <div className="flex items-center">
            <span className="text-sm">Page total:</span>
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
                          {dataItem[field as keyof IEmptyContainer]}
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

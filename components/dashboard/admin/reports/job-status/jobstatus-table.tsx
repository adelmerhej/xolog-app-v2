/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid, GridColumn as Column, GridCustomCellProps } from "@progress/kendo-react-grid";
import { createPortal } from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownButton, DropDownButtonItemClickEvent } from "@progress/kendo-react-buttons";
import { IJobStatus } from "@/types/reports/IJobStatus";
import {
  TotalsCell,
  ColumnMenu,
  PersonCell,
  ProgressCell,
  RatingCell,
  CountryCell,
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

// Helper function to format dates
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
      }
    },
    filterable: {
      operators: {
        date: {
          eq: "Is equal to",
          gte: "Is after or equal to",
          lte: "Is before or equal to",
        },
      },
    }
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
    }
  },
  { 
    field: "ReferenceNo", 
    title: "Reference#", 
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    }
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
    }
  },
  { 
    field: "PaymentDate", 
    title: "Payment Date", 
    width: "120px",
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.PaymentDate)}</td>;
      }
    },
    filterable: {
      operators: {
        date: {
          eq: "Is equal to",
          gte: "Is after or equal to",
          lte: "Is before or equal to",
        },
      },
    }
  },
  { 
    field: "MemberOf", 
    title: "Member Of", 
    visible: true,
    filterable: {
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
          neq: "Is not equal to",
        },
      },
    }
  },  
  { 
    field: "ATA", 
    title: "ATA", 
    width: "120px",
    visible: false,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.ATA)}</td>;
      }
    },
    filterable: {
      operators: {
        date: {
          eq: "Is equal to",
          gte: "Is after or equal to",
          lte: "Is before or equal to",
        },
      },
    }
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
      }
    },
    filterable: {
      operators: {
        date: {
          eq: "Is equal to",
          gte: "Is after or equal to",
          lte: "Is before or equal to",
        },
      },
    }
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
      }
    },
    filterable: {
      operators: {
        date: {
          eq: "Is equal to",
          gte: "Is after or equal to",
          lte: "Is before or equal to",
        },
      },
    }
  },
  { 
    field: "StatusType", 
    title: "Status", 
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
    }
  },
  { 
    field: "TotalProfit", 
    title: "Profit", 
    visible: true,
    columnMenu: ColumnMenu,
    cells: { data: TotalsCell },
    width: "150px"
  }
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

  const DATA_ITEM_KEY = "id";

  // Handle mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // Set mobile-friendly columns
        setColumns(prevColumns => 
          prevColumns.map(column => ({
            ...column,
            visible: ["JobNo", "CustomerName", "ArrivalDays", "TejrimDays"].includes(column.field)
          }))
        );
      } else {
        // Reset to default visible columns
        setColumns(prevColumns => 
          prevColumns.map(column => ({
            ...column,
            visible: allColumns.find(c => c.field === column.field)?.visible || false
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
        `/api/reports/admin/job-status?page=${pagination.pageIndex + 1}&limit=${
          pagination.pageSize
        }&search=${globalFilter}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
  
      if (Array.isArray(data.data)) {
        setJobs(data.data);
        setTotalCount(data.pagination.total);
        setShowLoading(false);
      } else {
        console.error("Invalid API response", data);
        setJobs([]);
        setTotalCount(0);
        setShowLoading(false);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setTotalCount(0);
      setShowLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, fetchData]);

  // Toggle column visibility
  const toggleColumnVisibility = (field: string) => {
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.field === field ? { ...column, visible: !column.visible } : column
      )
    );
  };

  // Render column selector dropdown
  const renderColumnSelector = () => {
    return (
      <DropDownButton
        text="Columns"
        themeColor={"base"}
        style={{ marginBottom: '20px', marginLeft: '10px' }}
        items={columns.map(column => ({
          text: column.title,
          selected: column.visible,
          id: column.field
        }))}
        onItemClick={(e: DropDownButtonItemClickEvent) => {
          toggleColumnVisibility(e.item.id);
        }}
      />
    );
  };

  return (
    <>
      <div className="flex justify-start">
        <Button onClick={fetchData} style={{ marginBottom: 20 }}>
          Reload Data
        </Button>
        {renderColumnSelector()}
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search all columns..."
          className="w-full md:max-w-sm p-2 border rounded"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div ref={gridRef} className="text-sm">
        {showLoading ? <LoadingPanel gridRef={gridRef} /> : null}

        <Grid 
          data={jobs}
          dataItemKey={DATA_ITEM_KEY}
          style={{ 
            height: "450px",
            fontSize: "0.75rem"
          }}
          autoProcessData={true}
          sortable={{ mode: 'multiple' }}
          pageable={{ 
            pageSizes: true,
            buttonCount: 5,
            info: true,
            type: "numeric",
          }}
          groupable={true}
          selectable={false}
          filterable={true}
          defaultTake={10}
          defaultSkip={0}
        >
          {columns.filter(c => c.visible).map(column => (
            <Column
              key={column.field}
              field={column.field}
              title={column.title}
              width={column.width}
              cells={column.cells || {
                data: (props: GridCustomCellProps) => {
                  const { dataItem, field } = props;
                  
                  if (!dataItem || !field) {
                    return null;
                  }

                  return (
                    <td style={{ fontSize: '0.75rem' }}>
                      {dataItem[field as keyof IJobStatus]}
                    </td>
                  );
                }
              }}
            />
          ))}
        </Grid>
      </div>
      {/* END GRID */}

      <div className="text-xs text-muted-foreground mt-2">
        Total rows: {totalCount} | Page {pagination.pageIndex + 1} of {Math.ceil(totalCount / pagination.pageSize)} | Rows per page: {pagination.pageSize}
      </div>
    </>
  );
}

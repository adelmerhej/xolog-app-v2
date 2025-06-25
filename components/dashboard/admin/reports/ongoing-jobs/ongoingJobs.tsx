/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Grid,
  GridColumn as Column,
  GridCustomCellProps,
  GridPageChangeEvent,
} from "@progress/kendo-react-grid";
import { createPortal } from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import {
  DropDownButton,
  DropDownButtonItemClickEvent,
} from "@progress/kendo-react-buttons";
import { Checkbox } from "@progress/kendo-react-inputs";
import { DropDownList, MultiSelect } from "@progress/kendo-react-dropdowns";
import { IOngoingJob } from "@/types/reports/IOngoingJob";
import {
  TotalsCell,
  ColumnMenu,
  PersonCell,
  ProgressCell,
  RatingCell,
  CountryCell,
  TotalProfitCell,
} from "@/components/data-table/custom-cells";
import { PagerTargetEvent } from "@progress/kendo-react-data-tools";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";

const loadingPanelMarkup = (
  <div className="k-loading-mask">
    <span className="k-loading-text">Loading</span>
    <div className="k-loading-image" />
    <div className="k-loading-color" />
  </div>
);

const LoadingPanel = ({ gridRef }: { gridRef: any }) => {
  const gridContent =
    gridRef.current && gridRef.current.querySelector(".k-grid-content");
  return gridContent
    ? createPortal(loadingPanelMarkup, gridContent)
    : loadingPanelMarkup;
};

// Pagination state
interface PageState {
  skip: number;
  take: number;
}
const initialDataState: PageState = { skip: 0, take: 200 };

// Date formatting helper
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Define all columns
const allColumns = [
  { field: "JobNo", title: "Job#", width: "150px", visible: true },
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
  { field: "ReferenceNo", title: "Reference#", width: "150px", visible: true },
  { field: "DepartmentId", title: "Department", width: "150px", visible: false },
  { field: "DepartmentName", title: "Department Name", width: "150px", visible: true },
  { field: "JobStatusType", title: "Job Status", width: "150px", visible: true },
  { field: "StatusType", title: "Status Type", width: "150px", visible: false },
  { field: "CustomerName", title: "Customer", width: "150px", visible: true },
  { field: "ConsigneeName", title: "Consignee", width: "150px", visible: false },
  { field: "MemberOf", title: "Member Of", width: "150px", visible: false },
  
  { field: "ContainerToCnee", title: "Container To Cnee", width: "150px", visible: false },
  { field: "dtCntrToCnee", title: "Container To Cnee Date", width: "150px", visible: false },
  { field: "EmptyContainer", title: "Empty Container", width: "150px", visible: false },
  { field: "dtEmptyCntr", title: "Empty Container Date", width: "150px", visible: false },
  { field: "OperatingUser", title: "Operating User", width: "150px", visible: false },
  { field: "UserName", title: "Operating User", width: "150px", visible: false },
  { field: "SalesName", title: "Sales Name", width: "150px", visible: false },
  { field: "Mbl", title: "Mbl", width: "150px", visible: false },
  { field: "ContainerNo", title: "Container No", width: "150px", visible: false },
  {
    field: "Atd",
    title: "ATD",
    width: "120px",
    visible: false,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Atd)}</td>;
      },
    },
  },  {
    field: "Ata",
    title: "ATA",
    width: "120px",
    visible: false,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Ata)}</td>;
      },
    },
  },  
  {
    field: "Etd",
    title: "ETD",
    width: "120px",
    visible: false,
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
    width: "120px",
    visible: false,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Eta)}</td>;
      },
    },
  },
  { field: "Status", title: "Status", width: "150px", visible: true },
  { field: "blstatus", title: "BL Status", width: "150px", visible: false },
  { field: "Notes", title: "Notes", width: "150px", visible: false },
  { field: "CarrierName", title: "Carrier Name", width: "150px", visible: false },
  { field: "ArrivalDays", title: "Arrival Days", width: "150px", visible: true },
  { field: "TejrimDays", title: "Tejrim Days", width: "150px", visible: true },
  { field: "DiffCntrToCnee", title: "Diff Cntr To Cnee", width: "150px", visible: false },
  { field: "CountryOfDeparture", title: "Country Of Departure", width: "150px", visible: false },
  { field: "Departure", title: "Departure", width: "150px", visible: false },
  { field: "CountryOfDestination", title: "Country Of Destination", width: "150px", visible: false },
  { field: "Destination", title: "Destination", width: "150px", visible: false },
  { field: "Tejrim", title: "Tejrim", width: "150px", visible: false },
  { field: "TejrimDate", title: "Tejrim Date", width: "150px", visible: false },
  { field: "JobType", title: "Job Type", width: "150px", visible: true },
  { field: "FullPaid", title: "Full Paid", width: "150px", visible: true },
  { field: "PaidDO", title: "Paid D/O", width: "120px", visible: false },
  { field: "PaidDate", title: "Paid Date", width: "120px", visible: false },
  { field: "MissingDocuments", title: "Missing Documents", width: "120px", visible: false },
  { field: "MissingDocumentsDate", title: "Missing Documents Date", width: "120px", visible: false },
  { field: "PendingInvoices", title: "Pending Invoices", width: "120px", visible: false },
  { field: "PendingCosts", title: "Pending Costs", width: "120px", visible: false },
  { field: "TotalInvoices", title: "Total Invoices", visible: true, columnMenu: ColumnMenu, cells: { data: TotalProfitCell }, width: "100px" },
  { field: "TotalCosts", title: "Total Costs", visible: true, columnMenu: ColumnMenu, cells: { data: TotalProfitCell }, width: "100px" },
  { field: "TotalProfit", title: "Total Profit", visible: true, columnMenu: ColumnMenu, cells: { data: TotalProfitCell }, width: "100px" },
];

export default function OngoingJobComponent() {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<IOngoingJob[]>([]);
  const [showLoading, setShowLoading] = React.useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageState, setPageState] = React.useState<PageState>(initialDataState);
  const [pageSizeValue, setPageSizeValue] = React.useState<
    number | string | undefined
  >();
  const [totalCount, setTotalCount] = useState(0);
  const [columns, setColumns] = useState(allColumns);
  const [isMobile, setIsMobile] = useState(false);
  const [grandTotalProfit, setGrandTotalProfit] = useState(0);
  //const [showFullPaid, setShowFullPaid] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string[]>(["New"]);
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState<string[]>(["All"]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "All",
  ]);
  const [fullPaidChecked, setFullPaidChecked] = useState<string[]>(["All"]);

  // Initialize date range for filtering
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // Jan 1st of current year
    to: new Date(),
  });

  const handleFullPaidChange = (event: any) => {
    setFullPaidChecked(event.value);
  };

  // Handle global filter change
  const pageChange = (event: GridPageChangeEvent) => {
    const targetEvent = event.targetEvent as PagerTargetEvent;
    const take =
      targetEvent.value === "All" ? filteredJobs.length : event.page.take;
    if (targetEvent.value) {
      setPageSizeValue(targetEvent.value);
    }
    setPageState({
      ...event.page,
      take,
    });
  };

  // Update footer cell dynamically
  const updatedColumns = useMemo(() => {
    return columns.map((column) => {
      if (column.field === "TotalProfit") {
        return {
          ...column,
          footerCell: (props: any) => (
            <td style={{ textAlign: "right", fontWeight: "bold" }}>
              $
              {props.grandTotalProfit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          ),
        };
      }
      return column;
    });
  }, [columns]);

  const DATA_ITEM_KEY = "id";

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
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
      const status = statusFilter.includes("All") ? "" : statusFilter;
      //const checkedShowFullPaid = showFullPaid === "All" ? "" : showFullPaid;

      const selectedDepartmentsParam =
        selectedDepartments.length > 0
          ? selectedDepartments.includes("All")
            ? ["All"]
            : selectedDepartments
          : ["All"];
      const departmentsStatusParam = Array.isArray(status) ? status.join(",") : status;

      // Format date range for API request
      const startDate = selectedDateRange.from
        ? formatDate(selectedDateRange.from)
        : "";
      const endDate = selectedDateRange.to
        ? formatDate(selectedDateRange.to)
        : "";

      const shipmentStatusParam =
        shipmentStatusFilter.length > 0
          ? shipmentStatusFilter.includes("All")
            ? ["All"]
            : shipmentStatusFilter
          : ["All"];

      const shipmentStatus =
        Array.isArray(shipmentStatusParam)
          ? shipmentStatusParam.join(",")
          : shipmentStatusParam;

      const res = await fetch(
        `/api/reports/admin/on-going?
          page=${Math.floor(pageState.skip / pageState.take) + 1}
          &globalFilter=${globalFilter}
          &departmentsStatus=${encodeURIComponent(departmentsStatusParam)}
          &shipmentStatus=${encodeURIComponent(shipmentStatus)}
          &departments=${selectedDepartmentsParam}
          &fullpaid=${fullPaidChecked}
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
        setGrandTotalProfit(data.pagination.grandTotalProfit ?? 0);
      }

      setShowLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setTotalCount(0);
      setShowLoading(false);
      setGrandTotalProfit(0);
    }
  }, [statusFilter, selectedDepartments, selectedDateRange.from, 
    selectedDateRange.to, shipmentStatusFilter, pageState.skip, pageState.take, 
    globalFilter, fullPaidChecked]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Render column selector
  const renderColumnSelector = () => {
    const allSelected = columns.every(column => column.visible);
    const items = [
      { text: "All", selected: allSelected, id: "all" },
      ...columns.map((column) => ({
        text: column.title,
        selected: column.visible,
        id: column.field,
      }))
    ];

    const handleItemClick = (e: DropDownButtonItemClickEvent) => {
      if (e.item.id === "all") {
        setColumns(columns.map(column => ({ ...column, visible: true })));
      } else {
        toggleColumnVisibility(e.item.id);
      }
    };

    return (
      <div style={{ marginBottom: "10px" }}>
        <DropDownButton
          text="Columns"
          themeColor={"base"}
          items={items}
          onItemClick={handleItemClick}
          className="mr-2"
        />
      </div>
    );
  };

  // Status options
  const renderStatusSelector = () => {
    const statusOptions = [
      { text: "All", value: "All" },
      { text: "New", value: "New" },
      { text: "Delivered", value: "Delivered" },
      { text: "Cancelled", value: "Cancelled" },
    ];
    return (
      <div style={{ marginBottom: "20px", minWidth: 220 }}>
        <MultiSelect
          data={statusOptions}
          textField="text"
          dataItemKey="value"
          value={statusOptions.filter(
            (option) =>
              statusFilter.includes(option.value) &&
              (option.value !== "All" || statusFilter.length === 1)
          )}
          onChange={(e) => {
            let values = e.value.map((item: any) => item.value);
            if (values.length > 0) {
              values = values.filter((v: string) => v !== "All");
              setStatusFilter(values);
            } else {
              setStatusFilter(["All"]);
            }
          }}
          placeholder="Select status..."
          className="w-[220px] mr-2"
        />
      </div>
    );
  };

    // Status options
    const renderShipmentStatusSelector = () => {
      const shipmentStatusOptions = [
        { text: "All", value: "All" },
        { text: "To be Loaded", value: "TobeLoaded" },
        { text: "On Water", value: "OnWater" },
        { text: "Under Clearance", value: "UnderClearance" },
      ];
      return (
        <div style={{ marginBottom: "20px", minWidth: 220 }}>
          <MultiSelect
            data={shipmentStatusOptions}
            textField="text"
            dataItemKey="value"
            value={shipmentStatusOptions.filter(
              (option) =>
                shipmentStatusFilter.includes(option.value) &&
                (option.value !== "All" || shipmentStatusFilter.length === 1)
            )}
            onChange={(e) => {
              let values = e.value.map((item: any) => item.value);
              if (values.length > 0) {
                values = values.filter((v: string) => v !== "All");
                setShipmentStatusFilter(values);
              } else {
                setShipmentStatusFilter(["All"]);
              }
            }}
            placeholder="Select status..."
            className="w-[220px] mr-2"
          />
        </div>
      );
    };

  // Render checkbox for full paid filter
  // This checkbox will filter jobs that are fully paid
  // const checkedOptions = [
  //   { text: "All", value: "All" },
  //   { text: "Full Paid", value: "FullPaid" },
  //   { text: "Not Paid", value: "NotPaid" },
  //   { text: "Pendings", value: "Pendings" },
  // ];
  // const renderCheckFullpaidSelector = () => {
  //   return (
  //     <div style={{ marginBottom: "20px", marginLeft: "10px", minWidth: 150 }}>
  //       <DropDownList
  //         data={checkedOptions}
  //         textField="text"
  //         dataItemKey="value"
  //         value={checkedOptions.find((option) => option.value === showFullPaid)}
  //         onChange={(e) => toggleCheckedFilter(e.value.value)}
  //       />
  //     </div>
  //   );
  // };

  // Status options
  const renderCheckFullpaidSelector = () => {
    const checkedOptions = [
      { text: "All", value: "All" },
      { text: "Full Paid", value: "FullPaid" },
      { text: "Not Paid", value: "NotPaid" },
    ];
    return (
      <div style={{ marginBottom: "20px", minWidth: 220 }}>
        <MultiSelect
          data={checkedOptions}
          textField="text"
          dataItemKey="value"
          value={checkedOptions.filter(
            (option) =>
              fullPaidChecked.includes(option.value) &&
              (option.value !== "All" || fullPaidChecked.length === 1)
          )}
          onChange={(e) => {
            let values = e.value.map((item: any) => item.value);
            if (values.length > 0) {
              values = values.filter((v: string) => v !== "All");
              setFullPaidChecked(values);
            } else {
              setFullPaidChecked(["All"]);
            }
          }}
          placeholder="Select payment..."
          className="w-[220px] mr-2"
        />
      </div>
    );
  };

  const toggleCheckedFilter = (status: string) => {
    setFullPaidChecked([status]);
  };

  //
  const renderCheckFullpaidSelector2 = () => {
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

  const renderDepartmentsSelector = () => {
      const departments = [
        { text: "All", value: "All" },
        { text: "AIR IMPORT", value: "AIR IMPORT" },  
        { text: "AIR EXPORT", value: "AIR EXPORT" },
        { text: "AIR CLEARANCE", value: "AIR CLEARANCE" },
        { text: "SEA IMPORT", value: "SEA IMPORT" },
        { text: "SEA EXPORT", value: "SEA EXPORT" },
        { text: "SEA CLEARANCE", value: "SEA CLEARANCE" },
        { text: "LAND FREIGHT", value: "LAND FREIGHT" },
        { text: "SEA CROSS", value: "SEA CROSS" },
      ];
      return (
        <div style={{ marginBottom: "20px", minWidth: 220 }}>
          <MultiSelect
            data={departments}
            textField="text"
            dataItemKey="value"
            value={departments.filter(
              (option) =>
                selectedDepartments.includes(option.value) &&
                (option.value !== "All" || selectedDepartments.length === 1)
            )}
            onChange={(e) => {
              let values = e.value.map((item: any) => item.value);
              if (values.length > 0) {
                values = values.filter((v: string) => v !== "All");
                setSelectedDepartments(values);
              } else {
                setSelectedDepartments(["All"]);
              }
            }}
            placeholder="Select departments..."
            className="w-[220px] mr-2"
          />
        </div>
      );
    };

  const filteredJobs = useMemo(() => {
    if (statusFilter.includes("All")) return jobs;
    return jobs.filter((job) => {
      const jobStatus = job.StatusType;
      switch (true) {
        case statusFilter.includes("New"):
          return jobStatus === "New";
        case statusFilter.includes("Delivered"):
          return jobStatus === "Delivered";
        case statusFilter.includes("Cancelled"):
          return jobStatus === "Cancelled";
        default:
          return true;
      }
    });
  }, [jobs, statusFilter]);

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

  useEffect(() => {
    setPageState((prev) => ({ ...prev, skip: 0 }));
    fetchData();
  }, [
    globalFilter,
    statusFilter,
    selectedDepartments,
    fullPaidChecked,
    fetchData,
  ]);

  return (
    <>
      {/* Info Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-xs text-muted-foreground mt-2">
          Total rows: {totalCount} | Page{" "}
          {Math.ceil(pageState.skip / pageState.take) + 1} of{" "}
          {Math.ceil(totalCount / pageState.take)} | Rows per page:{" "}
          {pageState.take}
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

      {/* Controls & Totals Row */}
      <div className="flex justify-between">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Left-aligned controls */}
          <div className="flex flex-wrap gap-2">
            {renderColumnSelector()}
            {renderDepartmentsSelector()}
            {renderShipmentStatusSelector()}
            {renderStatusSelector()}
            {renderCheckFullpaidSelector()}
            
            {/* Date Range Picker */}
            <div className="flex flex-col md:flex-row gap-4 justify-start">
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
      </div>

      {/* Grid */}
      <div ref={gridRef} className="text-sm">
        {showLoading ? <LoadingPanel gridRef={gridRef} /> : null}
        <Grid
          data={filteredJobs}
          dataItemKey={DATA_ITEM_KEY}
          style={{ height: "650px", fontSize: "0.75rem" }}
          autoProcessData={true}
          sortable={{ mode: "multiple" }}
          groupable={true}
          selectable={false}
          filterable={true}
          pageable={{
            buttonCount: 4,
            type: "numeric",
            info: true,
            pageSizes: [10, 50, 100, 200, 1000, "All"],
            pageSizeValue: pageSizeValue,
          }}
          skip={pageState.skip}
          take={pageState.take}
          total={totalCount}
          onPageChange={pageChange}
        >
          {updatedColumns
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
                      if (!dataItem || !field) return null;
                      return (
                        <td style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                          {dataItem[field as keyof IOngoingJob]}
                        </td>
                      );
                    },
                  }
                }
              />
            ))}
        </Grid>
      </div>
    </>
  );
}

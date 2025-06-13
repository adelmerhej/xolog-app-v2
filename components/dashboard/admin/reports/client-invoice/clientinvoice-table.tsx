/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import React, { useState, useEffect, useCallback } from "react";
import { Grid, GridColumn as Column, GridCustomCellProps } from "@progress/kendo-react-grid";
import { createPortal } from "react-dom";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownButton, DropDownButtonItemClickEvent } from "@progress/kendo-react-buttons";
import { IClientInvoice } from "@/types/reports/IClientInvoice";
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
  { field: "JobNo", title: "Job#", width: "75px", visible: true },
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
      }
    }
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
      }
    }
  },
  { 
    field: "Eta", 
    title: "ETA", 
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Eta)}</td>;
      }
    }
  },
  { 
    field: "Atd", 
    title: "ATD", 
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Atd)}</td>;
      }
    }
  },
  { 
    field: "Ata", 
    title: "ATA", 
    visible: true,
    cells: {
      data: (props: GridCustomCellProps) => {
        const { dataItem } = props;
        return <td>{formatDate(dataItem.Ata)}</td>;
      }
    }
  },
  { field: "Status", title: "Status", visible: false },
  { 
    field: "TotalInvoiceAmount", 
    title: "Totals", 
    visible: true,
    columnMenu: ColumnMenu,
    cells: { data: TotalsCell },
    width: "150px"
  }
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

  const DATA_ITEM_KEY = "id";

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setShowLoading(true);
  
      const res = await fetch(
        `/api/reports/admin/client-invoice?page=${pagination.pageIndex + 1}&limit=${
          pagination.pageSize
        }&filterinvoices=${invoiceFilter.join(",")}&filterjobs=${selectedJobsStatus.join(",")}&search=${globalFilter}`,
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
        setGrandTotal(data.pagination.grandTotalInvoices ?? 0);
        setShowLoading(false);
      } else {
        console.error("Invalid API response", data);
        setJobs([]);
        setTotalCount(0);
        setGrandTotal(0);
        setShowLoading(false);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
      setTotalCount(0);
      setGrandTotal(0);
      setShowLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, invoiceFilter, selectedJobsStatus, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, invoiceFilter, selectedJobsStatus, globalFilter, fetchData]);

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
          pageable={{ pageSizes: true }}
          groupable={true}
          selectable={false}
          defaultTake={10}
          defaultSkip={0}
        >
          {columns.filter(c => c.visible).map(column => (
            <Column
              key={column.field}
              field={column.field}
              title={column.title}
              width={column.width}
              columnMenu={column.columnMenu}
              cells={column.cells || {
                data: (props: GridCustomCellProps) => {
                  const { dataItem, field } = props;
                  
                  if (!dataItem || !field) {
                    return null;
                  }

                  return (
                    <td style={{ fontSize: '0.75rem' }}>
                      {dataItem[field as keyof IClientInvoice]}
                    </td>
                  );
                }
              }}
            />
          ))}
        </Grid>
      </div>
      {/* END GRID */}
    </>
  );
}
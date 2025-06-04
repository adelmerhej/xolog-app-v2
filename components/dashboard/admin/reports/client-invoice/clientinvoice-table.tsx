/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { IClientInvoice } from "@/types/reports/IClientInvoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import DataGrid, {
  Column,
  Paging,
  Pager,
  FilterRow,
  SearchPanel,
  Sorting,
  Export,
  GroupPanel,
  Grouping,
  Summary,
  TotalItem,
  HeaderFilter,
  Selection,
  ColumnChooser,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'devextreme/dist/css/dx.material.blue.light.css';

export default function ClientInvoiceComponent() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 200,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [selectedJobsStatus, setSelectedJobsStatus] = useState<string[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // CustomStore for DataGrid
  const dataSource = useMemo(() => {
    return new CustomStore({
      key: '_id',
      load: async (loadOptions: any) => {
        const page = (loadOptions.skip ?? 0) / (loadOptions.take ?? pagination.pageSize) + 1;
        const pageSize = loadOptions.take ?? pagination.pageSize;
        const filterinvoices = invoiceFilter.join(",");
        const filterjobs = selectedJobsStatus.join(",");
        const search = globalFilter;
        const url = `/api/reports/admin/client-invoice?page=${page}&limit=${pageSize}&filterinvoices=${filterinvoices}&filterjobs=${filterjobs}&search=${search}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setTotalCount(data.pagination?.total ?? 0);
        setGrandTotal(data.pagination?.grandTotalInvoices ?? 0);
        return {
          data: Array.isArray(data.data) ? data.data : [],
          totalCount: data.pagination?.total ?? 0,
        };
      },
    });
  }, [pagination.pageSize, invoiceFilter, selectedJobsStatus, globalFilter]);

  // Calculate Total Invoice Amount for current page (client-side sum)
  const [pageJobs, setPageJobs] = useState<IClientInvoice[]>([]);
  const TotalInvoiceAmountSum = useMemo(
    () =>
      pageJobs.reduce(
        (sum, job) =>
          sum +
          (typeof job.TotalInvoiceAmount === "number"
            ? job.TotalInvoiceAmount
            : Number(job.TotalInvoiceAmount) || 0),
        0
      ),
    [pageJobs]
  );

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

  // Format currency
  const formatCurrency = (value: any) => {
    const numValue = Number(value);
    return `$${numValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Format date
  const formatDate = (value: any) => {
    if (!value) return "";
    const date = new Date(value);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  // Handle page change
  const onPageChanged = useCallback((e: any) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: e.pageIndex,
      pageSize: e.pageSize
    }));
  }, []);

  return (
    <div className="w-full max-w-full mx-auto space-y-4 text-sm">
      <div className="text-xs text-muted-foreground">
        Total rows: {totalCount} | Page{" "}
        {pagination.pageIndex + 1} of {Math.ceil(totalCount / pagination.pageSize)} |
        Rows per page: {pagination.pageSize}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Input
          placeholder="Search all columns..."
          className="w-full md:max-w-sm"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div className="flex gap-2">
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
          <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            <div className="flex items-center">
              <span className="text-sm">Page total:</span>
              <span className="ml-2 font-semibold text-green-700">
                {formatCurrency(TotalInvoiceAmountSum)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">Grand total:</span>
              <span className="ml-2 font-semibold text-blue-700">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DevExtreme DataGrid */}
      <div className="dx-datagrid-wrapper" style={{ height: 600 }}>
        <DataGrid
          dataSource={dataSource}
          keyExpr="_id"
          showBorders={true}
          columnAutoWidth={true}
          allowColumnResizing={true}
          rowAlternationEnabled={true}
          columnResizingMode="widget"
          showColumnLines={true}
          showRowLines={true}
          hoverStateEnabled={true}
          remoteOperations={true}
          onOptionChanged={onPageChanged}
          onContentReady={e => setPageJobs(e.component.getVisibleRows().map((row: any) => row.data).filter(Boolean))}
        >
          <SearchPanel 
            visible={false} 
            highlightCaseSensitive={true} 
          />
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <Sorting mode="multiple" />
          
          <Paging 
            enabled={true}
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex}
          />
          <Pager 
            visible={true}
            showPageSizeSelector={true} 
            allowedPageSizes={[10, 20, 50, 100, 200, 1000]} 
            showInfo={true}
            showNavigationButtons={true}
          />
          
          <Export enabled={true} />
          <GroupPanel visible={true} />
          <Grouping autoExpandAll={false} />
          <ColumnChooser enabled={true} />
          <ColumnFixing enabled={true} />
          <Selection mode="multiple" showCheckBoxesMode="always" />

          {/* Columns */}
          <Column 
            dataField="JobNo" 
            caption="Job No" 
            width={120}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="QuotationNo" 
            caption="Quotation No" 
            width={130}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="Mbl" 
            caption="MBL" 
            width={150}
            allowSorting={true}
            allowFiltering={true}
            cellRender={({ value }) => (
              <div className="whitespace-normal min-w-[120px] max-w-[100px] line-clamp-3">
                {value}
              </div>
            )}
          />
          <Column 
            dataField="InvoiceNo" 
            caption="Invoice No" 
            width={130}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="DueDate" 
            caption="Due Date" 
            dataType="date"
            width={120}
            allowSorting={true}
            allowFiltering={true}
            cellRender={({ value }) => formatDate(value)}
          />
          <Column 
            dataField="TotalInvoiceAmount" 
            caption="Total Invoice" 
            dataType="number"
            format="currency"
            width={130}
            allowSorting={true}
            allowFiltering={true}
            alignment="right"
            cellRender={({ value }) => formatCurrency(value)}
          />
          <Column 
            dataField="Consignee" 
            caption="Customer" 
            width={150}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="Salesman" 
            caption="Salesman" 
            width={120}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="POL" 
            caption="POL" 
            width={100}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="POD" 
            caption="POD" 
            width={100}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="Volume" 
            caption="Volume" 
            width={100}
            allowSorting={true}
            allowFiltering={true}
          />
          <Column 
            dataField="Etd" 
            caption="ETD" 
            dataType="date"
            width={120}
            allowSorting={true}
            allowFiltering={true}
            cellRender={({ value }) => formatDate(value)}
          />
          <Column 
            dataField="Eta" 
            caption="ETA" 
            dataType="date"
            width={120}
            allowSorting={true}
            allowFiltering={true}
            cellRender={({ value }) => formatDate(value)}
          />
          <Column 
            dataField="Atd" 
            caption="ATD" 
            dataType="date"
            width={120}
            allowSorting={true}
            allowFiltering={true}
            cellRender={({ value }) => formatDate(value)}
          />
          <Column 
            dataField="Ata" 
            caption="ATA" 
            dataType="date"
            width={120}
            allowSorting={true}
            allowFiltering={true}
            cellRender={({ value }) => formatDate(value)}
          />
          <Column 
            dataField="Status" 
            caption="Status" 
            width={150}
            allowSorting={true}
            allowFiltering={true}
          />

          <Summary>
            <TotalItem 
              column="TotalInvoiceAmount" 
              summaryType="sum" 
              valueFormat="currency" 
              displayFormat="Total: {0}"
              customizeText={(data) => `Total: ${formatCurrency(data.value)}`}
            />
          </Summary>
        </DataGrid>
      </div>
    </div>
  );
}

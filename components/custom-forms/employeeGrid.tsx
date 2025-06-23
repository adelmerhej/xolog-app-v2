'use client';

import './style.css';

import React from 'react';

import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Button, ButtonGroup } from '@progress/kendo-react-buttons';
import { Grid, GridColumn as Column, GridToolbar, GridSearchBox } from '@progress/kendo-react-grid';

import { BudgetCell, ColumnMenu, PersonCell, ProgressCell, RatingCell, CountryCell } from './custom-cells';
import { employees } from '@/models/employees';

const DATA_ITEM_KEY = 'id';

const EmployeeGrid = () => {
    let _pdfExport: GridPDFExport | null = null;
    const exportExcel = () => {
        if (_export) {
            _export.save();
        }
    };

    let _export: ExcelExport | null = null;
    const exportPDF = () => {
        if (_pdfExport) {
            _pdfExport.save();
        }
    };

    const grid = (
        <Grid
            style={{ height: '670px' }}
            dataItemKey={DATA_ITEM_KEY}
            data={employees}
            autoProcessData={true}
            sortable={true}
            defaultGroup={[{ field: 'job_title' }]}
            pageable={{ pageSizes: true }}
            groupable={true}
            selectable={true}   
            rowSpannable={{ valueGetter: (dataItem, field) => `${dataItem.job_title}-${dataItem[field]}` }}
            defaultTake={10}
            defaultSkip={0}
        >
            <GridToolbar>
                <GridSearchBox style={{ width: 210 }} />
                <ButtonGroup>
                    <Button themeColor={'base'} onClick={exportExcel}>
                        Export to Excel
                    </Button>
                    <Button themeColor={'base'} onClick={exportPDF}>
                        Export to PDF
                    </Button>
                </ButtonGroup>
            </GridToolbar>
            <Column filterable={false} groupable={false} width={50} columnType="checkbox" />
            <Column title="Employee" groupable={false} sortable={false}>
                <Column
                    field="full_name"
                    title="Contact Name"
                    columnMenu={ColumnMenu}
                    cells={{
                        data: PersonCell
                    }}
                    width="250px"
                />
                <Column field="job_title" title="Job Title" columnMenu={ColumnMenu} width="220px" />
                <Column
                    field="country"
                    title="Country"
                    cells={{
                        data: CountryCell
                    }}
                    columnMenu={ColumnMenu}
                    width="120px"
                />
            </Column>
            <Column title="Performance" groupable={false} sortable={false}>
                <Column
                    field="target"
                    title="Engagement"
                    cells={{
                        data: ProgressCell
                    }}
                    columnMenu={ColumnMenu}
                    width="250px"
                />
                <Column
                    field="budget"
                    title="Budget"
                    columnMenu={ColumnMenu}
                    cells={{
                        data: BudgetCell
                    }}
                    width="150px"
                />
                <Column
                    field="rating"
                    title="Rating"
                    cells={{
                        data: RatingCell
                    }}
                    columnMenu={ColumnMenu}
                    width="230px"
                />
            </Column>
            <Column title="Contacts" groupable={false} sortable={false}>
                <Column field="phone" title="Phone" columnMenu={ColumnMenu} width="230px" />
                <Column field="address" title="Address" columnMenu={ColumnMenu} width="230px" />
            </Column>
        </Grid>
    );

    return (
        <>
            <ExcelExport
                data={employees}
                ref={(exporter: ExcelExport | null) => {
                    _export = exporter;
                }}
            >
                {grid}
            </ExcelExport>
            <GridPDFExport
                margin="1cm"
                ref={(element: GridPDFExport | null) => {
                    _pdfExport = element;
                }}
            >
                {grid}
            </GridPDFExport>
        </>
    );
};
export default EmployeeGrid;

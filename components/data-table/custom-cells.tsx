/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import * as React from 'react';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import {
    GridColumnMenuSort,
    GridColumnMenuFilter,
    GridColumnMenuGroup,
    GridCustomCellProps,
    GridColumnMenuProps
} from '@progress/kendo-react-grid';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Rating } from '@progress/kendo-react-inputs';
import Image from 'next/image';


export const TotalsCell = (props: GridCustomCellProps) => {
    const { dataItem } = props;

    if (dataItem && dataItem.TotalInvoiceAmount !== undefined) {
        const Totals = dataItem.TotalInvoiceAmount;
        const formattedTotals = `$${Totals.toFixed(2)}`;
        return <td {...props.tdProps}>{formattedTotals}</td>;
    }
};

export const TotalProfitCell = (props: GridCustomCellProps) => {
    const { dataItem } = props;
    const value = dataItem.TotalProfit;
    
    return (
      <td style={{ textAlign: 'right' }}>
        {typeof value === 'number' 
          ? `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          : value}
      </td>
    );
};

export const ColumnMenu = (props: GridColumnMenuProps) => {
    return (
        <div>
            <GridColumnMenuSort {...props} />
            <GridColumnMenuFilter {...props} />
            <GridColumnMenuGroup {...props} />
        </div>
    );
};

export const PersonCell = (props: GridCustomCellProps) => {
    const { dataItem } = props;

    if (!dataItem || !dataItem.image) {
        return dataItem.full_name;
    }

    const imageDataUrl = dataItem.image.replace(/url\('(.*)'\)/, '$1');
    return (
        <td {...props.tdProps}>
            <Image 
                src={imageDataUrl} width={34} height={34} 
                className="contact-img" alt="Contact" />
            <span
                style={{
                    display: 'inlineBlock',
                    paddingLeft: '10px',
                    verticalAlign: 'middle',
                    lineHeight: '32px'
                }}
                className="person-name"
            >
                {dataItem.full_name}
            </span>
        </td>
    );
};

export const ProgressCell = (props: GridCustomCellProps) => {
    const progress = props.dataItem.target;
    if (props.rowType === 'groupHeader') {
        return;
    }
    return (
        <td {...props.tdProps}>
            <ProgressBar
                style={{
                    width: '150px',
                    height: '8px',
                    marginRight: '20px'
                }}
                value={progress}
                labelVisible={false}
            />
            {progress} %<span> </span>
        </td>
    );
};

export const RatingCell = (props: GridCustomCellProps) => {
    const field = props.field || '';
    const value = props.dataItem[field];
    if (props.rowType === 'groupHeader') {
        return null;
    }
    return (
        <td {...props.tdProps}>
            <Rating value={value === null ? '' : props.dataItem[field]} readonly={true} />
        </td>
    );
};

export const BudgetCell = (props: GridCustomCellProps) => {
    if (!props.field) {
        return null;
    }
    const value = props.dataItem[props.field];
    if (props.rowType === 'groupHeader') {
        return null;
    }
    return (
        <td {...props.tdProps}>
            {value ? `$${value.toFixed(2)}` : ''}
        </td>
    );
};

export const CountryCell = (props: GridCustomCellProps) => {
    const { dataItem } = props;

    if (!dataItem || !dataItem.flag) {
        return null;
    }

    return (
        <td {...props.tdProps}>
            <Image
                src={dataItem.flag}
                width="22"
                height="11"
                alt="Flag"
                style={{
                    marginLeft: '12px'
                }}
            />
        </td>
    );
};

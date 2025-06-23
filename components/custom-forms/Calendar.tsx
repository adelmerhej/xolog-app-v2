'use client';

import React, { useState } from "react";
import PropTypes from "prop-types";

import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import { addDays, subDays } from "date-fns";
import { DateRangePicker, RangeKeyDict } from "react-date-range";

interface CalendarProps {
  onChange: (range: { startDate: Date; endDate: Date; key: string }) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onChange }) => {
  const [state, setState] = useState([
    {
      startDate: subDays(new Date(), 7),
      endDate: addDays(new Date(), 1),
      key: "selection"
    }
  ]);

const handleOnChange = (ranges: RangeKeyDict) => {
  const selection = ranges.selection;

  if (selection?.startDate && selection?.endDate && selection?.key) {
    onChange({
      startDate: selection.startDate,
      endDate: selection.endDate,
      key: selection.key,
    });
    setState([
      {
        startDate: selection.startDate as Date,
        endDate: selection.endDate as Date,
        key: selection.key as string,
      }
    ]);
  }
};


  return (
    <DateRangePicker
      onChange={handleOnChange}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction="horizontal"
    />
  );
};

Calendar.propTypes = {
  onChange: PropTypes.func
};

export default Calendar;

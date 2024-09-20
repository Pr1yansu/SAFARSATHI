import React from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./calendar.css";

function Calendar({ dateRange, setDateRange }) {
  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([startDate, endDate]);
  };

  return (
    <div className="calendar-container">
      <DateRangePicker
        ranges={[
          {
            startDate: dateRange[0],
            endDate: dateRange[1],
            key: "selection",
          },
        ]}
        rangeColors={["#8b5cf6"]}
        onChange={handleSelect}
        minDate={new Date()}
        maxDate={
          new Date(new Date().setFullYear(new Date().getFullYear() + 40))
        }
      />
    </div>
  );
}

export default Calendar;

import React, { useState } from "react";
import { formatDate, isWeekend, isPastDate } from "../utils/dateUtils";

const DateRangePicker = ({ onDateChange, startDate, endDate }) => {
  const [tempStartDate, setTempStartDate] = useState(startDate || "");
  const [tempEndDate, setTempEndDate] = useState(endDate || "");

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setTempStartDate(newStartDate);

    // Auto-set end date to start date if end date is before start date
    if (tempEndDate && new Date(tempEndDate) < new Date(newStartDate)) {
      setTempEndDate(newStartDate);
      onDateChange(newStartDate, newStartDate);
    } else {
      onDateChange(newStartDate, tempEndDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setTempEndDate(newEndDate);
    onDateChange(tempStartDate, newEndDate);
  };

  // Get minimum date (today)
  const today = formatDate(new Date());

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          min={today}
          value={tempStartDate}
          onChange={handleStartDateChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {tempStartDate && isPastDate(tempStartDate) && (
          <p className="mt-1 text-sm text-red-600">Cannot select past dates</p>
        )}
        {tempStartDate && isWeekend(tempStartDate) && (
          <p className="mt-1 text-sm text-red-600">Cannot select weekends</p>
        )}
      </div>
      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700"
        >
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          min={tempStartDate || today}
          value={tempEndDate}
          onChange={handleEndDateChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {tempEndDate && isPastDate(tempEndDate) && (
          <p className="mt-1 text-sm text-red-600">Cannot select past dates</p>
        )}
        {tempEndDate && isWeekend(tempEndDate) && (
          <p className="mt-1 text-sm text-red-600">Cannot select weekends</p>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;

import React, { useState } from "react";
import {
  useGetOrdersQuery,
  useGetReservesByMonthQuery,
  useGetTotalEarningsQuery,
} from "../../store/apis/charts";
import { formatCurrency } from "../../components/utils/utils";
import { FaCashRegister } from "react-icons/fa";
import LineChart from "../../components/charts/line-chart";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PieChartComponent from "../../components/charts/pie-charts";
import { FaCalendarAlt } from "react-icons/fa";

const removeMilliseconds = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    0,
    0
  );
};

const Dashboard = () => {
  const [startDate, setStartDate] = React.useState(
    removeMilliseconds(new Date(new Date().setMonth(new Date().getMonth() - 1)))
  );
  const [endDate, setEndDate] = React.useState(removeMilliseconds(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  const {
    data: orders,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
  } = useGetOrdersQuery(
    { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: reserves,
    isLoading: reservesLoading,
    isFetching: reservesFetching,
  } = useGetReservesByMonthQuery(
    { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: totalEarnings,
    isLoading: totalEarningsLoading,
    isFetching: totalEarningsFetching,
    refetch: refetchEarnings,
  } = useGetTotalEarningsQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const handleDateChange = (item) => {
    const newStartDate = removeMilliseconds(item.selection.startDate);
    const newEndDate = removeMilliseconds(item.selection.endDate);

    if (
      newStartDate.getTime() !== startDate.getTime() ||
      newEndDate.getTime() !== endDate.getTime()
    ) {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      refetchEarnings();
    }
  };

  return (
    <div className="container mx-auto my-6">
      <div className="flex gap-6 items-start flex-wrap">
        <div className="flex-1">
          <div className="shadow-lg rounded-lg bg-white p-6 flex items-center gap-4 border">
            <FaCashRegister size={46} color="#f59e0b" />
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-500">
                Total Earnings
              </h4>
              {totalEarningsLoading || totalEarningsFetching ? (
                <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <span className="text-3xl font-semibold">
                  {formatCurrency(totalEarnings)}
                </span>
              )}
            </div>
          </div>

          <div
            className="mt-6 w-full shadow-md rounded-lg bg-white p-6 border"
            style={{ height: "400px", position: "relative" }}
          >
            {ordersLoading || ordersFetching ? (
              <div className="w-full h-full flex justify-center items-center">
                <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            ) : (
              <LineChart orders={orders} />
            )}
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <div className="shadow-lg rounded-lg bg-white p-6 flex items-center gap-4 border max-md:flex-col">
            {/* Collapse DatePicker on smaller screens */}
            <button
              className="lg:hidden flex items-center gap-2 text-gray-700"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <FaCalendarAlt size={20} />
              <span>{showDatePicker ? "Hide" : "Show"} Date Picker</span>
            </button>
            {/* Show DatePicker based on screen size */}
            <div className={`${showDatePicker ? "block" : "hidden"} lg:block`}>
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <div className="w-full my-4">
            <div
              className="shadow-md rounded-lg bg-white p-6 border"
              style={{ minHeight: "400px", position: "relative" }}
            >
              <h4 className="text-lg font-semibold text-gray-700 my-4">
                Reserves by Month
              </h4>
              {reservesLoading || reservesFetching ? (
                <div className="w-full h-full flex justify-center items-center">
                  <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
              ) : (
                <div style={{ height: "300px" }}>
                  <PieChartComponent reserves={reserves} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import {
  useGetOrdersQuery,
  useGetReservesByMonthQuery,
  useGetTotalEarningsQuery,
} from "../../store/apis/charts";
import { formatCurrency } from "../../components/utils/utils";
import LineChart from "../../components/charts/line-chart";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PieChartComponent from "../../components/charts/pie-charts";
import { HiBanknotes, HiCalendar, HiChartBar, HiShieldCheck, HiSparkles, HiUserGroup } from "react-icons/hi2";
import { motion } from "framer-motion";

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
    <div className="min-h-screen py-8 px-4 sm:px-6 gradient-hero-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
              <HiSparkles className="text-indigo-600" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Executive Analytics & Financial Overview
            </h1>
          </div>

          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-xs shadow-xs"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <HiCalendar size={18} className="text-indigo-600" />
            <span>{showDatePicker ? "Hide Range Picker" : "Filter Date Range"}</span>
          </button>
        </div>

        {/* Top Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Earnings Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-slate-900 text-white rounded-3xl p-6 shadow-card flex items-center justify-between gap-4 border border-slate-800"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Platform Revenue</p>
              {totalEarningsLoading || totalEarningsFetching ? (
                <div className="w-32 h-8 bg-slate-800 animate-pulse rounded-lg"></div>
              ) : (
                <p className="text-3xl font-black tracking-tight text-emerald-400">
                  {formatCurrency(totalEarnings)}
                </p>
              )}
              <p className="text-[10px] text-slate-400 font-medium">Selected date range total</p>
            </div>
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <HiBanknotes size={32} />
            </div>
          </motion.div>

          {/* Orders Volume Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 flex items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Reservations</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {orders?.length || 0} <span className="text-xs font-normal text-slate-400">Bookings</span>
              </p>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <HiShieldCheck size={14} />
                <span>100% Payment Secured</span>
              </p>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
              <HiChartBar size={32} />
            </div>
          </motion.div>

          {/* Active Status Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 flex items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Health</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                Active <span className="text-xs font-bold text-emerald-500">Live</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium">MongoDB Cluster Operational</p>
            </div>
            <div className="p-4 bg-violet-50 text-violet-600 rounded-2xl border border-violet-100">
              <HiUserGroup size={32} />
            </div>
          </motion.div>
        </div>

        {/* Charts & Date Range Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Revenue Chart */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Revenue & Booking Trends</h3>
                <span className="text-xs font-semibold text-slate-400">Monthly Volume</span>
              </div>
              <div className="w-full h-80 relative">
                {ordersLoading || ordersFetching ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="w-16 h-16 bg-slate-100 animate-pulse rounded-full"></div>
                  </div>
                ) : (
                  <LineChart orders={orders} />
                )}
              </div>
            </div>

            {/* Reserves Distribution Pie Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Monthly Reservation Distribution</h3>
              <div className="w-full h-72 relative">
                {reservesLoading || reservesFetching ? (
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="w-16 h-16 bg-slate-100 animate-pulse rounded-full"></div>
                  </div>
                ) : (
                  <PieChartComponent reserves={reserves} />
                )}
              </div>
            </div>
          </div>

          {/* Date Picker Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-200/80 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HiCalendar className="text-indigo-600" />
                <span>Select Analysis Window</span>
              </h3>
              <div className={`overflow-hidden rounded-2xl border border-slate-200 ${showDatePicker ? "block" : "hidden"} lg:block`}>
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={handleDateChange}
                  rangeColors={["#4f46e5"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/charts`;

export const chartsApi = createApi({
  reducerPath: "chartsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Charts"],
  endpoints: (builder) => ({
    getReservesByMonth: builder.query({
      query: ({ startDate, endDate }) =>
        `${baseUrl}/reserves?startDate=${startDate}&endDate=${endDate}`,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Charts"],
    }),
    getReservesByCategory: builder.query({
      query: () => `${baseUrl}/reserves/category`,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Charts"],
    }),
    getOrders: builder.query({
      query: ({ startDate, endDate }) =>
        `${baseUrl}/orders?startDate=${startDate}&endDate=${endDate}`,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.orders;
      },
      providesTags: ["Charts"],
    }),
    getTotalEarnings: builder.query({
      query: ({ startDate, endDate }) =>
        `${baseUrl}/earnings?startDate=${startDate}&endDate=${endDate}`,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.totalEarnings;
      },
      providesTags: ["Charts"],
    }),
  }),
});

export const {
  useGetReservesByMonthQuery,
  useGetReservesByCategoryQuery,
  useGetOrdersQuery,
  useGetTotalEarningsQuery,
} = chartsApi;

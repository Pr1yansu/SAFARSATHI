import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/reserves`;

export const reserveApi = createApi({
  reducerPath: "reserveApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Reserve"],
  endpoints: (builder) => ({
    createReserve: builder.mutation({
      query: (body) => ({
        url: `${baseUrl}/create`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Reserve"],
    }),
    getReserveByTouristSpotId: builder.query({
      query: (id) => `${baseUrl}/tourist-spot/${id}`,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.reserve;
      },
      providesTags: ["Reserve"],
    }),
    createOrder: builder.mutation({
      query: ({ reserveId }) => ({
        url: `${baseUrl}/order`,
        method: "POST",
        body: {
          reserveId,
        },
        credentials: "include",
      }),
      invalidatesTags: ["Reserve"],
    }),
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: `${baseUrl}/order/verify`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Reserve"],
    }),
  }),
});

export const {
  useCreateReserveMutation,
  useGetReserveByTouristSpotIdQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} = reserveApi;

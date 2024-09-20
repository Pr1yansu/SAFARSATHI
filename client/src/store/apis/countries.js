import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1`;

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Countries"],
  endpoints: (builder) => ({
    getCountries: builder.query({
      query: () => "/countries",
      providesTags: ["Countries"],
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;

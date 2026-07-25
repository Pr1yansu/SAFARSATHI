import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v1/news-letter`;

export const newsLetterApi = createApi({
  reducerPath: "newsLetterApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["NewsLetter"],
  endpoints: (builder) => ({
    subscribe: builder.mutation({
      query: (body) => ({
        url: `${baseUrl}/subscribe`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["NewsLetter"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
  }),
});

export const { useSubscribeMutation } = newsLetterApi;

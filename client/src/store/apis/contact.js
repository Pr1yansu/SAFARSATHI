import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/contact`;

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (body) => ({
        url: `${baseUrl}/send-message`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Contact"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
  }),
});

export const { useSendMessageMutation } = contactApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`;

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (body) => ({
        url: `${baseUrl}/create`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    getCategories: builder.query({
      query: () => `${baseUrl}/`,
      providesTags: ["Categories"],
      transformResponse: (response) => response.categories,
    }),
    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `${baseUrl}/update/${id}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    deleteCategories: builder.mutation({
      query: ({ categories }) => ({
        url: `${baseUrl}/delete`,
        method: "DELETE",
        credentials: "include",
        body: { categories },
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoriesMutation,
} = categoriesApi;

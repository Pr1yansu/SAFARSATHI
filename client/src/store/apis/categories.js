import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v1/categories`;

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/create",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (response) => {
        return response?.data?.message || response?.message || "Failed to create category";
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    getCategories: builder.query({
      query: () => "/",
      providesTags: ["Categories"],
      transformResponse: (response) => response.categories,
    }),
    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (response) => {
        return response?.data?.message || response?.message || "Failed to update category";
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    deleteCategories: builder.mutation({
      query: ({ categories }) => ({
        url: "/delete",
        method: "DELETE",
        credentials: "include",
        body: { categories },
      }),
      invalidatesTags: ["Categories"],
      transformErrorResponse: (response) => {
        return response?.data?.message || response?.message || "Failed to delete category";
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

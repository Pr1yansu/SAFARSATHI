import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v1/users`;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ password, email, name }) => ({
        url: "/register",
        method: "POST",
        body: {
          password,
          email,
          name,
        },
      }),
      invalidatesTags: ["User"],
      transformErrorResponse: (response) => {
        return response?.data?.message || response?.message || "Registration failed";
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    login: builder.mutation({
      query: ({ password, email }) => ({
        url: "/login",
        method: "POST",
        body: {
          password,
          username: email,
        },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
      transformErrorResponse: (response) => {
        return response?.data?.message || response?.message || "Invalid credentials";
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    profile: builder.query({
      query: () => ({
        url: "/current/profile",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: ({ page, limit }) => ({
        url: limit ? `?limit=${limit}` : `?page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/${id}/update-role`,
        method: "PUT",
        body: {
          role,
        },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: {
          email,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || response?.message || "Error processing request";
      },
      transformResponse: (response) => {
        return {
          message: response.message,
          duration: response.duration,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ password, token }) => ({
        url: "/reset-password",
        method: "POST",
        body: {
          password,
          token,
        },
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || response?.message || "Reset failed";
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useProfileQuery,
  useLogoutMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;

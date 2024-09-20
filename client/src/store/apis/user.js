import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/users`;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ password, email, name }) => ({
        url: `${baseUrl}/register`,
        method: "POST",
        body: {
          password,
          email,
          name,
        },
      }),
      invalidatesTags: ["User"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        console.log(response);

        return response.message;
      },
    }),
    login: builder.mutation({
      query: ({ password, email }) => ({
        url: `${baseUrl}/login`,
        method: "POST",
        body: {
          password,
          username: email,
        },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    profile: builder.query({
      query: () => ({
        url: `${baseUrl}/current/profile`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${baseUrl}/logout`,
        method: "GET",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: ({ page, limit }) => ({
        url: limit ? `${baseUrl}?limit=${limit}` : `${baseUrl}?page=${page}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${baseUrl}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `${baseUrl}/${id}/update-role`,
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
        url: `${baseUrl}/forgot-password`,
        method: "POST",
        body: {
          email,
        },
      }),
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        console.log(response);
        return {
          message: response.message,
          duration: response.duration,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ password, token }) => ({
        url: `${baseUrl}/reset-password`,
        method: "POST",
        body: {
          password,
          token,
        },
      }),
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

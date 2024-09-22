import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/tourist-spot`;

export const touristSpotsApi = createApi({
  reducerPath: "touristSpotsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["TouristSpots"],
  endpoints: (builder) => ({
    createTouristSpot: builder.mutation({
      query: (body) => ({
        url: `${baseUrl}/create`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["TouristSpots"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    getTouristSpots: builder.query({
      query: (data) => {
        const params = new URLSearchParams();

        if (data?.page) params.append("page", data.page);
        if (data?.category) params.append("category", data.category);
        if (data?.location) params.append("location", data.location);
        if (data?.checkin) params.append("checkin", data.checkin);
        if (data?.checkout) params.append("checkout", data.checkout);
        if (data?.guests) params.append("guests", data.guests);
        if (data?.rooms) params.append("rooms", data.rooms);
        if (data?.adults) params.append("adults", data.adults);
        if (data?.children) params.append("children", data.children);
        if (data?.infants) params.append("infants", data.infants);

        return `${baseUrl}/?${params.toString()}`;
      },
      providesTags: ["TouristSpots"],
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (response) => {
        return response.data.message;
      },
    }),
    getTouristSpotById: builder.query({
      query: (id) => `${baseUrl}/spot/${id}`,
      providesTags: ["TouristSpots"],
      transformResponse: (response) => response.touristSpot,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
    }),
    getTouristSpotByIds: builder.query({
      query: (ids) => ({
        url: `${baseUrl}/ids`,
        method: "POST",
        body: { ids },
      }),
      providesTags: ["TouristSpots"],
      transformResponse: (response) => response.touristSpots,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
    }),
    getCurrentUserListedHomes: builder.query({
      query: () => `${baseUrl}/listed-homes`,
      providesTags: ["TouristSpots"],
      transformResponse: (response) => response.touristSpots,
      transformErrorResponse: (response) => {
        return response.data.message;
      },
    }),
    verifyTouristSpot: builder.mutation({
      query: ({ id, verified }) => ({
        url: `${baseUrl}/verify/${id}`,
        method: "PUT",
        credentials: "include",
        body: { verified },
      }),
      invalidatesTags: ["TouristSpots"],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => {
        return response.message;
      },
    }),
    addReview: builder.mutation({
      query: ({ touristSpotId, body }) => ({
        url: `/review/${touristSpotId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { touristSpotId }) => [
        { type: "TouristSpots", id: touristSpotId },
        { type: "Reviews", id: touristSpotId },
      ],
    }),

    updateReview: builder.mutation({
      query: ({ touristSpotId, reviewId, body }) => ({
        url: `/review/${touristSpotId}/${reviewId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { touristSpotId, reviewId }) => [
        { type: "TouristSpots", id: touristSpotId },
        { type: "Reviews", id: reviewId },
      ],
    }),

    getReviewByTouristSpotAndUserId: builder.query({
      query: (touristSpotId) => `/review/${touristSpotId}`,
      providesTags: (result, error, touristSpotId) => [
        { type: "Reviews", id: touristSpotId },
      ],
      transformErrorResponse: (response) => {
        return response.data.message;
      },
      transformResponse: (response) => response.review,
    }),
    sendVerificationRequestToAdmins: builder.mutation({
      query: (id) => ({
        url: `/send-verification-request/${id}`,
        method: "GET",
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
  useCreateTouristSpotMutation,
  useGetTouristSpotsQuery,
  useGetTouristSpotByIdQuery,
  useGetTouristSpotByIdsQuery,
  useGetCurrentUserListedHomesQuery,
  useVerifyTouristSpotMutation,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useGetReviewByTouristSpotAndUserIdQuery,
  useSendVerificationRequestToAdminsMutation,
} = touristSpotsApi;

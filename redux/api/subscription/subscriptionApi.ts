import { baseApi } from "../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscriptions",
        method: "POST",
        body: data,
      }),
    }),
    getQuote: builder.mutation({
      query: (data) => ({
        url: "/subscriptions/quote",
        method: "POST",
        body: data,
      }),
    }),
    getMySubscriptions: builder.query({
      query: (params) => ({
        url: "/subscriptions/my-subscriptions",
        method: "GET",
        params, // pass { page, limit } etc.
      }),
      providesTags: ["Subscription"],
    }),
    getMyPaymentMethod: builder.query({
      query: () => ({
        url: "/subscriptions/my-payment-method",
        method: "GET",
      }),
    }),
    updatePaymentMethod: builder.mutation({
      query: (data) => ({
        url: "/payments/update-payment-method",
        method: "PATCH",
        body: data,
      }),
    }),
    getMyServiceUpdateRequests: builder.query({
      query: (params) => ({
        url: "/service-update-requests/my-requests",
        method: "GET",
        params,
      }),
      providesTags: ["ServiceRequest"],
    }),
    getServiceUpdateRequestById: builder.query({
      query: (id) => ({
        url: `/service-update-requests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ServiceRequest", id }],
    }),
    createServiceUpdateRequest: builder.mutation({
      query: (data) => ({
        url: "/service-update-requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ServiceRequest"],
    }),
    getMyReports: builder.query({
      query: (params) => ({
        url: "/reports",
        method: "GET",
        params,
      }),
      providesTags: ["Report"],
    }),
    getReportById: builder.query({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Report", id }],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetQuoteMutation,
  useGetMySubscriptionsQuery,
  useGetMyPaymentMethodQuery,
  useUpdatePaymentMethodMutation,
  useGetMyServiceUpdateRequestsQuery,
  useGetServiceUpdateRequestByIdQuery,
  useCreateServiceUpdateRequestMutation,
  useGetMyReportsQuery,
  useGetReportByIdQuery,
} = subscriptionApi;

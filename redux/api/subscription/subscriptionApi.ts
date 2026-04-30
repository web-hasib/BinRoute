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
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetQuoteMutation,
  useGetMySubscriptionsQuery,
  useGetMyPaymentMethodQuery,
  useUpdatePaymentMethodMutation,
} = subscriptionApi;

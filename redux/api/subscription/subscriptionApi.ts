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
  }),
});

export const { useCreateSubscriptionMutation, useGetQuoteMutation } = subscriptionApi;

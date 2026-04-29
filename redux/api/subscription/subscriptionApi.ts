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
  }),
});

export const { useCreateSubscriptionMutation } = subscriptionApi;

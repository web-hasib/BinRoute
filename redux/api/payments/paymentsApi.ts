import { baseApi } from "../baseApi";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentHistory: builder.query({
      query: (params) => ({
        url: "/payments/history",
        method: "GET",
        params, // Accepts page, limit, serviceType, status, etc.
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetPaymentHistoryQuery } = paymentsApi;

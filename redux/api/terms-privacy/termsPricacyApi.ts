


import { IPrivacyResponse, ITermsResponse } from "@/types/global";
import baseApi from "../baseApi";

const termsPrivacyApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    createPrivacy: builder.mutation({
      query: (credentials) => ({
        url: "/privacy-policy",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Privacy"],
    }),


    getAllPrivacy: builder.query<IPrivacyResponse, void>({
      query: () => ({
        url: `/privacy-policy`,
        method: "GET",
      }),
      providesTags: ["Privacy"],
    }),


    createTerms: builder.mutation({
      query: (credentials) => ({
        url: "/terms-and-conditions",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Terms"],
    }),


    getAllTerms: builder.query<ITermsResponse, void>({
      query: () => ({
        url: `/terms-and-conditions`,
        method: "GET",
      }),
      providesTags: ["Terms"],
    }),





  }),
});

export const {
  useCreatePrivacyMutation,
  useGetAllPrivacyQuery,
  useCreateTermsMutation,
  useGetAllTermsQuery,

} = termsPrivacyApi;

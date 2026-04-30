import { baseApi } from "../baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobSchedules: builder.query({
      query: (params) => ({
        url: "/jobs/schedule",
        method: "GET",
        params, // Accepts page, limit, sortOrder, sortBy
      }),
      providesTags: ["Job"],
    }),
  }),
});

export const { useGetJobSchedulesQuery } = jobsApi;

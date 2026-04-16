import { IServiceAreaResponse } from "@/types/global";
import baseApi from "../baseApi";

export const serviceAreaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceAreas: builder.query<
      IServiceAreaResponse,
      { page?: number; limit?: number; searchTerm?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);

        return {
          url: `/service-areas?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["ServiceArea"],
    }),
  }),
});

export const { useGetServiceAreasQuery } = serviceAreaApi;

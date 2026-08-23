import { IServicePlanResponse } from "@/types/global";
import baseApi from "../baseApi";

export const dumpsterPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServicePlans: builder.query<
      IServicePlanResponse,
      { page?: number; limit?: number; searchTerm?: string; category?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit) queryParams.append("limit", params.limit.toString());
          if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
          if (params.category) queryParams.append("category", params.category);
        }

        return {
          url: `/service-plans?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["ServicePlan"],
    }),

    createServicePlan: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/service-plans",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["ServicePlan"],
    }),

    getServicePlanById: builder.query<any, string>({
      query: (id) => ({
        url: `/service-plans/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ServicePlan", id }],
    }),

    updateServicePlan: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/service-plans/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => ["ServicePlan", { type: "ServicePlan", id }],
    }),
  }),
});

export const {
  useGetServicePlansQuery,
  useCreateServicePlanMutation,
  useGetServicePlanByIdQuery,
  useUpdateServicePlanMutation,
} = dumpsterPlanApi;

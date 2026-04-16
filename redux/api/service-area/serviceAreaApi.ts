import {
  IBaseResponse,
  ICreateServiceAreaPayload,
  IServiceArea,
  IServiceAreaResponse,
  IServicePlanResponse,
} from "@/types/global";
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

    getServicePlans: builder.query<IServicePlanResponse, void>({
      query: () => "/service-plans",
    }),

    getServiceAreaById: builder.query<IBaseResponse<IServiceArea>, string>({
      query: (id) => ({
        url: `/service-areas/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ServiceArea", id }],
    }),

    createServiceArea: builder.mutation<
      IServiceAreaResponse,
      ICreateServiceAreaPayload
    >({
      query: (body) => ({
        url: "/service-areas",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServiceArea"],
    }),

    updateServiceArea: builder.mutation<
      IServiceAreaResponse,
      { id: string; data: Partial<ICreateServiceAreaPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/service-areas/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["ServiceArea", { type: "ServiceArea", id }],
    }),
  }),
});

export const {
  useGetServiceAreasQuery,
  useGetServicePlansQuery,
  useGetServiceAreaByIdQuery,
  useCreateServiceAreaMutation,
  useUpdateServiceAreaMutation,
} = serviceAreaApi;

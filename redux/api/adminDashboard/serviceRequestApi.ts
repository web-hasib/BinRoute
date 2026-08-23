import baseApi from "../baseApi";

export interface IServiceUpdateRequest {
  id: string;
  driverId: string;
  driverName?: string; // Depends on backend response, adjust as needed
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  // add other fields as returned by your backend
  [key: string]: any;
}

export interface IServiceUpdateRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: IServiceUpdateRequest[];
}

export const serviceRequestApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getServiceUpdateRequests: builder.query<
      IServiceUpdateRequestsResponse,
      { status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string }
    >({
      query: (params) => ({
        url: "/service-update-requests",
        method: "GET",
        params,
      }),
      providesTags: ["ServiceRequest"],
    }),
    approveServiceRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/service-update-requests/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["ServiceRequest"],
    }),
    rejectServiceRequest: builder.mutation<any, { id: string; rejectionReason: string }>({
      query: ({ id, rejectionReason }) => ({
        url: `/service-update-requests/${id}/reject`,
        method: "PATCH",
        body: { rejectionReason },
      }),
      invalidatesTags: ["ServiceRequest"],
    }),
  }),
});

export const {
  useGetServiceUpdateRequestsQuery,
  useApproveServiceRequestMutation,
  useRejectServiceRequestMutation,
} = serviceRequestApi;

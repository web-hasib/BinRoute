import baseApi from "../baseApi";

export interface ICustomer {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    image: string | null;
    status: string;
    createdAt: string;
    totalBooking: number;
    totalSpent: number;
}

export interface ICustomerMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface IGetAllCustomersResponse {
    success: boolean;
    statusCode: number;
    message: string;
    meta: ICustomerMeta;
    data: ICustomer[];
}

export interface ICustomerStats {
    totalCustomers: number;
    activeSubscriptions: number;
    totalRevenue: number;
}

export interface IGetCustomerStatsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: ICustomerStats;
}

const customerApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Admin: Get all customers with pagination, search
        getAllCustomers: builder.query<IGetAllCustomersResponse, any>({
            query: (args) => ({
                url: "/users/customers",
                params: args,
            }),
            providesTags: ["User"],
        }),

        // Admin: Get single customer by ID
        getSingleCustomer: builder.query<any, string>({
            query: (id) => `/users/customers/${id}`,
            providesTags: ["User"],
        }),

        // Admin: Get customer stats
        getCustomerStats: builder.query<IGetCustomerStatsResponse, any>({
            query: () => "/users/stats", // Assuming a stats endpoint exists
            providesTags: ["User"],
        }),

        // Admin: Toggle customer status (Block/Unblock)
        toggleCustomerStatus: builder.mutation<any, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/users/customers/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetAllCustomersQuery,
    useGetSingleCustomerQuery,
    useGetCustomerStatsQuery,
    useToggleCustomerStatusMutation,
} = customerApi;

export default customerApi;

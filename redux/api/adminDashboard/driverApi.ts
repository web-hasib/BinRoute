import baseApi from "../baseApi";

export interface IDriver {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    image: string | null;
    address: string;
    driverStatus: "ONLINE" | "OFFLINE";
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
    totalAssignedJobs: number;
    totalCompletedJobs: number;
}

export interface IAssignedJob {
    id: string;
    status: string;
}

export interface IDriverDetails extends IDriver {
    assignedJobs: IAssignedJob[];
}

export interface IDriverStats {
    totalCompletedJobs: number;
    thisMonthCompletedJobs: number;
    todayTotalJobs: number;
    todayCompletedJobs: number;
    pendingJobs: number;
    inProgressJobs: number;
    driverStatus: string;
}

export interface IGetAllDriversResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        data: IDriver[];
    };
}

export interface IJob {
    id: string;
    type: string;
    status: string;
    jobStartTime: string;
    jobCode: string;
    driverId: string | null;
    isExtraMoneyPaid: boolean;
    subscription: {
        id: string;
        userId: string;
        planId: string;
        status: string;
        dropoffAddress: string;
        dropoffDate: string;
        pickupDate: string;
        businessType: string;
        wasteType: string;
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            image: string;
        };
        plan: {
            id: string;
            price: number;
            category: string;
            dumpsterSize: string;
        };
    };
}

export interface IGetJobsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        data: IJob[];
    };
}

const driverApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        createDriver: builder.mutation<any, any>({
            query: (data) => ({
                url: "/auth/admin/create-driver",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Driver"],
        }),

        getAllDrivers: builder.query<IGetAllDriversResponse, any>({
            query: (args) => ({
                url: "/drivers",
                params: args,
            }),
            providesTags: ["Driver"],
        }),

        getDriverById: builder.query<{ data: IDriverDetails }, string>({
            query: (id) => `/drivers/${id}`,
            providesTags: ["Driver"],
        }),

        deleteDriver: builder.mutation<any, string>({
            query: (id) => ({
                url: `/drivers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Driver"],
        }),

        updateDriver: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/drivers/${id}/profile`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Driver"],
        }),

        getStatByDriverId: builder.query<{ data: IDriverStats }, string>({
            query: (id) => `/drivers/${id}/stats`,
            providesTags: ["Driver"],
        }),

        getDriverAssignedJobs: builder.query<IGetJobsResponse, { id: string; [key: string]: any }>({
            query: ({ id, ...params }) => ({
                url: "/jobs/driver-assigned-jobs",
                params: { driverId: id, ...params },
            }),
            providesTags: ["Driver"],
        }),

        getAllDriverList: builder.query<any, any>({
            query: () => ({
                url: "/drivers",
            }),
            providesTags: ["Driver"],
        }),
    }),
});

export const {
    useCreateDriverMutation,
    useGetAllDriversQuery,
    useGetDriverByIdQuery,
    useDeleteDriverMutation,
    useUpdateDriverMutation,
    useGetStatByDriverIdQuery,
    useGetDriverAssignedJobsQuery,
    useGetAllDriverListQuery,
} = driverApi;

export default driverApi;

import baseApi from "../baseApi";

export interface ISchedule {
    jobId: string;
    subscriptionId: string;
    customerName: string;
    companyName: string;
    location: string;
    size: string;
    scheduledDate: string;
    serviceType: string;
    jobType: string;
    status: string;
    driverId: string | null;
    driverName?: string;
    subscription: {
        id: string;
        userId: string;
        planId: string;
        status: string;
        dropoffAddress: string;
        dropoffDate: string;
        user: {
            id: string;
            fullName: string;
            phone: string;
            email: string;
        };
        plan: {
            id: string;
            category: string;
            price: number;
            dumpsterSize: string;
        };
    };
}

export interface IGetAllSchedulesResponse {
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
        data: ISchedule[];
    };
}

export interface IAssignJobRequest {
    driverId: string;
    jobId: string;
    type: string;
    jobStartTime: string;
    instructions: string;
}

const jobApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllSchedules: builder.query<IGetAllSchedulesResponse, any>({
            query: (params) => ({
                url: "/jobs/schedule",
                params,
            }),
            providesTags: ["Booking"],
        }),
        assignJob: builder.mutation<any, IAssignJobRequest>({
            query: (body) => ({
                url: "/jobs/assign",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Booking", "Driver"],
        }),
        getAllJobs: builder.query<any, any>({
            query: (params) => ({
                url: "/jobs",
                params,
            }),
            providesTags: ["Booking"],
        }),
        completeJob: builder.mutation<any, string>({
            query: (id) => ({
                url: `/jobs/complete/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Booking", "Driver"],
        }),
        getSingleJob: builder.query<any, string>({
            query: (id) => ({
                url: `/jobs/${id}`,
            }),
            providesTags: ["Booking", "Driver"],
        }),
    }),
});

export const {
    useGetAllSchedulesQuery,
    useAssignJobMutation,
    useGetAllJobsQuery,
    useCompleteJobMutation,
    useGetSingleJobQuery,
} = jobApi;

export default jobApi;

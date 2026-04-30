import baseApi from "../baseApi";

// --- Types ---
export interface IReportUser {
    id: string;
    fullName: string;
    email: string;
    phone: string;
}

export interface IReportSubscription {
    id: string;
    status: string;
    dropoffAddress: string;
}

export interface IReport {
    id: string;
    reportId: string;
    userId: string;
    subscriptionId: string;
    type: "RESCHEDULE_PICKUP" | "REPORT_DAMAGE" | "MISSING_SCHEDULE";
    status: "PENDING" | "COMPLETED";
    reportDescription: string;
    damagePicture: string | null;
    missingScheduleDate: string | null;
    resolvedAt: string | null;
    resolvedById: string | null;
    resolutionNote: string | null;
    createdAt: string;
    updatedAt: string;
    user: IReportUser;
    subscription: IReportSubscription;
}

export interface IReportMeta {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface IGetAllReportsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        meta: IReportMeta;
        data: IReport[];
    };
}

export interface IReportStats {
    total: number;
    pending: number;
    resolved: number;
    dismissed: number;
}

export interface IGetReportStatsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IReportStats;
}

// --- API ---
const reportApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Public: Submit contact form
        submitReport: builder.mutation({
            query: (data) => ({
                url: "/reports/submit",
                method: "POST",
                body: data,
            }),
        }),

        // Admin: Get all reports with pagination, search, filter
        getAllReports: builder.query<IGetAllReportsResponse, any>({
            query: (args) => ({
                url: "/reports",
                params: args,
            }),
            providesTags: ["Contact"],
        }),

        // Admin: Get single contact by ID
        getSingleReport: builder.query<any, string>({
            query: (id) => `/reports/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Contact", id }],
        }),

        // Admin: Update report status (Resolve, Dismiss, etc.)
        updateReport: builder.mutation<any, { id: string; status: string; resolutionNote: string }>({
            query: ({ id, status, resolutionNote }) => ({
                url: `/reports/${id}/resolve`,
                method: "PATCH",
                body: { status, resolutionNote },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Contact",
                { type: "Contact", id },
            ],
        }),

        getAllReportStats: builder.query<IGetReportStatsResponse, any>({
            query: () => `/reports/stats`,
            providesTags: ["Contact"],
        }),
    }),
});

export const {
    useSubmitReportMutation,
    useGetAllReportsQuery,
    useGetSingleReportQuery,
    useUpdateReportMutation,
    useGetAllReportStatsQuery,
} = reportApi;

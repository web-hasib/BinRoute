import baseApi from "../baseApi";

export interface IDriverSummary {
    online: number;
    offline: number;
    inRoute: number;
    total: number;
}

export interface IDashboardDriver {
    id: string;
    fullName: string;
    image: string | null;
    driverStatus: string | null;
}

export interface IDashboardStats {
    totalRevenue: number;
    totalCustomers: number;
    totalDrivers: number;
    activeWork: number;
    serviceBooking: {
        totalOrders: number;
        commercial: { count: number; percentage: number };
        rollOff: { count: number; percentage: number };
    };
    driverStatus: {
        drivers: IDashboardDriver[];
        summary: IDriverSummary;
    };
    period: string;
}

export interface IGetDashboardStatsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IDashboardStats;
}

export interface IRevenueBreakdown {
    [key: string]: number;
}

export interface IRevenuePerformanceData {
    totalRevenue: number;
    averageRevenue: number;
    breakdown: IRevenueBreakdown;
    periodCount: number;
}

export interface IRevenuePerformanceResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        type: string;
        current: IRevenuePerformanceData;
        previous: IRevenuePerformanceData;
        comparison: {
            percentageChange: number;
            absoluteChange: number;
            isGrowth: boolean;
        };
    };
}

const analysisApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Admin: Get dashboard stats (Revenue, Customers, Drivers, Active Work)
        getDashboardStats: builder.query<IGetDashboardStatsResponse, { period: string }>({
            query: ({ period }) => ({
                url: "/analytics/dashboard-stats",
                params: { period },
            }),
            providesTags: ["Contact"], // Or use a new "Analytics" tag if available
        }),

        // Admin: Get revenue performance (Chart data)
        getRevenuePerformance: builder.query<IRevenuePerformanceResponse, { type: string }>({
            query: ({ type }) => ({
                url: "/analytics/revenue-performance",
                params: { type },
            }),
            providesTags: ["Contact"],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetRevenuePerformanceQuery,
} = analysisApi;

export default analysisApi;

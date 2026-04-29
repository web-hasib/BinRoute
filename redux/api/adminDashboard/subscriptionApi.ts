import baseApi from "../baseApi";

export interface ISubscription {
    id: string;
    userId: string;
    planId: string;
    status: string;
    totalAmount: number;
    startDate: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName?: string;
    plan: {
        category: string;
        dumpsterSize: string;
    };
    user: {
        fullName: string;
        email: string;
    };
}

export interface IGetAllSubscriptionsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: ISubscription[];
}

const subscriptionApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Admin: Get all subscriptions with pagination, search
        getAllSubscriptions: builder.query<IGetAllSubscriptionsResponse, any>({
            query: (args) => ({
                url: "/subscriptions",
                params: args,
            }),
            providesTags: ["Contact"], // Reusing Contact tag or create Subscriptions tag
        }),
    }),
});

export const {
    useGetAllSubscriptionsQuery,
} = subscriptionApi;

export default subscriptionApi;

import baseApi from "../baseApi";

export interface IBooking {
    id: string;
    userId: string;
    planId: string;
    status: string;
    dropoffAddress: string;
    dropoffDate: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    pickupDate: string;
    businessType: string;
    wasteType: string;
    containerCount: number;
    serviceFrequency: string | null;
    contractDuration: string | null;
    serviceDays: string[];
    rentalDuration: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    deliveryInstructions: string;
    serviceAreaFee: number;
    totalAmount: number;
    startDate: string;
    endDate: string | null;
    cancelledAt: string | null;
    pausedAt: string | null;
    cancelAtPeriodEnd: boolean | null;
    paymentIntentId: string;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    createdAt: string;
    updatedAt: string;
    plan: {
        id: string;
        image: string;
        price: number;
        category: string;
        dumpsterSize: string;
        features: string[];
        extraInfo: string;
        createdAt: string;
        updatedAt: string;
        stripeProductId: string;
    };
    user: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        image: string;
    };
}

export interface IGetAllBookingsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        data: IBooking[];
    };
}

export interface IGetBookingDetailsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IBooking;
}

const bookingApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllBookings: builder.query<IGetAllBookingsResponse, any>({
            query: (params) => ({
                url: "/subscriptions/all",
                params,
            }),
            providesTags: ["Booking"],
        }),
        getBookingById: builder.query<IGetBookingDetailsResponse, string>({
            query: (id) => `/subscriptions/${id}`,
            providesTags: ["Booking"],
        }),
    }),
});

export const {
    useGetAllBookingsQuery,
    useGetBookingByIdQuery,
} = bookingApi;

export default bookingApi;

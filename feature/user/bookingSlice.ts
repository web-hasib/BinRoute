import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookingState {
  currentStep: number;
  serviceType: "roll-off" | "commercial" | null;
  dumpsterSize: string | null;
  dropOffAddress: string;
  dropOffDate: string;
  pickUpAddress: string;
  pickUpDate: string;
  businessType: string;
  wasteType: string;
  serviceFrequency?: string;
  serviceDays?: string[];
  contractDuration?: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    deliveryInstructions: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    fee: number;
    total: number;
  };
  clientSecret: string | null;
  subscriptionId: string | null;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  distance?: number;
  quoteData?: {
    serviceType: string;
    billingType: string;
    basePrice: number;
    distanceInMiles: number;
    distanceCharge: number;
    loyaltyDiscount: number;
    totalPrice: number;
    breakdown: { label: string; amount: number }[];
  } | null;
}

const initialState: BookingState = {
  currentStep: 1,
  serviceType: null,
  dumpsterSize: null,
  dropOffAddress: "",
  dropOffDate: "",
  pickUpAddress: "",
  pickUpDate: "",
  businessType: "",
  wasteType: "",
  serviceFrequency: "1x/week",
  serviceDays: [],
  contractDuration: "1 year",
  contactInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    deliveryInstructions: "",
  },
  pricing: {
    subtotal: 0,
    tax: 0,
    fee: 150,
    total: 0,
  },
  clientSecret: null,
  subscriptionId: null,
  dropoffLatitude: 0,
  dropoffLongitude: 0,
  quoteData: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setServiceType: (state, action: PayloadAction<"roll-off" | "commercial" | null>) => {
      state.serviceType = action.payload;
    },
    setDumpsterSize: (state, action: PayloadAction<{ id: string; price: number }>) => {
      state.dumpsterSize = action.payload.id;
      state.pricing.subtotal = action.payload.price;
      state.pricing.tax = action.payload.price * 0.06;
      state.pricing.total = state.pricing.subtotal + state.pricing.tax + state.pricing.fee;
    },
    updateBookingData: (state, action: PayloadAction<Partial<BookingState>>) => {
      return { ...state, ...action.payload };
    },
    updateContactInfo: (state, action: PayloadAction<Partial<BookingState["contactInfo"]>>) => {
      state.contactInfo = { ...state.contactInfo, ...action.payload };
    },
    setSubscriptionData: (state, action: PayloadAction<{ clientSecret: string; subscriptionId: string; distance?: number; totalAmount?: number }>) => {
      state.clientSecret = action.payload.clientSecret;
      state.subscriptionId = action.payload.subscriptionId;
      if (action.payload.distance !== undefined) {
         state.distance = action.payload.distance;
      }
      if (action.payload.totalAmount !== undefined) {
         state.pricing.total = action.payload.totalAmount;
      }
    },
    setQuoteData: (state, action: PayloadAction<any>) => {
      state.quoteData = action.payload;
    },
    resetBooking: () => initialState,
  },
});

export const { 
  setStep, 
  setServiceType, 
  setDumpsterSize, 
  updateBookingData, 
  updateContactInfo, 
  setSubscriptionData,
  setQuoteData,
  resetBooking 
} = bookingSlice.actions;

export default bookingSlice.reducer;

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
    resetBooking: () => initialState,
  },
});

export const { 
  setStep, 
  setServiceType, 
  setDumpsterSize, 
  updateBookingData, 
  updateContactInfo, 
  resetBooking 
} = bookingSlice.actions;

export default bookingSlice.reducer;

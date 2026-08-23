

import { IBaseResponse, IForgotPasswordPayload, IUserRespon, IUserResponse, IVerifyOTPPayload } from "@/types/global";
import baseApi from "../baseApi";
import { email } from "zod";



export type UsersApiResponse = {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: {
      id: string;
      name: string;
      role: "USER" | "ADMIN" | "SUPERADMIN";
      email: string;
      phone: string;
      location: string | null;
      expertise: string[];
      startTime: string | null;
      endTime: string | null;
      workingDays: ("M" | "T" | "W" | "TH" | "F" | "S" | "SU")[];
      isDeleted: boolean;
      notes: string | null;
      profileImage: string | null;
      password: string | null;
      resetToken: string | null;
      resetExpires: string | null;
      inviteSentAt: string | null;
      inviteCount: number;
      isPasswordChanged: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
  };
};

export type WorkingDay = "M" | "T" | "W" | "TH" | "F" | "S" | "SU";

export type ResourceRegistration = {
  fullName: string;
  role?: string; // e.g. "USER", "ADMIN", etc.
  email: string;

  password?: string;
  location?: string | null;
  expertise?: string[]; // comma-separated → array
  startTime?: string | null; // e.g. "09:00"
  endTime?: string | null; // e.g. "18:00"
  workingDays?: WorkingDay[];
  notes?: string | null;
  profileImage?: File | null; // for upload (optional)
};

export type AuthSuccessResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string | null;
    expertise: string[];
    startTime: string | null;
    endTime: string | null;
    workingDays: WorkingDay[];
    notes: string | null;
    profileImage: string | null;
    // other fields you don't need in UI can stay
    [key: string]: unknown;
  };
};

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  success: boolean;
  message?: string;
  data: {
    result: unknown;
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
    accessToken: string;
  };
};

export interface ResourceUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  location?: string | null;
  expertise?: { set: string[] } | string[] | null | undefined;
  workingDays?: { set: WorkingDay[] } | WorkingDay[] | null | undefined;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  profileImage?: string | null;
}

export interface IAddAdminPayload {
  fullName: string;
  email: string;
  phone: string;
}

export interface IAddDriverPayload {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  password?: string;
  contactEmail: string;
}

const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    logIn: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    signUp: builder.mutation<AuthSuccessResponse, ResourceRegistration>({
      query: (body) => ({
        url: "/auth/create-account",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    emailVerifyOtp: builder.mutation({
      query: (body: IVerifyOTPPayload) => ({
        url: "/auth/email-verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // get all resourse (user)
    getAllResource: builder.query<IUserResponse, any>({
      query: (params) => ({
        url: `/users`,
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),

    getAdmins: builder.query<any, { status?: string }>({
      query: ({ status }) => ({
        url: `/users`,
        method: "GET",
        params: { role: "ADMIN", ...(status ? { status } : {}) },
      }),
      providesTags: ["User"],
    }),

    toggleUserStatus: builder.mutation<IBaseResponse, { id: string; status: "ACTIVE" | "BLOCKED" }>({
      query: ({ id, status }) => ({
        url: `/users/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["User"],
    }), forgotPassword: builder.mutation({
      query: (body: IForgotPasswordPayload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    // reset password
    // In your authApi.ts
    resetPassword: builder.mutation<any, { accessToken: string; newPassword: string }>({
      query: ({ accessToken, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { newPassword },
        headers: {
          Authorization: `Bearer ${accessToken}`,   // Must have "Bearer " + space
        },
      }),
    }),
    // set password
    changePassword: builder.mutation({
      query: (body: unknown) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateProfile: builder.mutation<IBaseResponse, FormData>({
      query: (body) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserProfile: builder.mutation<IBaseResponse, FormData>({
      query: (body) => ({
        url: "/users/update-user-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),




    updateGeneralProfile: builder.mutation<IBaseResponse, FormData>({
      query: (body) => ({
        url: "/users/update-general-profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),


    verifyOtp: builder.mutation({
      query: (body: IVerifyOTPPayload) => ({
        url: "/auth/verify-reset-password-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    googleLogin: builder.mutation({
      query: (token: string) => ({
        url: "/auth/google-login",
        method: "POST",
        body: { idToken: token },
      }),
      invalidatesTags: ["User"],
    }),

    addAdmin: builder.mutation<IBaseResponse, IAddAdminPayload>({
      query: (body) => ({
        url: "/auth/admin/create-admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    addDriver: builder.mutation<IBaseResponse, IAddDriverPayload>({
      query: (body) => ({
        url: "/auth/admin/create-driver",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLogInMutation,
  useSignUpMutation,
  useEmailVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useVerifyOtpMutation,
  useGetAllResourceQuery,
  useUpdateProfileMutation,
  useUpdateUserProfileMutation,
  useGoogleLoginMutation,
  useAddAdminMutation,
  useAddDriverMutation,
  useUpdateGeneralProfileMutation,
  useGetAdminsQuery,
  useToggleUserStatusMutation,
} = authApi;

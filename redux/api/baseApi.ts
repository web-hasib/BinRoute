



import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Privacy",
    "Terms",
    "Contact",
    "Faq",
    "Blog",
    "ServiceArea",
    "ServicePlan",
    "Subscription",
    
  ],
});

export default baseApi;
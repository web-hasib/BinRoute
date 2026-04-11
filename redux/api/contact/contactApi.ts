import baseApi from "../baseApi";

// --- Types ---
export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IContactMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface IGetAllContactsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IContactMeta;
    data: IContactMessage[];
  };
}

export interface IGetAllContactsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isRead?: boolean | string;
}

export interface IGetSingleContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IContactMessage;
}

export interface IUpdateContactReadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IContactMessage;
}

// --- API ---
const contactApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Public: Submit contact form
    submitContact: builder.mutation({
      query: (data) => ({
        url: "/contact-us/submit",
        method: "POST",
        body: data,
      }),
    }),

    // Admin: Get all contacts with pagination, search, filter
    getAllContacts: builder.query<IGetAllContactsResponse, IGetAllContactsParams>({
      query: ({ page = 1, limit = 10, searchTerm, isRead } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("searchTerm", searchTerm);
        if (isRead !== undefined && isRead !== "") params.set("isRead", String(isRead));
        return `/contact-us?${params.toString()}`;
      },
      providesTags: ["Contact"],
    }),

    // Admin: Get single contact by ID
    getSingleContact: builder.query<IGetSingleContactResponse, string>({
      query: (id) => `/contact-us/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Contact", id }],
    }),

    // Admin: Update contact isRead status
    updateContactRead: builder.mutation<
      IUpdateContactReadResponse,
      { id: string; isRead: boolean }
    >({
      query: ({ id, isRead }) => ({
        url: `/contact-us/${id}`,
        method: "PATCH",
        body: { isRead },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Contact",
        { type: "Contact", id },
      ],
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useGetAllContactsQuery,
  useGetSingleContactQuery,
  useUpdateContactReadMutation,
} = contactApi;

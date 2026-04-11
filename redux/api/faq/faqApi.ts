import baseApi from "../baseApi";

// --- Types ---
export interface IFaq {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFaqMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface IGetAllFaqsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IFaqMeta;
    data: IFaq[];
  };
}

export interface IGetAllFaqsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface IFaqPayload {
  title: string;
  description: string;
}

export interface IFaqMutationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IFaq;
}

export interface IDeleteFaqResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

// --- API ---
const faqApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all FAQs with pagination & search
    getAllFaqs: builder.query<IGetAllFaqsResponse, IGetAllFaqsParams>({
      query: ({ page = 1, limit = 10, searchTerm } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("searchTerm", searchTerm);
        return `/faqs?${params.toString()}`;
      },
      providesTags: ["Faq"],
    }),

    // Create FAQ
    createFaq: builder.mutation<IFaqMutationResponse, IFaqPayload>({
      query: (body) => ({
        url: "/faqs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Faq"],
    }),

    // Update FAQ
    updateFaq: builder.mutation<
      IFaqMutationResponse,
      { id: string } & Partial<IFaqPayload>
    >({
      query: ({ id, ...body }) => ({
        url: `/faqs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Faq"],
    }),

    // Delete FAQ
    deleteFaq: builder.mutation<IDeleteFaqResponse, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faq"],
    }),
  }),
});

export const {
  useGetAllFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;

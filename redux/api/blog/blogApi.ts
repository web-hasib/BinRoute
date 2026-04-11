import baseApi from "../baseApi";

export interface IBlog {
  id: string;
  title: string;
  category: string;
  readingTime: number;
  tags: string[];
  coverPhoto: string | null;
  thumbnail: string | null;
  shortDescription: string;
  fullContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface IGetAllBlogsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IBlogMeta;
    data: IBlog[];
  };
}

export interface IGetSingleBlogResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IBlog;
}

export interface IBlogMutationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IBlog;
}

export interface IGetAllBlogsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}

const blogApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllBlogs: builder.query<IGetAllBlogsResponse, IGetAllBlogsParams>({
      query: ({ page = 1, limit = 10, searchTerm, sortBy, sortOrder } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("searchTerm", searchTerm);
        if (sortBy) params.set("sortBy", sortBy);
        if (sortOrder) params.set("sortOrder", sortOrder);
        return `/blogs?${params.toString()}`;
      },
      providesTags: ["Blog"],
    }),

    getSingleBlog: builder.query<IGetSingleBlogResponse, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    createBlog: builder.mutation<IBlogMutationResponse, FormData>({
      query: (body) => ({
        url: "/blogs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation<IBlogMutationResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Blog",
        { type: "Blog", id },
      ],
    }),

    deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

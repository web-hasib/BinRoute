import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BlogDraft {
  title: string;
  readingTime: string;
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverPhoto: string | null;
  thumbnail: string | null;
}

interface BlogState {
  draft: BlogDraft;
}

const initialState: BlogState = {
  draft: {
    title: "",
    readingTime: "3",
    category: "",
    excerpt: "",
    content: "",
    tags: ["Industrial", "EcoFriendly"],
    coverPhoto: null,
    thumbnail: null,
  },
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    updateDraft: (state, action: PayloadAction<Partial<BlogDraft>>) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.draft.tags = action.payload;
    },
    resetDraft: (state) => {
      state.draft = initialState.draft;
    },
  },
});

export const { updateDraft, setTags, resetDraft } = blogSlice.actions;
export default blogSlice.reducer;

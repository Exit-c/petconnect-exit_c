import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentData } from "firebase/firestore";

interface CommunityState {
  checkedCategory: string;
  title: string;
  content: string;
  imgPreviews: string[];
  userWriteData: DocumentData[];
}

const initialState: CommunityState = {
  checkedCategory: "강아지",
  title: "",
  content: "",
  imgPreviews: [],
  userWriteData: [],
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setCheckedCategory(state, action: PayloadAction<string>) {
      state.checkedCategory = action.payload;
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setContent(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },
    setImgPreviews(state, action: PayloadAction<string[]>) {
      state.imgPreviews = action.payload;
    },
    setUserWriteData(state, action: PayloadAction<DocumentData[]>) {
      state.userWriteData = action.payload;
    },
  },
});

export const {
  setCheckedCategory,
  setTitle,
  setContent,
  setImgPreviews,
  setUserWriteData,
} = communitySlice.actions;

export default communitySlice.reducer;

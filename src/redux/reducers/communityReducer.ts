import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ActionCodeURL } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';

// Define a type for the slice state
interface CommunityState {
  checkedCategory: string;
  title: string;
  content: string;
  imgPreviews: string[];
  userWriteData: DocumentData[];
}

// Define the initial state using that type
const initialState: CommunityState = {
  checkedCategory: '강아지',
  title: '',
  content: '',
  imgPreviews: [],
  userWriteData: [],
};

const communitySlice = createSlice({
  name: 'community',
  // `createSlice` will infer the state type from the `initialState` argument
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

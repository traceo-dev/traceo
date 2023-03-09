import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavbarState {
  hidden: boolean;
}

const initialState = {
  hidden: false
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState: initialState,
  reducers: {
    navbarHideState: (state, action: PayloadAction<{ hidden: boolean }>): NavbarState => ({
      ...state,
      ...action.payload
    })
  }
});

export const { navbarHideState } = navbarSlice.actions;
export const navbarReducer = navbarSlice.reducer;

export default {
  navbar: navbarReducer
};

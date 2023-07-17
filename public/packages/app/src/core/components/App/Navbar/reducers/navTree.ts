import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavItem } from "@traceo/types";

export interface NavTreeState {
  navTree: NavItem[];
}

const initialState = {
  navTree: []
};

const navTreeSlice = createSlice({
  name: "navTree",
  initialState: initialState,
  reducers: {
    setNavTree: (state, action: PayloadAction<NavItem[]>): NavTreeState => ({
      ...state,
      navTree: action.payload
    })
  }
});

export const { setNavTree } = navTreeSlice.actions;
export const navReducer = navTreeSlice.reducer;

export default {
  navTree: navReducer
};

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
        navbarState: (state, action: PayloadAction<NavbarState>): NavbarState => {
            return { ...state, hidden: action.payload.hidden };
        }
    }
});

export const { navbarState } = navbarSlice.actions;
export const navbarReducer = navbarSlice.reducer;

export default {
    navbar: navbarReducer
};

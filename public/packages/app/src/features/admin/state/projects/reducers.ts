import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProject } from "@traceo/types";

export interface State {
    project: IProject;
    isLoading: boolean;
}

const initialState = {
    project: {} as IProject,
    isLoading: false
};

const slice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {
        beginProjectFetch: (state): State => ({ ...state, isLoading: true }),
        setProject: (state, action: PayloadAction<IProject>): State => {
            return { ...state, isLoading: false, project: action.payload };
        }
    }
});

export const { setProject, beginProjectFetch } = slice.actions;
export const reducer = slice.reducer;

export default {
    adminProject: reducer
};

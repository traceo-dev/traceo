import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IComment } from "@traceo/types";

export interface State {
    comments: IComment[];
    isLoading: boolean;
}

const initialIncidentState: State = {
    comments: [] as IComment[],
    isLoading: false
};

const slice = createSlice({
    name: "comments",
    initialState: initialIncidentState,
    reducers: {
        beginCommentsFetch: (state) => ({ ...state, isLoading: true }),
        setIncidentComments: (state, action: PayloadAction<IComment[]>): State => ({
            ...state, comments: action.payload, isLoading: false
        })
    }
});

export const { setIncidentComments, beginCommentsFetch } = slice.actions;
export const commentsReducer = slice.reducer;
export default {
    comments: commentsReducer
};

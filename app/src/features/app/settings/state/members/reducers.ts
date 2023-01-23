import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationMember } from "../../../../../types/application";

export interface MembersState {
  members: ApplicationMember[];
  hasFetched: boolean;
}

const initialState = {
  members: [],
  hasFetched: false
};

const membersSlice = createSlice({
  name: "members",
  initialState: initialState,
  reducers: {
    membersLoaded: (state, action: PayloadAction<ApplicationMember[]>): MembersState => ({ ...state, hasFetched: true, members: action.payload })
  }
});

export const { membersLoaded } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;

export default {
  members: membersReducer
};

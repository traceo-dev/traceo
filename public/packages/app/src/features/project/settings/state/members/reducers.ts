import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectMember } from "@traceo/types";

export interface MembersState {
  members: ProjectMember[];
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
    membersLoaded: (state, action: PayloadAction<ProjectMember[]>): MembersState => ({
      ...state,
      hasFetched: true,
      members: action.payload
    })
  }
});

export const { membersLoaded } = membersSlice.actions;
export const membersReducer = membersSlice.reducer;

export default {
  members: membersReducer
};

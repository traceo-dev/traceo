import { createAction } from "@reduxjs/toolkit";
import { StoreState } from "../../types/store";

export type StateSelector<T> = (state: StoreState) => T;

export interface CleanUp<T> {
  stateSelector: (state: StoreState) => T;
}

// eslint-disable-next-line
export const cleanUpAction = createAction<CleanUp<{}>>("core/cleanUpState");

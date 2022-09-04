import { useEffect, useRef } from "react";

import { createAction } from "@reduxjs/toolkit";
import { dispatch } from "src/store/store";
import { StoreState } from "src/types/store";

export type StateSelector<T> = (state: StoreState) => T;

export interface CleanUp<T> {
  stateSelector: (state: StoreState) => T;
}

// eslint-disable-next-line
export const cleanUpAction = createAction<CleanUp<{}>>("");

export const useCleanup = <T>(stateSelector: StateSelector<T>) => {
  const selectorRef = useRef(stateSelector);
  selectorRef.current = stateSelector;

  useEffect(() => {
    return () => {
      dispatch(cleanUpAction({ stateSelector: selectorRef.current }));
    };
  }, []);
};

export const useAppStoreClean = () => {
  useCleanup((state: StoreState) => state.incident);
  useCleanup((state: StoreState) => state.incidents);
  useCleanup((state: StoreState) => state.members);
  useCleanup((state: StoreState) => state.application);
};

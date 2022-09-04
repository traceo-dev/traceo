import { Store } from "redux";
import { StoreState } from "src/types/store";

export let store: Store<StoreState>;

export const dispatch = (action: any) => {
  if (!store || !store.getState) {
    return;
  }

  return store.dispatch(action);
};

export const setStore = (newStore: Store<StoreState>) => {
  store = newStore;
};

export const getState = (): StoreState => {
  return store.getState();
};

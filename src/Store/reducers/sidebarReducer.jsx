import { SIDEBAR_KEY } from "../actions/sidebarAction";

const initialState = {
  key: undefined,
};
export const sidebarReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SIDEBAR_KEY: {
      return { key: payload };
    }
    default: {
      return state;
    }
  }
};

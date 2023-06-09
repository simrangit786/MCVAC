import { OWNER_ACCOUNT_DETAIL_SUCCESS } from "../actions/ownerAccountAction";

export const ownerAccountReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case OWNER_ACCOUNT_DETAIL_SUCCESS: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};

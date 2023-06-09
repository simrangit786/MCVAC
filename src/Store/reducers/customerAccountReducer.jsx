import { CUSTOMER_ACCOUNT_DETAIL_SUCCESS } from "../actions/customerAccountAction";

export const customerAccountReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case CUSTOMER_ACCOUNT_DETAIL_SUCCESS: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};

export const globalSearchReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case "GLOBAL_SEARCH": {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};

import { VENDOR_ACCOUNT_DETAIL_SUCCESS } from "../actions/vendorAccountAction";

export const vendorAccountReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case VENDOR_ACCOUNT_DETAIL_SUCCESS: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};
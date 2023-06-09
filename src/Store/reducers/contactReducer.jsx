import { CONTACT_DETAIL_SUCCESS } from "../actions/contactAction";

export const contactReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case CONTACT_DETAIL_SUCCESS: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};

import { LOGIN_SUCCESS } from "../actions/authAction";

export const userLoginReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGIN_SUCCESS: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};

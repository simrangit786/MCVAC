import { USERDATA } from "../actions/userdataAction";

export const userdataReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case USERDATA: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};
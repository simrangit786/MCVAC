import { OPPORTUNITY_DETAIL_SUCCESS } from "../actions/opportunityAction";

export const opportunityReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case OPPORTUNITY_DETAIL_SUCCESS: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};

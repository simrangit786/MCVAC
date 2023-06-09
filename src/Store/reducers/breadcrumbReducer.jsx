import { routes } from "../../Controller/Routes";
import { BREADCRUMB_DATA } from "../actions/breadcrumbAction";

const initialState = [
  {
    title: "Dashboard",
    url: routes.dashboard.self,
  },
];

export const breadcrumbReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case BREADCRUMB_DATA: {
      return payload;
    }
    default: {
      return state;
    }
  }
};

import { getOneCustomerAccount } from "../../Controller/api/customerAccountServices";
import { globalSearch } from "../../Controller/api/labourServices";

export const CUSTOMER_ACCOUNT_DETAIL_SUCCESS =
  "CUSTOMER_ACCOUNT_DETAIL_SUCCESS";

export function customerAccountDetailAction(id) {
  return (dispatch) => {
    return getOneCustomerAccount(id).then((response) => {
      dispatch({
        type: CUSTOMER_ACCOUNT_DETAIL_SUCCESS,
        payload: response?.data,
      });
    });
  };
}

export function globalSearchAction(params = {}) {
  return (dispatch) => {
    return globalSearch(params).then((response) => {
      dispatch({
        type: "GLOBAL_SEARCH",
        payload: response?.data,
      });
    });
  };
}

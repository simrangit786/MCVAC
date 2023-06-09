import { getVendorAccountById } from "../../Controller/api/vendorAccountServices";

export const VENDOR_ACCOUNT_DETAIL_SUCCESS = "VENDOR_ACCOUNT_DETAIL_SUCCESS";

export function vendorAccountDetailAction(id) {
  return (dispatch) => {
    return getVendorAccountById(id).then((response) => {
      dispatch({
        type: VENDOR_ACCOUNT_DETAIL_SUCCESS,
        payload: response.data,
      });
    });
  };
}

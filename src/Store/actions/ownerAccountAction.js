import { getOneOwnerAccount } from "../../Controller/api/ownerAccountServices";

export const OWNER_ACCOUNT_DETAIL_SUCCESS = "CUSTOMER_ACCOUNT_DETAIL_SUCCESS";

export function ownerAccountDetailAction(id) {
  return (dispatch) => {
    return getOneOwnerAccount(id).then((response) => {
      dispatch({
        type: OWNER_ACCOUNT_DETAIL_SUCCESS,
        payload: response.data,
      });
    });
  };
}

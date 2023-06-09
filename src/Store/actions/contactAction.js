import { getOneContact } from "../../Controller/api/contactsServices";

export const CONTACT_DETAIL_SUCCESS = "CONTACT_DETAIL_SUCCESS";

export function contactDetailAction(id) {
  return (dispatch) => {
    return getOneContact(id).then((response) => {
      dispatch({
        type: CONTACT_DETAIL_SUCCESS,
        payload: response.data,
      });
    });
  };
}

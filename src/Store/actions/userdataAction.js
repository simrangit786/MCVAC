import {getUserData} from "../../Controller/api/authServices"
export const USERDATA = "USERDATA"

export function userDataAction(id) {
    return (dispatch) => {
      return getUserData(id).then((response) => {
        dispatch({
          type: USERDATA,
          payload: response?.data,
        });
      });
    };
  }
  
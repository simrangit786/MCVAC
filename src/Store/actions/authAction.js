import {
  logout,
  setRefreshToken,
  setUserRole,
  setUserToken,
} from "../../Controller/localStorageHandler";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { login } from "../../Controller/api/authServices";

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export function userLoginAction(data) {
  return (dispatch) => {
    return login(data).then((response) => {
      setUserToken(response.data.access);
      setRefreshToken(response.data.refresh);
      setUserRole(response.data.user?.role)
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.user,
      });
      history.push(routes.dashboard.self);
    });
  };
}

export const userLogOutAction = () => {
  logout();
  history.push(routes.login);
  window.location.reload();
  return { type: LOGOUT_SUCCESS };
};

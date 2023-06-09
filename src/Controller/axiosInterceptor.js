import Axios from "axios";
import { getEnvValue } from "./Environment";
import {
  getRefreshToken,
  getUserToken,
  setUserToken,
} from "./localStorageHandler";
import { routes } from "./Routes";
import { history } from "./history";
import { getAPIUrl } from "./Global";

export const axios = Axios.create({
  baseURL: getEnvValue("REACT_APP_API_URL"),
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.log("error");
    const originalRequest = error.config;

    // if (error.response.status === 401 && originalRequest.url === 'http://13.232.130.60:8081/v1/auth/token') {
    //     router.push('/login');
    //     return Promise.reject(error);
    // }

    if (
      error.response?.status === 401 &&
      error.response?.data.code &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      return Axios.post(getAPIUrl("auth.refresh"), {
        refresh: refreshToken,
      })
        .then(async (res) => {
          if (res.status === 200) {
            await setUserToken(res.data.access);
            originalRequest.headers["Authorization"] =
              "Bearer " + getUserToken();
            return axios(originalRequest);
          }
        })
        .catch((e) => {
          history.push(routes.logout);
          console.log(e, "refresh error");
        });
    }
    return Promise.reject(error);
  }
);

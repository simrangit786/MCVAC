import { Get, Post } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function login(data) {
  const url = getAPIUrl("auth.login");
  return Post(url, data, false);
}

export function getUser(type, params) {
  const url = getAPIUrl("auth.user", { type });
  return Get(url, params);
}
export function getGoogleAuthenticateURL(params) {
  const url = getAPIUrl("auth.gmail_authenticate");
  return Get(url, params);
}

export function getUserData() {
  const url = getAPIUrl("auth.profile");
  return Get(url);
}

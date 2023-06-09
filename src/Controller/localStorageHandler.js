export const USER_TOKEN = "mcvac_user_token";
export const USER_ROLE = "mcvac_user_role";
export const REFRESH_TOKEN = "mcvac_refresh_role";

export function logout() {
  clearUserToken();
}

export function setUserToken(TOKEN) {
  localStorage.setItem(USER_TOKEN, TOKEN);
}

export function setRefreshToken(TOKEN) {
  localStorage.setItem(REFRESH_TOKEN, TOKEN);
}

export function setUserRole(ROLE) {
  localStorage.setItem(USER_ROLE, ROLE);
}

export function getUserRole() {
  return localStorage.getItem(USER_ROLE);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN);
}

export function getUserToken() {
  return localStorage.getItem(USER_TOKEN);
}

export function clearUserToken() {
  localStorage.removeItem(USER_TOKEN);
  localStorage.removeItem(USER_ROLE);
  localStorage.removeItem(REFRESH_TOKEN);
}

export function isLoggedIn() {
  const accessToken = getUserToken();
  return !!accessToken;
}

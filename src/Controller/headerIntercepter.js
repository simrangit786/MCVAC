import { axios } from "./axiosInterceptor";
import { getUserToken } from "./localStorageHandler";
const _ = require('lodash')

function header(requireAuth = true) {
  let headers = {
    "Content-Type": "application/json",
  };
  if (requireAuth) headers["Authorization"] = `Bearer ${getUserToken()}`;
  return headers;
}

export function Get(url, params) {
  params = _.pickBy(params)
  return axios.get(url, { headers: header(), params: params });
}

export function GetPdf(url, params) {
  return axios.get(url, { headers: header(), responseType: 'blob', params: params });
}

export function PostPdf(url, data, auth = true) {
  return axios.post(url, data, { headers: header(auth)});
}

export function Post(url, data, auth = true) {
  return axios.post(url, data, { headers: header(auth) });
}

export function Patch(url, data) {
  return axios.patch(url, data, { headers: header() });
}

export function Remove(url) {
  return axios.delete(url, { headers: header() });
}

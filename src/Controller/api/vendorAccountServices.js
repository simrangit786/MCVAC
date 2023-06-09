import { getAPIUrl } from "../Global";
import { Get, Post, Patch } from "../headerIntercepter";

export function getVendorAccount(params = {}) {
  const url = getAPIUrl("account.vendor_account");
  return Get(url, params);
}

export function getVendorAccountById(id) {
  const url = getAPIUrl("account.vendor_account", {id});
  return Get(url);
}

export function createVendorAccount(params = {}) {
  const url = getAPIUrl("account.vendor_account");
  return Post(url, params);
}

export function updateVendorAccount(params = {}, id) {
  const url = getAPIUrl("account.vendor_account", { id });
  return Patch(url, params);
}

export function createMainAdd(params = {}) {
  const url = getAPIUrl("account.vendor_main_address");
  return Post(url, params);
}

export function createBillingAdd(params = {}) {
  const url = getAPIUrl("account.vendor_billing_address");
  return Post(url, params);
}

export function updateMainAdd(params = {}, id) {
  const url = getAPIUrl("account.vendor_main_address", { id });
  return Patch(url, params);
}

export function updateBillingAdd(params = {}, id) {
  const url = getAPIUrl("account.vendor_billing_address", { id });
  return Patch(url, params);
}

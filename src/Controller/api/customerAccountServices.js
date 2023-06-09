import { Get, Patch, Post } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getAccount(params = {}) {
  const url = getAPIUrl("account.account");
  return Get(url, params);
}

export function getOneAccount(id) {
  const url = getAPIUrl("account.account", { id });
  return Get(url);
}

export function getCustomerAccount(params = {}) {
  const url = getAPIUrl("account.customerAccount");
  return Get(url, params);
}

export function createCustomerAccount(data) {
  const url = getAPIUrl("account.customerAccount");
  return Post(url, data);
}

export function updateCustomerAccount(id, data) {
  const url = getAPIUrl("account.customerAccount", { id });
  return Patch(url, data);
}

export function getOneCustomerAccount(id, params = {}) {
  const url = getAPIUrl("account.customerAccount", { id: id });
  return Get(url, params);
}
export function getOneAccountActivity(id, params = {}) {
  const url = getAPIUrl("account.account_activity", { id: id });
  return Get(url, params);
}

export function createCustomerPaymentInfo(data) {
  const url = getAPIUrl("account.customerPaymentInfo");
  return Post(url, data);
}

export function updateCustomerPaymentInfo(id, data) {
  const url = getAPIUrl("account.customerPaymentInfo", { id });
  return Patch(url, data);
}

export function createCustomerMainAddress(data) {
  const url = getAPIUrl("account.customerMainAddress");
  return Post(url, data);
}

export function updateCustomerMainAddress(id, data) {
  const url = getAPIUrl("account.customerMainAddress", { id });
  return Patch(url, data);
}

export function getCustomerMainAddress(params) {
  const url = getAPIUrl("account.customerMainAddress");
  return Get(url, params);
}

export function createCustomerBillingAddress(data) {
  const url = getAPIUrl("account.customerBillingAddress");
  return Post(url, data);
}

export function updateCustomerBillingAddress(id, data) {
  const url = getAPIUrl("account.customerBillingAddress", { id });
  return Patch(url, data);
}

export function getCustomerBillingAddress(params) {
  const url = getAPIUrl("account.customerBillingAddress");
  return Get(url, params);
}

export function createCustomerDocuments(data) {
  const url = getAPIUrl("account.customerDocuments");
  return Post(url, data);
}

export function createSiteDocument(data) {
  const url = getAPIUrl("account.sitesDocument");
  return Post(url, data);
}

export function getSiteDocuments(data) {
  const url = getAPIUrl('account.sitesDocument');
  return Get(url, data)
}
export function getCustomerDocuments(params) {
  const url = getAPIUrl("account.customerDocuments");
  return Get(url, params);
}

export function getCustomerPost(params) {
  const url = getAPIUrl("account.post");
  return Get(url, params);
}

export function createCustomerPost(params) {
  const url = getAPIUrl("account.post");
  return Post(url, params);
}

export function updateCustomerPost(id, params) {
  const url = getAPIUrl("account.post", { id });
  return Patch(url, params);
}

export function getAccountCounty(params) {
  const url = getAPIUrl("account.county_state");
  return Get(url, params);
}


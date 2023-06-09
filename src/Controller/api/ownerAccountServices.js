import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createOwnerAccount(data) {
  const url = getAPIUrl("account.ownerAccount");
  return Post(url, data);
}

export function updateOwnerAccount(id, data) {
  const url = getAPIUrl("account.ownerAccount", { id });
  return Patch(url, data);
}

export function getOwnerAccount(params = {}) {
  const url = getAPIUrl("account.ownerAccount");
  return Get(url, params);
}

export function getOneOwnerAccount(id, params = {}) {
  const url = getAPIUrl("account.ownerAccount", { id: id });
  return Get(url, params);
}

export function createOwnerPayment(data) {
  const url = getAPIUrl("account.ownerPaymentInfo");
  return Post(url, data);
}

export function updateOwnerPayment(id, data) {
  const url = getAPIUrl("account.ownerPaymentInfo", { id });
  return Patch(url, data);
}

export function createOwnerSites(data) {
  const url = getAPIUrl("account.ownerSites");
  return Post(url, data);
}

export function getOwnerSites(params) {
  const url = getAPIUrl("account.ownerSites");
  return Get(url, params);
}

export function getSingleOwnerSites(id) {
  const url = getAPIUrl("account.ownerSites", { id });
  return Get(url);
}

export function updateOwnerSites(data, id) {
  const url = getAPIUrl("account.ownerSites", { id });
  return Patch(url, data);
}

export function removeOwnerSites(id) {
  const url = getAPIUrl("account.ownerSites", { id });
  return Remove(url);
}

export function getAssociatedAccounts(id, params) {
  const url = getAPIUrl("account.associated_account", { id });
  return Get(url, params);
}

export function getIndustries(params) {
  const url = getAPIUrl("account.industry");
  return Get(url, params);
}

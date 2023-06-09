import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createSupplyFamily(data) {
  let url = getAPIUrl("supply.family");
  return Post(url, data);
}

export function updateSupplyFamily(id, data) {
  let url = getAPIUrl("supply.family", { id });
  return Patch(url, data);
}

export function getSupplyFamily(params = {}) {
  let url = getAPIUrl("supply.family");
  return Get(url, params);
}

export function getSupplyFamilyById(id, params = {}) {
  let url = getAPIUrl("supply.family", { id });
  return Get(url, params);
}

export function createSupplyGroup(data) {
  let url = getAPIUrl("supply.supply_group");
  return Post(url, data);
}

export function getSupplyGroupById(id, params = {}) {
  let url = getAPIUrl("supply.supply_group", { id });
  return Get(url, params);
}

export function updateSupplyGroup(id, data) {
  let url = getAPIUrl("supply.supply_group", { id });
  return Patch(url, data);
}

export function getSupplyGroup(params = {}) {
  let url = getAPIUrl("supply.supply_group");
  return Get(url, params);
}

export function deleteSupplyGroup(id) {
  let url = getAPIUrl("supply.supply_group", { id });
  return Remove(url);
}

export function createSupply(data) {
  let url = getAPIUrl("supply.supply");
  return Post(url, data);
}

export function updateSupply(id, data) {
  let url = getAPIUrl("supply.supply", { id });
  return Patch(url, data);
}

export function getSupply(params = {}) {
  let url = getAPIUrl("supply.supply");
  return Get(url, params);
}

export function getSupplyDispatch(params = {}) {
  let url = getAPIUrl("supply.supply_dispatch");
  return Get(url, params);
}

export function getSupplyById(id, params = {}) {
  let url = getAPIUrl("supply.supply", { id });
  return Get(url, params);
}

export function getInternalLocation(params = {}) {
  let url = getAPIUrl("labor.internal_location");
  return Get(url, params);
}

export function updateInternalLocation(id, params = {}) {
  let url = getAPIUrl("labor.internal_location", { id });
  return Patch(url, params);
}

export function createInternalLocation(params = {}) {
  let url = getAPIUrl("labor.internal_location");
  return Post(url, params);
}

export function getSupplyDoc(params = {}) {
  let url = getAPIUrl("supply.supply_doc");
  return Get(url, params);
}

export function getSupplyDocById(id) {
  let url = getAPIUrl("supply.supply_doc", { id });
  return Get(url);
}

export function createSupplyDoc(data) {
  let url = getAPIUrl("supply.supply_doc");
  return Post(url, data);
}

export function updateSupplyDoc(id, data) {
  let url = getAPIUrl("supply.supply_doc", { id });
  return Patch(url, data);
}

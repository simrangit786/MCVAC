import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getServiceFamily(params = {}) {
  let url = getAPIUrl("service.family");
  return Get(url, params);
}

export function getServiceFamilyById(id) {
  let url = getAPIUrl("service.family", { id });
  return Get(url);
}

export function createServiceFamily(data) {
  let url = getAPIUrl("service.family");
  return Post(url, data);
}

export function updateServiceFamily(id, data) {
  let url = getAPIUrl("service.family", { id });
  return Patch(url, data);
}

export function deleteServiceFamily(id) {
  let url = getAPIUrl("service.family", { id });
  return Remove(url);
}

export function getLineItem(params = {}) {

  let url = getAPIUrl("service.line_item");
  return Get(url, params);
}

export function getLineItemById(id) {
  let url = getAPIUrl("service.line_item", { id });
  return Get(url);
}

export function createLineItem(data) {
  let url = getAPIUrl("service.line_item");
  return Post(url, data);
}

export function updateLineItem(id, data) {
  let url = getAPIUrl("service.line_item", { id });
  return Patch(url, data);
}

export function deleteLineItem(id) {
  let url = getAPIUrl("service.line_item", { id });
  return Remove(url);
}

export function getLineItemResource(params = {}) {
  let url = getAPIUrl("service.resource");
  return Get(url, params);
}

export function deleteLineItemResource(id) {
  let url = getAPIUrl("service.resource", { id });
  return Remove(url);
}

export function createLineItemResource(data) {
  let url = getAPIUrl("service.resource");
  return Post(url, data);
}

export function getAssociatedLineItems(params = {}) {
  let url = getAPIUrl("service.family_item");
  return Get(url, params);
}

export function getLineItemPricing(params = {}) {
  let url = getAPIUrl("service.pricing");
  return Get(url, params);
}

export function getLineItemUniquePricing(params = {}) {
  let url = getAPIUrl("service.pricing_unique_variants");
  return Get(url, params);
}

export function getLineItemDisplayName(params = {}) {
  let url = getAPIUrl("service.unique_display_name");
  return Get(url, params);
}

export function getLineItemPricingById(id) {
  let url = getAPIUrl("service.pricing", { id });
  return Get(url);
}

export function createLineItemPricing(data) {
  let url = getAPIUrl("service.pricing");
  return Post(url, data);
}

export function updateLineItemPricing(id, data) {
  let url = getAPIUrl("service.pricing", { id });
  return Patch(url, data);
}

export function deleteLineItemPricing(id) {
  let url = getAPIUrl("service.pricing", { id });
  return Remove(url);
}

export function getProposalPricingList(data) {
  let url = getAPIUrl("service.item_pricing");
  return Get(url, data);
}

export function getProposalPricingById(id) {
  let url = getAPIUrl("service.item_pricing", { id });
  return Get(url);
}

export function getVendorLocation() {
  let url = getAPIUrl("service.vendor_location");
  return Get(url);
}

export function getBackendPricing(data) {
  let url = getAPIUrl("service.table_data");
  return Get(url, data);
}

export function deleteBackendPricing(id) {
  let url = getAPIUrl("service.table_data", {id});
  return Remove(url);
}

export function addLaborChild(data) {
  let url = getAPIUrl("service.add_table_data");
  return Post(url, data)
}

export function updatePricingRow(id, data) {
  let url = getAPIUrl("service.add_table_data", {id});
  return Patch(url, data)
}
import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getDisposalFamily(params = {}) {
  let url = getAPIUrl("disposal.family");
  return Get(url, params);
}

export function getDisposalFamilyById(id) {
  let url = getAPIUrl("disposal.family", { id });
  return Get(url);
}

export function createDisposalFamily(data) {
  let url = getAPIUrl("disposal.family");
  return Post(url, data);
}

export function updateDisposalFamily(id, data) {
  let url = getAPIUrl("disposal.family", { id });
  return Patch(url, data);
}

export function deleteDisposalFamily(id) {
  let url = getAPIUrl("disposal.family", { id });
  return Remove(url);
}

export function getDisposal(params = {}) {
  let url = getAPIUrl("disposal.disposal");
  return Get(url, params);
}

export function getDisposalById(id) {
  let url = getAPIUrl("disposal.disposal", { id });
  return Get(url);
}

export function createDisposal(data) {
  let url = getAPIUrl("disposal.disposal");
  return Post(url, data);
}

export function updateDisposal(id, data) {
  let url = getAPIUrl("disposal.disposal", { id });
  return Patch(url, data);
}

export function deleteDisposal(id) {
  let url = getAPIUrl("disposal.disposal", { id });
  return Remove(url);
}

export function createDisposalDoc(data) {
  let url = getAPIUrl("disposal.documents");
  return Post(url, data);
}

export function getDisposalDoc(params = {}) {
  let url = getAPIUrl("disposal.documents");
  return Get(url, params);
}

export function getUnitType() {
  let url = getAPIUrl("disposal.unit_type");
  return Get(url);
}

export function getSubUnitName(params = {}) {
  let url = getAPIUrl("disposal.unit_name");
  return Get(url, params);
}

export function getComData() {
  let url = getAPIUrl("disposal.custom_measurement");
  return Get(url);
}

export function sendComData(data) {
  let url = getAPIUrl("disposal.custom_measurement");
  return Post(url, data);
}

export function deleteComData(id) {
  let url = getAPIUrl("disposal.custom_measurement", { id });
  return Remove(url);
}

export function updateComData(id, data) {
  let url = getAPIUrl("disposal.custom_measurement", { id });
  return Patch(url, data);
}

export function updateDisposalLocation(id, data) {
  let url = getAPIUrl("disposal.disposal_location", { id });
  return Patch(url, data);
}

export function getDisposalLocationById(data) {
  let url = getAPIUrl("disposal.disposal_location");
  return Get(url, data);
}

export function createDisposalLocation(data) {
  let url = getAPIUrl("disposal.disposal_location");
  return Post(url, data);
}

export function deleteDisposalPrice(id) {
  let url = getAPIUrl("disposal.disposal_location_price", { id });
  return Remove(url);
}

export function deleteDisposalVendorPrice(id) {
  let url = getAPIUrl("disposal.disposal_vendor_price", { id });
  return Remove(url);
}

export function updateDisposalPrice(id, data) {
  let url = getAPIUrl("disposal.disposal_location_price", { id });
  return Patch(url, data);
}

export function updateDisposalVendorPrice(id, data) {
  let url = getAPIUrl("disposal.disposal_vendor_price", { id });
  return Patch(url, data);
}

export function updateLocationQty(id, data) {
  let url = getAPIUrl("disposal.measurement_qty", { id });
  return Patch(url, data);
}

export function deleteLocationDisposal(id) {
  let url = getAPIUrl("disposal.measurement_qty", { id });
  return Remove(url);
}

export function getDisposalVendorById(data) {
  let url = getAPIUrl("disposal.disposal_vendor");
  return Get(url, data);
}

export function createDisposalVendor(data) {
  let url = getAPIUrl("disposal.disposal_vendor");
  return Post(url, data);
}

export function updateVendorQty(id, data) {
  let url = getAPIUrl("disposal.measurement_vendor_qty", { id });
  return Patch(url, data);
}

export function deleteVendorDisposal(id) {
  let url = getAPIUrl("disposal.measurement_vendor_qty", { id });
  return Remove(url);
}

// export function getLineItemResource(params = {}) {
//     let url = getAPIUrl('service.resource')
//     return Get(url, params)
// }

// export function deleteLineItemResource(id) {
//     let url = getAPIUrl('service.resource', {id})
//     return Remove(url)
// }

// export function createLineItemResource(data) {
//     let url = getAPIUrl('service.resource')
//     return Post(url, data)
// }

// export function getLineItemPricing(params = {}) {
//     let url = getAPIUrl('service.pricing')
//     return Get(url, params)
// }

// export function getLineItemPricingById(id) {
//     let url = getAPIUrl('service.pricing', {id})
//     return Get(url)
// }

// export function createLineItemPricing(data) {
//     let url = getAPIUrl('service.pricing')
//     return Post(url, data)
// }

// export function updateLineItemPricing(id, data) {
//     let url = getAPIUrl('service.pricing', {id})
//     return Patch(url, data)
// }

// export function deleteLineItemPricing(id) {
//     let url = getAPIUrl('service.pricing', {id})
//     return Remove(url)
// }

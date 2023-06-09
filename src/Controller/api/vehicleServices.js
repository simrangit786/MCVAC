import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createFleetFamily(data) {
  let url = getAPIUrl("fleet.family");
  return Post(url, data);
}

export function updateFleetFamily(id, data) {
  let url = getAPIUrl("fleet.family", { id });
  return Patch(url, data);
}

export function getFleetFamilyPackages(params = {}) {
  let url = getAPIUrl("fleet.family");
  return Get(url, params);
}

export function getFleetFamilyPackageById(id, params = {}) {
  let url = getAPIUrl("fleet.family", { id });
  return Get(url, params);
}

// export function createVehiclePackageItem(data) {
//     let url = getAPIUrl('fleet.vehicle_package_item')
//     return Post(url, data)
// }

// export function updateVehiclePackageItem(id, data) {
//     let url = getAPIUrl('fleet.vehicle_package_item', {id})
//     return Patch(url, data)
// }

// export function getVehiclePackageItemById(id, params = {}) {
//     let url = getAPIUrl('fleet.vehicle_package_item', {id})
//     return Get(url, params)
// }

// export function getVehiclePackageItem(params = {}) {
//     let url = getAPIUrl('fleet.vehicle_package_item')
//     return Get(url, params)
// }

// export function deleteVehiclePackageItem(id) {
//     let url = getAPIUrl('fleet.vehicle_package_item', {id})
//     return Remove(url)
// }

export function createFleetGroup(data) {
  let url = getAPIUrl("fleet.fleet_group");
  return Post(url, data);
}

export function getFleetGroupById(id, params = {}) {
  let url = getAPIUrl("fleet.fleet_group", { id });
  return Get(url, params);
}

export function getFleetKitById(id, params = {}) {
  let url = getAPIUrl("fleet.fleet_kit", { id });
  return Get(url, params);
}

export function updateFleetGroup(id, data) {
  let url = getAPIUrl("fleet.fleet_group", { id });
  return Patch(url, data);
}

export function getFleetGroup(params = {}) {
  let url = getAPIUrl("fleet.fleet_group");
  return Get(url, params);
}

export function deleteFleetGroup(id) {
  let url = getAPIUrl("fleet.fleet_group", { id });
  return Remove(url);
}

export function createVehicle(data) {
  let url = getAPIUrl("fleet.vehicle");
  return Post(url, data);
}

export function createFleetKit(data) {
  let url = getAPIUrl("fleet.fleet_kit");
  return Post(url,data);
}

export function updateFleetKit(id, data) {
  let url = getAPIUrl("fleet.fleet_kit", { id });
  return Patch(url, data);
}

export function updateVehicle(id, data) {
  let url = getAPIUrl("fleet.vehicle", { id });
  return Patch(url, data);
}

export function getVehicle(params = {}) {
  let url = getAPIUrl("fleet.vehicle");
  return Get(url, params);
}

export function getFleetKit(params = {}) {
  let url = getAPIUrl("fleet.fleet_kit");
  return Get(url, params);
}

export function getFleetData(params = {}) {
  let url = getAPIUrl("fleet.dispatch_vehicle");
  return Get(url, params);
}

export function getVehicleById(id, params = {}) {
  let url = getAPIUrl("fleet.vehicle", { id });
  return Get(url, params);
}

export function getRegion(params = {}) {
  let url = getAPIUrl("fleet.region");
  return Get(url, params);
}

export function getBlock(params = {}) {
  let url = getAPIUrl("fleet.block");
  return Get(url, params);
}

export function getDuty(params = {}) {
  let url = getAPIUrl("fleet.duty");
  return Get(url, params);
}

export function getWeight(params = {}) {
  let url = getAPIUrl("fleet.weight");
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

export function createVehicleDocument(data) {
  let url = getAPIUrl("fleet.vehicle_document");
  return Post(url, data);
}

export function updateVehicleDocument(id, data) {
  let url = getAPIUrl("fleet.vehicle_document", { id });
  return Patch(url, data);
}

export function getVehicleDocument(params = {}) {
  let url = getAPIUrl("fleet.vehicle_document");
  return Get(url, params);
}


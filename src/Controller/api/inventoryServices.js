import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createInventoryPackage(data) {
  let url = getAPIUrl("inventory.inventory_package");
  return Post(url, data);
}

export function updateInventoryPackage(id, data) {
  let url = getAPIUrl("inventory.inventory_package", { id });
  return Patch(url, data);
}

export function getInventoryPackages(params = {}) {
  let url = getAPIUrl("inventory.inventory_package");
  return Get(url, params);
}

export function getInventoryPackageById(id, params = {}) {
  let url = getAPIUrl("inventory.inventory_package", { id });
  return Get(url, params);
}

export function createInventoryPackageItem(data) {
  let url = getAPIUrl("inventory.inventory_package_item");
  return Post(url, data);
}

export function deleteInventoryPackageItem(id) {
  let url = getAPIUrl("inventory.inventory_package_item", { id });
  return Remove(url);
}

export function updateInventoryPackageItem(id, data) {
  let url = getAPIUrl("inventory.inventory_package_item", { id });
  return Patch(url, data);
}

export function getInventoryPackageItemById(id, params = {}) {
  let url = getAPIUrl("inventory.inventory_package_item", { id });
  return Get(url, params);
}

export function getInventoryPackageItem(params = {}) {
  let url = getAPIUrl("inventory.inventory_package_item");
  return Get(url, params);
}

export function getInventoryGroup(params = {}) {
  let url = getAPIUrl("inventory.inventory_group");
  return Get(url, params);
}

export function getInventoryGroupById(id, params = {}) {
  let url = getAPIUrl("inventory.inventory_group", { id });
  return Get(url, params);
}

export function createInventoryGroup(data) {
  let url = getAPIUrl("inventory.inventory_group");
  return Post(url, data);
}

export function updateInventoryGroup(id, data) {
  let url = getAPIUrl("inventory.inventory_group", { id });
  return Patch(url, data);
}

export function createInventory(data) {
  let url = getAPIUrl("inventory.inventory");
  return Post(url, data);
}

export function updateInventory(id, data) {
  let url = getAPIUrl("inventory.inventory", { id });
  return Patch(url, data);
}

export function getInventory(params = {}) {
  let url = getAPIUrl("inventory.inventory");
  return Get(url, params);
}

export function getInventoryById(id, params = {}) {
  let url = getAPIUrl("inventory.inventory", { id });
  return Get(url, params);
}

export function getInventoryKit(params = {}) {
  let url = getAPIUrl("inventory.inventory_kit");
  return Get(url, params);
}

export function getInventoryKitById(id, params = {}) {
  let url = getAPIUrl("inventory.inventory_kit", { id });
  return Get(url, params);
}

export function createInventoryKit(data) {
  let url = getAPIUrl("inventory.inventory_kit");
  return Post(url, data);
}

export function updateInventoryKit(id, data) {
  let url = getAPIUrl("inventory.inventory_kit", { id });
  return Patch(url, data);
}

export function getInventoryKitItem(params = {}) {
  let url = getAPIUrl("inventory.inventory_kit_item");
  return Get(url, params);
}

export function getInventoryKitItemById(id, params = {}) {
  let url = getAPIUrl("inventory.inventory_kit_item", { id });
  return Get(url, params);
}

export function createInventoryKitItem(data) {
  let url = getAPIUrl("inventory.inventory_kit_item");
  return Post(url, data);
}

export function updateInventoryKitItem(id, data) {
  let url = getAPIUrl("inventory.inventory_kit_item", { id });
  return Patch(url, data);
}

export function deleteInventoryKitItem(id) {
  let url = getAPIUrl("inventory.inventory_kit_item", { id });
  return Remove(url);
}

export function getInventoryFamily(params = {}) {
  let url = getAPIUrl("inventory.family");
  return Get(url, params);
}

export function getInventoryFamilyById(id) {
  let url = getAPIUrl("inventory.family", { id });
  return Get(url);
}

export function createInventoryFamily(data) {
  let url = getAPIUrl("inventory.family");
  return Post(url, data);
}

export function updateInventoryFamily(id, data) {
  let url = getAPIUrl("inventory.family", { id });
  return Patch(url, data);
}

export function deleteInventoryFamily(id) {
  let url = getAPIUrl("inventory.family", { id });
  return Remove(url);
}

export function getInventoryLineItem(params = {}) {
  let url = getAPIUrl("inventory.inventory");
  return Get(url, params);
}

export function getInventoryLineItemById(id) {
  let url = getAPIUrl("inventory.inventory", { id });
  return Get(url);
}

export function createInventoryLineItem(data) {
  let url = getAPIUrl("inventory.inventory");
  return Post(url, data);
}

export function updateInventoryLineItem(id, data) {
  let url = getAPIUrl("inventory.inventory", { id });
  return Patch(url, data);
}

export function deleteInventoryLineItem(id) {
  let url = getAPIUrl("inventory.inventory", { id });
  return Remove(url);
}

export function getInventoryLocationById(data) {
  let url = getAPIUrl("inventory.inventory_location");
  return Get(url, data);
}

export function createInventoryLocation(data) {
  let url = getAPIUrl("inventory.inventory_location");
  return Post(url, data);
}

export function updateInventoryLocationQty(id, data) {
  let url = getAPIUrl("inventory.measurement_qty", { id });
  return Patch(url, data);
}

export function deleteLocationInventory(id) {
  let url = getAPIUrl("inventory.measurement_qty", { id });
  return Remove(url);
}

export function getInventoryVendorById(data) {
  let url = getAPIUrl("inventory.inventory_vendor");
  return Get(url, data);
}

export function createInventoryVendor(data) {
  let url = getAPIUrl("inventory.inventory_vendor");
  return Post(url, data);
}

export function updateInventoryVendorQty(id, data) {
  let url = getAPIUrl("inventory.measurement_vendor_qty", { id });
  return Patch(url, data);
}

export function deleteVendorInventory(id) {
  let url = getAPIUrl("inventory.measurement_vendor_qty", { id });
  return Remove(url);
}


export function createInventoryDocument(data) {
  let url = getAPIUrl("inventory.inventory_document");
  return Post(url, data);
}

export function updateInventoryDocument(id, data) {
  let url = getAPIUrl("inventory.inventory_document", { id });
  return Patch(url, data);
}

export function getInventoryDocument(params = {}) {
  let url = getAPIUrl("inventory.inventory_document");
  return Get(url, params);
}

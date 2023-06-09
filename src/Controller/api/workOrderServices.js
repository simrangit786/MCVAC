import { Get, GetPdf, Patch, Post, PostPdf, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createWorkOrder(data) {
  let url = getAPIUrl("work_order.work_order");
  return Post(url, data);
}

export function updateWorkOrder(id, data) {
  let url = getAPIUrl("work_order.work_order", { id });
  return Patch(url, data);
}

export function getWorkOrders(params = {}) {
  const url = getAPIUrl("work_order.work_order");
  return Get(url, params);
}
export function getWorkOrderById(id, params = {}) {
  let url = getAPIUrl("work_order.work_order", { id });
  return Get(url, params);
}

export function getWarehouse(params = {}) {
  let url = getAPIUrl("labor.internal_location");
  return Get(url, params);
}

export function createWorkOrderDocument(data) {
  let url = getAPIUrl("work_order.work_order_document");
  return Post(url, data);
}

export function updateWorkOrderDocument(id, data) {
  let url = getAPIUrl("work_order.work_order_document", { id });
  return Patch(url, data);
}

export function getWorkOrderDocuments(params = {}) {
  let url = getAPIUrl("work_order.work_order_document");
  return Get(url, params);
}

export function createWorkOrderPost(data) {
  let url = getAPIUrl("work_order.post");
  return Post(url, data);
}

export function updateWorkOrderPost(id, data) {
  let url = getAPIUrl("work_order.post", { id });
  return Patch(url, data);
}

export function getWorkOrderPost(params = {}) {
  let url = getAPIUrl("work_order.post");
  return Get(url, params);
}
export function getWorkOrderCustomerAccount(params = {}) {
  const url = getAPIUrl("work_order.customer_contacts");
  return Get(url, params);
}

export function createWorkOrderCustomerAccount(data) {
  const url = getAPIUrl("work_order.customer_contacts");
  return Post(url, data);
}

export function updateWorkOrderCustomerAccount(id, data) {
  const url = getAPIUrl("work_order.customer_contacts", { id });
  return Patch(url, data);
}

export function deleteWorkOrderCustomerAccount(id) {
  const url = getAPIUrl("work_order.customer_contacts", { id });
  return Remove(url);
}
export function createWorkOrderOwnerAccount(data) {
  const url = getAPIUrl("work_order.owner_contacts");
  return Post(url, data);
}

export function updateWorkOrderOwnerAccount(id, data) {
  const url = getAPIUrl("work_order.owner_contacts", { id });
  return Patch(url, data);
}

export function deleteWorkOrderOwnerAccount(id) {
  const url = getAPIUrl("work_order.owner_contacts", { id });
  return Remove(url);
}

export function getSiteOwnerContacts(params = {}) {
  const url = getAPIUrl("work_order.owner_contacts");
  return Get(url, params);
}
// export function getContactAccount(search) {
//   const url = getAPIUrl('proposal.proposal_contact_account');
//   return Get(url, search)
// }

export function getContacts(search) {
  const url = getAPIUrl("work_order.customer_contacts");
  return Get(url, search);
}

export function createCustomerContact(data) {
  const url = getAPIUrl("work_order.customer_contacts");
  return Post(url, data);
}

export function updateContact(data, id) {
  const url = getAPIUrl("work_order.contacts", { id });
  return Patch(url, data);
}

export function deleteContact(id) {
  const url = getAPIUrl("work_order.contacts", { id });
  return Remove(url);
}

export function getWorkOrderActivityInfo(id) {
  const url = getAPIUrl("work_order.work_order_activity", { id });
  return Get(url);
}

export function getWorkOrderStatusOptions() {
  const url = getAPIUrl("work_order.work_order_status");
  return Get(url);
}

export function updateWorkOrderDefaultCustomerRecipient(id, data) {
  const url = getAPIUrl("work_order.default_customer_recipient", { id });
  return Patch(url, data);
}

export function updatePrimarySite(id, data) {
  const url = getAPIUrl("work_order.primary_site", { id });
  return Patch(url, data);
}

export function createWorkOrderWarehouse(data) {
  const url = getAPIUrl("work_order.work_order_warehouse");
  return Post(url, data)
}

export function getWorkOrderWarehouse(id) {
  const url = getAPIUrl("work_order.work_order_warehouse", { id });
  return Get(url);
}

export function deleteWorkOrderWarehouse(id) {
  const url = getAPIUrl("work_order.work_order_warehouse", { id });
  return Remove(url);
}

export function getWorkOrderProjectVarient(params={}) {
  const url = getAPIUrl("work_order.work_order_project_variant");
  return Get(url,params);
}

export function getWorkOrderServiceVarient(data) {
  const url = getAPIUrl("work_order.work_order_service_variant");
  return Get(url,data);
}

export function addWorkOrderServiceVarient(data) {
  const url = getAPIUrl("work_order.work_order_service_variant");
  return Post(url,data);
}

export function addWorkOrderContainerData(data) {
  const url = getAPIUrl("work_order.work_order_container_data");
  return Post(url,data);
}

export function updateWorkOrderServiceVarient(data, id) {
  const url = getAPIUrl("work_order.work_order_service_variant", { id });
  return Patch(url, data);
}

export function deleteWorkOrderServiceVariant(id) {
  const url = getAPIUrl("work_order.work_order_service_variant", { id })
  return Remove(url)
}

export function getWorkOrderPdf(id) {
  const url = getAPIUrl("work_order.work_order_pdf",{ id });
  return GetPdf(url);
}
export function addWorkOrderPdf(data) {
  const url = getAPIUrl("work_order.work_order_pdf");
  return PostPdf(url,data);
}

export function getWorkOrderDispatch(params={}) {
  const url = getAPIUrl("work_order.work_order");
  return Get(url,params);
}

export function updateWorkOrderDispatch(data,id) {
  const url = getAPIUrl("work_order.work_order",{ id });
  return Patch(url,data)
}

export function getWorkOrderGroupDispatch(params={}) {
  const url = getAPIUrl("work_order.work_order_group");
  return Get(url,params);
}

export function getDispatchFleetGroup(params={}) {
  const url = getAPIUrl("dispatch.dispatch_vehicle");
  return Get(url,params);
}

export function getDispatchFleetKit(params={}) {
  const url = getAPIUrl("dispatch.dispatch_kit");
  return Get(url,params);
}



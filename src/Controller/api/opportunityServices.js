import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getSource(search) {
  const url = getAPIUrl("opportunity.source");
  return Get(url, search);
}

export function getContactAccount(search) {
  const url = getAPIUrl("opportunity.opportunity_contact_account");
  return Get(url, search);
}

export function getContacts(search) {
  const url = getAPIUrl("opportunity.contacts");
  return Get(url, search);
}

export function createContact(data) {
  const url = getAPIUrl("opportunity.contacts");
  return Post(url, data);
}

export function updateContact(data, id) {
  const url = getAPIUrl("opportunity.contacts", { id });
  return Patch(url, data);
}

export function deleteContact(id) {
  const url = getAPIUrl("opportunity.contacts", { id });
  return Remove(url);
}

export function getDocuments(search) {
  const url = getAPIUrl("opportunity.documents");
  return Get(url, search);
}

export function createDocument(data) {
  const url = getAPIUrl("opportunity.documents");
  return Post(url, data);
}

export function getOpportunities(params = {}) {
  const url = getAPIUrl("opportunity.opportunity");
  return Get(url, params);
}

export function getOneOpportunities(id, params = {}) {
  const url = getAPIUrl("opportunity.opportunity", { id: id });
  return Get(url, params);
}

export function getAccountContacts(params = {}) {
  const url = getAPIUrl("opportunity.contacts");
  return Get(url, params);
}

export function getOpportunityDocuments(params = {}) {
  const url = getAPIUrl("opportunity.documents");
  return Get(url, params);
}

export function getOpportunityPost(params = {}) {
  const url = getAPIUrl("opportunity.post");
  return Get(url, params);
}

export function createOpportunityPost(data) {
  const url = getAPIUrl("opportunity.post");
  return Post(url, data);
}

export function updateOpportunityPost(id, data) {
  const url = getAPIUrl("opportunity.post", { id });
  return Patch(url, data);
}

export function createOpportunity(data) {
  const url = getAPIUrl("opportunity.opportunity");
  return Post(url, data);
}

export function updateOpportunity(id, data) {
  const url = getAPIUrl("opportunity.opportunity", { id });
  return Patch(url, data);
}

export function getAllCustomerAccounts() {
  const url = getAPIUrl("opportunity.customer_contacts");
  return Get(url);
}

export function getCustomerAccount(params = {}) {
  const url = getAPIUrl("opportunity.customer_contacts");
  return Get(url, params);
}

export function createOpportunityCustomerAccount(data) {
  const url = getAPIUrl("opportunity.customer_contacts");
  return Post(url, data);
}

export function updateOpportunityCustomerAccount(id, data) {
  const url = getAPIUrl("opportunity.customer_contacts", { id });
  return Patch(url, data);
}

export function deleteOpportunityCustomerAccount(id) {
  const url = getAPIUrl("opportunity.customer_contacts", { id });
  return Remove(url);
}

export function getOwnerAccount(params = {}) {
  const url = getAPIUrl("opportunity.owner_contacts");
  return Get(url, params);
}

export function createOpportunityOwnerAccount(data) {
  const url = getAPIUrl("opportunity.owner_contacts");
  return Post(url, data);
}

export function updateOpportunityOwnerAccount(id, data) {
  const url = getAPIUrl("opportunity.owner_contacts", { id });
  return Patch(url, data);
}

export function deleteOpportunityOwnerAccount(id) {
  const url = getAPIUrl("opportunity.owner_contacts", { id });
  return Remove(url);
}

export function getActivityInfo(id, params = {}) {
  const url = getAPIUrl("opportunity.opportunity_activity", { id: id });
  return Get(url, params);
}

export function getStatusData() {
  const url = getAPIUrl("opportunity.status");
  return Get(url);
}

export function updatePrimarySite(id, data) {
  const url = getAPIUrl("opportunity.primary_site", { id });
  return Patch(url, data);
}

export function getStatusReasonOptions() {
  const url = getAPIUrl("opportunity.reason_options");
  return Get(url)
}
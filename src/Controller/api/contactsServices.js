import { Get, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";
import { post } from "jquery";

export function getContact(params = {}) {
  const url = getAPIUrl("contact.contact");
  return Get(url, params);
}

export function getOneContact(id, params = {}) {
  const url = getAPIUrl("contact.contact", { id: id });
  return Get(url, params);
}

export function getOneContactActivity(id, params = {}) {
  const url = getAPIUrl("contact.contact_activity", { id: id });
  return Get(url, params);
}

export function createContact(data) {
  const url = getAPIUrl("contact.contact");
  return Post(url, data);
}

export function updateContact(data, id) {
  const url = getAPIUrl("contact.contact", { id });
  return Patch(url, data);
}

export function removeContact(id) {
  const url = getAPIUrl("contact.contact", { id });
  return Remove(url);
}

export function getContactEmails(params = {}) {
  const url = getAPIUrl("contact.email");
  return Get(url, params);
}

export function createContactEmail(data) {
  const url = getAPIUrl("contact.email");
  return Post(url, data);
}

export function updateContactEmail(data, id) {
  const url = getAPIUrl("contact.email", { id });
  return Patch(url, data);
}

export function removeContactEmail(id) {
  const url = getAPIUrl("contact.email", { id });
  return Remove(url);
}

export function getContactPhones(params = {}) {
  const url = getAPIUrl("contact.phone");
  return Get(url, params);
}

export function createContactPhone(data) {
  const url = getAPIUrl("contact.phone");
  return Post(url, data);
}

export function updateContactPhone(data, id) {
  const url = getAPIUrl("contact.phone", { id });
  return Patch(url, data);
}

export function removeContactPhone(id) {
  const url = getAPIUrl("contact.phone", { id });
  return Remove(url);
}

export function getContactDocument(params = {}) {
  const url = getAPIUrl("contact.document");
  return Get(url, params);
}

export function createContactDocument(data) {
  const url = getAPIUrl("contact.document");
  return Post(url, data);
}

export function createContactPost(data) {
  const url = getAPIUrl("contact.post");
  return Post(url, data);
}

export function getContactPost(params) {
  const url = getAPIUrl("contact.post");
  return Get(url, params);
}

export function updateContactPost(id, params) {
  const url = getAPIUrl("contact.post", { id });
  return Patch(url, params);
}

export function updateDefaultEmail(id, params) {
  const url = getAPIUrl("contact.default_email", { id });
  return Patch(url, params);
}

export function updateDefaultPhone(id, params) {
  const url = getAPIUrl("contact.default_phone", { id });
  return Patch(url, params);
}

export function createContactAddress(data) {
  const url = getAPIUrl("contact.address");
  return Post(url,data);
}

export function updateContactAddress(id,data) {
  const url = getAPIUrl("contact.address", { id });
  return Patch(url,data);

}
export function getContactAddress(id, params) {
  const url = getAPIUrl("contact.address", { id });
  return Get(url,params)
}

export function getContactPositions(params) {
  const url = getAPIUrl("contact.position");
  return Get(url, params)
}

export function createContactPosition(data) {
  const url = getAPIUrl("contact.position");
  return Post(url,data);
}
export function createContactOppotunity(data) {
  const url = getAPIUrl("contact.opportunity");
  return Post(url,data);
}

export function removeContactOppotunity(id) {
  const url = getAPIUrl("contact.opportunity", { id });
  return Remove(url);
}

export function getContactOppotunity(params) {
  const url = getAPIUrl("contact.opportunity");
  return Post(url,params);
}
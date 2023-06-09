import { Get, GetPdf, Patch, Post, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createProject(data) {
  let url = getAPIUrl("project.project");
  return Post(url, data);
}

export function updateProject(id, data) {
  let url = getAPIUrl("project.project", { id });
  return Patch(url, data);
}

export function getProjects(params = {}) {
  const url = getAPIUrl("project.project");
  return Get(url, params);
}
export function getProjectById(id, params = {}) {
  let url = getAPIUrl("project.project", { id });
  return Get(url, params);
}

export function createProjectDocument(data) {
  let url = getAPIUrl("project.project_document");
  return Post(url, data);
}

export function updateProjectDocument(id, data) {
  let url = getAPIUrl("project.project_document", { id });
  return Patch(url, data);
}

export function getProjectDocuments(params = {}) {
  let url = getAPIUrl("project.project_document");
  return Get(url, params);
}

export function createProjectPost(data) {
  let url = getAPIUrl("project.post");
  return Post(url, data);
}

export function updateProjectPost(id, data) {
  let url = getAPIUrl("project.post", { id });
  return Patch(url, data);
}

export function getProjectPost(params = {}) {
  let url = getAPIUrl("project.post");
  return Get(url, params);
}
export function getProjectCustomerAccount(params = {}) {
  const url = getAPIUrl("project.customer_contacts");
  return Get(url, params);
}

export function createProjectCustomerAccount(data) {
  const url = getAPIUrl("project.customer_contacts");
  return Post(url, data);
}

export function updateProjectCustomerAccount(id, data) {
  const url = getAPIUrl("project.customer_contacts", { id });
  return Patch(url, data);
}

export function deleteProjectCustomerAccount(id) {
  const url = getAPIUrl("project.customer_contacts", { id });
  return Remove(url);
}
export function createProjectOwnerAccount(data) {
  const url = getAPIUrl("project.owner_contacts");
  return Post(url, data);
}

export function updateProjectOwnerAccount(id, data) {
  const url = getAPIUrl("project.owner_contacts", { id });
  return Patch(url, data);
}

export function deleteProjectOwnerAccount(id) {
  const url = getAPIUrl("project.owner_contacts", { id });
  return Remove(url);
}

export function getSiteOwnerContacts(params = {}) {
  const url = getAPIUrl("project.owner_contacts");
  return Get(url, params);
}
// export function getContactAccount(search) {
//   const url = getAPIUrl('proposal.proposal_contact_account');
//   return Get(url, search)
// }

export function getContacts(search) {
  const url = getAPIUrl("project.customer_contacts");
  return Get(url, search);
}

export function createCustomerContact(data) {
  const url = getAPIUrl("project.customer_contacts");
  return Post(url, data);
}

export function updateContact(data, id) {
  const url = getAPIUrl("project.contacts", { id });
  return Patch(url, data);
}

export function deleteContact(id) {
  const url = getAPIUrl("project.contacts", { id });
  return Remove(url);
}

export function getProjectActivityInfo(id) {
  const url = getAPIUrl("project.project_activity", { id });
  return Get(url);
}

export function getProjectStatusOptions() {
  const url = getAPIUrl("project.project_status");
  return Get(url);
}

export function updateProjectDefaultCustomerRecipient(id, data) {
  const url = getAPIUrl("project.default_customer_recipient", { id });
  return Patch(url, data);
}

export function updatePrimarySite(id, data) {
  const url = getAPIUrl("project.primary_site", { id });
  return Patch(url, data);
}

export function getProposalPdf(id) {
  const url = getAPIUrl("project.proposal_pdf", { id })
  return GetPdf(url)
}

export function addServiceVariantProject(data) {
  const url = getAPIUrl("project.service_variant");
  return Post(url, data)
}

export function getServiceVariantProject(data) {
  const url = getAPIUrl("project.service_variant")
  return Get(url, data)
}

export function updateServiceVariantProject(data, id) {
  const url = getAPIUrl("project.service_variant", { id })
  return Patch(url, data)
}

export function getTaxBasisOptions(data) {
  const url = getAPIUrl("project.tax_basis")
  return Get(url, data)
}

export function deleteServiceVariant(id) {
  const url = getAPIUrl("project.service_variant", { id })
  return Remove(url)
}

export function sendPdfProject(id, data) {
  const url = getAPIUrl("project.sales_pdf_email", { id })
  return Post(url, data);
}

export function generateMultipleProjects(data) {
  const url = getAPIUrl("project.generate_proposals")
  return Post(url, data)
}

export function getAssociateProposals(params = {}) {
  const url = getAPIUrl("project.associated_proposal");
  return Get(url, params);
}


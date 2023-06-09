import { Get, GetPdf, Patch, Post, PostPdf, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createProposal(data) {
  let url = getAPIUrl("proposal.proposal");
  return Post(url, data);
}

export function updateProposal(id, data) {
  let url = getAPIUrl("proposal.proposal", { id });
  return Patch(url, data);
}

export function getProposals(params = {}) {
  const url = getAPIUrl("proposal.proposal");
  return Get(url, params);
}
export function getProposalById(id, params = {}) {
  let url = getAPIUrl("proposal.proposal", { id });
  return Get(url, params);
}

export function createProposalDocument(data) {
  let url = getAPIUrl("proposal.proposal_document");
  return Post(url, data);
}

export function updateProposalDocument(id, data) {
  let url = getAPIUrl("proposal.proposal_document", { id });
  return Patch(url, data);
}

export function getProposalDocuments(params = {}) {
  let url = getAPIUrl("proposal.proposal_document");
  return Get(url, params);
}

export function createProposalPost(data) {
  let url = getAPIUrl("proposal.post");
  return Post(url, data);
}

export function updateProposalPost(id, data) {
  let url = getAPIUrl("proposal.post", { id });
  return Patch(url, data);
}

export function getProposalPost(params = {}) {
  let url = getAPIUrl("proposal.post");
  return Get(url, params);
}
export function getCustomerAccount(params = {}) {
  const url = getAPIUrl("proposal.customer_contacts");
  return Get(url, params);
}

export function createProposalCustomerAccount(data) {
  const url = getAPIUrl("proposal.customer_contacts");
  return Post(url, data);
}

export function updateProposalCustomerAccount(id, data) {
  const url = getAPIUrl("proposal.customer_contacts", { id });
  return Patch(url, data);
}

export function deleteProposalCustomerAccount(id) {
  const url = getAPIUrl("proposal.customer_contacts", { id });
  return Remove(url);
}
export function createProposalOwnerAccount(data) {
  const url = getAPIUrl("proposal.owner_contacts");
  return Post(url, data);
}

export function updateProposalOwnerAccount(id, data) {
  const url = getAPIUrl("proposal.owner_contacts", { id });
  return Patch(url, data);
}

export function deleteProposalOwnerAccount(id) {
  const url = getAPIUrl("proposal.owner_contacts", { id });
  return Remove(url);
}

export function getSiteOwnerContacts(params = {}) {
  const url = getAPIUrl("proposal.owner_contacts");
  return Get(url, params);
}
// export function getContactAccount(search) {
//   const url = getAPIUrl('proposal.proposal_contact_account');
//   return Get(url, search)
// }

export function getContacts(search) {
  const url = getAPIUrl("proposal.customer_contacts");
  return Get(url, search);
}

export function createCustomerContact(data) {
  const url = getAPIUrl("proposal.customer_contacts");
  return Post(url, data);
}

export function updateContact(data, id) {
  const url = getAPIUrl("proposal.contacts", { id });
  return Patch(url, data);
}

export function deleteContact(id) {
  const url = getAPIUrl("proposal.contacts", { id });
  return Remove(url);
}

export function getProposalActivityInfo(id) {
  const url = getAPIUrl("proposal.proposal_activity", { id });
  return Get(url);
}

export function getProposalStatusOptions() {
  const url = getAPIUrl("proposal.proposal_status");
  return Get(url);
}

export function updateDefaultCustomerRecipient(id, data) {
  const url = getAPIUrl("proposal.default_customer_recipient", { id });
  return Patch(url, data);
}

export function updatePrimarySite(id, data) {
  const url = getAPIUrl("proposal.primary_site", { id });
  return Patch(url, data);
}

export function getProposalPdf(id, data) {
  const url = getAPIUrl("proposal.proposal_pdf", {id})
  return GetPdf(url, data)
}

export function addServiceVariantProposal(data) {
  const url = getAPIUrl("proposal.service_variant");
  return Post(url, data)
}

export function getServiceVariantProposal(data) {
  const url = getAPIUrl("proposal.service_variant")
  return Get(url, data)
}

export function updateServiceVariantProposal(data, id) {
  const url = getAPIUrl("proposal.service_variant", {id})
  return Patch(url, data)
}

export function getTaxBasisOptions(data) {
  const url = getAPIUrl("proposal.tax_basis")
  return Get(url, data)
}

export function deleteServiceVariant(id) {
  const url = getAPIUrl("proposal.service_variant", {id})
  return Remove(url)
}

export function sendPdfProposal(id, data) {
  const url = getAPIUrl("proposal.sales_pdf_email", {id})
  return Post(url, data);
}

export function generateMultipleProposals(data) {
  const url = getAPIUrl("proposal.generate_proposals")
  return Post(url, data)
}

export function addProposalPdf(data) {
  const url = getAPIUrl("proposal.proposal_create_pdf")
  return PostPdf(url, data)
}



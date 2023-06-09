import { Get, Patch, GetPdf, Post, Remove, PostPdf } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function createInvoice(data) {
    let url = getAPIUrl("invoice.invoice");
    return Post(url, data);
  }

export function getInvoices(params = {}) {
    const url = getAPIUrl("invoice.invoice");
    return Get(url, params);
  }

export function updateInvoice(id, data) {
    let url = getAPIUrl("invoice.invoice", { id });
    return Patch(url, data);
  }

  export function getInvoiceById(id, params = {}) {
    let url = getAPIUrl("invoice.invoice", { id });
    return Get(url, params);
  }
  
export function getInvoiceStatus(params={}) {
    let url = getAPIUrl("invoice.invoice_status");
    return Get(url, params)
  }

export function createInvoiceCustomerAccount(params = {}) {
  const url = getAPIUrl("invoice.customer_contacts");
    return Post(url, params);
}

export function getInvoiceCustomerAccount(params = {}) {
  const url = getAPIUrl("invoice.customer_contacts");
    return Get(url, params);
}

export function updateInvoiceCustomerAccount(id, data) {
  const url = getAPIUrl("invoice.customer_contacts", { id });
  return Patch(url, data);
}

export function addInvoicePdf(data) {
  const url = getAPIUrl("invoice.invoice_create_pdf");
  return PostPdf(url,data);
}

export function deleteInvoiceCustomerAccount(id) {
  const url = getAPIUrl("invoice.customer_contacts", { id });
  return Remove(url);
}

export function createInvoiceOwnerAccount(params = {}) {
  const url = getAPIUrl("invoice.owner_contacts");
    return Post(url, params);
}

export function getInvoiceOwnerAccount(params = {}) {
  const url = getAPIUrl("invoice.owner_contacts");
    return Get(url, params);
}

export function updateInvoiceOwnerAccount(id, data) {
  const url = getAPIUrl("invoice.owner_contacts", { id });
  return Patch(url, data);
}

export function getInvoiceActivityInfo(id) {
  const url = getAPIUrl("invoice.invoice_activity", { id });
  return Get(url);
}

export function deleteInvoiceOwnerAccount(id) {
  const url = getAPIUrl("invoice.owner_contacts", { id });
  return Remove(url);
}

export function updateInvoicePrimarySite(id, data) {
  const url = getAPIUrl("invoice.primary_site", { id });
  return Patch(url, data);
}

export function createInvoicePost(data) {
  let url = getAPIUrl("invoice.post");
  return Post(url, data);
}

export function createInvoiceDocument(data) {
  let url = getAPIUrl("invoice.invoice_document");
  return Post(url, data);
}

export function updateInvoiceDocument(id, data) {
  let url = getAPIUrl("invoice.invoice_document", { id });
  return Patch(url, data);
}

export function getInvoiceDocuments(params = {}) {
  let url = getAPIUrl("invoice.invoice_document");
  return Get(url, params);
}

export function updateInvoicePost(id, data) {
  let url = getAPIUrl("invoice.post", { id });
  return Patch(url, data);
}

export function getInvoicePost(params = {}) {
  let url = getAPIUrl("invoice.post");
  return Get(url, params);
}

export function getInvoiceWorkorder(params={}) {
  const url = getAPIUrl("invoice.invoice_work_order");
    return Get(url, params);
}

export function getInvoiceProjectWorkorder(params={}) {
  const url = getAPIUrl("invoice.invoice_project_work_order");
    return Get(url, params);
}

export function postInvoiceWorkorder(data) {
  let url = getAPIUrl("invoice.invoice_project_work_order");
  return Post(url, data);
}

export function updateInvoiceWorkorder(id, data) {
  let url = getAPIUrl("invoice.invoice_project_work_order", { id });
  return Patch(url, data);
}

export function removeInvoiceWorkorder(id) {
  let url = getAPIUrl("invoice.invoice_project_work_order", { id });
  return Remove(url)
}

export function sendPdfInvoice(id, data) {
  const url = getAPIUrl("invoice.invoice_sales_pdf_email", {id})
  return Post(url, data);
}

export function getInvoicePdf(id, data) {
  const url = getAPIUrl("invoice.invoice_pdf", {id})
  return GetPdf(url, data)
}



  
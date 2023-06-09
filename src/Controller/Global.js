import { getEnvValue } from "./Environment";
import { include, reverse } from "named-urls";
import { message } from "antd";

const endpoint = {
  auth: include("/api/v1/auth/", {
    login: "login/",
    user: "user/:type/",
    profile: "user/profile/",
    refresh: "token/refresh/",
    gmail_authenticate: "gmail-authenticate",
  }),
  opportunity: include("/api/v1/opportunity/", {
    opportunity: "opportunity/:id?/",
    source: "source/",
    contacts: "contacts/:id?/",
    documents: "documents/",
    post: "post/:id?/",
    opportunity_contact_account: "opportunity-account-contact/",
    owner_contacts: "owner-contacts/:id?/",
    customer_contacts: "customer-contacts/:id?/",
    opportunity_activity: "opportunity/:id/opportunity-activity/",
    status: "status/:id?/",
    primary_site: "owner-contacts/:id/primary-site/",
    reason_options: "reason-options"
  }),
  global_search: include("/api/v1/", {
    global_search: "global-search/",
  }),
  contact: include("/api/v1/contact/", {
    contact: "contact/:id?/",
    position: "position/:id?/",
    email: "email/:id?/",
    default_email: "email/:id?/default-email/",
    phone: "phone/:id?/",
    default_phone: "phone/:id?/default-phone/",
    post: "post/:id?/",
    document: "document/",
    contact_activity: "contact/:id/contact-activity/",
    address: "address/:id?/",
    opportunity:"contact-opportunity/:id?/"
  }),
  account: include("/api/v1/account/", {
    account: "account/:id?/",
    account_activity: "account/:id/account-activity/",
    customerAccount: "customer-account/:id?/",
    customerBillingAddress: "customer-billing-address/:id?/",
    customerDocuments: "customer-documents/:id?/",
    customerMainAddress: "customer-main-address/:id?/",
    customerPaymentInfo: "customer-payment-info/:id?/",
    industry: "industry/:id?/",
    ownerAccount: "owner-account/:id?/",
    ownerDocuments: "owner-documents/:id?/",
    ownerPaymentInfo: "owner-payment-info/:id?/",
    ownerSites: "owner-sites/:id?/",
    sitesDocument: "site-document/",
    postDocument: "post-document/:id?/",
    post: "post/:id?/",
    associated_account: "associated-account/:id?/",
    vendor_account: "vendor-account/:id?/",
    vendor_main_address: "vendor-main-address/:id?/",
    vendor_billing_address: "vendor-billing-address/:id?/",
    county_state: "county-state/",
  }),
  fleet: include("/api/v1/management/fleet/", {
    fleet_group: "group/:id?/",
    family: "family/:id?/",
    fleet_kit: "fleet-kit/:id?/",
    // vehicle_package_item: 'vehicle-package-item/:id?/',
    // vehicle_group: 'vehicle-group/:id?/',
    vehicle: "vehicle/:id?/",
    dispatch_vehicle: "vehicle/dispatch-vehicle/:id?/",
    region: "region/:id?/",
    block: "block/:id?/",
    duty: "duty/:id?/",
    weight: "weight/:id?/",
    vehicle_document:"document/:id?/"
  }),
  supply: include("/api/v1/management/supply/", {
    family: "family/:id?/",
    supply_group: "group/:id?/",
    // supply_package: 'supply-package/:id?/',
    // supply_package_item: 'supply-package-item/:id?/',
    // supply_group: 'supply-group/:id?/',
    supply: "supply/:id?/",
    supply_dispatch: "supply/dispatch-supply/:id?/",
    supply_doc: "document/:id?/",
  }),
  inventory: include("/api/v1/management/inventory/", {
    inventory_package: "inventory-package/:id?/",
    inventory_package_item: "inventory-item/:id?/",
    inventory_group: "inventory-group/:id?/",
    inventory: "inventory-item/:id?/",
    inventory_kit: "kit/:id?/",
    inventory_kit_item: "kit-item/:id?/",
    family: "family/:id?/",
    inventory_location: "inventory-location/:id?/",
    measurement_qty: "measurement-inventory-location/:id?/",
    inventory_vendor: "inventory-vendor/:id?/",
    measurement_vendor_qty: "measurement-inventory-vendor/:id?/",
    inventory_document:"document/:id?/"
  }),
  labor: include("/api/v1/management/labor/", {
    employee: "employee/:id?/",
    employee_doc: "employee-doc/:id?/",
    labor_employee: "employee/dispatch-employee/:id?/",
    employee_type: "employee-type/:id?/",
    labor_group: "labor-group/:id?/",
    shift: "shift/:id?/",
    internal_location: "internal-location/:id?/",
  }),
  service: include("/api/v1/management/service/", {
    family: "family/:id?/",
    add_table_data: 'add-table-data/:id?/',
    table_data: "table-data/:id?/",
    family_item: "family-item/:id?/",
    line_item: "line-item/:id?/",
    pricing: "pricing/:id?/",
    pricing_unique_variants: "pricing/unique-variants/",
    unique_display_name: "pricing/unique-display-names/",
    resource: "resource/:id?/",
    item_pricing: "item-pricing/:id?/",
    vendor_location: "vendor-location/:id?/",
  }),
  disposal: include("/api/v1/management/disposal/", {
    family: "family/:id?/",
    disposal: "disposal/:id?/",
    documents: "document/:id?/",
    unit_type: "unit-type/:id?/",
    unit_name: "unit-name/:id?/",
    custom_measurement: "custom-measurement/:id?/",
    disposal_location: "disposal-location/:id?/",
    disposal_location_price: "disposal-location-price/:id?/",
    disposal_vendor_price: "disposal-vendor-price/:id?/",
    measurement_qty: "measurement-disposal-location/:id?/",
    disposal_vendor: "disposal-vendor/:id?/",
    measurement_vendor_qty: "measurement-disposal-vendor/:id?/",
  }),

  proposal: include("/api/v1/proposal/", {
    service_variant: 'service-variant/:id?/',
    proposal: "proposal/:id?/",
    proposal_document: "proposal-document/:id?/",
    post: "post/:id?/",
    customer_contacts: "customer-contacts/:id?/",
    owner_contacts: "owner-contacts/:id?/",
    source: "source/",
    contacts: "contacts/:id?/",
    documents: "documents/",
    // proposal_contact_account: 'proposal-account-contact/',
    proposal_activity: "proposal/:id/proposal-activity/",
    proposal_status: "status",
    proposal_pdf: 'sales-pdf/:id',
    proposal_create_pdf: 'proposal-pdf/:id?/',
    generate_proposals: 'generate-proposals',
    sales_pdf_email: 'sales-pdf-email/:id',
    tax_basis: 'tax-basis/:id?/',
    default_customer_recipient:
      "customer-contacts/:id/default-customer-recipient/",
    primary_site: "owner-contacts/:id/primary-site/",
  }),
  project: include("/api/v1/project/", {
    service_variant: 'service-variant/:id?/',
    project: "project/:id?/",
    project_document: "project-document/:id?/",
    post: "post/:id?/",
    customer_contacts: "customer-contacts/:id?/",
    owner_contacts: "owner-contacts/:id?/",
    source: "source/",
    contacts: "contacts/:id?/",
    documents: "documents/",
    project_activity: "project/:id/project-activity/",
    project_status: "status",
    project_pdf: 'sales-pdf/:id',
    generate_proposals: 'generate-proposals',
    sales_pdf_email: 'sales-pdf-email/:id',
    tax_basis: 'tax-basis/:id?/',
    default_customer_recipient:
      "customer-contacts/:id/default-customer-recipient/",
    primary_site: "owner-contacts/:id/primary-site/",
    associated_proposal: "associated-proposal"
  }),
  work_order: include("/api/v1/work-order/", {
    work_order: 'work-order/:id?/',
    work_order_group: "work-order/fleet-group/:id?/",
    work_order_container_data: "container-data/",
    post: 'post/:id?/',
    customer_contacts: "customer-contacts/:id?/",
    owner_contacts: "owner-contacts/:id?/",
    work_order_activity: "work-order/:id/work-order-activity/",
    work_order_status: "status/",
    default_customer_recipient:
      "customer-contacts/:id/default-customer-recipient/",
    primary_site: "owner-contacts/:id/primary-site/",
    work_order_document: "work-order-document/:id?/",
    work_order_warehouse: "warehouse/:id?/",
    work_order_project_variant: "project-variant/:id?/",
    work_order_service_variant: "service-variant/:id?/",
    work_order_pdf: "workorder-pdf/:id?/",
  }),
  dispatch: include("/api/v1/dispatch/", {
      dispatch: "dispatch/workorders/:id?/",
      dispatch_assign: "dispatch/assign-resources/",
      dispatch_now: "dispatch/dispatch-now/",
      dispatched: "dispatch/dispatched/",
      dispatchChief: "dispatch/:id?/",
      dispatch_one: "dispatch/:id?/status/",
      dispatch_vehicle: "dispatch-vehicle/:id?/",
      dispatch_kit: "dispatch-kit/:id?/",
      dispatch_update_fleet_group: "update-fleet-group/:id?/"
  }),
  invoice: include("/api/v1/invoice/",{
    invoice: "invoice/:id?/",
    invoice_status: "status/",
    customer_contacts: "customer-contacts/:id?/",
    owner_contacts: "owner-contacts/:id?/",
    post: "post/:id?/",
    primary_site: "owner-contacts/:id/primary-site/",
    invoice_document: "invoice-document/:id?/",
    invoice_activity: "invoice/:id/invoice-activity/",
    invoice_work_order: "workorder/:id?/",
    invoice_project_work_order: "invoice-workorder/:id?/",
    invoice_sales_pdf_email: "invoice-pdf-email/:id?",
    invoice_pdf: "sales-pdf/:id?",
    invoice_create_pdf: "invoice-pdf/:id?/"
  })
};

export const TYPES = {
  create: "create",
  edit: "edit",
};

export const roles = {
  salesPerson: "SALES_PERSON",
  salesAssistant: "SALES_ASSISTANT",
  salesManager: "SALES_MANAGER",
};

export const STATUS_TYPES = [
  "PROSPECT",
  "CONTACTED",
  "NURTURING",
  "NEGOTIATING",
  "CONVERTED",
  "LOST",
  "CLOSE/DEAD",
];

export function getAPIUrl(url, params = null) {
  const path = reverse(
    url.split(".").reduce((o, i) => o[i], endpoint),
    params
  );
  return getEnvValue("REACT_APP_API_URL") + path;
}

export function handleError(err) {
  if (err.response) {
    Object.keys(err.response.data).forEach((e) => {
      message.error(`${e}:${err.response.data[e]}`);
    });
  }
}

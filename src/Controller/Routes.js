import { include } from "named-urls";

export const routes = {
  login: "/",
  logout: "/logout/",
  forget_password: "/forgot-password/",
  dashboard: include("/dashboard", {
    self: "",
    global_search: "global-search",
    opportunities: include("opportunities", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    }),
    customer_account: include("billing-account", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    }),
    owner_account: include("site-manager-account", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
      site_account: include("sites", {
        create: "create",
        edit: "edit/:id",
        view: "view/:id",
      }),
    }),
    vendor_account: include("vendor-account", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id"
    }),
    customer_owner_account: "customer-owner/create/",
    contacts: include("contacts", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    }),
    account_contact: "account-contact/",
    sales: include("sales", {
      self: "",
      proposal: include("proposal", {
        self: "",
        create: "create",
        view: "view/:id",
        edit: "edit/:id",
      }),
      price_lookup: include("price-lookup", {
        self: ""
      }),
    }),
    operations: include('operations',{
      self:'',
      projects:include("projects",{
        self:'',
        create:'create',
        view:'view/:id',
        edit:'edit/:id',
      }),
      work_order:include("work-order",{
        self:'',
        create:'create',
        view:'view/:id',
        edit:'edit/:id',
      }),
      dispatch:include("dispatch",{
        self:'',
        create:'create',
        view:'view/:id',
        edit:'edit/:id',
      })
    }),
    management: include("management", {
      self: "",
      fleet: include("fleet", {
        self: "",
        fleet_family: include("fleet_family", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id/",
        }),
        groups: include("groups", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id/",
        }),
        kit: include("kit", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        vehicle: include("vehicle", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
      }),
      labor: include("labor", {
        self: "",
        labor_group: include("labor-group", {
          create: "create/",
          view: "view/:id/",
          edit: "edit/:id/",
        }),
        employee: include("employee", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id/",
        }),
      }),
      inventory: include("inventory", {
        self: "",
        inventory_packages: include("inventory-packages", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        inventory_groups: include("inventory-groups", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        inventory_items: include("inventory-items", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        inventory_kits: include("inventory-kits", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
      }),
      supply_tools: include("supply-tools", {
        self: "",
        supply_packages: include("supply-packages", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        supply_groups: include("supply-groups", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        supply_tools: include("supply-tools", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
      }),
      service: include("service", {
        self: "",
        line_items: include("line-item", {
          create: "create/",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        family: include("family", {
          create: "create",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        pricing: include("pricing", {
          self: "",
        }),
      }),
      disposal: include("disposal", {
        self: "",
        family: include("family", {
          create: "create",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
        items: include("item", {
          create: "create",
          view: "view/:id?/",
          edit: "edit/:id?/",
        }),
      }),
      disposal_inventory: include("disposal-inventory", {
        self: "",
        view: "view/:id?/",
        family: include("family", {
          view: "view/:id?/",
        }),
      }),
    }),
    accounting: include("accounting",{
      self:'',
      invoicing:include("invoicing",{
        self:'',
        create:"create",
        view:'view/:id?/',
        edit:'edit/:id?/'
      })
    }),
  }),
};

import React from "react";
import SideBar from "./sidebar/SideBar";
import CustomHeader from "./CustomHeader";
import {routes} from "../Controller/Routes";
import DashboardNew from "./DashboardNew";
import OpportunitiesDashboard from "./Opportunities/OpportunitiesDashboard";
import CreateOpportunityForm from "./Opportunities/create/CreateOpportunityForm";
import OpportunityDetail from "./Opportunities/view/OpportunityDetail";
import SearchResults from "./search-results/SearchResults";
import SiteManagerAccountMain from "./accounts/owner-accounts/SiteManagerAccountMain";
import CreateOwnerAccount from "./accounts/owner-accounts/site-manager-account/create/CreateOwnerAccount";
import SiteCreateMain from "./accounts/owner-accounts/sites-main/create/SiteCreateMain";
import SiteManagerDetailsMain from "./accounts/owner-accounts/sites-main/view/SiteManagerDetailsMain";
import SiteOwnerDetailMain from "./accounts/owner-accounts/site-manager-account/view/SiteOwnerDetailMain";
import CreateCustomerOwnerAccount from "./accounts/customer-owner-account/create/CreateCustomerOwnerAccount";
import CustomerAccountMain from "./accounts/customer-account/CustomerAccountMain";
import CreateCustomerAccount from "./accounts/customer-account/create/CreateCustomerAccount";
import CustomerAccountDetail from "./accounts/customer-account/view/CustomerAccountDetail";
import ContactMain from "./contacts/ContactMain";
import ContactDetail from "./contacts/view/ContactDetail";
import CreateContact from "./contacts/create/CreateContact";
import AccountContact from "./Menu/AccountContact";
import Sales from "./Menu/Sales";
import Operations from "./Menu/Operations";
import Management from "./Menu/Management";
import Vehicles from "./management/fleet/Vehicles";
import CreateVehiclePackagesMain from "./management/fleet/vehicle-package-main/create/CreateVehiclePackagesMain";
import VehiclePackagesViewMain from "./management/fleet/view/vehicles-packages-view/VehiclePackagesViewMain";
import VehiclePackagesGroupMain
    from "./management/fleet/view/vehicles-packages-view/vehicle-packages-group/VehiclePackagesGroupMain";
import VehiclesViewMain from "./management/fleet/view/vehicles/VehiclesViewMain";
import CreateVehicleGroupMain from "./management/fleet/vehicle-group-create/CreateVehicleGroupMain";
import createFleetKitMain from "./management/fleet/fleet-kit-create/CreateFleetKitMain";
import VehiclesDetailsCreateMain from "./management/fleet/Vehicles-details-main-create/VehiclesDetailsCreateMain";
import Labor from "./management/labor/Labor";
import LaborView from "./management/labor/LaborView";
import EmployeeView from "./management/labor/EmployeeView";
import CreateLaborGroupMain from "./management/labor/Create/CreateLaborGroupMain";
import CreateLaborNewEmployeeMain from "./management/labor/Create/CreateLaborNewEmployeeMain";
import Inventory from "./management/inventory/Inventory";
import CreateInventoryPackagesMain
    from "./management/inventory/inventory-packages-main/create/CreateInventoryPackagesMain";
import InventoryPackagesViewMain from "./management/inventory/view/inventory-packages-view/InventoryPackagesViewMain";
import CreateInventoryGroupsMain from "./management/inventory/Inventory-groups/CreateInventoryGroupsMain";
import InventoryGroupViewMain from "./management/inventory/view/inventory-group-view/InventoryGroupViewMain";
import CreateInventoryItemsMain from "./management/inventory/inventory-items/CreateInventoryItemsMain";
import InventoryItemsViewMain from "./management/inventory/view/inventory-items-view/InventoryItemsViewMain";
import InventoryKitsCreateMain from "./management/inventory/inventory-kits/create/InventoryKitsCreateMain";
import InventoryKitsViewMain from "./management/inventory/inventory-kits/view/InventoryKitsViewMain";
import InventoryPackagesGroup from "./management/inventory/view/inventory-packages-view/InventoryPackagesGroup";
import SupplyTools from "./management/supply-packages/SupplyTools";
import CreateSupplyPackageMain from "./management/supply-packages/supply-package-main/create/CreateSupplyPackageMain";
import CreateSupplyGroupMain from "./management/supply-packages/supply-group/CreateSupplyGroupMain";
import CreateSupplySmallToolsMain from "./management/supply-packages/supply-small-tools/CreateSupplySmallToolsMain";
import SupplyPackageViewMain from "./management/supply-packages/view/supply-package-view/SupplyPackageViewMain";
import SupplyGroupTabs from "./management/supply-packages/view/supply-package-view/SupplyGroupTabs";
import SupplySmallToolsViewMain
    from "./management/supply-packages/view/supply-small-tools-view/SupplySmallToolsViewMain";
import CreateLineItemPackagesMain from "./management/service/family/create/CreateLineItemPackagesMain";
import LineItemsPackagesMain from "./management/service/view/LineItemsPackagesMain";
import LineItemsViewMain from "./management/service/view/LineItemsViewMain";
import LineItems from "./management/service/LineItems";
import Accounting from "./Menu/Accounting";
import ProposalMain from "./proposal/ProposalMain";
import ProposalCreateMain from "./proposal/create/ProposalCreateMain";
import ProposalViewMain from "./proposal/View/ProposalViewMain";
import Disposal from "./management/disposal/Disposal";
import CreateDisposalFamilyMain from "./management/disposal/disposal-family/CreateDisposalFamilyMain";
import DisposalFamilyViewMain from "./management/disposal/disposal-family/view/DisposalFamilyViewMain";
import CreateDisposalMain from "./management/disposal/disposal-item/CreateDisposalMain";
import DisposalViewItemMain from "./management/disposal/disposal-item/DisposalViewItemMain";
import PriceLookup from "./price-lookup/PriceLookup";
import {Route} from "react-router-dom";
import vendorAccountsMain from "./accounts/vendor-account/vendorAccountsMain";
import CreateVendorAccount from "./accounts/vendor-account/CreateVendorAccount";
import VendorAccountViewMain from "./accounts/vendor-account/VendorAccountViewMain";
import OperationsProjects from "./operations/projects/OperationsProjects";
import ProjectsViewMain from "./operations/projects/ProjectsViewMain";
import ProjectsCreateMain from "./operations/projects/ProjectsCreateMain";
import OperationsWorkOrder from "./operations/work-order/OperationsWorkOrder";
import OperationsWorkOrderCreateMain from "./operations/work-order/OperationsWorkOrderCreateMain";
import WorkOrderViewMain from "./operations/work-order/WorkOrderViewMain";
import OperationsDispatch from "./operations/dispatch/OperationsDispatch";
import FleetKitViewMain from "./management/fleet/fleet-kit-create/view/fleetkit/FleetKitViewMain";
import InvoicingMain from "./accounting/invoicing/InvoicingMain";
import CreateInvoicingMain from "./accounting/invoicing/create/CreateInvoicingMain";
import InvoicingViewMain from "./accounting/invoicing/view/InvoicingViewMain";

function Main() {
    return (
        <React.Fragment>
            <SideBar/>
            <CustomHeader/>
            <Route exact path={routes.dashboard.self} component={DashboardNew}/>
            <Route
                exact
                path={routes.dashboard.opportunities.self}
                component={OpportunitiesDashboard}
            />
            <Route
                exact
                path={routes.dashboard.opportunities.create}
                component={CreateOpportunityForm}
            />
            <Route
                exact
                path={routes.dashboard.opportunities.edit}
                component={CreateOpportunityForm}
            />
            <Route
                exact
                path={routes.dashboard.opportunities.view}
                component={OpportunityDetail}
            />
            <Route
                exact
                path={routes.dashboard.global_search}
                component={SearchResults}
            />

            <Route
                exact
                path={routes.dashboard.owner_account.self}
                component={SiteManagerAccountMain}
            />
            <Route
                exact
                path={routes.dashboard.owner_account.create}
                component={CreateOwnerAccount}
            />
            <Route
                exact
                path={routes.dashboard.owner_account.site_account.create}
                component={SiteCreateMain}
            />
            <Route
                exact
                path={routes.dashboard.owner_account.site_account.edit}
                component={SiteCreateMain}
            />
            <Route
                exact
                path={routes.dashboard.owner_account.site_account.view}
                component={SiteManagerDetailsMain}
            />
            <Route
                exact
                path={routes.dashboard.owner_account.edit}
                component={CreateOwnerAccount}
            />
            <Route
                exact
                path={routes.dashboard.owner_account.view}
                component={SiteOwnerDetailMain}
            />

            <Route
                exact
                path={routes.dashboard.customer_owner_account}
                component={CreateCustomerOwnerAccount}
            />

            <Route
                exact
                path={routes.dashboard.customer_account.self}
                component={CustomerAccountMain}
            />
            <Route
                exact
                path={routes.dashboard.customer_account.create}
                component={CreateCustomerAccount}
            />
            <Route
                exact
                path={routes.dashboard.customer_account.edit}
                component={CreateCustomerAccount}
            />
            <Route
                exact
                path={routes.dashboard.customer_account.view}
                component={CustomerAccountDetail}
            />

            <Route
                exact
                path={routes.dashboard.vendor_account.self}
                component={vendorAccountsMain}
            />
            <Route
                exact
                path={routes.dashboard.vendor_account.create}
                component={CreateVendorAccount}
            />
            <Route
                exact
                path={routes.dashboard.vendor_account.edit}
                component={CreateVendorAccount}
            />
                <Route
                exact
                path={routes.dashboard.vendor_account.view}
                component={VendorAccountViewMain}
            />
            <Route
                exact
                path={routes.dashboard.contacts.self}
                component={ContactMain}
            />
            <Route
                exact
                path={routes.dashboard.contacts.view}
                component={ContactDetail}
            />
            <Route
                exact
                path={routes.dashboard.contacts.create}
                component={CreateContact}
            />
            <Route
                exact
                path={routes.dashboard.contacts.edit}
                component={CreateContact}
            />
            <Route
                exact
                path={routes.dashboard.account_contact}
                component={AccountContact}
            />
            <Route exact path={routes.dashboard.sales.self} component={Sales}/>

            <Route exact path={routes.dashboard.operations.self} component={Operations}/>
            <Route exact path={routes.dashboard.operations.projects.self} component={OperationsProjects}/>
            <Route exact path={routes.dashboard.operations.projects.view} component={ProjectsViewMain}/>
            <Route exact path={routes.dashboard.operations.projects.create} component={ProjectsCreateMain}/>
            <Route exact path={routes.dashboard.operations.projects.edit} component={ProjectsCreateMain}/>
            <Route exact path={routes.dashboard.operations.work_order.self} component={OperationsWorkOrder}/>
            <Route exact path={routes.dashboard.operations.work_order.create} component={OperationsWorkOrderCreateMain}/>
            <Route exact path={routes.dashboard.operations.work_order.edit} component={OperationsWorkOrderCreateMain}/>
            <Route exact path={routes.dashboard.operations.work_order.view} component={WorkOrderViewMain}/>

            <Route exact path={routes.dashboard.operations.dispatch.self} component={OperationsDispatch}/>

            <Route
                exact
                path={routes.dashboard.management.self}
                component={Management}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.self}
                component={Vehicles}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.fleet_family.create}
                component={CreateVehiclePackagesMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.fleet_family.edit}
                component={CreateVehiclePackagesMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.fleet_family.view}
                component={VehiclePackagesViewMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.groups.view}
                component={VehiclePackagesGroupMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.vehicle.view}
                component={VehiclesViewMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.kit.view}
                component={FleetKitViewMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.groups.create}
                component={CreateVehicleGroupMain}
            />
            <Route 
                exact
                path={routes.dashboard.management.fleet.kit.create}
                component={createFleetKitMain}
            />
            <Route 
                exact
                path={routes.dashboard.management.fleet.kit.edit}
                component={createFleetKitMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.groups.edit}
                component={CreateVehicleGroupMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.vehicle.create}
                component={VehiclesDetailsCreateMain}
            />
            <Route
                exact
                path={routes.dashboard.management.fleet.vehicle.edit}
                component={VehiclesDetailsCreateMain}
            />

            <Route
                exact
                path={routes.dashboard.management.labor.self}
                component={Labor}
            />
            <Route
                exact
                path={routes.dashboard.management.labor.labor_group.view}
                component={LaborView}
            />
            <Route
                exact
                path={routes.dashboard.management.labor.employee.view}
                component={EmployeeView}
            />
            <Route
                exact
                path={routes.dashboard.management.labor.labor_group.create}
                component={CreateLaborGroupMain}
            />
            <Route
                exact
                path={routes.dashboard.management.labor.labor_group.edit}
                component={CreateLaborGroupMain}
            />
            <Route
                exact
                path={routes.dashboard.management.labor.employee.create}
                component={CreateLaborNewEmployeeMain}
            />
            <Route
                exact
                path={routes.dashboard.management.labor.employee.edit}
                component={CreateLaborNewEmployeeMain}
            />

            <Route
                exact
                path={routes.dashboard.management.inventory.self}
                component={Inventory}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_packages.create}
                component={CreateInventoryPackagesMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_packages.edit}
                component={CreateInventoryPackagesMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_packages.view}
                component={InventoryPackagesViewMain}
            />

            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_groups.create}
                component={CreateInventoryGroupsMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_groups.view}
                component={InventoryGroupViewMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_groups.edit}
                component={CreateInventoryGroupsMain}
            />

            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_items.create}
                component={CreateInventoryItemsMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_items.edit}
                component={CreateInventoryItemsMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_items.view}
                component={InventoryItemsViewMain}
            />

            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_kits.create}
                component={InventoryKitsCreateMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_kits.edit}
                component={InventoryKitsCreateMain}
            />
            <Route
                exact
                path={routes.dashboard.management.inventory.inventory_kits.view}
                component={InventoryKitsViewMain}
            />
            <Route
                exact
                path={"/dashboard/management/inventory/inventory-items/groups/view/"}
                component={InventoryPackagesGroup}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.self}
                component={SupplyTools}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_packages.create}
                component={CreateSupplyPackageMain}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_packages.edit}
                component={CreateSupplyPackageMain}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_groups.create}
                component={CreateSupplyGroupMain}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_groups.edit}
                component={CreateSupplyGroupMain}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_tools.create}
                component={CreateSupplySmallToolsMain}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_tools.edit}
                component={CreateSupplySmallToolsMain}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_packages.view}
                component={SupplyPackageViewMain}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_groups.view}
                component={SupplyGroupTabs}
            />
            <Route
                exact
                path={routes.dashboard.management.supply_tools.supply_tools.view}
                component={SupplySmallToolsViewMain}
            />

            <Route
                exact
                path={routes.dashboard.management.service.family.create}
                component={CreateLineItemPackagesMain}
            />
            <Route
                exact
                path={routes.dashboard.management.service.family.edit}
                component={CreateLineItemPackagesMain}
            />
            <Route
                exact
                path={routes.dashboard.management.service.family.view}
                component={LineItemsPackagesMain}
            />
            <Route
                exact
                path={routes.dashboard.management.service.line_items.view}
                component={LineItemsViewMain}
            />

            <Route
                exact
                path={routes.dashboard.management.service.self}
                component={LineItems}
            />
            <Route exact path={routes.dashboard.accounting.self} component={Accounting}/>
            <Route exact path={routes.dashboard.accounting.invoicing.self} component={InvoicingMain}/>
            <Route exact path={routes.dashboard.accounting.invoicing.create} component={CreateInvoicingMain}/>
            <Route exact path={routes.dashboard.accounting.invoicing.edit} component={CreateInvoicingMain}/>
            <Route exact path={routes.dashboard.accounting.invoicing.view} component={InvoicingViewMain}/>

            <Route
                exact
                path={routes.dashboard.sales.proposal.self}
                component={ProposalMain}
            />
            <Route
                exact
                path={routes.dashboard.sales.proposal.create}
                component={ProposalCreateMain}
            />
            <Route
                exact
                path={routes.dashboard.sales.proposal.edit}
                component={ProposalCreateMain}
            />
            <Route
                exact
                path={routes.dashboard.sales.proposal.view}
                component={ProposalViewMain}
            />

            <Route
                exact
                path={routes.dashboard.management.disposal.self}
                component={Disposal}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal.family.create}
                component={CreateDisposalFamilyMain}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal.family.edit}
                component={CreateDisposalFamilyMain}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal.family.view}
                component={DisposalFamilyViewMain}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal.items.create}
                component={CreateDisposalMain}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal.items.edit}
                component={CreateDisposalMain}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal.items.view}
                component={DisposalViewItemMain}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal_inventory.view}
                component={DisposalViewItemMain}
            />
            <Route
                exact
                path={routes.dashboard.management.disposal_inventory.family.view}
                component={DisposalFamilyViewMain}
            />
            <Route
                exact
                path={routes.dashboard.sales.price_lookup.self}
                component={PriceLookup}
            />
        </React.Fragment>
    )
}

export default Main;

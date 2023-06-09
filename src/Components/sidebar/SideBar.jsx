import React, { Component } from "react";
import { Image as Images } from "../Images";
import { Button, Collapse } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { connect } from "react-redux";
import { setSidebarKey } from "../../Store/actions/sidebarAction";
import { checkActiveKey, isAccessible, isDomainAccessible, Role } from "../../Controller/utils";

const { Panel } = Collapse;

let newActiveKey = "";

class SideBar extends Component {
  state = {
    activeKey: "",
    BETA_SERVER: false,
  };


  componentDidMount() {
    // if(window.location?.href.includes('demo')) {
    //   this.setState({BETA_SERVER: true})
    // }
  }
  onPanelChange = (key) => {
    this.props.setSidebarKey(key);
    switch (key) {
      case "1":
        history.push(routes.dashboard.account_contact);
        return;

      case "2":
        history.push(routes.dashboard.sales.self);
        return;

      case "3":
        history.push(routes.dashboard.operations.self);
        return;

      case "4":
        history.push(routes.dashboard.management.self);
        return;

      case "5":
        history.push(routes.dashboard.accounting.self);
        return;

      case "6":
        history.push(routes.dashboard.self);
        return;

      case "7":
        history.push(routes.dashboard.self);
        return;

      default:
    }
  };
  checkActive = (key) => {
    let { pathname } = this.props.location;
    switch (key) {
      case 1:
        return pathname === "/dashboard/account-contact/";
      case 2:
        return pathname === "/dashboard/sales/";
      case 3:
        return pathname === "/dashboard/operations/";
      case 4:
        return pathname === "/dashboard/management/";
      case 5:
        return pathname === "/dashboard/accounting/";
      case 6:
        return pathname === "/dashboard/analytics/";
      case 7:
        return pathname === "/dashboard/data-management/";
      case 8:
      default:
        return false;
    }
  };

  toggleSidebar = () => {
    let ele = document.getElementById("app_main");
    if (ele.classList.contains("small-sidebar")) {
      ele.classList.remove("small-sidebar");
    } else {
      ele.classList.add("small-sidebar");
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.sidebar.key !== this.props.sidebar.key) {
      newActiveKey = checkActiveKey(this.props.match.path);
      this.setState({ activeKey: newActiveKey });
    }
  }

  render() {
    const {BETA_SERVER} = this.state;
    return (
      <React.Fragment>
        <div className="sidebar-main-div position-fixed h-100">
          <div className="row mx-0 sticky-section-row">
            <Button
              onClick={this.toggleSidebar}
              className="menu-fold-btn bg-transparent border-0 p-0 position-absolute"
            >
              <img
                src={Images.menu_fold_icon}
                alt="menu_fold_icon"
                className="img-fluid collapse-icon-close"
              />
              <img
                src={Images.collapse_icon_open}
                alt="menu_fold_icon"
                className="img-fluid collapse-icon-open"
              />
            </Button>
            <div className="col-12 logo-div-sidebar text-center">
              <NavLink to={routes.dashboard.self} className="d-inline-block">
                <img
                  className="img-fluid"
                  src={Images.logo_fav_sidebar}
                  alt={"sidebar logo img"}
                />
              </NavLink>
            </div>
            <div className="col-12 sidebar-nav-links-div">
              {/* {BETA_SERVER &&
                <div className="beta-heading beta-heading-sidebar mt-0">
                   Demo
                </div>
                } */}
                 {isDomainAccessible(['lab']) &&
                <div className="beta-heading beta-heading-sidebar mt-0">
                   Lab
                </div>
                }
                 {isDomainAccessible(['product']) &&
                <div className="beta-heading beta-heading-sidebar mt-0">
                   Product
                </div>
                }
              <ul className="list-inline sidebar-ul-main">
                <li onClick={() => this.props.setSidebarKey(undefined)}>
                  <NavLink
                    exact
                    to={routes.dashboard.self}
                    className="nav-link-tag d-flex align-items-center"
                  >
                    <span className="nav-icons-tag float-left" />
                    <span className="nav-details-tag float-left">
                      Dashboard
                    </span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="row mx-0 scroll-section-row">
            <div className="col-12 p-0">
              <Collapse
                activeKey={this.props.sidebar.key || undefined}
                accordion
                className="collapse-sidebar-main"
                onChange={this.onPanelChange}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  className={
                    this.checkActive(1)
                      ? "active"
                      // : this.state.activeKey == 1
                      // ? "active"
                      : ""
                  }
                  header={
                    <div className="nav-collapse-card-inn">
                      <span className="sidebar-user-icon account-icon-sidebar" />
                      <span className="nav-details-tag float-left">
                        Accounts & Contacts
                      </span>
                    </div>
                  }
                  key="1"
                >
                  <ul className="list-inline">
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.owner_account.self}
                      >
                        <span className="nav-details-tag float-left">
                          Site Manager Accounts
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.customer_account.self}
                      >
                        <span className="nav-details-tag float-left">
                          Billing Accounts
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.vendor_account.self}
                      >
                        <span className="nav-details-tag float-left">
                          Vendor Accounts
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.contacts.self}
                      >
                        <span className="nav-details-tag float-left">
                          Contacts
                        </span>
                      </NavLink>
                    </li>
                  </ul>
                </Panel>

                <Panel
                  className={
                    this.checkActive(2)
                      ? "active"
                      // : this.state.activeKey == 2
                      // ? "active"
                      : ""
                  }
                  header={
                    <div className="nav-collapse-card-inn">
                      <span className="sidebar-user-icon sales-sidebar-icon" />
                      <span className="nav-details-tag float-left">Sales</span>
                    </div>
                  }
                  key="2"
                >
                  <ul className="list-inline">
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.opportunities.self}
                      >
                        <span className="nav-details-tag float-left">
                          Opportunities
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.sales.proposal.self}
                      >
                        <span className="nav-details-tag float-left">
                          Proposals
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.sales.price_lookup.self}
                      >
                        <span className="nav-details-tag float-left">
                          Price Lookup
                        </span>
                      </NavLink>
                    </li>
                  </ul>
                </Panel>

                <Panel
                  className={this.checkActive(3) ? "active" : ""}
                  header={
                    <div className="nav-collapse-card-inn">
                      <span className="sidebar-user-icon operations-sidebar-icon" />
                      <span className="nav-details-tag float-left">
                        Operations
                      </span>
                    </div>
                  }
                  key="3"
                >
                  <ul className="list-inline">
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.operations.projects.self}
                      >
                        <span className="nav-details-tag float-left">
                          Projects
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.operations.work_order.self}
                      >
                        <span className="nav-details-tag float-left">
                          Work Orders
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag nav-icons-tag-2 d-flex align-items-center"
                        to={routes.dashboard.operations.dispatch.self}
                      >
                        <span className="nav-details-tag float-left">
                          Dispatch
                        </span>
                      </NavLink>
                    </li>
                    {isAccessible(['ADMIN']) &&
                    <>
                    <li>
                      <NavLink
                        className="nav-link-tag nav-icons-tag-2 d-flex align-items-center"
                        to={""}
                      >
                        <span className="nav-details-tag float-left">
                          Warehouse Management
                        </span>
                      </NavLink>
                    </li>
                    </>
                    }
                  </ul>
                </Panel>
                {isAccessible(['ADMIN']) &&
                <>
                <Panel
                  className={
                    this.checkActive(4)
                      ? "active"
                      // : this.state.activeKey == 4
                      // ? "active"
                      : ""
                  }
                  header={
                    <div className="nav-collapse-card-inn">
                      <span className="sidebar-user-icon managements-sidebar-icon" />
                      <span className="nav-details-tag float-left">
                        Management
                      </span>
                    </div>
                  }
                  key="4"
                >
                  <ul className="list-inline">
                    <li>
                      <NavLink
                        className="nav-link-tag nav-icons-tag-2 d-flex align-items-center"
                        to={routes.dashboard.management.service.self}
                      >
                        <span className="nav-details-tag float-left">
                          Services
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.management.labor.self}
                      >
                        <span className="nav-details-tag float-left">
                          Labor
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.management.fleet.self}
                      >
                        <span className="nav-details-tag float-left">
                          Fleet
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag nav-icons-tag-2 d-flex align-items-center"
                        to={routes.dashboard.management.supply_tools.self}
                      >
                        <span className="nav-details-tag float-left">
                          Supplies/Small Tools
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag nav-icons-tag-2 d-flex align-items-center"
                        to={routes.dashboard.management.inventory.self}
                      >
                        <span className="nav-details-tag float-left">
                          Inventory
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="nav-link-tag nav-icons-tag-2 d-flex align-items-center"
                        to={routes.dashboard.management.disposal.self}
                      >
                        <span className="nav-details-tag float-left">
                          Disposal
                        </span>
                      </NavLink>
                    </li>
                  </ul>
                </Panel>

                <Panel
                  className={this.checkActive(5) ? "active" : ""}
                  header={
                    <div className="nav-collapse-card-inn">
                      <span className="sidebar-user-icon accounting-sidebar-icon" />
                      <span className="nav-details-tag float-left">
                        Accounting
                      </span>
                    </div>
                  }
                  key="5"
                >
                  <ul className="list-inline">
                    <li>
                      <NavLink
                        className="nav-link-tag d-flex align-items-center"
                        to={routes.dashboard.accounting.invoicing.self}
                      >
                        <span className="nav-details-tag float-left">
                          Invoicing
                        </span>
                      </NavLink>
                    </li>
                  </ul>
                </Panel>
                <Panel
                  collapsible="disabled"
                  className={`${this.checkActive(6) ? "active" : ""}`}
                  header={
                    <div className="nav-collapse-card-inn">
                      <span className="sidebar-user-icon analytics-sidebar-icon" />
                      <span className="nav-details-tag float-left">
                        Analytics
                      </span>
                    </div>
                  }
                  key="6"
                >
                  {/*<ul className="list-inline">*/}
                  {/*    <li>*/}
                  {/*        <NavLink className="nav-link-tag d-flex align-items-center"*/}
                  {/*                 to={"/opportunities/"}>*/}
                  {/*            <span className="nav-details-tag float-left">Accounts Receivables</span>*/}
                  {/*        </NavLink>*/}
                  {/*    </li>*/}
                  {/*</ul>*/}
                </Panel>

                <Panel
                  collapsible="disabled"
                  className={`${this.checkActive(7) ? "active" : ""}`}
                  header={
                    <div className="nav-collapse-card-inn">
                      <span className="sidebar-user-icon data-management-sidebar-icon" />
                      <span className="nav-details-tag float-left">
                        Data Management
                      </span>
                    </div>
                  }
                  key="7"
                >
                  {/*<ul className="list-inline">*/}
                  {/*    <li>*/}
                  {/*        <NavLink className="nav-link-tag d-flex align-items-center"*/}
                  {/*                 to={"/opportunities/"}>*/}
                  {/*            <span className="nav-details-tag float-left">Accounts Receivables</span>*/}
                  {/*        </NavLink>*/}
                  {/*    </li>*/}
                  {/*</ul>*/}
                </Panel>
                </>
              }
              </Collapse>

              {/*<ul className="list-inline">*/}
              {/*    <li>*/}
              {/*        <NavLink className="nav-link-tag d-flex align-items-center" to={" "}>*/}
              {/*            <span className="nav-icons-tag float-left">*/}
              {/*                <img src={Images.proposals_gray_icon} alt=""*/}
              {/*                     className="img-fluid icon-gray"/>*/}
              {/*            </span>*/}
              {/*            <span className="nav-details-tag float-left">Proposals</span>*/}
              {/*        </NavLink>*/}
              {/*    </li>*/}
              {/*</ul>*/}
            </div>
          </div>
          {/*<Button*/}
          {/*    className="pull-left-pull-right-btn d-flex align-items-center justify-content-center border-0 position-absolute">*/}
          {/*    <img src={Images.pull_push_icon} className="img-fluid" alt="arrow left icon"/>*/}
          {/*</Button>*/}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { sidebar: state.sidebar };
};
export default connect(mapStateToProps, { setSidebarKey })(withRouter(SideBar));

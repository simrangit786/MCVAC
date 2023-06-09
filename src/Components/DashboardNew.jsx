import React, { Component } from "react";
import { routes } from "../Controller/Routes";
import { Image as Images } from "./Images";
import { history } from "../Controller/history";
import { Role } from "../Controller/utils";

class DashboardNew extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mt-4 mx-0 opportunities-table-main-dashboard">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                    onClick={() =>
                      history.push(routes.dashboard.account_contact)
                    }
                    className="shade-card-main-div dashboard-card-new row mx-0 cursor-pointer"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.account_white_icon_db}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Accounts & Contacts</h5>
                            <h6 className="mb-0">
                              Billing, Site Manager, Vendor Accounts and Contacts
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                    onClick={() => history.push(routes.dashboard.sales.self)}
                    className="shade-card-main-div dashboard-card-new row mx-0 cursor-pointer"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.sales_white_icon_db}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Sales</h5>
                            <h6 className="mb-0">
                              Opportunities and Proposals
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                    onClick={() => history.push(routes.dashboard.operations.self)}
                    className="shade-card-main-div dashboard-card-new row mx-0 cursor-pointer"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.work_order_white_icon_db}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Operations</h5>
                            <h6 className="mb-0">
                              Projects, Work Orders, Dispatch, and Warehouse Management
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Role allow={['ADMIN']}>
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                    onClick={() =>
                      history.push(routes.dashboard.management.self)
                    }
                    className="shade-card-main-div dashboard-card-new row mx-0 cursor-pointer"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.management_white_icon_db}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Management</h5>
                            <h6 className="mb-0">
                              Services, Labor, Fleet, Supplies / Small Tools, Inventory, and Disposal {" "}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                    disabled={true}
                    className="shade-card-main-div shade-card-inactive-section dashboard-card-new mx-0 row"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.accounting_white_icon_db}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left position-relative">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Accounting</h5>
                            <h6 className="mb-0">
                              Short description of this section
                            </h6>
                          </div>
                        </div>
                        <div className="coming-soon-div d-flex align-items-center m-auto">
                          Coming Soon
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                    disabled={true}
                    className="shade-card-main-div shade-card-inactive-section dashboard-card-new mx-0 row"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.analytics_white_icon_db}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left position-relative">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Analytics</h5>
                            <h6 className="mb-0">
                              Short description of this section
                            </h6>
                          </div>
                        </div>
                        <div className="coming-soon-div d-flex align-items-center m-auto">
                          Coming Soon
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                    disabled={true}
                    className="shade-card-main-div shade-card-inactive-section dashboard-card-new mx-0 row"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.data_white_icon_db}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left position-relative">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Data Management</h5>
                            <h6 className="mb-0">
                              Short description of this section
                            </h6>
                          </div>
                        </div>
                        <div className="coming-soon-div d-flex align-items-center m-auto">
                          Coming Soon
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </Role>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DashboardNew;

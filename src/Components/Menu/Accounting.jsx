import React, { Component } from "react";
import { Image as Images } from "../Images";
import {routes} from "../../Controller/Routes";
import {history} from "../../Controller/history";

class Accounting extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mt-4 mx-0 opportunities-table-main-dashboard">
            <div className="col-12">
              <div className="row">
                {/*<div className="col-12 col-sm-12 col-md-6">*/}
                {/*  <div*/}
                {/*    className="shade-card-main-div shade-card-inactive-section row mx-0"*/}
                {/*    disabled={true}*/}
                {/*  >*/}
                {/*    <div className="col-12 p-0">*/}
                {/*      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">*/}
                {/*        primary-icons-img*/}
                {/*        <img src={Images.AR} alt={""}*/}
                {/*             className="img-fluid"/>*/}

                {/*        inactive-icon-img*/}
                {/*        <img src={Images.AR} alt={""} className="img-fluid" />*/}
                {/*      </div>*/}
                {/*      <div className="card-content-section float-left position-relative">*/}
                {/*        <div className="row">*/}
                {/*          <div className="col-12">*/}
                {/*            <h5 className="mb-0">Accounts Receivables</h5>*/}
                {/*            <h6 className="mb-0">*/}
                {/*              Short description of this section*/}
                {/*            </h6>*/}
                {/*          </div>*/}
                {/*        </div>*/}
                {/*        <div className="coming-soon-div d-flex align-items-center m-auto">*/}
                {/*          Coming Soon*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                {/*<div className="col-12 col-sm-12 col-md-6">*/}
                {/*  <div*/}
                {/*    onClick={() =>*/}
                {/*      history.push(routes.dashboard.owner_account.self)*/}
                {/*    }*/}
                {/*    className="shade-card-main-div row mx-0 cursor-pointer"*/}
                {/*  >*/}
                {/*    <div className="col-12 p-0">*/}
                {/*      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">*/}
                {/*        <img src={Images.AP} alt={""} className="img-fluid" />*/}
                {/*      </div>*/}
                {/*      <div className="card-content-section float-left">*/}
                {/*        <div className="row">*/}
                {/*          <div className="col-12">*/}
                {/*            <h5 className="mb-0">Accounts Payables</h5>*/}
                {/*            <h6 className="mb-0">*/}
                {/*              Short description of this section*/}
                {/*            </h6>*/}
                {/*          </div>*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                <div className="col-12 col-sm-12 col-md-6">
                  <div
                      onClick={()=>history.push(routes.dashboard.accounting.invoicing.self)}
                    className="shade-card-main-div row mx-0 cursor-pointer">
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        {/*primary-icons-img*/}
                        <img src={Images.Cash} alt={""}
                             className="img-fluid"/>

                        {/*inactive-icon-img*/}
                        {/*<img src={Images.Cash} alt={""} className="img-fluid" />*/}
                      </div>
                      <div className="card-content-section float-left position-relative">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Invoicing</h5>
                            <h6 className="mb-0">
                              Short description of this section
                            </h6>
                          </div>
                        </div>
                        {/*<div className="coming-soon-div d-flex align-items-center m-auto">*/}
                        {/*  Coming Soon*/}
                        {/*</div>*/}
                      </div>
                    </div>
                  </div>
                </div>
                {/*<div className="col-12 col-sm-12 col-md-6">*/}
                {/*  <div*/}
                {/*    className="shade-card-main-div shade-card-inactive-section row mx-0"*/}
                {/*    disabled={true}*/}
                {/*  >*/}
                {/*    <div className="col-12 p-0">*/}
                {/*      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">*/}
                {/*        primary-icons-img*/}
                {/*        <img src={Images.Inventory} alt={""}*/}
                {/*             className="img-fluid"/>*/}

                {/*        inactive-icon-img*/}
                {/*        <img*/}
                {/*          src={Images.Inventory}*/}
                {/*          alt={""}*/}
                {/*          className="img-fluid"*/}
                {/*        />*/}
                {/*      </div>*/}
                {/*      <div className="card-content-section float-left position-relative">*/}
                {/*        <div className="row">*/}
                {/*          <div className="col-12">*/}
                {/*            <h5 className="mb-0">Inventory</h5>*/}
                {/*            <h6 className="mb-0">*/}
                {/*              Short description of this section*/}
                {/*            </h6>*/}
                {/*          </div>*/}
                {/*        </div>*/}
                {/*        <div className="coming-soon-div d-flex align-items-center m-auto">*/}
                {/*          Coming Soon*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                {/*<div className="col-12 col-sm-12 col-md-6">*/}
                {/*  <div*/}
                {/*    className="shade-card-main-div shade-card-inactive-section row mx-0"*/}
                {/*    disabled={true}*/}
                {/*  >*/}
                {/*    <div className="col-12 p-0">*/}
                {/*      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">*/}
                {/*        primary-icons-img*/}
                {/*        <img src={Images.Reports} alt={""}*/}
                {/*             className="img-fluid"/>*/}

                {/*        inactive-icon-img*/}
                {/*        <img*/}
                {/*          src={Images.Reports}*/}
                {/*          alt={""}*/}
                {/*          className="img-fluid"*/}
                {/*        />*/}
                {/*      </div>*/}
                {/*      <div className="card-content-section float-left position-relative">*/}
                {/*        <div className="row">*/}
                {/*          <div className="col-12">*/}
                {/*            <h5 className="mb-0">Reports</h5>*/}
                {/*            <h6 className="mb-0">*/}
                {/*              Short description of this section*/}
                {/*            </h6>*/}
                {/*          </div>*/}
                {/*        </div>*/}
                {/*        <div className="coming-soon-div d-flex align-items-center m-auto">*/}
                {/*          Coming Soon*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
                {/*<div*/}
                {/*  onClick={() => history.push(routes.dashboard.contacts.self)}*/}
                {/*  className="col-12 col-sm-12 col-md-6 cursor-pointer"*/}
                {/*>*/}
                {/*  <div className="shade-card-main-div row mx-0">*/}
                {/*    <div className="col-12 p-0">*/}
                {/*      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">*/}
                {/*        <img*/}
                {/*          src={Images.ChartOfAccounts}*/}
                {/*          alt={""}*/}
                {/*          className="img-fluid"*/}
                {/*        />*/}
                {/*      </div>*/}
                {/*      <div className="card-content-section float-left">*/}
                {/*        <div className="row">*/}
                {/*          <div className="col-12">*/}
                {/*            <h5 className="mb-0">Chart of Accounts</h5>*/}
                {/*            <h6 className="mb-0">*/}
                {/*              Short description of this section*/}
                {/*            </h6>*/}
                {/*          </div>*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Accounting;

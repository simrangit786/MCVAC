import React, { Component } from "react";
import { Image as Images } from "../Images";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../Store/actions/breadcrumbAction";

class AccountContact extends Component {
  componentDidMount() {
    let arr = [
      {
        title: "Accounts & Contacts",
        url: routes.dashboard.account_contact,
      },
    ];
    this.props.setBreadcrumb(arr);
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mt-4 mx-0 opportunities-table-main-dashboard">
            <div className="col-12">
              <div className="row">
                <div
                  onClick={() =>
                    history.push(routes.dashboard.customer_account.self)
                  }
                  className="col-12 col-sm-12 col-md-6 cursor-pointer"
                >
                  <div className="shade-card-main-div mx-0 row">
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.green_shade_customer_img}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Billing Accounts</h5>
                            <h6 className="mb-0">
                              Account that pays for the service
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() =>
                    history.push(routes.dashboard.owner_account.self)
                  }
                  className="col-12 col-sm-12 col-md-6 cursor-pointer"
                >
                  <div className="shade-card-main-div row mx-0">
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.owner}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Site Manager Accounts</h5>
                            <h6 className="mb-0">Account that manages sites</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6"
                onClick={() =>
                  history.push(routes.dashboard.vendor_account.self)
                }>
                  <div
                    className="shade-card-main-div row mx-0"
                  >
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img src={Images.Vendor} alt={""}
                          className="img-fluid"/>
                        {/* <img
                          src={Images.vendor_acc_inactive_img}
                          alt={""}
                          className="img-fluid"
                        /> */}
                      </div>
                      <div className="card-content-section float-left position-relative">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Vendor Accounts</h5>
                            <h6 className="mb-0">
                              The account that provides external services
                            </h6>
                          </div>
                        </div>
                        {/* <div className="coming-soon-div d-flex align-items-center m-auto">
                          Coming Soon
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => history.push(routes.dashboard.contacts.self)}
                  className="col-12 col-sm-12 col-md-6 cursor-pointer"
                >
                  <div className="shade-card-main-div row mx-0">
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.Contacts}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Contacts</h5>
                            <h6 className="mb-0">
                              The person who represents an account
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(AccountContact);

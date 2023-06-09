import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/src";
import { routes } from "../../../../../Controller/Routes";
import CustomerOwnerConfirmModal from "../../../../modals/CustomerOwnerConfirmModal";
import { CUSTOMER_OWNER, userTypes } from "../../../../../Controller/userTypes";
import { updateCustomerAccount } from "../../../../../Controller/api/customerAccountServices";
import { withRouter } from "react-router-dom";
import CommonWarningModal from "../../../../modals/CommonWarningModal";

class GeneralInfo extends Component {
  state = {
    visibleConfirm: false,
    visibleWarning: false,
    updated_customer: null,
  };
  updateAccountRole = () => {
    updateCustomerAccount(this.props.match.params.id, {
      account_type: CUSTOMER_OWNER,
    }).then((response) => {
      this.setState({
        visibleConfirm: true,
        visibleWarning: false,
        updated_customer: response.data,
      });
    });
  };
  viewOwner = (id) => {
    history.push(reverse(routes.dashboard.owner_account.view, { id }));
    this.setState({ visibleConfirm: false });
  };
  viewCustomer = (id) => {
    history.push(reverse(routes.dashboard.customer_account.view, { id }));
    this.setState({ visibleConfirm: false });
  };

  render() {
    const { updated_customer } = this.state;
    const customer = this.props.customer;
    var acc_source;
    if (customer && customer.account_source) {
      if (customer.account_source.indexOf("_") != -1) {
        acc_source = customer.account_source.toLowerCase().replace(/_/g, " ");
      } else {
        acc_source = customer.account_source.toLowerCase();
      }
    } else {
      acc_source = "-";
    }
    return (
      <div className="row summary-collapse-inner-row-main">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase ">ACCOUNT NAME</h6>
          <h5 className="text-capitalize font-weight-bold">{customer.name}</h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">ACCOUNT TYPE</h6>
          <h5 className="mb-0 text-capitalize" style={{ minWidth: 350 }}>
            {updated_customer?.account_type === CUSTOMER_OWNER ||
              customer.account_type === CUSTOMER_OWNER ? (
              <div>
                <a className="mr-2 activeRole">{userTypes.CUSTOMER}</a>
                <a
                  className={"nonActiveRole"}
                  onClick={() => {
                    history.push(
                      reverse(routes.dashboard.owner_account.view, {
                        id: customer.id,
                      })
                    );
                  }}
                >
                  {userTypes.SITE_OWNER}
                </a>
              </div>
            ) : (
              <div>
                <span>{userTypes[customer.account_type]}</span>
                <br />
                <span>
                  <button
                    className="create-account mt-2"
                    onClick={() => this.setState({ visibleWarning: true })}
                  // onClick={() => this.updateAccountRole()}
                  >
                    + Site Manager account
                  </button>
                </span>
              </div>
            )}
          </h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">Industry</h6>
          <h5>{customer?.industry?.title || "-"}</h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">Website</h6>
          <h5>
            <a href={`https://${customer?.website}`} target="_blank">
              {customer?.website || <span className="text-dark">-</span>}
            </a>
          </h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">Account Source</h6>
          <h5 className="text-capitalize">{acc_source || "-"}</h5>
        </div>
        {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">Note</h6>
          <h5>{customer?.note || "-"}</h5>
        </div> */}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">Epa Id</h6>
          <h5>{customer?.epa_id || "-"}</h5>
        </div>
        <CustomerOwnerConfirmModal
          heading={
            "You’ve successfully created this Billing & Site Manager account!"
          }
          subHeading={
            <div style={{ paddingLeft: "5%" }}>
              <p className="m-0">
                To view this account as a Billing, select{" "}
                <Button
                  onClick={() => this.viewCustomer(customer.id)}
                  className="border-0 shadow-none p-0 bg-transparent"
                >
                  View as Customer.
                </Button>
              </p>
              <p className="m-0">
                To view this account as a Site Manager, select{" "}
                <Button
                  onClick={() => this.viewOwner(customer.id)}
                  className="border-0 shadow-none p-0 bg-transparent"
                >
                  View as Site Manager.
                </Button>
              </p>
            </div>
          }
          id={customer.id}
          okTitle={"View Site Manager Account"}
          okAction={() =>
            history.push(reverse(routes.dashboard.owner_account.view))
          }
          visible={this.state.visibleConfirm}
          onClose={() => this.setState({ visibleConfirm: false })}
        />
        <CommonWarningModal
          heading={
            "Are you sure you want this account to function as  Billing & Site Manager Account?"
          }
          subHeadingUOM={
            <p
              style={{
                color: "#828282",
                width: "98%",
              }}
            >
              {" "}
              If yes, select “Yes, I would like to”. If no, select “No, go
              back”.
            </p>
          }
          visible={this.state.visibleWarning}
          changeAccountTypeConfirmation
          changeAccountType={() => {
            this.updateAccountRole();
          }}
          onClose={() => this.setState({ visibleWarning: false })}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(withRouter(GeneralInfo));

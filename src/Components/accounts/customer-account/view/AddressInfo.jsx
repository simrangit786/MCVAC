import React, { Component } from "react";
import { Button, Dropdown, Form, Input, message } from "antd";
import { Image as Images } from "../../../Images";
import {
  getCustomerBillingAddress,
  getCustomerMainAddress,
} from "../../../../Controller/api/customerAccountServices";
import { withRouter } from "react-router-dom";
import { formatPhone } from "../../../../Controller/utils";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../Controller/Routes";

class AddressInfo extends Component {
  state = {
    main: null,
    billing: null,
  };

  componentDidMount() {
    getCustomerMainAddress({ account: this.props.match.params.id })
      .then((res) => {
        this.setState({ main: res.data.results[0] });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
    getCustomerBillingAddress({ account: this.props.match.params.id })
      .then((res) => {
        this.setState({ billing: res.data.results[0] });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  }

  handleBillingAddress = () => {
    let { billing } = this.state;

    if(billing && billing?.street_address || billing?.apartment || billing?.county || billing?.city || billing?.state || billing?.zip_code) {
      return true;
    }
    return false

  }

  render() {
    let { main, billing } = this.state;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          {!this.props.hideTitle && (
            <div className="col-12">
              <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
                {!this.props.hideTitle && (
                  <Button
                    className="edit-btn-summary"
                    onClick={() =>
                      history.push({
                        pathname: reverse(
                          routes.dashboard.customer_account.edit,
                          { id: this.props.match.params.id }
                        ),
                        editTab: "3",
                      })
                    }
                  >
                    <img
                      src={Images.pencil_green}
                      alt=""
                      className="img-fluid"
                    />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          )}
          <div className="col-12">
            <div className="row summary-collapse-inner-row-main px-0">
              <div className="col-12">
                {main ? (
                  <div className="row site-details-row-card position-relative">
                    <div className="col-12 col-sm-3 title">
                      <div className="site-name-location">
                        <img
                          src={Images.location_black_icon}
                          alt=""
                          className="img-fluid"
                        />
                        <span>Main Address</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">{`${main.street_address || ""} ${main.apartment || ""} ${main.county || ""} ${main.city || ""} ${main.state || ""} ${main.zip_code || ""} ${main.country || ""}`}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">{main.email || "-"}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">{formatPhone(main.phone) || "-"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="row mx-0 no-data-card-row  bg-transparent no-data-card-row-2 align-items-center mb-0 justify-content-center">
                    <div className="col-12 text-center">
                      <img
                        alt={""}
                        className="img-fluid"
                        src={Images.location_gray}
                      />
                      <h6 className="mb-0 text-gray-tag">
                        No Address Information
                      </h6>
                    </div>
                  </div>
                )}
                {this.handleBillingAddress() && (
                  <div className="row site-details-row-card position-relative">
                    <div className="col-12 col-sm-3 title">
                      <div className="site-name-location">
                        <img
                          src={Images.location_black_icon}
                          alt=""
                          className="img-fluid"
                        />
                        <span>Billing Address</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">{`${billing?.street_address || ""} ${billing?.apartment || ""} ${billing?.county || ""} ${billing?.city || ""} ${billing?.state || ""} ${billing?.zip_code || ""} ${billing?.country || ""}`}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AddressInfo);

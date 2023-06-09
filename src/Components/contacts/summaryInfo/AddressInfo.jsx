import React, { Component } from "react";
import { Button, Dropdown, Form, Input, message } from "antd";
import { Image as Images } from "../../Images";
import {
  getContactAddress,
} from "../../../Controller/api/contactsServices";
import { withRouter } from "react-router-dom";
import { formatPhone } from "../../../Controller/utils";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../Controller/Routes";

class AddressInfo extends Component {
  state = {
    address: null
  };

  componentDidMount() {
    if(this.props?.contact?.contact_address?.id) {
    getContactAddress(this.props?.contact?.contact_address?.id)
      .then((res) => {
          console.log(res.data,"response")
        this.setState({ address: res.data });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
    }
  }

  render() {
    let { address } = this.state;
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
                {address ? (
                  <div className="row site-details-row-card position-relative">
                    <div className="col-12 col-sm-3 title">
                      <div className="site-name-location">
                        <img
                          src={Images.location_black_icon}
                          alt=""
                          className="img-fluid"
                        />
                        <span style={{
                          color:'#4F4F4F'
                        }}>Main Address</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">{`${address.street_address || ""} ${address.apartment || ""} ${address.county || ""} ${address.city || ""} ${address.state || ""} ${address.zip_code || ""} ${address.country || ""}`}</p>
                    </div>
                    {/* <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">{address.email || "-"}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">{formatPhone(address.phone)}</p>
                    </div> */}
                  </div>
                ) : (
                  <div className="row mx-0 no-data-card-row bg-transparent mb-0 no-data-card-row-2 align-items-center justify-content-center">
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
                </div>
                </div>
                </div>
                </div>
                
      </React.Fragment>
    );
  }
}

export default withRouter(AddressInfo);

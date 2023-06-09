import React, {Component} from 'react';
import {Button} from "antd";
import {Image as Images} from "../../../Images";
import { formatPhone } from '../../../../Controller/utils';
import { reverse } from 'named-urls/src';
import { history } from '../../../../Controller/history';
import { routes } from '../../../../Controller/Routes';

class VendorAddressInfo extends Component {

  handleBillingAddress = () => {
    const billing = this.props.vendor?.billing_address;
    if(billing && billing?.street_address || billing?.apartment || billing?.county || billing?.city || billing?.state || billing?.zip_code) {
      return true;
    }
    return false

  }
    render() {
      const main = this.props.vendor?.main_address;
      const billing = this.props.vendor?.billing_address;
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
                          routes.dashboard.vendor_account.edit,
                          { id: this.props.match.params.id }
                        ),
                        editTab: "2",
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
                  <div className="row mx-0 site-details-row-card position-relative">
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
                      <p className="mb-0">
                          {/* 3961 10th Ave.
                          New York NY
                          10001 USA */}
                          {`${main.street_address || ""} ${main.apartment || ""} ${main.county || ""} ${main.city || ""} ${main.state || ""} ${main.zip_code || ""} ${main.country || ""}`}
                      </p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">
                          {/* main@live.com */}
                          {main?.email || "-"}
                      </p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">
                          {/* 973-555-1234 */}
                          {formatPhone(main?.phone) || "-"}
                      </p>
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
                  <div className="row mx-0 site-details-row-card position-relative">
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
                      <p className="mb-0">
                          {/* 12 Spencer Street
Brooklyn NY
11205 USA */}
                          {`${billing?.street_address || ""} ${billing?.apartment || ""} ${billing?.county || ""} ${billing?.city || ""} ${billing?.state || ""} ${billing?.zip_code || ""} ${billing?.country || ""}`}
                      </p>
                    </div>
                      {/* <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">
                          {/* main@live.com 
                          {billing?.email || "-"}
                      </p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">
                          {/* 973-555-1234 
                          {formatPhone(billing?.phone) || "-"}
                      </p>
                    </div> */}
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

export default VendorAddressInfo;
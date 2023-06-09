import React, { Component } from "react";
import { formatPhone } from "../../../../../Controller/utils";
import { Image as Images } from "../../../../Images";

class SiteGeneralInformation extends Component {
  render() {
    const { siteData } = this.props;
    return (
      <React.Fragment>
        <div className="col-12">
          <div className="row summary-collapse-inner-row-main px-0">
            <div className="col-12 col-sm-6 col-md-4 col-lg-4">
              <h6 className="text-uppercase">
                {siteData?.account?.account_type === "CUSTOMER_OWNER"
                  ? "Billing / Site Manager Account"
                  : siteData?.account?.account_type === "SITE_OWNER"
                  ? "Site Manager Account"
                  : "Billing"}
              </h6>
              <div
                style={{ minHeight: "76px", height: "76px" }}
                className="row mx-0 mb-4 align-items-center user-info-div-main opportunity-info-div-main"
              >
                <div className="col-12">
                  <div className="user-icons-div">
                    <img
                      src={Images.person_black_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="user-info-div">
                    <h6>{siteData?.account?.name}</h6>
                    <p className="mb-0">
                      {siteData?.account?.account_type === "CUSTOMER_OWNER"
                        ? "Billing / Site Manager Account"
                        : siteData?.account?.account_type === "SITE_OWNER"
                        ? "Site Manager Account"
                        : "Billing"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              {siteData ? (
                <div className="row mx-0 mb-3 site-details-row-card position-relative">
                  <div className="col-12 col-sm-3 bg-gray-main">
                    <div className="site-name-location">
                      <img
                        src={Images.location_black_icon}
                        alt=""
                        className="img-fluid"
                      />
                      <span className="text-capitalize">{siteData.name || "-"}</span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <h6 className="text-uppercase">ADDRESS</h6>
                    <p className="mb-0">
                      {/* 2125 Center Ave Ste 400 Fort Lee NJ 07024 United States */}
                      {`${siteData.street_address || ""} ${
                        siteData.apartment || ""
                      } ${siteData.city || ""} ${siteData.state || ""} ${
                        siteData.country || ""
                      }`}
                    </p>
                  </div>
                  <div className="col-12 col-sm-3">
                    <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                    <p className="mb-0">{siteData.email || "-"}</p>
                  </div>
                  <div className="col-12 col-sm-3">
                    <h6 className="text-uppercase">PHONE NUMBER</h6>
                    <p className="mb-0">{formatPhone(siteData.phone)}</p>
                  </div>
                </div>
              ) : (
                <div className="row mx-0 no-data-card-row no-data-card-row-2 align-items-center justify-content-center">
                  <div className="col-12 text-center">
                    <img
                      alt={""}
                      className="img-fluid"
                      src={Images.location_gray}
                    />
                    <h6 className="mb-0">No Site Information</h6>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SiteGeneralInformation;

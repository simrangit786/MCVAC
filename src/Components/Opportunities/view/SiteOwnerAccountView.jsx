import React, { Component } from "react";
import { Image as Images } from "../../Images";

const SiteOwnerAccountView = props => {
    const { data } = props;
    return (
      <React.Fragment>
        <div className="row" style={{ padding: "16px 0" }}>
          {data.contact.length > 0 ? (
            data.contact.map((contact, index) => (
              <div key={index} className="col-6 col-sm-6">
                <div
                  style={{ minHeight: "85px", height: "85px" }}
                  className="row mx-0 align-items-center user-info-div-main opportunity-info-div-main mb-2"
                >
                  <div className="col-12">
                    <div className="user-icons-div">
                      <img
                        src={Images.contact_file_icon_black}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="user-info-div position-relative">
                      <h6>
                        {`${contact.first_name} ${contact.last_name}`}
                        <small
                          style={{
                            borderLeft: "1px solid #e0e0e0",
                            marginLeft: "5px",
                            paddingLeft: "5px",
                            fontWeight: "500",
                            color: "#bdbdbd",
                          }}
                        >
                          {contact.role ? contact.role : "-"}
                        </small>
                      </h6>
                      <p className="mb-0">
                        {contact.default_email &&
                          `${contact.default_email?.email},`}
                        &nbsp; {contact.default_phone?.phone_number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                <div className="col-12 text-center">
                  <img alt={''} className="img-fluid" src={Images.contacts_empty_state_icon} />
                  <h6
                    className="mb-0"
                  >
                    No Contacts
                  </h6>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="row"
          style={{ padding: "16px 0", borderTop: "1px solid #e0e0e0" }}
        >
          {data.site.length > 0 ? (
            data.site.map((item, index) => (
              <div className="col-12" key={index}>
                <div
                    style={{
                        minHeight:'100px'
                    }}
                    className={`row site-details-row-card site-details-row-card-update position-relative ${item.primary ? "active" : ""}`}>
                  <div className="col-12 col-sm-2 bg-gray-main p-0">
                    <div className="row mx-0 pt-lg-3 pt-md-3 pt-3">
                      <div className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                        <img
                          src={Images.location_black_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-12 col-sm-9 pl-lg-2">
                        <span className="text-uppercase font-weight-500">{item.site?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-10 px-3 py-0 position-relative">
                    <div className="row pt-lg-3 pt-md-3 pt-3">
                      <div className="col-12 col-sm-4">
                        <h6 className="text-uppercase">ADDRESS</h6>
                        <p className="mb-0">
                          {item.site?.apartment} {item.site?.city},{" "}
                          {item.site?.state} {item.site?.zip_code} USA
                        </p>
                      </div>
                      <div className="col-12 col-sm-4">
                        <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                        <p className="mb-0" style={{ width: 100 }}>
                          {item.site?.email}
                        </p>
                      </div>
                      <div className="col-12 col-sm-4">
                        <h6 className="text-uppercase">PHONE NUMBER</h6>
                        <p className="mb-0">{item.site?.phone}</p>
                      </div>
                    </div>
                      {item.primary && (
                          <small style={{
                              right:'15px'
                          }} className="primary-text-right text-capitalize position-absolute"> primary site</small>
                              )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                <div className="col-12 text-center">
                  <img
                    src={Images.location_gray}
                    alt={""}
                    className={"img-fluid mb-2"}
                  />
                  <h6
                    className="mb-0"
                  >
                    No Sites
                  </h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }

export default SiteOwnerAccountView;

import React, { Component } from "react";
import { Image as Images } from "../../../Images";

const CustomerAccountView = props => {
    const { contacts } = props;
    return (
      <React.Fragment>
        {contacts.length > 0 ? (
          <div className="row" style={{ padding: "16px 0" }}>
            <div className="col-12">
              <h6 className="small-heading-contact mb-0">Contacts</h6>
            </div>
            {contacts.map((contact, index) => (
              <div key={index} className="col-6 col-sm-6">
                <div
                  style={{ minHeight: "76px", height: "76px" }}
                  className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main mb-2`}
                >
                  <div className="col-12">
                    <div className="user-icons-div">
                      <img
                        src={Images.contact_file_icon_black}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="user-info-div">
                      <h6>
                        {`${contact?.first_name || ""} ${
                          contact?.last_name || ""
                        }`}
                        <small
                          style={{
                            borderLeft: "1px solid #e0e0e0",
                            marginLeft: "5px",
                            paddingLeft: "5px",
                            fontWeight: "500",
                            color: "#bdbdbd",
                          }}
                        >
                          {contact?.role || ""}
                        </small>
                      </h6>
                      <p className="mb-0">
                        {contact?.default_email &&
                          `${contact.default_email?.email},`}{" "}
                        {contact?.default_phone?.phone_number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`col-12 pt-3 px-0`}>
            <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
              <div className="col-12 text-center">
                <img
                  src={Images.contacts_empty_state_icon}
                  alt={"contact-icon"}
                  className="img-fluid"
                />
                <h6 className="mb-0 mt-2">No Contacts</h6>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

export default CustomerAccountView;

import React, { Component } from "react";
import { Image as Images } from "../../../Images";

class CustomerContactsView extends Component {
  render() {
    const { contacts } = this.props;
    return (
      <React.Fragment>
        {contacts.length > 0 ? (
          <div className="row" style={{ padding: "16px 0" }}>
            {/*<div className="col-12">*/}
            {/*  <div className="row mx-0 contact-green-small-heading position-relative">*/}
            {/*    <h5 className="mb-0">Contacts</h5>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div className="col-12">
              <h6 className="small-heading-contact mb-0">Contacts</h6>
            </div>
            {contacts.map((contact, index) => (
              <div key={index} className="col-6 col-sm-6">
                <div
                  style={{ minHeight: "76px", height: "76px" }}
                  className={`row mx-0 align-items-center user-info-div-main opportunity-info-div-main mb-2 ${
                    contact.default_customer_recipient ? "active" : ""
                  }`}
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
                        {`${contact.contact?.first_name || ""} ${
                          contact.contact?.last_name || ""
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
                          {contact.contact?.role || ""}
                        </small>
                      </h6>
                      <p className="mb-0">
                        {contact.contact?.default_email &&
                          `${contact.contact.default_email?.email},`}{" "}
                        {contact.contact?.default_phone?.phone_number}
                      </p>
                      {contact.default_customer_recipient && (
                        <span
                          className={
                            "point-details font-weight-bold position-absolute m-auto d-flex align-items-center"
                          }
                        >
                          Proposal Recipient
                        </span>
                      )}
                    </div>
                  </div>
                  {/*<div className="col-6">*/}
                  {/*    <div className="user-info-div">*/}
                  {/*        <p className="mb-0">No account associated</p>*/}
                  {/*    </div>*/}
                  {/*</div>*/}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`col-12 pt-3`}>
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
        {/*<div*/}
        {/*    className="row mx-0 no-data-card-row align-items-center justify-content-center">*/}
        {/*    <div className="col-12 text-center cursor-pointer">*/}
        {/*        <h6 className="mb-0">No Customer Accounts</h6>*/}
        {/*    </div>*/}
        {/*</div>*/}
      </React.Fragment>
    );
  }
}

export default CustomerContactsView;

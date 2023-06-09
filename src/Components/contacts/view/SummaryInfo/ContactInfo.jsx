import React, { Component } from "react";
import { connect } from "react-redux";

class ContactInfo extends Component {
  render() {
    const contact = this.props.contact;
    if (!contact.id) return <div />;
    return (
      <div className="row summary-collapse-inner-row-main">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                    <h6 className="text-uppercase">Salutation</h6>
                    <h5>{(contact.salutation === "MR." ? "Mr." :  contact.salutation === "MRS." ? "Mrs." : contact.salutation === "MS." ? "Ms.": "-")}</h5>
                </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">FIRST NAME</h6>
          <h5 className="mb-0">{contact?.first_name}</h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
          <h6 className="text-uppercase">Middle NAME</h6>
          <h5 className="mb-0">{contact?.middle_name || "-"}</h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
          <h6 className="text-uppercase">Last Name</h6>
          <h5 className="mb-0">{contact?.last_name}</h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
          <h6 className="text-uppercase">Suffix</h6>
          <h5 className="mb-0">
            {contact?.suffix === "JR"
              ? "Jr"
              : contact?.suffix === "SR"
              ? "Sr"
              : contact?.suffix === "I"
              ? "I"
              : contact?.suffix === "II"
              ? "II"
              : contact?.suffix === "III"
              ? "III"
              : "-"}
          </h5>
        </div>
        <div className="col-12 mb-15-bt">
          <h6 className="text-uppercase">Note</h6>
          <h5 className="mb-0">{contact?.note || "-"}</h5>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(ContactInfo);

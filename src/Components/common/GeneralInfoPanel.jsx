import React, { Component } from "react";

class GeneralInfoPanel extends Component {
  render() {
    return (
      <div className="row summary-collapse-inner-row-main">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">ACCOUNT NAME</h6>
          <h5>{customer.name}</h5>
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
          <h6 className="text-uppercase">ACCOUNT TYPE</h6>
          <h5 className="mb-0">{customer.account_type}</h5>
        </div>
      </div>
    );
  }
}

export default GeneralInfoPanel;

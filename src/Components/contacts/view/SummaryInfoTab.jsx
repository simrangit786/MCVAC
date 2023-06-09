import React, { Component } from "react";
import SummaryInfo from "./SummaryInfo/SummaryInfo";

class SummaryInfoTab extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row summary-info-row-main">
          <div className="col-12 p-0">
            <div className="row mx-0 steps-main-div-inn mt-3">
              <SummaryInfo {...this.props} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SummaryInfoTab;

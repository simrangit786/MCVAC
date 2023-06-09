import React, { Component } from "react";
import Prospect from "./summary-info/Prospect";

class SummaryInfo extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row summary-info-row-main">
          <div className="col-12 p-0">
            <div className="row mx-0 steps-main-div-inn mt-3">
              <Prospect {...this.props} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SummaryInfo;

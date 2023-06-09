import React, { Component } from "react";
import Documents from "./SummaryInfo/Documents";

class DocumentsInfo extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row mx-0 mt-30 no-data-card-row-new">
          <Documents />
        </div>
      </React.Fragment>
    );
  }
}

export default DocumentsInfo;

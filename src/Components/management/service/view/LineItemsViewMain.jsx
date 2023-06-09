import React, { Component } from "react";
import SingleLineItemsView from "./SingleLineItemsView";

class LineItemsViewMain extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0">
            <div className="col-12">
              <SingleLineItemsView />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LineItemsViewMain;

import React, { Component } from "react";
import { Tabs } from "antd";
import LineItemsView from "./LineItemsView";
import LineItemSummaryTree from "./LineItemSummaryTree";

const { TabPane } = Tabs;

class LineItemsPackagesMain extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0">
            <div className="col-12">
              <Tabs
                className="carpet-cleaning-main-common-tab"
                defaultActiveKey="1"
              >
                <TabPane tab="Summary" key="1">
                  <LineItemSummaryTree />
                </TabPane>
                <TabPane tab="Services" key="2">
                  <LineItemsView />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LineItemsPackagesMain;

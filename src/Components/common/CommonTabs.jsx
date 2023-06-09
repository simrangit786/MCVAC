import React, { Component } from "react";
import { Tabs } from "antd";
import SummaryInfoTab from "../accounts/customer-account/view/SummaryInfoTab";
const { TabPane } = Tabs;
class CommonTabs extends Component {
  render() {
    const { TabData } = this.props;
    return (
      <div className="main-content-div">
        <div className="row mx-0 carpet-cleaning-main-row position-relative">
          <Tabs
            className="carpet-cleaning-main-common-tab"
            defaultActiveKey="1"
          >
            <TabPane tab="Summary" key="1">
              <SummaryInfoTab />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CommonTabs;

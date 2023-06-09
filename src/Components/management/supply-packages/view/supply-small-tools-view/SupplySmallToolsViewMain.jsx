import React, { Component } from "react";
import { Tabs } from "antd";
import SummaryInfo from "./SummaryInfo";
import DocumentsTab from "./DocumentsTab";

const { TabPane } = Tabs;

class SupplySmallToolsViewMain extends Component {
  state = {
    tab: "1",
  };
  tabChange = (key) => {
    this.setState({ tab: key });
  };
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0">
            <div className="col-12">
              <Tabs
                activeKey={this.state.tab}
                onChange={this.tabChange}
                className="carpet-cleaning-main-common-tab"
                defaultActiveKey="1"
              >
                <TabPane tab="Summary" key="1">
                  <SummaryInfo tabChange={this.tabChange} />
                </TabPane>
                <TabPane tab="Documents" key="2">
                  <DocumentsTab />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SupplySmallToolsViewMain;

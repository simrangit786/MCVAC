import React, { Component } from "react";
import { Tabs } from "antd";
import SupplyGroup from "./SupplyGroup";
import SupplySummaryTree from "./SupplySummaryTree";

const { TabPane } = Tabs;

class SupplyPackageViewMain extends Component {
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
                  <SupplySummaryTree />
                </TabPane>
                <TabPane tab="Supply Groups" key="2">
                  <SupplyGroup />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SupplyPackageViewMain;

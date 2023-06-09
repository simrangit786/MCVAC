import React, { Component } from "react";
import { Tabs } from "antd";
import VehicleSummaryTree from "./VehicleSummaryTree";
import VehiclePackageGroup from "./VehiclePackageGroup";

const { TabPane } = Tabs;

class VehiclePackagesViewMain extends Component {
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
                  <VehicleSummaryTree />
                </TabPane>
                <TabPane tab="Fleet Groups" key="2">
                  <VehiclePackageGroup />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default VehiclePackagesViewMain;

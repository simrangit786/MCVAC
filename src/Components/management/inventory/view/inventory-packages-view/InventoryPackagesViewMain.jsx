import React, { Component } from "react";
import { Tabs } from "antd";
import InventorySummaryTree from "./InventorySummaryTree";

const { TabPane } = Tabs;

class InventoryPackagesViewMain extends Component {
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
                  <InventorySummaryTree />
                </TabPane>
                {/*<TabPane tab="Inventory Groups" key="2">*/}
                {/*    <InventoryGroupView/>*/}
                {/*</TabPane>*/}
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InventoryPackagesViewMain;

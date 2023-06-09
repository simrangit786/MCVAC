import React, { Component } from "react";
import { Tabs } from "antd";
import InventorySummary from "./InventorySummary";
import InventoryItems from "./InventoryItems";

const { TabPane } = Tabs;

class InventoryPackagesGroup extends Component {
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
                  <InventorySummary />
                </TabPane>
                <TabPane tab="Inventory Items" key="2">
                  <InventoryItems />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InventoryPackagesGroup;

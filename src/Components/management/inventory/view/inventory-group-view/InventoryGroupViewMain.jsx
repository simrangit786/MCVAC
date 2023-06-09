import React, { Component } from "react";
import { Tabs } from "antd";
import InventorySummary from "../inventory-packages-view/InventorySummary";
import InventoryItems from "../inventory-packages-view/InventoryItems";
import InventoryKitView from "../inventory-packages-view/InventoryKitView";

const { TabPane } = Tabs;

class InventoryGroupViewMain extends Component {
  state = {
    active: "1",
  };

  onTabChange = (key) => {
    this.setState({ active: key });
  };

  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0">
            <div className="col-12">
              <Tabs
                activeKey={this.state.active}
                onChange={this.onTabChange}
                className="carpet-cleaning-main-common-tab"
                defaultActiveKey="1"
              >
                <TabPane tab="Summary" key="1">
                  <InventorySummary onTabChange={this.onTabChange} />
                </TabPane>
                <TabPane tab="Inventory Items" key="2">
                  <InventoryItems />
                </TabPane>
                <TabPane tab="Inventory Kits" key="3">
                  <InventoryKitView />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InventoryGroupViewMain;

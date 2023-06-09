import React, { Component } from "react";
import { Tabs } from "antd";
import InventoryKitsSummaryMain from "./InventoryKitsSummaryMain";
import InventoryKitsItemsView from "./InventoryKitsItemsView";

const { TabPane } = Tabs;

class InventoryKitsViewMain extends Component {
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
                  <InventoryKitsSummaryMain
                    onTabChange={() => this.onTabChange("2")}
                  />
                </TabPane>
                <TabPane tab="Inventory Items" key="2">
                  <InventoryKitsItemsView editBtn={true} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InventoryKitsViewMain;

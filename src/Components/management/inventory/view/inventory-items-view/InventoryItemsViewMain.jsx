import React, { Component } from "react";
import { Tabs } from "antd";
import SummaryInfo from "./SummaryInfo";
import InventoryKitView from "./InventoryKitView";
import InternalLocationView from "./InternalLocationView";
import DocumentsView from "./DocumentsView";
import VendorView from "./VendorView";
import CustomUnitMeasurementsInventoryView from "./CustomUnitMeasurementsInventoryView";
import { routes } from "../../../../../Controller/Routes";
import { getInventoryById } from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";
import { checkInventoryFieldRequired } from "../../../../../Controller/utils";

const { TabPane } = Tabs;

class InventoryItemsViewMain extends Component {
  state = {
    tab: "1",
    inventory: null,
    requiredFields: true
  };

  tabChange = (key) => {
    this.setState({ tab: key });
  };

  componentDidMount() {
    // this.setState({loading: true});
    if (this.props.match.params.id) {
      getInventoryById(this.props.match.params.id)
        .then((res) => {
          // let arrIn = [{
          //     title: 'Inventory',
          //     url: routes.dashboard.management.inventory.self
          // }, {
          //     title: 'Inventory Items',
          //     url: routes.dashboard.management.inventory.self
          // }, {title: res.data.name, url: '#'}];
          // this.props.setBreadcrumb(arrIn);
          this.setState({ inventory: res.data },() => {
            this.setState({requiredFields: checkInventoryFieldRequired(this.state.inventory)})
          });
        })
        .catch((err) => {
          handleError(err);
          this.setState({ loading: false });
        });
    }
  }

  render() {
    const { inventory } = this.state;
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            {this.state.requiredFields && (
              <div className="row mx-0 info-gray-div info-red-div align-items-center">
                <h6 className="mb-0">
                  Please complete all required information to avoid issues
                </h6>
                </div>
            )}
            <Tabs
              onChange={this.tabChange}
              className="carpet-cleaning-main-common-tab"
              activeKey={this.state.tab}
            >
              <TabPane tab="Summary" key="1">
                <SummaryInfo tabChange={this.tabChange} />
              </TabPane>
              <TabPane tab="Custom Unit of Measurement" key="2">
                <CustomUnitMeasurementsInventoryView
                  editBtn={true}
                  inventory={inventory}
                />
              </TabPane>
              <TabPane tab="Warehouses" key="3">
                <InternalLocationView editBtn={true} inventory={inventory} />
              </TabPane>
              <TabPane tab="Vendors" key="4">
                <VendorView editBtn={true} inventory={inventory} />
              </TabPane>
              <TabPane tab="Inventory Kits" key="5">
                <InventoryKitView editBtn={true} inventory={inventory} />
              </TabPane>
              <TabPane tab="Documents" key="6">
                <DocumentsView editBtn={true} inventory={inventory} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InventoryItemsViewMain;

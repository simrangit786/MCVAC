import React, { Component } from "react";
import { Tabs } from "antd";
import SupplySummary from "./SupplySummary";
import SupplySmallTools from "./SupplySmallTools";
import { checkSupplyFieldRequired } from "../../../../../Controller/utils";
import { withRouter } from 'react-router-dom';

const { TabPane } = Tabs;

class SupplyGroupTabs extends Component {
  state = {
    key: "1",
    requiredFields: true,
    supplyGroup: null
  };

  handleChange = (key) => {
    this.setState({ key })
  };

  setSupplyGroup = supplyGroup => {
    this.setState({
      requiredFields: checkSupplyFieldRequired(supplyGroup)
    })
  }

  render() {
    const { requiredFields } = this.state
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0">
            <div className="col-12">
            {requiredFields && (
              <div className="row mx-0 info-gray-div info-red-div align-items-center">
                <h6 className="mb-0">
                  Please complete all required information to avoid issues
                </h6>
              </div>
            )}
              <Tabs
                defa
                onChange={this.handleChange}
                className="carpet-cleaning-main-common-tab"
                activeKey={this.state.key}
              >
                <TabPane tab="Summary" key={"1"}>
                  <SupplySummary handleViewAll={() => this.handleChange("2")} setSupplyGroup = {this.setSupplyGroup} />
                </TabPane>
                <TabPane tab="Supplies/Small Tools " key={"2"}>
                  <SupplySmallTools />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SupplyGroupTabs);

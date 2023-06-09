import React, { Component } from "react";
import { Tabs } from "antd";
import SummaryView from "./SummaryView";
import VehiclesView from "./VehiclesView";
import { checkFleetFieldsRequired } from "../../../../../../Controller/utils";

const { TabPane } = Tabs;

class VehiclePackagesGroupMain extends Component {
  state = {
    key: "1",
    fleetGroupData: null,
    requiredFields: true
  };

  handleTabChange = (key) => {
    this.setState({ key });
  };

  setFleetGroup = fleetGroupData => {
    this.setState({
      requiredFields: checkFleetFieldsRequired(fleetGroupData),
    });
    // this.setState({fleetGroupData})
  }

  render() {
    const {requiredFields} = this.state;
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
                onChange={this.handleTabChange}
                className="carpet-cleaning-main-common-tab"
                activeKey={this.state.key}
              >
                <TabPane tab="Summary" key="1">
                  <SummaryView handleViewAll={this.handleTabChange} setFleetGroup={this.setFleetGroup} />
                </TabPane>
                <TabPane tab="Vehicles" key="2">
                  <VehiclesView />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default VehiclePackagesGroupMain;

import React, { Component } from "react";
import { Tabs } from "antd";
import FleetKitSummary from "./FleetKitSummary";
import FleetKitsItemsView from "./FleetKitsItemsView";
import { getFleetKitById } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import { routes } from "../../../../../../Controller/Routes";
const { TabPane } = Tabs;



class FleetKitViewMain extends Component {
  state = {
    active: "1",
    fleetData: null
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      getFleetKitById(this.props.match.params.id)
        .then((res) => {
          this.setState({ fleetData: res.data });
          let arrVehicle = [
            {
              title: "Fleet kit",
              url: routes.dashboard.management.fleet.self,
            },
            // {
            //     title: "Vehicles",
            //     url: routes.dashboard.management.fleet.self,
            // },
            // {
            //     title: res.data.name,
            //     url: "#",
            // },
          ];
          this.props.setBreadcrumb(arrVehicle);
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }


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
              onChange={this.onTabChange}
              activeKey={this.state.active}
                className="carpet-cleaning-main-common-tab"
                // defaultActiveKey="1"
              >
                <TabPane tab="Summary" key="1">
                   <FleetKitSummary onTabChange={this.onTabChange} fleetData={this.state.fleetData} />   
                </TabPane>
                <TabPane tab="Fleet Group" key="2">
                  <FleetKitsItemsView editBtn={true} fleetData={this.state.fleetData}/>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FleetKitViewMain;

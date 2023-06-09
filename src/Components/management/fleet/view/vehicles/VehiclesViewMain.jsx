import React, { Component } from "react";
import { Tabs } from "antd";
import Summary from "./Summary";
import VehicleDocs from "./VehicleDocs";
const { TabPane } = Tabs;



class VehiclesViewMain extends Component {
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
              onChange={this.onTabChange}
              activeKey={this.state.active}
                className="carpet-cleaning-main-common-tab"
                // defaultActiveKey="1"
              >
                <TabPane tab="Summary" key="1">
                  
                  <Summary   
                  onTabChange={this.onTabChange}/>
                </TabPane>
                <TabPane tab="Documents" key="2">
                  <VehicleDocs  onChange={this.onTabChange} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default VehiclesViewMain;

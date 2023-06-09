import React, { Component } from "react";
import { Tabs } from "antd";
import OwnerAccountsMain from "./site-manager-account/OwnerAccountsMain";
import SitesAccountsMain from "./sites-main/SitesAccountsMain";

const { TabPane } = Tabs;

class SiteManagerAccountMain extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <Tabs
            className="carpet-cleaning-main-common-tab"
            defaultActiveKey="1"
          >
            <TabPane tab="Site Manager Accounts" key="1">
              <OwnerAccountsMain />
            </TabPane>
            <TabPane tab="Sites" key="2">
              <SitesAccountsMain />
            </TabPane>
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}

export default SiteManagerAccountMain;

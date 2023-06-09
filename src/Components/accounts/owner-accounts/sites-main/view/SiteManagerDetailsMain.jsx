import React, { Component } from "react";
import ActivityInfo from "../../../common/ActivityInfo";
import { Tabs } from "antd";
import SiteManagerSummaryInfo from "./SiteManagerSummaryInfo";
import SiteManagerDocumentsInfo from "./SiteManagerDocumentsInfo";
import SiteManagerOpportunityInfo from "./SiteManagerOpportunityInfo";
import SiteManagerProjectsInfo from "./SiteManagerProjectsInfo";
import SiteManagerWorkOrdersInfo from "./SiteManagerWorkOrdersInfo";
import SiteManagerOwnerPostTab from "./SiteManagerOwnerPostTab";
import SiteManagerProposalsInfo from "./SiteManagerProposalsInfo";
import { getSingleOwnerSites } from "../../../../../Controller/api/ownerAccountServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router";

const { TabPane } = Tabs;

class SiteManagerDetailsMain extends Component {
  state = {
    tab: "1",
    siteData: null,
  };
  tabChange = (key) => {
    this.setState({ tab: key });
  };

  render() {
    const { siteData } = this.state;
    const tabName = [
      {
        name: "Summary",
        id: 1,
        component: <SiteManagerSummaryInfo />,
      },
      {
        name: "Documents",
        id: 2,
        component: <SiteManagerDocumentsInfo />,
      },
      // ,
      // {
      //     name: 'Opportunities',
      //     id: 3,
      //     component: <SiteManagerOpportunityInfo/>
      // },
      // {
      //     name: 'Proposals',
      //     id: 4,
      //     component: <SiteManagerProposalsInfo/>
      // },
      // {
      //     name: 'Projects',
      //     id: 5,
      //     component: <SiteManagerProjectsInfo/>
      // },
      // {
      //     name: 'Work Orders',
      //     id: 6,
      //     component: <SiteManagerWorkOrdersInfo/>
      // },
      // {
      //     name: 'Posts',
      //     id: 7,
      //     component: <SiteManagerOwnerPostTab/>
      // },
      // {
      //     name: 'Activity',
      //     id: 8,
      //     component: <ActivityInfo/>
      // },
    ];
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            <Tabs
              activeKey={this.state.tab}
              onChange={this.tabChange}
              className="carpet-cleaning-main-common-tab"
              defaultActiveKey="1"
            >
              {tabName.map((i) => (
                <TabPane tab={`${i.name}`} key={i.id}>
                  {i.component}
                </TabPane>
              ))}
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SiteManagerDetailsMain);

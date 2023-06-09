import React, { Component } from "react";
import { Tabs } from "antd";
import SummaryInfo from "./SummaryInfo";
import DocumentsInfo from "./DocumentsInfo";
import ActivityInfo from "../../../common/ActivityInfo";
import ContactsInfo from "./ContactsInfo";
import Sites from "./Sites";
import ProjectsInfo from "./ProjectsInfo";
import WorkOrdersInfo from "./WorkOrdersInfo";
import OwnerPostTab from "./OwnerPostTab";
import { connect } from "react-redux";
import { ownerAccountDetailAction } from "../../../../../Store/actions/ownerAccountAction";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../../Controller/Routes";
import OpportunitiesInfo from "./OpportunityInfo";
import AssociatedAccounts from "./AssociatedAccounts";
import { withRouter } from "react-router-dom";
import ProposalInfo from "./ProposalInfo";

const { TabPane } = Tabs;

class SiteOwnerDetailMain extends Component {
  state = {
    tab: "1",
  };

  componentDidMount() {
    this.props.ownerAccountDetailAction(this.props.match.params.id).then(() => {
      const { owner } = this.props;
      let arr = [
        {
          title: "Site Manager Accounts",
          url: routes.dashboard.owner_account.self,
        },
        {
          title: owner.name,
          url: "#",
        },
      ];
      this.props.setBreadcrumb(arr);
    });
  }

  tabChange = (key) => {
    this.setState({ tab: key });
  };

  render() {
    const tabName = [
      {
        name: "Summary",
        id: 1,
        component: <SummaryInfo tabChange={this.tabChange} {...this.props} />,
      },
      {
        name: "Posts",
        id: 10,
        component: <OwnerPostTab/>,
      },
      {
        name: "Activity",
        id: 11,
        component: <ActivityInfo/>,
      },
      // {
      //     name:'Address information',
      //     id:2,
      //     component:<AddressInfo hideTitle/>
      // },
      {
        name: "Sites",
        id: 3,
        component: <Sites />,
      },
      {
        name: "Contacts",
        id: 4,
        component: <ContactsInfo viewAll/>,
      },
      {
        name: "Documents",
        id: 5,
        component: <DocumentsInfo />,
      },
      {
        name: "Associated Accounts",
        id: 6,
        component: <AssociatedAccounts {...this.props} />,
      },
      {
        name: "Opportunities",
        id: 7,
        component: <OpportunitiesInfo />,
      },
      {
        name: "Proposals",
        id: 12,
        component: <ProposalInfo viewAll/>,
      },
      {
        name: "Projects",
        id: 8,
        component: <ProjectsInfo />,
      },
      {
        name: "Work Orders",
        id: 9,
        component: <WorkOrdersInfo />,
      },
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

const mapStateToProps = (state) => {
  return { ...state };
};
export default connect(mapStateToProps, {
  ownerAccountDetailAction,
  setBreadcrumb,
})(withRouter(SiteOwnerDetailMain)
);


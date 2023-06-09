import React, { Component } from "react";
import { Tabs } from "antd";
import Posts from "../summaryInfo/Posts";
import SummaryInfoTab from "./SummaryInfoTab";
import ProposalsInfo from "../summaryInfo/ProposalsInfo";
import DocumentsInfo from "../summaryInfo/DocumentsInfo";
import ActivityInfo from "../summaryInfo/ActivityInfo";
import ProjectsInfo from "../summaryInfo/ProjectsInfo";
import WorkOrdersInfo from "../summaryInfo/WorkOrdersInfo";
import OpportunitiesInfo from "../summaryInfo/OpportunitiesInfo";
import { contactDetailAction } from "../../../Store/actions/contactAction";
import { connect } from "react-redux";
import ContactsInfo from "../summaryInfo/ContactsInfo";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { routes } from "../../../Controller/Routes";
import AccountInfo from "../summaryInfo/AccountInfo";

const { TabPane } = Tabs;

class ContactDetail extends Component {
  async componentDidMount() {
    await this.props.contactDetailAction(this.props.match.params.id);
    let arr = [
      {
        title: "Contacts",
        url: routes.dashboard.contacts.self,
      },
      {
        title:
          this.props.contact.first_name + " " + this.props.contact.last_name,
        url: "#",
      },
    ];
    this.props.setBreadcrumb(arr);
  }

  state = {
    tab: "1",
  };

  tabChange = (key) => {
    this.setState({ tab: key });
  };

  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            <Tabs
              className="carpet-cleaning-main-common-tab"
              activeKey={this.state.tab}
              onChange={this.tabChange}
            >
              <TabPane tab="Summary" key="1">
                <SummaryInfoTab tabChange={this.tabChange} />
              </TabPane>
              <TabPane tab="Contact Info" key="2">
                <ContactsInfo />
              </TabPane>
              <TabPane tab="Posts" key="8">
                <Posts pagination/>
              </TabPane>
              <TabPane tab="Activity" key="9">
                <ActivityInfo pagination/>
              </TabPane>
              <TabPane tab="Account" key="10">
                <AccountInfo contact={this.props.contact}/>
              </TabPane>
              <TabPane tab="Documents" key="3">
                <DocumentsInfo pagination />
              </TabPane>
              <TabPane tab="Opportunities" key="4">
                <OpportunitiesInfo pagination {...this.props}/>
              </TabPane>
              <TabPane tab="Proposals" key="5">
                <ProposalsInfo />
              </TabPane>
              <TabPane tab="Projects" key="6">
                <ProjectsInfo />
              </TabPane>
              <TabPane tab="Work Orders" key="7">
                <WorkOrdersInfo />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { ...state };
}

const actionCreators = {
  contactDetailAction,
  setBreadcrumb,
};

export default connect(mapStateToProps, actionCreators)(ContactDetail);

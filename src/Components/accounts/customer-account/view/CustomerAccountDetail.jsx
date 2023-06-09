import React, { Component } from "react";
import { Tabs } from "antd";
import CustomerPostTab from "./CustomerPostTab";
import SummaryInfoTab from "./SummaryInfoTab";
import DocumentsInfo from "./DocumentsInfo";
import ActivityInfo from "../../common/ActivityInfo";
import ContactsInfo from "./ContactsInfo";
import AddressInfo from "./AddressInfo";
import ProjectsInfo from "./ProjectsInfo";
import WorkOrdersInfo from "./WorkOrdersInfo";
import { connect } from "react-redux";
import { customerAccountDetailAction } from "../../../../Store/actions/customerAccountAction";
import OpportunitiesInfo from "./OpportunitiesInfo";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import { routes } from "../../../../Controller/Routes";
import AssociatedAccounts from "./AssociatedAccounts";
import ProposalInfo from "../../owner-accounts/site-manager-account/view/ProposalInfo";
import ProposalCustomerInfo from "./ProposalCustomerInfo";

const { TabPane } = Tabs;

class CustomerAccountDetail extends Component {
  state = {
    tab: "1",
  };

  componentDidMount() {
    this.props
      .customerAccountDetailAction(this.props.match.params.id)
      .then(() => {
        const { customer } = this.props;
        let arr = [
          {
            title: "Billing Accounts",
            url: routes.dashboard.customer_account.self,
          },
          {
            title: customer.name,
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
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            <Tabs
              activeKey={this.state.tab}
              onChange={this.tabChange}
              className="carpet-cleaning-main-common-tab"
            >
              <TabPane tab="Summary" key="1">
                <SummaryInfoTab tabChange={this.tabChange} {...this.props} />
              </TabPane>
              <TabPane tab="Posts" key="9">
                <CustomerPostTab />
              </TabPane>
              <TabPane tab="Activity" key="10">
                <ActivityInfo />
              </TabPane>
              {/* <TabPane tab="Address Information" key="2">
                                <AddressInfo/>
                            </TabPane> */}
              <TabPane tab="Contacts" key="3">
                <ContactsInfo viewAll/>
              </TabPane>
              <TabPane tab="Documents" key="4">
                <DocumentsInfo />
              </TabPane>
              <TabPane tab="Associated Accounts" key="5">
                <AssociatedAccounts {...this.props} />
              </TabPane>
              <TabPane tab="Opportunities" key="6">
                <OpportunitiesInfo pagination />
              </TabPane>
              <TabPane tab="Proposals" key="11">
                <ProposalCustomerInfo pagination  viewAll/>
              </TabPane>
              <TabPane tab="Projects" key="7">
                <ProjectsInfo />
              </TabPane>
              <TabPane tab="Work Orders" key="8">
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
  customerAccountDetailAction,
  setBreadcrumb,
};

export default connect(mapStateToProps, actionCreators)(CustomerAccountDetail);

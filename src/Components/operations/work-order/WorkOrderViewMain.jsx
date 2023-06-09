import React, { Component } from 'react';
import { Tabs } from "antd";
import WorkOrderSummaryView from "./view/WorkOrderSummaryView";
import { getWorkOrderById } from '../../../Controller/api/workOrderServices';
import { handleError } from '../../../Controller/Global';
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { routes } from '../../../Controller/Routes';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import WOPosts from './view/WOPosts';
import WOActivity from './view/WOActivity';
import WOSiteManagerAccountView from './view/WOSitemanagerView';
import WOBillingAccountView from './view/WOBillingAccountView';
import WOServiceVarientsView from './view/WOServiceVarientsView';
import WODocumentsView from './view/WODocumentsView';
const { TabPane } = Tabs;

class WorkOrderViewMain extends Component {
  state = {
    workOrder: null,
    active:'1',
  }

  componentDidMount() {
    this.fetchWorkOrder();
  }


  fetchWorkOrder = () => {
    getWorkOrderById(this.props.match.params.id)
      .then(res => {
        let arr = [
          {
            title: "Work Order",
            url: routes.dashboard.operations.work_order.self,
          },
          {
            title: res.data.project.name,
            url: "",
          },
        ];
        this.props.setBreadcrumb(arr);
        this.setState({ workOrder: res.data }, () => {
        })
      })
      .catch((err) => {
        handleError(err);
      });
  }
  onTabChange = (key) => {
    this.setState({ active: key });
  };

  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mx-0 carpet-cleaning-main-row position-relative">
            {/*{proposal_filled && (*/}
            {/*    <div className="row mx-0 info-gray-div info-red-div align-items-center">*/}
            {/*      <h6 className="mb-0">*/}
            {/*        Please complete all required information to view and send the proposal PDF.*/}
            {/*      </h6>*/}
            {/*      </div>*/}
            {/*  )}*/}
            <Tabs
              className="carpet-cleaning-main-common-tab"
              onChange={this.onTabChange}
              activeKey={this.state.active}
              // defaultActiveKey="1"
            >
              <TabPane tab="Summary" key="1">
                <WorkOrderSummaryView
                  workOrder={this.state.workOrder}
                  fetchWorkOrder={this.fetchWorkOrder}
                  onTabChange={this.onTabChange}
                />
              </TabPane>
              <TabPane tab="POSTS" key="2">
                <WOPosts  
                 workOrder={this.state.workOrder}
                 {...this.props} 
                 />
              </TabPane>
              <TabPane tab="ACTIVITY" key="3">
                <WOActivity
                 workOrder={this.state.workOrder}
                 {...this.props} 
                />
              </TabPane>
              <TabPane tab="SITE MANAGER ACCOUNT" key="4">
                <WOSiteManagerAccountView
                  workOrder={this.state.workOrder}
                  {...this.props} 
                />
              </TabPane>
              <TabPane tab="BILLING ACCOUNT" key="5">
                <WOBillingAccountView
                  workOrder={this.state.workOrder}
                  {...this.props} 
                />
              </TabPane>
              <TabPane tab="SERVICE VARIANTS" key="6">
                <WOServiceVarientsView
                  workOrder = {this.state.workOrder}
                  {...this.props} 
                />
              </TabPane>
              <TabPane tab="DOCUMENTS" key="7">
                <WODocumentsView
                  workOrder={this.state.workOrder}
                  {...this.props}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(withRouter(WorkOrderViewMain));

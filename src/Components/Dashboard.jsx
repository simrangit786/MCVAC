import React, { Component } from "react";
import DashboardMinHeader from "./min-header/DashboardMinHeader";
import { Image as Images } from "./Images";
import { Button, Tabs } from "antd";
import AllTabs from "./dashboard-inner/tabs-component/AllTabs";
import OpportunitiesTabs from "./dashboard-inner/tabs-component/OpportunitiesTabs";
import ProjectsTabs from "./dashboard-inner/tabs-component/ProjectsTabs";
import ProposalsTabs from "./dashboard-inner/tabs-component/ProposalsTabs";
import WorkOrdersTabs from "./dashboard-inner/tabs-component/WorkOrdersTabs";

const { TabPane } = Tabs;

function callback(key) {}

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <DashboardMinHeader />
          <div className="row mx-0 dashboard-card-row-main justify-content-between">
            <div className="card dashboard-card border-0 d-block">
              <div className="card-img-div float-left h-100 d-flex align-items-center justify-content-center">
                <img
                  src={Images.graph_profit_img}
                  alt="graph img"
                  className="img-fluid"
                />
              </div>
              <div className="card-details-div float-left">
                <h6>Profit</h6>
                <h4 className="blue-color">
                  $6,000.75
                  <Button className="border-0 bg-transparent p-0">
                    <img
                      src={Images.arrow_green_small_upload}
                      alt="upload arrow"
                      className="img-fluid"
                    />
                  </Button>
                </h4>
                <p className="mb-0">+20% This month</p>
              </div>
            </div>

            <div className="card dashboard-card border-0 d-block">
              <div className="card-img-div float-left h-100 d-flex align-items-center justify-content-center">
                <img
                  src={Images.new_proposals_icon_img}
                  alt="new_proposals_icon_img"
                  className="img-fluid"
                />
              </div>
              <div className="card-details-div float-left">
                <h4>
                  67
                  <Button className="border-0 bg-transparent p-0">
                    <img
                      src={Images.arrow_down_red}
                      alt="upload arrow"
                      className="img-fluid"
                    />
                  </Button>
                </h4>
                <h6 className="card-db-h6">New Proposals</h6>
                <p className="mb-0">-20% This month</p>
              </div>
            </div>

            <div className="card dashboard-card border-0 d-block">
              <div className="card-img-div float-left h-100 d-flex align-items-center justify-content-center">
                <img
                  src={Images.work_icon_img}
                  alt="work_icon_img"
                  className="img-fluid"
                />
              </div>
              <div className="card-details-div float-left">
                <h4>
                  22
                  <Button className="border-0 bg-transparent p-0">
                    <img
                      src={Images.arrow_green_small_upload}
                      alt="upload arrow"
                      className="img-fluid"
                    />
                  </Button>
                </h4>
                <h6 className="card-db-h6">Completed Work</h6>
                <p className="mb-0">+20% This month</p>
              </div>
            </div>

            <div className="card dashboard-card border-0 d-block">
              <div className="card-img-div float-left h-100 d-flex align-items-center justify-content-center">
                <img
                  src={Images.new_accounts_img}
                  alt="new_accounts_img"
                  className="img-fluid"
                />
              </div>
              <div className="card-details-div float-left">
                <h4>
                  5
                  <Button className="border-0 bg-transparent p-0">
                    <img
                      src={Images.arrow_down_red}
                      alt="upload arrow"
                      className="img-fluid"
                    />
                  </Button>
                </h4>
                <h6 className="card-db-h6">New Accounts</h6>
                <p className="mb-0">-10% This month</p>
              </div>
            </div>

            <div className="card dashboard-card border-0 d-block">
              <div className="card-img-div float-left h-100 d-flex align-items-center justify-content-center">
                <img
                  src={Images.new_opportunities_img}
                  alt="graph img"
                  className="img-fluid"
                />
              </div>
              <div className="card-details-div float-left">
                <h4>
                  12
                  <Button className="border-0 bg-transparent p-0">
                    <img
                      src={Images.arrow_green_small_upload}
                      alt="upload arrow"
                      className="img-fluid"
                    />
                  </Button>
                </h4>
                <h6 className="card-db-h6">New Opportunities</h6>
                <p className="mb-0">+20% This month</p>
              </div>
            </div>
          </div>
          <div className="row mx-0 dashboard-tabs-card-row-main">
            <div className="col-12">
              <Tabs
                className="main-tab-card-all"
                onChange={callback}
                type="card"
              >
                <TabPane
                  tab={
                    <React.Fragment>
                      <div className="common-heading-div d-flex align-items-center">
                        All
                        <span className="tab-heading-count-card d-flex align-items-center justify-content-center font-weight-bold text-uppercase">
                          102
                        </span>
                      </div>
                      <div className="tabs-design-angle" />
                    </React.Fragment>
                  }
                  key="1"
                >
                  <div className="row tabs-inner-data-row">
                    <div className="col-12">
                      <AllTabs />
                    </div>
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <React.Fragment>
                      <div className="common-heading-div d-flex align-items-center">
                        Work Orders
                        <span className="tab-heading-count-card d-flex align-items-center justify-content-center font-weight-bold text-uppercase">
                          22
                        </span>
                      </div>
                      <div className="tabs-design-angle" />
                    </React.Fragment>
                  }
                  key="2"
                >
                  <div className="row tabs-inner-data-row">
                    <div className="col-12">
                      <WorkOrdersTabs />
                    </div>
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <React.Fragment>
                      <div className="common-heading-div d-flex align-items-center">
                        Proposals
                        <span className="tab-heading-count-card d-flex align-items-center justify-content-center font-weight-bold text-uppercase">
                          35
                        </span>
                      </div>
                      <div className="tabs-design-angle" />
                    </React.Fragment>
                  }
                  key="3"
                >
                  <div className="row tabs-inner-data-row">
                    <div className="col-12">
                      <ProposalsTabs />
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <React.Fragment>
                      <div className="common-heading-div d-flex align-items-center">
                        Projects
                        <span className="tab-heading-count-card d-flex align-items-center justify-content-center font-weight-bold text-uppercase">
                          24
                        </span>
                      </div>
                      <div className="tabs-design-angle" />
                    </React.Fragment>
                  }
                  key="4"
                >
                  <div className="row tabs-inner-data-row">
                    <div className="col-12">
                      <ProjectsTabs />
                    </div>
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <React.Fragment>
                      <div className="common-heading-div d-flex align-items-center">
                        Opportunities
                        <span className="tab-heading-count-card d-flex align-items-center justify-content-center font-weight-bold text-uppercase">
                          21
                        </span>
                      </div>
                      <div className="tabs-design-angle" />
                    </React.Fragment>
                  }
                  key="5"
                >
                  <div className="row tabs-inner-data-row">
                    <div className="col-12">
                      <OpportunitiesTabs />
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;

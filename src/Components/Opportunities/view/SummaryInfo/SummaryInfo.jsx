import React, { Component } from "react";
import { Button, Collapse, Form, Input, Table } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../Images";
// import CreateTask from "../../../drawers/CreateTask";
// import CreateNote from "../../../drawers/CreateNote";
// import ViewContact from "../../../drawers/ViewContact";
// import CreateContact from "../../../modals/CreateContact";
// import ViewAccounts from "../../../drawers/ViewAccounts";
// import AddAccount from "../../../drawers/AddAccount";
import OpportunityInfo from "./OpportunityInfo";
// import AccountContact from "./AccountContact";
import Documents from "./Documents";
import Posts from "./OpportunityPosts";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../Controller/Routes";
import { withRouter } from "react-router-dom";
import Teams from "../Teams";
import { connect } from "react-redux";
import { opportunityDetailAction } from "../../../../Store/actions/opportunityAction";
import OpportunityCustomerAccount from "./OpportunityCustomerAccount";
import OppurtunityOwnerInfo from "./../OppurtunityOwnerInfo";
import ActivityInfo from "../ActivityInfo";
import ProposalsInfo from "../ProposalsInfo";
import { checkOpportunityRequired } from "../../../../Controller/utils";

const { Panel } = Collapse;

const SummaryInfo = props => {
  // state = {
  //   data: [],
  //   visibleTaskCreate: false,
  //   visibleCreateNote: false,
  //   visibleViewContact: false,
  //   visibleCreateContact: false,
  //   visibleViewAccount: false,
  //   visibleAddAccount: false,
  // };

  // showCreateTask = (visible) => {
  //   this.setState({
  //     visibleTaskCreate: visible,
  //   });
  // };

  // showCreateNote = (visible) => {
  //   this.setState({
  //     visibleCreateNote: visible,
  //   });
  // };

  // showViewContact = (visible) => {
  //   this.setState({
  //     visibleViewContact: visible,
  //   });
  // };

  // showCreateContact = (visible) => {
  //   this.setState({
  //     visibleCreateContact: visible,
  //   });
  // };

  // showViewAccount = (visible) => {
  //   this.setState({
  //     visibleViewAccount: visible,
  //   });
  // };

  // showAddAccount = (visible) => {
  //   this.setState({
  //     visibleAddAccount: visible,
  //   });
  // };
    let { onTabChange } = props;
    return (
      <React.Fragment>
        <div className="col-12">
          <div className="row summary-info-inner-row">
            <div className="col-12">
              <Collapse
                // accordion
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        General Information <sup>*</sup>
                      </span>
                      <Button
                        // onClick={() =>
                        //   history.push(
                        //     reverse(routes.dashboard.opportunities.edit, {
                        //       id: props.match.params.id,
                        //     })
                        //   )
                        // }
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.opportunities.edit,
                              { id: props.match.params.id }
                            ),
                            editTab: "1"
                          })
                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="1"
                  forceRender
                >
                  <OpportunityInfo />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Posts</span>
                    </div>
                  }
                  key="7"
                >
                  <Posts hideTitle={false} onTabChange={onTabChange} viewAll={false}/>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Activity</span>
                    </div>
                  }
                  key="8"
                >
                  <ActivityInfo hideTitle={true} onTabChange={onTabChange} viewAll={false}/>
                  {/*<div className="col-12">*/}
                  {/*    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">*/}
                  {/*        <div className="d-flex align-items-center">*/}
                  {/*            <div className="search-bar-div">*/}
                  {/*                <Form className="position-relative">*/}
                  {/*                    <Input placeholder="Search"/>*/}
                  {/*                    <Button*/}
                  {/*                        className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>*/}
                  {/*                        <img src={Images.search_icon_gray} className="img-fluid"*/}
                  {/*                             alt="search icon"/>*/}
                  {/*                    </Button>*/}
                  {/*                </Form>*/}
                  {/*            </div>*/}
                  {/*            /!*<Button className="add-btn-collapse">ADD</Button>*!/*/}
                  {/*        </div>*/}
                  {/*        <Button className="view-all-btn text-uppercase">VIEW ALL </Button>*/}
                  {/*    </div>*/}
                  {/*    <div className="row summary-collapse-inner-row-main px-0 pb-0">*/}
                  {/*        {data.length > 0 ? <div className="col-12 table-responsive main-table-div">*/}
                  {/*                <Table*/}
                  {/*                    className="main-table-all carpet-cleaning-table border-0 activity-info-table"*/}
                  {/*                    columns={this.activityColumns}*/}
                  {/*                    pagination={false}*/}
                  {/*                    locale={{emptyText: 'Not Implemented yet'}}*/}
                  {/*                    dataSource={[]} size="middle"/>*/}
                  {/*            </div>*/}
                  {/*            :*/}
                  {/*            <div className="col-12">*/}
                  {/*                <div*/}
                  {/*                    className="row no-data-upload-screens no-data-second m-0 border-0">*/}
                  {/*                    <div className="col-12 text-center">*/}
                  {/*                        <img src={Images.time_activity_add} alt=""*/}
                  {/*                             className="img-fluid"/>*/}
                  {/*                        <h6 className="mb-0">No Activity</h6>*/}
                  {/*                    </div>*/}
                  {/*                </div>*/}
                  {/*            </div>}*/}
                  {/*    </div>*/}
                  {/*</div>*/}
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Team *</span>
                      <div className="d-flex align-items-center">
                      {checkOpportunityRequired(props?.opportunity,"TEAMS") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                       onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.opportunities.edit,
                            { id: props.match.params.id }
                          ),
                          editTab: "2"
                        })
                      }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                      </div>
                    </div>
                  }
                  key="2"
                  forceRender
                >
                  <Teams opportunity={props.opportunity} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Billing Accounts * 
                      </span>
                      <div className="d-flex align-items-center">
                      {checkOpportunityRequired(props?.opportunity,"CUSTOMER") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                      onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.opportunities.edit,
                            { id: props.match.params.id }
                          ),
                          editTab: "3"
                        })
                      }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                    </div>
                  }
                  key="3"
                >
                  <OpportunityCustomerAccount
                    onTabChange={onTabChange}
                    editBtn={true}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Site Manager Account *
                      </span>
                      <div className="d-flex align-items-center">
                      {checkOpportunityRequired(props?.opportunity,"OWNER") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                       onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.opportunities.edit,
                            { id: props.match.params.id }
                          ),
                          editTab: "4"
                        })
                      }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                    </div>
                  }
                  key="4"
                >
                  <OppurtunityOwnerInfo
                    hideTitle={true}
                    onTabChange={onTabChange}
                  />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Proposals</span>
                    </div>
                  }
                  key="5"
                >
                  <ProposalsInfo hideTitle={true} onTabChange={onTabChange} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Documents</span>
                    </div>
                  }
                  key="6"
                >
                  <Documents hideTitle={true} onTabChange={onTabChange} />
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
        {/* <CreateTask
          visible={this.state.visibleTaskCreate}
          onClose={() => this.showCreateTask(false)}
        />
        <CreateNote
          visible={this.state.visibleCreateNote}
          onClose={() => this.showCreateNote(false)}
        />
        <ViewContact
          visible={this.state.visibleViewContact}
          onClose={() => this.showViewContact(false)}
        />
        <CreateContact
          visible={this.state.visibleCreateContact}
          onClose={() => this.showCreateContact(false)}
        />
        <ViewAccounts
          visible={this.state.visibleViewAccount}
          onClose={() => this.showViewAccount(false)}
        />
        <AddAccount
          visible={this.state.visibleAddAccount}
          onClose={() => this.showAddAccount(false)}
        /> */}
      </React.Fragment>
    );
  }

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps, { opportunityDetailAction })(
  withRouter(SummaryInfo)
);

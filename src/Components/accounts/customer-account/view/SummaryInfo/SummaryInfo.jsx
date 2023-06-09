import React, { Component } from "react";
import { Button, Collapse, Form, Input } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../../Images";
import GeneralInfo from "./GeneralInfo";
import PaymentInfo from "./PaymentInfo";
import AddressInfo from "../AddressInfo";
import ContactsInfo from "../ContactsInfo";
import DocumentsInfo from "../DocumentsInfo";
import OpportunitiesInfo from "../OpportunitiesInfo";
import AssociatedAccounts from "../AssociatedAccounts";
import CustomerPostTab from "../CustomerPostTab";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";
import { withRouter } from "react-router-dom";
import ActivityInfo from "../../../common/ActivityInfo";
import CustomerTeamInfoView from "./CustomerTeamInfoView";
import ProposalCustomerInfo from "../ProposalCustomerInfo";

const { Panel } = Collapse;

function callback(key) {
  // console.log(key);
}

class SummaryInfo extends Component {
  state = {
    visibleTaskCreate: false,
    visibleCreateNote: false,
    visibleViewContact: false,
    visibleCreateContact: false,
    visibleViewAccount: false,
    visibleAddAccount: false,
  };

  showCreateTask = (visible) => {
    this.setState({
      visibleTaskCreate: visible,
    });
  };

  showCreateNote = (visible) => {
    this.setState({
      visibleCreateNote: visible,
    });
  };

  showViewContact = (visible) => {
    this.setState({
      visibleViewContact: visible,
    });
  };

  showCreateContact = (visible) => {
    this.setState({
      visibleCreateContact: visible,
    });
  };

  showViewAccount = (visible) => {
    this.setState({
      visibleViewAccount: visible,
    });
  };

  showAddAccount = (visible) => {
    this.setState({
      visibleAddAccount: visible,
    });
  };
  
  render() {
    const { customer } = this.props;
    return (
      <React.Fragment>
        <div className="col-12">
          <div className="row summary-info-inner-row">
            <div className="col-12">
              <Collapse
                // accordion
                defaultActiveKey={["1"]}
                onChange={callback}
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
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.customer_account.edit,
                              { id: this.props.match.params.id }
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
                >
                  <GeneralInfo />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Posts </span>
                    </div>
                  }
                  key="10"
                >
                  <CustomerPostTab {...this.props} hideTitle />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Activity </span>
                    </div>
                  }
                  key="11"
                >
                  <ActivityInfo {...this.props} hideTitle hideSearch />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Payment Information 
                      </span>
                      <div className="d-flex align-items-center">
                      {/* {checkAccountRequired(customer, "PAYMENT") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)} */}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.customer_account.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "2",
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
                >
                  <PaymentInfo />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Address Information 
                      </span>
                      <div className="d-flex align-items-center">
                      {/* {checkAccountRequired(customer,"ADDRESS") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)} */}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.customer_account.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "3",
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
                  <AddressInfo hideTitle={true} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Contacts </span>
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.customer_account.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "4",
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
                  key="4"
                >
                  <ContactsInfo {...this.props} hideTitle={true} hideSearch viewAll={false} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Team </span>
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.customer_account.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "6",
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
                  key="12"
                >
                  <CustomerTeamInfoView
                    {...this.props}
                    hideTitle={true}
                    hideSearch
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Documents </span>
                    </div>
                  }
                  key="5"
                >
                  <DocumentsInfo {...this.props} hideTitle={true} />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Associated Accounts</span>
                    </div>
                  }
                  key="6"
                >
                  <AssociatedAccounts {...this.props} hideTitle />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Opportunities</span>
                    </div>
                  }
                  key="7"
                >
                  <OpportunitiesInfo {...this.props} hideTitle />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Proposals</span>
                    </div>
                  }
                  key="13"
                >
                  <ProposalCustomerInfo {...this.props} hideTitle viewAll={false} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Projects</span>
                    </div>
                  }
                  key="8"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="d-flex align-items-center">
                        <div className="search-bar-div">
                          <Form className="position-relative">
                            <Input placeholder="Search" />
                            <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                              <img
                                src={Images.search_icon_gray}
                                className="img-fluid"
                                alt="search icon"
                              />
                            </Button>
                          </Form>
                        </div>
                        {/* <Button className="add-btn-collapse text-uppercase">CREATE</Button> */}
                      </div>
                      <Button
                        className="view-all-btn text-uppercase"
                        onClick={() => this.props.tabChange("7")}
                      >
                        VIEW ALL
                      </Button>
                    </div>
                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                      {/*when-no-data-is-available*/}
                      <div className="col-12">
                        <div className="row no-data-upload-screens no-data-second m-0 border-0">
                          <div className="col-12 text-center">
                            <img
                              src={Images.folder_gray_no_data}
                              alt=""
                              className="img-fluid"
                            />
                            <h6 className="mb-0 text-gray-tag">No Project</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center">
                      <span>Work Orders</span>
                    </div>
                  }
                  key="9"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="d-flex align-items-center">
                        <div className="search-bar-div">
                          <Form className="position-relative">
                            <Input placeholder="Search" />
                            <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                              <img
                                src={Images.search_icon_gray}
                                className="img-fluid"
                                alt="search icon"
                              />
                            </Button>
                          </Form>
                        </div>
                        {/* <Button className="add-btn-collapse text-uppercase">
                          CREATE
                        </Button> */}
                      </div>
                      <Button
                        className="view-all-btn text-uppercase"
                        onClick={() => this.props.tabChange("8")}
                      >
                        VIEW ALL
                      </Button>
                    </div>
                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                      {/*when-no-data-is-available*/}
                      <div className="col-12">
                        <div className="row no-data-upload-screens no-data-second m-0 border-0">
                          <div className="col-12 text-center">
                            <img
                              src={Images.work_setting}
                              alt=""
                              className="img-fluid"
                            />
                            <h6 className="mb-0 text-gray-tag">
                              No Work Order
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SummaryInfo);

import React, { Component } from "react";
import { Button, Collapse, Spin } from "antd";
import { Image as Images } from "../../Images";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";
import CreateSendProposal from "../../drawers/proposals/CreateSendProposal";
import { handleError } from "../../../Controller/Global";
import {
  getProposalStatusOptions,
  updateProposal,
} from "../../../Controller/api/proposalServices";
import { withRouter } from "react-router-dom";
import { routes } from "../../../Controller/Routes";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { connect } from "react-redux";
import { reverse } from "named-urls/dist/index.es";
import { history } from "../../../Controller/history";
import ProposalGeneralInfo from "./components/ProposalGeneralInfo";
import ViewProposalSites from "./components/ViewProposalSites";
import ViewProposalCustomerAccount from "./components/ViewProposalCustomerAccount";
import ViewProposalDocuments from "./components/ViewProposalDocuments";
import ViewProposalLineItems from "./components/ViewProposalLineItems";
import ViewProposalPost from "./components/ViewProposalPost";
import ProposalTeamsView from "./components/ProposalTeamsView";
import ProposalActivityView from "./summary-details/ProposalActivityView";
import { Tooltip } from "antd";
import { checkProposalRequired } from "../../../Controller/utils";

const { Panel } = Collapse;
// const STATUS_TYPES = ['created', 'sent', 'waiting_on_response', 'closed', 'moved_to_a_project'];

function getStatusCss(statusIndex, index) {
  if (statusIndex === index) return "active";
  else if (statusIndex > index) return "finish";
}

class ProposalSummary extends Component {
  state = {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
    visible: false,
    visibleDrawer: false,
  };

  handleChange = (e) => {
    updateProposal(this.props.match.params.id, { status: e.value })
      .then((res) => {
        this.props.fetchProposal();
      })
      .catch((err) => {
        handleError(err);
      });
  };
  showSendProposal = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  componentDidMount() {
    this.getProposalStatusOptions();
  }

  getProposalStatusOptions = () => {
    getProposalStatusOptions()
      .then((res) => {
        this.setState({ statusTypes: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    const { sites, proposal, onTabChange, proposal_filled } = this.props;
    const { statusTypes } = this.state;
    if (!proposal) {
      return (
        <div className={"text-center my-2"}>
          <Spin />
        </div>
      );
    }

    const statusIndex = statusTypes?.findIndex(
      (i) => i?.id === proposal?.status?.id
    );
    // console.log(statusIndex);
    return (
      <React.Fragment>
        <div className="col-12">
          <div
            className="row summary-info-row-main"
            style={{ marginBottom: "80px" }}
          > 
            <div className="col-12">
              <div className="row mx-0 summary-info-status-green-line-main">
                {statusTypes?.map((item, index) => {
                  return (
                    <Tooltip
                        placement="top"
                        title={item?.title}
                        overlayStyle={{ fontSize: 11 }}
                        arrowPointAtCenter={true}
                    >
                    <div
                      key={index}
                      className={
                        "summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center " +
                        getStatusCss(statusIndex, index)
                      }
                    >
                      {getStatusCss(statusIndex, index) === "finish" ? (
                        <CheckOutlined />
                      ) : (
                        item?.title
                      )}
                    </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="row mx-0 summary-info-inner-row">
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
                      <div className="d-flex align-items-center">
                        {/*<Button className="print-pdf-btn d-flex align-items-center text-capitalize">*/}
                        {/*    <img src={Images.pdf_icon_gray} alt="" className="img-fluid"/>*/}
                        {/*    Print / Preview*/}
                        {/*</Button>*/}
                        {/*<Button onClick={() => this.showSendProposal(true)}*/}
                        {/*        className="send-proposal-btn d-flex align-items-center text-capitalize">*/}
                        {/*    <img src={Images.send_icon_white} alt="" className="img-fluid"/>*/}
                        {/*    Send Proposal*/}
                        {/*</Button>*/}
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.sales.proposal.edit, {
                                id: this.props.match.params.id,
                              }),
                              editTab:"1"
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
                  key="1"
                >
                  <ProposalGeneralInfo
                    proposal={proposal}
                    handleChange={this.handleChange}
                    onTabChange={this.props.onTabChange}
                    fetchProposal={this.props.fetchProposal}
                    proposal_filled={proposal_filled}
                    statusTypes={statusTypes}
                    callbackSendProposal={() => this.showSendProposal(true)}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Posts</span>
                    </div>
                  }
                  key="7"
                >
                  <ViewProposalPost
                    onTabChange={onTabChange}
                    viewAll={true}
                    {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Activity</span>
                    </div>
                  }
                  key="8"
                >
                  <ProposalActivityView
                    onTabChange={onTabChange}
                    viewAll={true}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Team *</span>
                      <div className="d-flex align-items-center">
                      {checkProposalRequired(proposal,"TEAMS") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.sales.proposal.edit, {
                              id: this.props.match.params.id,
                            }),
                            editTab:"2"
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
                  <ProposalTeamsView proposal={proposal} {...this.props} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Billing Account *</span>
                      <div className="d-flex align-items-center">
                      {checkProposalRequired(proposal,"CUSTOMER") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.sales.proposal.edit, {
                              id: this.props.match.params.id,
                            }),
                            editTab:"3"
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
                  <ViewProposalCustomerAccount
                    onTabChange={onTabChange}
                    hideTitle={true}
                    {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Site Manager Account *</span>
                      <div className="d-flex align-items-center">
                      {checkProposalRequired(proposal,"OWNER") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.sales.proposal.edit, {
                              id: this.props.match.params.id,
                            }),
                            editTab:"4"
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
                  <ViewProposalSites
                    onTabChange={onTabChange}
                    viewAll={true}
                    {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Service Variants<sup>*</sup>
                      </span>
                      <div className="d-flex align-items-center">
                      {checkProposalRequired(proposal,"SERVICE_VARIENT") && (
                        <p className="mb-0 info-signifire mr-3">
                          Please complete required information to avoid issues
                        </p>)}
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.sales.proposal.edit, {
                              id: this.props.match.params.id,
                            }),
                            editTab:"5"
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
                  key="5"
                >
                  <ViewProposalLineItems
                    onTabChange={onTabChange}
                    proposal={proposal}
                    viewAll={true}
                  />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Documents 
                      </span>
                    </div>
                  }
                  key="6"
                >
                  <ViewProposalDocuments
                    proposal={proposal}
                    onTabChange={onTabChange}
                    hideTitle={true}
                  />
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
        <CreateSendProposal
          proposal={proposal}
          visible={this.state.visible}
          onClose={() => this.showSendProposal(false)}
        />
      </React.Fragment>
    );
  }
}

const actionCreators = {
  setBreadcrumb,
};
export default connect(null, actionCreators)(withRouter(ProposalSummary));

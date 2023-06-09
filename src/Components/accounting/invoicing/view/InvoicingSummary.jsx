import React, { Component } from "react";
import { Button, Collapse, Spin, Tooltip } from "antd";
import { Image as Images } from "../../../Images";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";
import CreateSendProposal from "../../../drawers/proposals/CreateSendProposal";
import { handleError } from "../../../../Controller/Global";
import {
  getProposalStatusOptions,
  updateProposal,
} from "../../../../Controller/api/proposalServices";
import InvoicingGeneralInfoView from "./InvoicingGeneralInfoView";
import ViewInvoicingPost from "./ViewInvoicingPost";
import ViewInvoicingActivity from "./ViewInvoicingActivity";
import ViewInvoicingBillingAccounts from "./ViewInvoicingBillingAccounts";
import ViewInvoicingSites from "./ViewInvoicingSites";
import ViewInvoicingDocumnets from "./ViewInvoicingDocumnets";
import ViewInvoicingWorkOrder from "./ViewInvoicingWorkOrder";
import { getInvoiceStatus, updateInvoice } from "../../../../Controller/api/invoiceServices";
import { routes } from "../../../../Controller/Routes";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls";
import { withRouter } from "react-router-dom";
import CreateSendInvoice from "../../../drawers/invoice/CreateSendInvoice";

const { Panel } = Collapse;

function getStatusCss(statusIndex, index) {
  if (statusIndex === index) return "active";
  else if (statusIndex > index) return "finish";
}
class InvoicingSummary extends Component {
  state = {
    data: [],
    loading: false,
    statusTypes: [],
    pagination: {
      current: 1,
      pageSize: 15,
    },
    visible: false,
    visibleDrawer: false,
  };

  handleChange = (e) => {
    const params = {
      status: e.value
    }
    updateInvoice(this.props.Invoice?.id,params)
      .then((res) => {
        this.props.fetchInvoice();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  componentDidMount() {
    this.getInvoiceStatusOptions();
  }

  getInvoiceStatusOptions = () => {
    getInvoiceStatus()
      .then((res) => {
        this.setState({ statusTypes: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  showSendInvoice = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  render() {
    const {Invoice, onTabChange } = this.props;
    const { statusTypes } = this.state;
    // if (!proposal) {
    //   return (
    //     <div className={"text-center my-2"}>
    //       <Spin />
    //     </div>
    //   );
    // }

    const statusIndex = statusTypes?.findIndex(
      (i) => i?.id === Invoice?.status?.id
    );
    // console.log(statusIndex);
    return (
      <React.Fragment>
        <div className="col-12">
          <div
            className="row summary-info-row-main summary-info-row-main-invoice"
            style={{ marginBottom: "80px" }}
          >
            <div className="col-12">
              {/* <div className="row mx-0 summary-info-status-green-line-main">
                <div
                    className="summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center finish">
                  Created
                </div>
                <div className="summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center">
                  Processed / send
                </div>
                <div className="summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center">
                  current / unpaid
                 </div>
                <div className="summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center">
                  past due
                </div>
                <div className="summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center">
                  payment received
                </div>
              </div> */}
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
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.accounting.invoicing.edit, {
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
                  <InvoicingGeneralInfoView
                   Invoice={Invoice}
                   statusTypes={statusTypes}
                   handleChange={this.handleChange}
                   onTabChange={onTabChange}
                   callbackSendInvoice={() => this.showSendInvoice(true)}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Work Orders</span>
                      <div className="d-flex align-items-center">
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.accounting.invoicing.edit, {
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
                >
                  <ViewInvoicingWorkOrder
                  viewAll={true}
                  Invoice={Invoice}
                  {...this.props}
                  />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Posts</span>
                      {/* <div className="d-flex align-items-center">
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.accounting.invoicing.edit, {
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
                      </div> */}
                    </div>
                  }
                  key="6"
                >
                  <ViewInvoicingPost 
                  viewAll={true}
                  Invoice={Invoice}
                  {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Activity</span>
                      {/* <div className="d-flex align-items-center">
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.accounting.invoicing.edit, {
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
                      </div> */}
                    </div>
                  }
                  key="7"
                >
                  <ViewInvoicingActivity viewAll={true}/>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Billing Account *</span>
                      <div className="d-flex align-items-center">
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.accounting.invoicing.edit, {
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
                  <ViewInvoicingBillingAccounts
                   hideTitle={true}
                   Invoice={Invoice}
                   {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Site Manager Account *</span>
                      <div className="d-flex align-items-center">
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.accounting.invoicing.edit, {
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
                  <ViewInvoicingSites 
                  viewAll={true}
                  Invoice={Invoice}
                   {...this.props}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Documents
                      </span>
                      <div className="d-flex align-items-center">
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.accounting.invoicing.edit, {
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
                  <ViewInvoicingDocumnets hideTitle={true} Invoice={Invoice}  {...this.props}/>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
        {this.state.visible &&
        <CreateSendInvoice
          Invoice={Invoice}
          visible={this.state.visible}
          onClose={() => this.showSendInvoice(false)}
        />
  }
      </React.Fragment>
    );
  }
}
export default withRouter(InvoicingSummary);

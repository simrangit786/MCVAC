import React, { Component } from "react";
import { Button, Collapse, Dropdown, Menu, Tooltip } from "antd";
import { CaretRightOutlined, CheckOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../Images";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls";
import { routes } from "../../../../Controller/Routes";
import WOGeneralInfo from "./WOGeneralInfo";
import WOServiceInformation from "./WOServiceInformation";
import WOPosts from "./WOPosts";
import WOActivity from "./WOActivity";
import WOWarehouseDispatchView from "./WOWarehouseDispatchView";
import WOBillingAccountView from "./WOBillingAccountView";
import WOSiteManagerAccountView from "./WOSitemanagerView";
import WOServiceVarientsView from "./WOServiceVarientsView";
import WODocumentsView from "./WODocumentsView";
import WODispatchView from "./WODispatchView";
import { handleError } from "../../../../Controller/Global";
import {
  getWorkOrderStatusOptions,
  updateWorkOrder,
} from "../../../../Controller/api/workOrderServices";
import { withRouter } from "react-router-dom";
import { checkWorkOrderRequired } from "../../../../Controller/utils";
import moment from "moment";
import WorkorderResourceDrawer from "./WorkorderResourceDrawer";
import { postDispatchData, updateDispatchData } from "../../../../Controller/api/dispatchServices";
import DispatchUpdateTimeDrawer from "./DispatchUpdateTimeDrawer";
const _ = require("lodash"); 

const { Panel } = Collapse;

function getStatusCss(statusIndex, index) {
  if (statusIndex === index) return "active";
  else if (statusIndex > index) return "finish";
}

class WorkOrderSummaryView extends Component {
  state = {
    statusTypes: null,
    dispatchInfo: false,
    visibleDrawer: false,
    visible: false,
    updatedWorkorder: null
  };

  child = React.createRef();

  componentDidMount() {
    this.getProjectStatusOptions();
  }

  handleDispatchInfo = (val) => {
    this.setState({ dispatchInfo: val });
  };

  handleChange = (e) => {
     const params = {
       status: e.value
     }
    postDispatchData(params,this.props.workOrder.dispatch.id).then((res) => {
      this.props.fetchWorkOrder();
    }).catch((err) => {
      handleError(err);
    });

  }

  getProjectStatusOptions = () => {
    getWorkOrderStatusOptions()
      .then((res) => {
        this.setState({ statusTypes: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleDispatch = (data) => {
    const checkTabs = data.filter((i) => i === "9");
    if (checkTabs.length) {
      this.handleDispatchInfo(true);
    } else {
      this.handleDispatchInfo(false);
    }
  };

  handleAssignButton = (val) => {
    this.setState({ visibleDrawer: val });
  };

  handleClose = () => {
    this.setState({ visibleDrawer: false });
  };

  handleRemove = (e) => {
    this.handleSelect({ crew_chief: null }, e);
  };

  handleSelect = (params,id) => {
    updateDispatchData(params, id)
      .then((res) => {
        this.props.fetchWorkOrder();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleRemove(item.id)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleTitle = (val) => {
    let text;
    switch (val) {
      case "In Queue":
        return (text = "SCHEDULED/IN QUEUE");
      case "Rescheduled":
        return (text = "NEED TO BE RESCHEDULED");
      case "Canceled":
        return (text = "PERMANENTLY CANCELED");
      case "Not Accepted":
        return (text = "NOT ACCEPTED");
      case "Pending":
        return (text = "Pending");
      case "Accepted":
        return (text = "ACCEPTED");
      case "En Route":
        return (text = "EN ROUTE");
      case "On Site":
        return (text = "ON SITE");
      case "Completed On Site":
        return (text = "COMPLETED: ON SITE");
      case "Completed Work Order":
        return (text = "COMPLETED: WORKORDER");
      case "Service Request":
        return (text = "SERVICE REQUESTED");
      case "Completed":
        return (text = "Completed");
      default:
        break;
    }
  };

  updateTimeDrawer = (val) => {
    if(val == true) {
      this.setState({
        updatedWorkorder: this.props.workOrder
      })
    }
     this.setState({visible: val})
  }

  render() {
    const { workOrder, onTabChange } = this.props;
    const { statusTypes } = this.state;
    const statusIndex = statusTypes?.findIndex(
      (i) => (i?.title).split(" ").join("_").toUpperCase() === workOrder?.status
    );
    return (
      <React.Fragment>
        <div className="col-12">
          <div
            className="row summary-info-row-main"
            style={{ marginBottom: "80px" }}
          >
            <div className="col-12">
              <div className="row mx-0 summary-info-status-green-line-main bar-scroll">
                {statusTypes?.map((item, index) => {
                  return (
                    <Tooltip
                      placement="top"
                      title={item?.title}
                      overlayStyle={{ fontSize: 11 }}
                      arrowPointAtCenter={true}
                    >
                      <div
                        style={{ width: "15.9%" }}
                        key={index}
                        className={
                          "summary-line-main text-uppercase position-relative p-0 d-flex align-items-center justify-content-center " +
                          getStatusCss(statusIndex, index)
                        }
                      >
                        {getStatusCss(statusIndex, index) === "finish" ? (
                          <CheckOutlined />
                        ) : (
                          this.handleTitle(item?.title)
                        )}
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="row summary-info-inner-row">
            <div className="col-12">
              <Collapse
                // accordion
                defaultActiveKey={["1"]}
                onChange={this.handleDispatch}
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
                              pathname: reverse(
                                routes.dashboard.operations.work_order.edit,
                                { id: this.props.match.params.id }
                              ),
                              editTab: "1",
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
                  <WOGeneralInfo
                    workOrder={workOrder}
                    statusTypes={statusTypes}
                    handleChange={this.handleChange}
                    onTabChange={onTabChange}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Service Information *</span>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          {checkWorkOrderRequired(
                            workOrder,
                            "SERVICE_INFO"
                          ) && (
                            <p className="mb-0 info-signifire mr-3">
                              Please complete required information to avoid
                              issues
                            </p>
                          )}
                          <Button
                            onClick={() =>
                              history.push({
                                pathname: reverse(
                                  routes.dashboard.operations.work_order.edit,
                                  { id: this.props.match.params.id }
                                ),
                                editTab: "2",
                                workOrder: workOrder,
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
                    </div>
                  }
                  key="2"
                >
                  <WOServiceInformation workOrder={workOrder} />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Posts</span>
                    </div>
                  }
                  key="3"
                >
                  <WOPosts
                    workOrder={workOrder}
                    onTabChange={onTabChange}
                    viewAll={true}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Activity</span>
                    </div>
                  }
                  key="4"
                >
                  <WOActivity
                    workOrder={this.props.workOrder}
                    onTabChange={onTabChange}
                    viewAll={true}
                  />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Warehouse / Dispatch *</span>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          {checkWorkOrderRequired(workOrder, "WAREHOUSE") && (
                            <p className="mb-0 info-signifire mr-3">
                              Please complete required information to avoid
                              issues
                            </p>
                          )}
                          <Button
                            onClick={() =>
                              history.push({
                                pathname: reverse(
                                  routes.dashboard.operations.work_order.edit,
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
                    </div>
                  }
                  key="5"
                >
                  <WOWarehouseDispatchView workOrder={this.props.workOrder} />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Billing Account *</span>
                      <div className="d-flex align-items-center">
                        {checkWorkOrderRequired(workOrder, "CUSTOMER") && (
                          <p className="mb-0 info-signifire mr-3">
                            Please complete required information to avoid issues
                          </p>
                        )}
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(
                                routes.dashboard.operations.work_order.edit,
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
                    </div>
                  }
                  key="6"
                >
                  <WOBillingAccountView
                    workOrder={workOrder}
                    onTabChange={onTabChange}
                    hideTitle={true}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Site Manager Account *</span>
                      <div className="d-flex align-items-center">
                        {checkWorkOrderRequired(workOrder, "OWNER") && (
                          <p className="mb-0 info-signifire mr-3">
                            Please complete required information to avoid issues
                          </p>
                        )}
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(
                                routes.dashboard.operations.work_order.edit,
                                { id: this.props.match.params.id }
                              ),
                              editTab: "5",
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
                  key="7"
                >
                  <WOSiteManagerAccountView
                    workOrder={workOrder}
                    onTabChange={onTabChange}
                    viewAll={true}
                  />
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Service Variants<sup>*</sup>
                      </span>
                      <div className="d-flex align-items-center">
                        {checkWorkOrderRequired(
                          workOrder,
                          "SERVICE_VARIENT"
                        ) && (
                          <p className="mb-0 info-signifire mr-3">
                            Please complete required information to avoid issues
                          </p>
                        )}
                        <Button
                          onClick={() =>
                            history.push({
                              pathname: reverse(
                                routes.dashboard.operations.work_order.edit,
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
                    </div>
                  }
                  key="8"
                >
                  <WOServiceVarientsView
                    onTabChange={onTabChange}
                    viewAll={true}
                    workOrder={workOrder}
                  />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse">
                      <div className="row mx-0 align-items-center justify-content-between">
                        <span>Dispatch</span>
                        <div className="d-flex align-items-center">
                          {this.props.workOrder?.workorder_variant?.length ? (
                            <Button
                              className="edit-btn-summary"
                              onClick={() => this.handleAssignButton(true)}
                            >
                              <img
                                src={Images.plus_green_icon}
                                alt=""
                                className="img-fluid"
                              />
                              Assign
                            </Button>
                          ) : (
                            <Button className="edit-btn-summary">
                              <img
                                src={Images.pencil_green}
                                alt=""
                                className="img-fluid"
                              />
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                      {this.state.dispatchInfo &&
                      this.props.workOrder?.workorder_variant?.length ? (
                        <div className="row dispatch-info-header">
                          <div
                            className="col-12"
                            style={{
                              borderBottom: "1px solid #f2f2f2",
                              paddingBottom: "15px",
                              marginBottom: "15px",
                            }}
                          >
                            <div className="row">
                              <div className="col-12 col-sm-6">  
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    <h6 className="text-uppercase">
                                      Service Information
                                    </h6>
                                  </li>
                                  <li className="list-inline-item">
                                    <Button className="update_time_button" onClick={(e) => {
                                      this.updateTimeDrawer(true);
                                      e.stopPropagation();
                                      // e.preventDefault();
                                      }}>Update Time</Button>
                                  </li>
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    Start Time
                                  </li>
                                  <li className="list-inline-item">
                                    {workOrder?.new_en_route_time ? moment(workOrder.new_en_route_time).format("hh:mm a") : "-"}
                                  </li>
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    On Site Time
                                  </li>
                                  <li className="list-inline-item">{workOrder?.new_on_site_time ? moment(workOrder?.new_on_site_time).format("hh:mm a"): "-"}</li>
                                  {/* <li className="list-inline-item">{workOrder?.on_site_time ? this.handleTimeStamp(workOrder?.on_site_time) : "-"}</li> */}
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    Leave Site Time
                                  </li>
                                  <li className="list-inline-item">{workOrder?.new_leave_site_time ? moment(workOrder?.new_leave_site_time).format("hh:mm a"): "-"}</li>
                                  {/* <li className="list-inline-item">{workOrder?.completed_site_time ? this.handleTimeStamp(workOrder?.leave_site_time) : "-"}</li> */}
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">End Time</li>
                                  <li className="list-inline-item">
                                  <li className="list-inline-item">{workOrder?.new_completed_order_time ? moment(workOrder?.new_completed_order_time).format("hh:mm a"): "-"}</li>
                                    {/* <li className="list-inline-item">{workOrder?.end_time ? this.handleTimeStamp(workOrder?.completed_order_time) : "-"}</li> */}
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-6">
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    <h6 className="text-uppercase">
                                      Disposal Information
                                    </h6>
                                  </li>
                  
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    Disposal time(if any)
                                  </li>
                                  <li className="list-inline-item">{_.get(workOrder,'dispatch.dispatch_disposal.0.created') ? moment(_.get(workOrder,'dispatch.dispatch_disposal.0.created')).format("hh:mm a") : "-"}</li>
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    Disposal ticket number
                                  </li>
                                  <li className="list-inline-item">{_.get(workOrder,'dispatch.dispatch_disposal.0.ticket') || "-"}</li>
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    Loaded weight
                                  </li>
                                  <li className="list-inline-item">{_.get(workOrder,'dispatch.dispatch_disposal.0.loaded_weight') ? parseInt(_.get(workOrder, 'dispatch.dispatch_disposal[0].loaded_weight')).toFixed(2) : "-"} {_.get(workOrder?.dispatch,'dispatch_disposal[0].loaded_uom.name')}</li>
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    Unloaded weight
                                  </li>
                                  <li className="list-inline-item">{_.get(workOrder,'dispatch.dispatch_disposal.0.unloaded_weight') ? (parseInt(_.get(workOrder?.dispatch,'dispatch_disposal[0].unloaded_weight')).toFixed(2)) : "-" } {_.get(workOrder?.dispatch,'dispatch_disposal[0].unloaded_uom.name')}</li>
                                </ul>
                                <ul className="list-inline mb-0">
                                  <li className="list-inline-item">
                                    Net Weight load
                                  </li>
                                  <li className="list-inline-item">{_.get(workOrder,'dispatch.dispatch_disposal.0.net_weight') ? (parseInt(_.get(workOrder?.dispatch,'dispatch_disposal[0].net_weight')).toFixed(2)) : "-" } {_.get(workOrder?.dispatch,'dispatch_disposal[0].net_uom.name')}</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          {!this.props.workOrder?.dispatch?.crew_chief ? (
                            <div className="col-12 col-sm-7">
                              <div
                                style={{
                                  height: "75px",
                                  marginBottom: "0",
                                }}
                                className="row mx-0 align-items-center no-data-card-row"
                              >
                                <div className="col-12 text-center">
                                  <img
                                    alt={""}
                                    className="img-fluid"
                                    src={Images.creq_chef_small}
                                  />
                                  <h6 className="mb-0 text-gray-tag">
                                    No Crew Chief
                                  </h6>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="col-12 col-sm-7">
                              <div className="row contact-row-line">
                                <div className="col-12">
                                  <div
                                    style={{
                                      height: "68px",
                                      minHeight: "68px",
                                    }}
                                    className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main"
                                  >
                                    <div className="col-12">
                                      <div className="row mx-0 align-items-center">
                                        <div
                                          style={{ width: "80%" }}
                                          className="d-flex align-items-center float-left"
                                        >
                                          <div className="user-icons-div">
                                            <span className="text-uppercase user-name-tg">
                                              {
                                                this.props.workOrder?.dispatch?.crew_chief
                                                  .split(" ")[0]
                                                  .split("")[0]
                                              }
                                              {
                                                this.props.workOrder?.dispatch?.crew_chief
                                                  .split(" ")[1]
                                                  .split("")[0]
                                              }
                                            </span>
                                          </div>
                                          <div className="user-info-div pt-0">
                                            <h6>
                                              {
                                                this.props.workOrder?.dispatch
                                                  ?.crew_chief
                                              }
                                            </h6>
                                          </div>
                                        </div>
                                        <div
                                          style={{ width: "20%" }}
                                          className="resource-name float-left text-right"
                                        >
                                          Crew Chief
                                        </div>
                                      </div>
                                      <Dropdown
                          overlayClassName="add-remove-dropdown-main"
                          overlay={this.menu(this.props.workOrder?.dispatch)}
                          trigger={["click"]}
                        >
                          <Button
                            className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src={Images.more_black}
                              alt=""
                              className="img-fluid"
                            />
                          </Button>
                        </Dropdown>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  }
                  key="9"
                >
                  <WODispatchView
                    hideTitle={true}
                    workOrder={workOrder}
                    handleDispatchInfo={this.handleDispatchInfo}
                  />
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Documents</span>
                    </div>
                  }
                  key="10"
                >
                  <WODocumentsView
                    workOrder={workOrder}
                    onTabChange={onTabChange}
                    hideTitle={true}
                  />
                </Panel>
              </Collapse>
              <WorkorderResourceDrawer
                visible={this.state.visibleDrawer}
                handleClose={this.handleClose}
                workOrder={this.props.workOrder}
                fetchWorkOrder={this.props.fetchWorkOrder}
              />
              {this.state.updatedWorkorder &&
              <DispatchUpdateTimeDrawer 
               visible = {this.state.visible}
               ref = {this.child}
               fetchWorkOrder = {this.props.fetchWorkOrder}
               workOrder = {this.state.updatedWorkorder}
               onClose = {() => {this.updateTimeDrawer(false)}}
              />
  }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(WorkOrderSummaryView);

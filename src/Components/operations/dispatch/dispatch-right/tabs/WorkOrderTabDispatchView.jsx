import React, { Component } from "react";
import { Button, DatePicker, Dropdown, Menu, Select, Spin } from "antd";
import { Image as Images } from "../../../../Images";
// import {CheckOutlined} from "@ant-design/icons";
import Board from "react-trello";
import { CheckOutlined } from "@ant-design/icons";
import { getWorkOrderServiceVarient } from "../../../../../Controller/api/workOrderServices";
import { handleError } from "../../../../../Controller/Global";
import isEmpty from "lodash/isEmpty";
import {
  getDispatchedCardData,
  getDispatchNowStatus,
  getDispatchStatus,
  postDispatchData,
} from "../../../../../Controller/api/dispatchServices";
import DispatchResourceDrawer from "../../drawer/DispatchResourceDrawer";
import { Option } from "antd/lib/mentions";
import moment from "moment";
import {
  getDecrementDate,
  getIncrementDate,
} from "../../../../../Controller/utils";

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
  </Menu>
);

class WorkOrderTabDispatchView extends Component {
  state = {
    visible: false,
    workOrder: [],
    data: {},
    newPricing: [],
    page: 1,
    loading: false,
    inqueue: [],
    enroute: [],
    dispatched: [],
    visibleResource: false,
    dispatchCard: {},
    cardData: "",
    date: "",
    closeDate: "",
    assignPending: false,
  };

  child = React.createRef();

  handleDrawer = (visible, data,val) => {
    this.setState({ visibleResource: visible, cardData: data, assignPending: val }, () => {
      this.child.current.handleDispatchDataById();
    });
  };

  handleClose = () => {
    this.setState({ visibleResource: false }, () => {
      this.getDispatchEnroute({ service_date: this.state.closeDate, warehouse: this.props.warehouseId});
      this.getDispatchInqueue({ service_date: this.state.closeDate, warehouse: this.props.warehouseId });
      this.getDispatchDispatched({ service_date: this.state.closeDate, warehouse: this.props.warehouseId });
    });
  };

  componentDidMount() {
    this.handleCalender();
  }

  handleCalender = () => {
    let d = new Date();
    let dateParams = moment(d).format("YYYY-MM-DD");
    this.setState({ closeDate: dateParams });
    this.setState({ date: d }, () => {
      this.getDispatchInqueue({ service_date: dateParams , warehouse: this.props.warehouseId});
      this.getDispatchEnroute({ service_date: dateParams , warehouse: this.props.warehouseId});
      this.getDispatchDispatched({ service_date: dateParams , warehouse: this.props.warehouseId});

    });
  };
  getSelectedServiceVariants = () => {
    const { workOrder } = this.state;
    getWorkOrderServiceVarient({ workorder: workOrder?.id })
      .then(async (resp) => {
        this.setState({ newPricing: resp.data });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  checkAddressSitePresent = (res) => {
    let site =
      res?.workorder?.work_owner_contact?.length &&
      res?.workorder?.work_owner_contact[0]?.site?.length &&
      res?.workorder?.work_owner_contact[0]?.site[0]?.site;
    if (site) {
      return site;
    } else {
      return null;
    }
  };

  getDispatchInqueue = (params = {}) => {
    this.setState({ loading: true });
    getDispatchStatus(params)
      .then((res) => {
        this.setState({ inqueue: res.data.results, loading: false }, () => {
          this.setlineItems();
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getDispatchDispatched = (params = {}) => {
    getDispatchedCardData(params)
      .then((res) => {
        this.setState({ dispatched: res.data.results });
        this.setlineItems();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getDispatchEnroute = (params = {}) => {
    getDispatchNowStatus(params)
      .then((res) => {
        this.setState({ enroute: res.data.results });
        this.setlineItems();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleStatusChange = (value, id) => {
    const params = {
      status: value,
    };
    postDispatchData(params, id)
      .then((res) => {
        this.getDispatchInqueue({service_date: this.state.closeDate, warehouse: this.props.warehouseId});
        this.getDispatchEnroute({service_date: this.state.closeDate, warehouse: this.props.warehouseId});
        this.props.fetchWorkorder({warehouse: this.props.warehouseId});
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleIncreaseDate = () => {
    let dateInput = new Date(this.state.date);
    let increasedDate = getIncrementDate(dateInput, 1);
    let dateParams = moment(increasedDate).format("YYYY-MM-DD");
    this.setState({ closeDate: dateParams });
    this.setState({ date: increasedDate }, () => {
      this.getDispatchInqueue({ service_date: dateParams, warehouse: this.props.warehouseId });
      this.getDispatchEnroute({ service_date: dateParams, warehouse: this.props.warehouseId });
      this.getDispatchDispatched({ service_date: dateParams, warehouse: this.props.warehouseId });
    });
  };

  handleDecrementDate = () => {
    var dateInput = new Date(this.state.date);
    let decreaseDate = getDecrementDate(dateInput, 1);
    let dateParams = moment(decreaseDate).format("YYYY-MM-DD");
    this.setState({ closeDate: dateParams });
    this.setState({ date: decreaseDate }, () => {
      this.getDispatchInqueue({ service_date: dateParams, warehouse: this.props.warehouseId });
      this.getDispatchEnroute({ service_date: dateParams, warehouse: this.props.warehouseId });
      this.getDispatchDispatched({ service_date: dateParams, warehouse: this.props.warehouseId });
    });
  };

  handleDataCalendar = (val) => {
    let dateParams = moment(val).format("YYYY-MM-DD")
    this.setState({closeDate: dateParams})
    this.setState({date: val},() => {
      this.getDispatchInqueue({ service_date: dateParams, warehouse: this.props.warehouseId });
      this.getDispatchEnroute({ service_date: dateParams, warehouse: this.props.warehouseId });
      this.getDispatchDispatched({ service_date: dateParams, warehouse: this.props.warehouseId });

    })

  }

  setlineItems = () => {
    const data = {
      lanes: [
        {
          id: "lane1",
          title: (
            <div className="data-details-inn d-flex align-items-center justify-content-center">
              <h6 className="mb-0">Assign resources</h6>
            </div>
          ),
          cards: this.state.inqueue.map((res) => {
            let site = this.checkAddressSitePresent(res);
            return {
              id: res.id.toString(),
              title: false,
              description: (
                <div className="row">
                  <div className="w-100 d-inline-block px-3">
                    <h6 className="mb-0 position-relative">
                      {/* <Dropdown
                        overlayClassName="add-remove-dropdown-main dispatch-dropdown"
                        placement="bottomCenter"
                        overlay={
                          <Menu>
                            <Menu.Item
                              onClick={() =>
                                this.handleStatusChange("RESCHEDULED", res.id)
                              }
                              key="0"
                            >
                              <Button className="bg-transparent border-0 shadow-none p-0">
                                Remove from calendar
                              </Button>
                            </Menu.Item>
                            <Menu.Item
                              onClick={() =>
                                this.handleStatusChange("CANCELED", res.id)
                              }
                              key="0"
                            >
                              <Button className="bg-transparent border-0 shadow-none p-0">
                                Permanently Cancel
                              </Button>
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                      >
                        <Button
                          style={{
                            right: 0,
                          }}
                          className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            src={Images.black_dots_elipsis}
                            alt=""
                            className="img-fluid"
                          />
                        </Button>
                      </Dropdown> */}
                      <span className="total-assign">{res.workorder?.id}</span>{" "}
                      <span className="line-y">|</span>{" "}
                      {res.workorder?.project?.name}{" "}
                    </h6>
                    <p className="mb-0">
                      {res.workorder?.work_owner_contact.length &&
                        res.workorder?.work_owner_contact[0].account.name}
                    </p>
                    <p className="site-address-dispatch">
                      <img
                        src={Images.location_gray_dispatch_14}
                        alt=""
                        className="img-fluid"
                      />
                      {site?.apartment || ""} {site?.street_address || ""}{" "}
                      {site?.city || ""} {site?.state}
                    </p>
                    <div
                      style={{ marginTop: "15px" }}
                      className="rescheduled-div p-0 shadow-none bg-transprent"
                    >
                      <Select
                        className="status-small-select"
                        // placeholder={i.status}
                        value={
                          res?.status == "NOT_ACCEPTED"
                            ? "Not Accepted"
                            : res?.status
                        }
                        style={{
                          width: "100%",
                          textAlign: "center",
                          fontSize: "13px",
                          color: res.status === "NOT_ACCEPTED" && "red",
                        }}
                        onChange={(e) => this.handleStatusChange(e, res.id)}
                        suffixIcon={
                          <img
                            src={Images.caret_small_icon_select}
                            alt=""
                            className="img-fluid"
                          />
                        }
                      >
                        <Option value={"SERVICE_REQUEST"}>
                          Service Request
                        </Option>
                        <Option value={"RESCHEDULED"}>
                          Need to be Rescheduled
                        </Option>
                        <Option value={"CANCELED"}>Permanently Canceled</Option>
                        <Option value={"IN_QUEUE"}>Scheduled/In Queue</Option>
                      </Select>
                    </div>
                    <Button
                      style={{ backgroundColor: "#38BC94" }}
                      className="common-project-btn assign-btn"
                      // className="common-project-btn assign-btn"
                      // onClick={() => this.showServiceVarient(true, res)}
                      onClick={() => this.handleDrawer(true, res)}
                    >
                      Assign resources
                    </Button>
                  </div>
                </div>
              ),
            };
          }),
        },
        {
          id: "lane2",
          title: (
            <div className="data-details-inn d-flex align-items-center justify-content-center">
              <h6 className="mb-0">WAITING ON CREW CHIEF</h6>
            </div>
          ),
          cards: this.state.enroute.map((res) => {
            let site = this.checkAddressSitePresent(res);
            return {
              id: "Card2",
              title: false,
              description: (
                <div className="row">
                  <div className="w-100 d-inline-block px-3">
                    <h6 className="mb-0">
                      <span className="total-assign">{res.workorder?.id}</span>{" "}
                      <span className="line-y">|</span>{" "}
                      {res.workorder?.project?.name}
                    </h6>
                    <p className="mb-0">
                      {res.workorder?.work_owner_contact.length &&
                        res.workorder?.work_owner_contact[0].account.name}
                    </p>
                    <p className="site-address-dispatch">
                      <img
                        src={Images.location_gray_dispatch_14}
                        alt=""
                        className="img-fluid"
                      />
                      {site?.apartment || ""} {site?.street_address || ""}{" "}
                      {site?.city || ""} {site?.state}
                    </p>
                    <div
                      style={{ marginTop: "15px" }}
                      className="rescheduled-div p-0 shadow-none bg-transprent"
                    >
                      {/* {res.status} */}
                      <Select
                        className="status-small-select"
                        // placeholder={i.status}
                        value={res?.status.split("_").join(" ")}
                        style={{
                          width: "100%",
                          textAlign: "center",
                          fontSize: "13px",
                        }}
                        onChange={(e) => this.handleStatusChange(e, res.id)}
                        suffixIcon={
                          <img
                            src={Images.caret_small_icon_select}
                            alt=""
                            className="img-fluid"
                          />
                        }
                      >
                        <Option value={"SERVICE_REQUEST"}>
                          Service Request
                        </Option>
                        <Option value={"RESCHEDULED"}>
                          Need to be Rescheduled
                        </Option>
                        <Option value={"CANCELED"}>Permanently Canceled</Option>
                        <Option value={"IN_QUEUE"}>In Queue</Option>
                      </Select>
                    </div>
                    <Button
                      // style={{ backgroundColor: "#38BC94" }}
                      // className="common-project-btn assign-btn"
                      className="common-project-btn assign-btn"
                      onClick={() => this.handleDrawer(true, res,true,"Pending")}
                    >
                      REVIEW
                    </Button>
                  </div>
                </div>
              ),
            };
          }),
        },
        {
          id: "lane3",
          title: (
            <div className="data-details-inn d-flex align-items-center justify-content-center">
              <h6 className="mb-0">ACCEPTED</h6>
            </div>
          ),
          cards: this.state.dispatched.map((res) => {
            let site = this.checkAddressSitePresent(res);
            return {
              id: "Card3",
              title: false,
              description: (
                <div className="row">
                  <div className="w-100 d-inline-block px-3">
                    <h6 className="mb-0">
                      <span className="total-assign">{res.workorder?.id}</span>{" "}
                      <span className="line-y">|</span>{" "}
                      {res.workorder?.project?.name}
                    </h6>
                    <p className="mb-0">
                      {res.workorder?.work_owner_contact.length &&
                        res.workorder?.work_owner_contact[0].account.name}
                    </p>
                    <p className="site-address-dispatch">
                      <img
                        src={Images.location_gray_dispatch_14}
                        alt=""
                        className="img-fluid"
                      />
                      {site?.apartment || ""} {site?.street_address || ""}{" "}
                      {site?.city || ""} {site?.state}
                    </p>
                    <div className="tag-common rescheduled-div">
                      {res?.status.split("_").join(" ")}
                    </div>
                    <Button
                      style={{
                        backgroundColor: "#F7FEFC",
                        color: "#38BC94",
                        boxShadow: "none",
                      }}
                      className="common-project-btn assign-btn"
                    >
                      <CheckOutlined />
                      Dispatched
                    </Button>
                  </div>
                </div>
              ),
            };
          }),
        },
      ],
    };
    this.setState({ data });
  };

  render() {
    const { workOrder, data, newPricing } = this.state;
    return (
      <div className="row dispatch-left-min-header-row">
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="row drag-drop-main-row mx-0">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12 px-0 data-header-employees">
                      <div
                        style={{
                          minHeight: "56px",
                          width: "100%",
                        }}
                        className="box-1-header justify-content-center"
                      >
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item">
                            <Button
                              className="arrow-btn"
                              onClick={this.handleDecrementDate}
                            >
                              <img
                                src={Images.arrow_small_left}
                                alt={""}
                                className="img-fluid"
                              />
                            </Button>
                          </li>
                          <li className="list-inline-item">
                            {/* Tue, May 4{" "} */}
                            {`${this.state.date?.toString()?.split(" ")[0]}, ${
                              this.state.date?.toString()?.split(" ")[1]
                            } ${this.state.date?.toString()?.split(" ")[2]}`}
                            {/* <img
                              src={Images.calendar_green}
                              className="img-fluid ml-1"
                              alt={""}
                            /> */}
                            <DatePicker format={'YYYY-MM-DD'} className={"datePicker-calendar"} onChange={this.handleDataCalendar} allowClear={false}/>
                          </li>
                          <li className="list-inline-item">
                            <Button
                              className="arrow-btn"
                              onClick={this.handleIncreaseDate}
                            >
                              <img
                                src={Images.arrow_small_right}
                                alt={""}
                                className="img-fluid"
                              />
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-12 px-0 data-header-employees data-header-employees-scroll">
                      {/* <div
                                            className="common-box-calender box-1-header box-1-header-main d-inline-block p-0">
                                            <div style={{ minHeight: '100px' }}
                                                className="box-1-left d-flex align-items-center justify-content-center">
                                                <div className="no-time-div h-auto">No Time</div>
                                            </div>
                                            <div className="box-1-left scroll-time-list">
                                                <ul className="list-inline mb-0">
                                                    {/* <li>07:00 AM</li>
                                                    <li>07:30 AM</li>
                                                    <li>08:00 AM</li>
                                                    <li>08:30 AM</li>
                                                    <li>09:00 AM</li>
                                                    <li>09:30 AM</li>
                                                    <li>10:00 AM</li>
                                                    <li>10:30 AM</li>
                                                    <li>11:00 AM</li>
                                                    <li>11:30 AM</li>
                                                    <li>12:00 AM</li>
                                                    <li>12:30 PM</li>
                                                    <li>01:00 PM</li>
                                                    <li>01:30 PM</li>
                                                    <li>02:00 PM</li>
                                                    <li>02:30 PM</li>
                                                    <li>03:00 PM</li>
                                                    <li>03:30 PM</li>
                                                    <li>04:00 PM</li>
                                                    <li>04:30 PM</li>
                                                    <li>05:00 PM</li>
                                                    <li>05:30 PM</li>
                                                    <li>06:00 PM</li>
                                                    <li>06:30 PM</li>
                                                    <li>07:00 PM</li>
                                                    <li>07:30 PM</li>
                                                    <li>08:00 PM</li>
                                                    <li>08:30 PM</li>
                                                    <li>09:00 PM</li>
                                                    <li>09:30 PM</li>
                                                    <li>10:00 PM</li>
                                                    <li>10:30 PM</li>
                                                    <li>11:00 PM</li>
                                                    <li>11:30 PM</li>
                                                    <li>12:00 PM</li>
                                                    <li>12:30 AM</li>
                                                    <li>01:00 AM</li>
                                                    <li>01:30 AM</li>
                                                    <li>02:00 AM</li>
                                                    <li>02:30 AM</li>
                                                    <li>03:00 AM</li>
                                                    <li>03:30 AM</li>
                                                    <li>04:00 AM</li>
                                                    <li>04:30 AM</li>
                                                    <li>05:00 AM</li>
                                                    <li>05:30 AM</li>
                                                    <li>06:00 AM</li>
                                                    <li>06:30 AM</li> */}
                      {/* </ul> */}
                      {/* </div> */}
                      {/* </div>  */}
                      <div
                        className="data-header-employees-scroll-common"
                        onScroll={this.handleScroll}
                      >
                        <div className="row mx-0 data-card-main">
                          <div className="col-12 p-0">
                            {/* <Board className={'custom-data-board'} data={data}/> */}
                            {!isEmpty(data) ? (
                              <Board
                                className={"custom-data-board"}
                                data={data}
                              />
                            ) : (
                              <div className="text-center">
                                <Spin />
                                {/* <h1>uydgbjknsk</h1> */}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.cardData ? (
          <DispatchResourceDrawer
            assignPending={this.state.assignPending}
            ref={this.child}
            visible={this.state.visibleResource}
            handleClose={this.handleClose}
            handleDispatchNow={this.props.handleDispatchNow}
            workOrder={this.state.cardData}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default WorkOrderTabDispatchView;

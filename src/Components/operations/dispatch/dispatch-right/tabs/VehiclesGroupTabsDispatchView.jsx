import React, { Component } from "react";
import { Breadcrumb, Button, DatePicker, Dropdown, Menu, message, Spin } from "antd";
import { Image as Images } from "../../../../Images";
// import {CheckOutlined} from "@ant-design/icons";
import Board from "react-trello";
import { CheckOutlined } from "@ant-design/icons";
import {
  getDispatchFleetGroup,
  getWorkOrderDispatch,
  getWorkOrderGroupDispatch,
  getWorkOrderServiceVarient,
  updateWorkOrderDispatch,
  updateWorkOrderGroupDispatch,
} from "../../../../../Controller/api/workOrderServices";
import { handleError } from "../../../../../Controller/Global";
import DispatchAssignServiceVarientModal from "../../drawer/DispatchAssignServiceVarientModal";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";
import { getDecrementDate, getIncrementDate } from "../../../../../Controller/utils";
import moment from "moment";
import { updateDispatchData, updateDispatchFleetGroupData } from "../../../../../Controller/api/dispatchServices";
import DispatchAssignServiceVariantDrawer from "../../drawer/DispatchAssignServiceVariantDrawer";

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
  </Menu>
);

class VehiclesGroupTabsDispatchView extends Component {
  state = {
    visible: false,
    workOrder: [],
    data: {},
    newPricing: [],
    page: 1,
    loading: false,
    inqueue: [],
    dispatchFleetGroup: [],
    date: "",
    closeDate: "",
  };

  child = React.createRef()

  showServiceVarient = (visible, res) => {
    this.setState(
      {
        visible: visible,
        workOrder: res,
      },
      () => {
        if (res !== undefined) {
          this.getSelectedServiceVariants();
        }
      }
    );
  };

  componentDidMount() {
    this.handleCalender()
    this.props.handleFleetGroupCall("fleetGroup")
  }

  handleCalender = () => {
    let d = new Date();
    let dateParams = moment(d).format("YYYY-MM-DD");
    this.setState({closeDate: dateParams})
    this.setState({ date: d }, () => {
      this.getWorkOrderInqueue({ service_date: dateParams });
      this.getDispatchFleetGroupData({ service_date: dateParams });
    });
  };

  handleIncreaseDate = () => {
    let dateInput = new Date(this.state.date);
    let increasedDate = getIncrementDate(dateInput,1)
    let dateParams = moment(increasedDate).format("YYYY-MM-DD");
    this.setState({closeDate: dateParams})
    this.setState({ date: increasedDate }, () => {
        this.getWorkOrderInqueue({ service_date: dateParams });
        this.getDispatchFleetGroupData({ service_date: dateParams })
        
    });
  };

  handleDecrementDate = () => {
    var dateInput = new Date(this.state.date);
    let decreaseDate = getDecrementDate(dateInput,1)
    let dateParams = moment(decreaseDate).format("YYYY-MM-DD");
    this.setState({closeDate: dateParams})
    this.setState({ date: decreaseDate }, () => {
        this.getWorkOrderInqueue({ service_date: dateParams });
        this.getDispatchFleetGroupData({ service_date: dateParams })
    });
  };

  handleDragEnd = async (cardId,sourceLaneId,targetLaneId, position, cardDetails) => {
    let params = {}
    if(targetLaneId == "lane1"){
      params = {
        workorder: cardDetails.id,
        vehicle:  sourceLaneId,
        service_date: this.state.closeDate
      }
    } else {
    params ={
      workorder: cardId,
      vehicle: targetLaneId,
      service_date: this.state.closeDate
    }
  }
    await updateDispatchFleetGroupData(params).then((res) =>{
      this.getWorkOrderInqueue({ service_date: this.state.closeDate });
      this.getDispatchFleetGroupData({ service_date: this.state.closeDate })
      message.success("Successfully dragged")

        
    }).catch((err) => {
      const {inqueue, dispatchFleetGroup} = this.state
      this.setState({inqueue: [...inqueue], dispatchFleetGroup: [...dispatchFleetGroup]}, () => this.setlineItems())
    })
    }

  getSelectedServiceVariants = () => {
    const { workOrder } = this.state;
    getWorkOrderServiceVarient({ workorder: workOrder?.id })
      .then(async (resp) => {
        this.setState({ newPricing: resp.data }, () => {
          // if (ADDED_NEW) {
          //     fetchWorkOrder(workOrder?.id);
          // }
          this.child.current.handleDispatchDataById(this.state.workOrder?.dispatch.id)
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  checkAddressSitePresent = (res) => {
    let site =
      res?.work_owner_contact?.length &&
      res?.work_owner_contact[0]?.site?.length &&
      res?.work_owner_contact[0]?.site[0]?.site;
    if (site) {
      return site;
    } else {
      return null;
    }
  };

  getDispatchFleetGroupData = (params={}) => {
    getDispatchFleetGroup(params).then((res) => {
      this.setState({ dispatchFleetGroup: res.data.results });
      this.setlineItems()
    }).catch((err) => {
        handleError(err);
    })
  };

  getWorkOrderInqueue = (params={}) => {
    this.setState({ loading: true });
    getWorkOrderGroupDispatch({...params, status: "IN_QUEUE", page: this.state.page })
      .then((res) => {
        this.setState({ inqueue: res.data.results, loading: false });
        this.setlineItems();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleRemove = (id) => {
    const params = {
      status: "SERVICE_REQUEST",
    };
    updateWorkOrderDispatch(params, id)
      .then((res) => {
        this.getWorkOrderInqueue();
        this.props.fetchWorkorder();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleDataCalendar = (val) => {
    let dateParams = moment(val).format("YYYY-MM-DD")
    this.setState({closeDate: dateParams})
    this.setState({date: val},() => {
      this.getWorkOrderInqueue({ service_date: dateParams });
      this.getDispatchFleetGroupData({ service_date: dateParams })
    })

  }

  setlineItems = () => {
    const data = {
      lanes: [
        {
          id: "lane1",
          title: (
            <div
              style={{ height: "90px" }}
              className="data-details-inn d-flex align-items-center justify-content-center"
            >
              <h6 className="mb-0">Holding Bin</h6>
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
                      <Dropdown
                        overlayClassName="add-remove-dropdown-main"
                        placement="bottomCenter"
                        overlay={
                          <Menu>
                            <Menu.Item
                              onClick={() => this.handleRemove(res.id)}
                              key="0"
                            >
                              <Button className="bg-transparent border-0 shadow-none p-0">
                                Remove
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
                      </Dropdown>
                      <span className="total-assign">{res.id}</span>{" "}
                      <span className="line-y">|</span> {res.project.name}{" "}
                    </h6>
                    <p className="mb-0">
                      {res.work_owner_contact.length &&
                        res.work_owner_contact[0].account.name}
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
                      {res.status}
                    </div>
                    <Button
                      className="common-project-btn assign-btn"
                      onClick={() => this.showServiceVarient(true, res)}
                    >
                      Assign resources
                    </Button>
                  </div>
                </div>
              ),
            };
          }),
        },
        ...this.state.dispatchFleetGroup.map((i, index) => {
            // let site = this.checkAddressSitePresent(res);
          return {
            id: `${i.id}`,
            title: (
              <div className="card-operator">
                <div className="row mx-0 operator-card-main position-relative">
                  <div className="col-12 d-flex align-items-center">
                    <div className="operator-initial">
                      <img
                        alt={" "}
                        className="img-fluid"
                        src={Images.truck_icon_green}
                      />
                    </div>
                    <div className="operator-details">
                      <h6 className="mb-0">{i?.name}</h6>
                      <p className="mb-0 text-green-tag">Active</p>
                    </div>
                  </div>
                  <Breadcrumb
                    className="custom-breadcrumb-dispatch"
                    separator={">"}
                  >
                    {/* {i.breadcrumb.map(i => (
                        <Breadcrumb.Item>
                        <Link to={" "}>{i}</Link>
                      </Breadcrumb.Item>
        ))} */}
                 <Breadcrumb.Item>
                        <Link to={" "}>vac truck 3800</Link>
                      </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link to={" "}>Vac Truck 3800</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      Vac Truck 3800 w/ air compressor
                    </Breadcrumb.Item>
                  </Breadcrumb>
                </div>
              </div>
            ),
            cards: i.workorders.length > 0 && i.workorders.map(res => {
                let site = this.checkAddressSitePresent(res.workorder);
                return {
                    id: res.workorder?.id.toString(),
                    title: false,
                    description: (
                      <div className="row">
                        <div className="w-100 d-inline-block px-3">
                          <h6 className="mb-0">
                            <span className="total-assign">{res.workorder?.id}</span>{" "}
                            <span className="line-y">|</span> {res.workorder?.project?.name}
                          </h6>
                          <p className="mb-0">{res.workorder?.work_owner_contact?.length > 0 &&
                        res.workorder?.work_owner_contact[0].account.name}</p>
                          <p className="site-address-dispatch">
                            <img
                              src={Images.location_gray_dispatch_14}
                              alt=""
                              className="img-fluid"
                            />
                           {site?.apartment || ""} {site?.street_address || ""}{" "}
                      {site?.city || ""} {site?.state}
                          </p>
                          <div className="tag-common rescheduled-div">{res.status}</div>
                          <Button
                            style={{ backgroundColor: "#38BC94" }}
                            className="common-project-btn assign-btn"
                          >
                            DISPATCH NOW
                          </Button>
                        </div>
                      </div>
                    ),
                  }
            }) 
        }
        }),
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
                            <Button className="arrow-btn" onClick={this.handleDecrementDate}>
                              <img
                                src={Images.arrow_small_left}
                                alt={""}
                                className="img-fluid"
                              />
                            </Button>
                          </li>
                          <li className="list-inline-item">
                            {/* Tue, May 4{" "} */}
                            {`${this.state.date.toString().split(" ")[0]}, ${
                              this.state.date.toString().split(" ")[1]
                            } ${this.state.date.toString().split(" ")[2]}`}
                            {/* <img
                              src={Images.calendar_green}
                              className="img-fluid ml-1"
                              alt={""}
                            /> */}
                            <DatePicker format={'YYYY-MM-DD'} className={"datePicker-calendar"} onChange={this.handleDataCalendar} allowClear={false}/>
                          </li>
                          <li className="list-inline-item">
                            <Button className="arrow-btn" onClick={this.handleIncreaseDate}>
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

                      <div
                        className="data-header-employees-scroll-common"
                        onScroll={this.handleScroll}
                      >
                        <div className="row mx-0 data-card-main">
                          <div className="col-12 p-0">
                            {/* <Board className={'custom-data-board'} data={data}/> */}
                            {!isEmpty(data) ? (
                              <Board
                                  laneStyle={{backgroundColor: '#b11111'}}
                                className={"custom-data-board"}
                                data={data}
                                  // style={}
                                handleDragStart={this.handleDragStart}
                                handleDragEnd={this.handleDragEnd}
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
        {/* <DispatchAssignServiceVarientModal
          visible={this.state.visible}
          onClose={() => this.showServiceVarient(false)}
          workOrder={workOrder}
          newPricing={newPricing}
        /> */}
        <DispatchAssignServiceVariantDrawer
          visible={this.state.visible}
          ref = {this.child}
          onClose={() => this.showServiceVarient(false)}
          workOrder={workOrder}
          newPricing={newPricing}
         />
      </div>
    );
  }
}

export default VehiclesGroupTabsDispatchView;

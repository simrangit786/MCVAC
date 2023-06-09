import React, {Component} from "react";
import {Breadcrumb, Button, DatePicker, Dropdown, Menu, message, Spin} from "antd";
import {Image as Images} from "../../../../Images";
import {
    getDispatchFleetGroup,
    getWorkOrderGroupDispatch,
    getWorkOrderServiceVarient,
    updateWorkOrderDispatch,
} from "../../../../../Controller/api/workOrderServices";
import {handleError} from "../../../../../Controller/Global";
import isEmpty from "lodash/isEmpty";
import {Link} from "react-router-dom";
import {getDecrementDate, getIncrementDate, statusLabel} from "../../../../../Controller/utils";
import moment from "moment";
import {updateDispatchFleetGroupData} from "../../../../../Controller/api/dispatchServices";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import DispatchAssignServiceVariantDrawer from "../../drawer/DispatchAssignServiceVariantDrawer";
import EditServiceInformation from "./drawer/EditServiceInformation";
import EditWarehouseDispatch from "./drawer/EditWarehouseDispatch";
import DispatchReviewServiceVariantDrawer from "../../drawer/DispatchReviewServiceVariantDrawer";

const momentRange = require("moment-range");

const Moment = momentRange.extendMoment(moment);

const menu = (<Menu>
    <Menu.Item key="0">
        <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
</Menu>);

const SlotHours = 3

class VehicleFleetsTab extends Component {
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
        visibleServiceInfo:false,
        visibleEditWarehouse:false,
        serviceInfoData: null,
        warehouseData: null,
        assignPending: false,
        reviewVisible: false,
        workorderReview: [],
    };
    child = React.createRef()

    menu = () => (<Menu>
        <Menu.Item key="0">
            <Button
                className="border-0 p-0 shadow-none bg-transparent"
            >
                Remove
            </Button>
        </Menu.Item>
    </Menu>);

    editMenu = (data) => (
    <Menu>
        <Menu.Item key="0">
            <Button
                onClick={()=>this.showServiceInfo(true,data)}
                className="border-0 p-0 shadow-none bg-transparent"
            >
                Edit Service Information
            </Button>
        </Menu.Item>
        <Menu.Item key="1">
            <Button
                onClick={()=>this.showEditWarehouse(true,data)}
                className="border-0 p-0 shadow-none bg-transparent"
            >
                Edit Warehouse / Dispatch
            </Button>
        </Menu.Item>
    </Menu>
    );

    showServiceVarient = (visible, res, val) => {
        this.setState({
            visible: visible, workOrder: res, assignPending: val
        }, () => {
            this.child.current.handleDispatchDataById();
            if (res !== undefined) {
                this.getSelectedServiceVariants();
                
            }
        });
    };

    reviewServiceVarient = (visible, res, val) => {
        this.setState({
            reviewVisible: visible, workorderReview: res, assignPending: val
        
        });
    };
    showServiceInfo = (visible,data) => {
        this.setState({
            visibleServiceInfo: visible,
            serviceInfoData: data

        });
    };
    showEditWarehouse = (visible,data) => {
        this.setState({
            visibleEditWarehouse: visible,
            warehouseData: data
        });
    };

    componentDidMount() {
        this.handleCalender()
        this.props.handleFleetGroupCall("fleetGroup")
    }

    componentDidUpdate() {
        if(this.props.dispatchNow) {
            this.handleCalender();
            this.props.handleDispatchNow(false)
        }
    }

    handleCalender = (update) => {
        if(update) {
            let date = new Date(this.state.date);
            let dateParams = moment(date).format("YYYY-MM-DD");
            // this.setState({closeDate: dateParams})
            this.setState({date: date}, () => {
                this.getWorkOrderInqueue({service_date: dateParams, warehouse: this.props.warehouseId});
                this.getDispatchFleetGroupData({service_date: dateParams, warehouse: this.props.warehouseId,active: this.props.activeKey ? "1" : "0"});

            })
        }else {
        let d = new Date();
        let dateParams = moment(d).format("YYYY-MM-DD");
        this.setState({closeDate: dateParams})
        this.setState({date: d}, () => {
            this.getWorkOrderInqueue({service_date: dateParams, warehouse: this.props.warehouseId});
            this.getDispatchFleetGroupData({service_date: dateParams, warehouse: this.props.warehouseId,active: this.props.activeKey ? "1" : "0"});
        });
    }
    };

    handleIncreaseDate = () => {
        let dateInput = new Date(this.state.date);
        let increasedDate = getIncrementDate(dateInput, 1)
        let dateParams = moment(increasedDate).format("YYYY-MM-DD");
        this.setState({closeDate: dateParams})
        this.setState({date: increasedDate}, () => {
                    this.getWorkOrderInqueue({service_date: dateParams, warehouse: this.props.warehouseId});
                    this.getDispatchFleetGroupData({service_date: dateParams, warehouse: this.props.warehouseId,active: this.props.activeKey ? "1" : "0"});

        });
    };

    handleDecrementDate = () => {
        var dateInput = new Date(this.state.date);
        let decreaseDate = getDecrementDate(dateInput, 1)
        let dateParams = moment(decreaseDate).format("YYYY-MM-DD");
        this.setState({closeDate: dateParams})
        this.setState({date: decreaseDate}, () => {
            this.getWorkOrderInqueue({service_date: dateParams, warehouse: this.props.warehouseId});
            this.getDispatchFleetGroupData({service_date: dateParams, warehouse: this.props.warehouseId,active: this.props.activeKey ? "1" : "0" })
        });
    };

    handleDragEnd = async (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        let params = {}
        if (targetLaneId == "lane1") {
            params = {
                workorder: cardDetails.id, vehicle: sourceLaneId, service_date: this.state.closeDate
            }
        } else {
            params = {
                workorder: cardId, vehicle: targetLaneId, service_date: this.state.closeDate
            }
        }
        await updateDispatchFleetGroupData(params).then((res) => {
            this.getWorkOrderInqueue({service_date: this.state.closeDate});
            this.getDispatchFleetGroupData({service_date: this.state.closeDate})
            message.success("Successfully dragged")


        }).catch((err) => {
            const {inqueue, dispatchFleetGroup} = this.state
            this.setState({
                inqueue: [...inqueue], dispatchFleetGroup: [...dispatchFleetGroup]
            }, () => this.setlineItems())
        })
    }

    getSelectedServiceVariants = () => {
        const {workOrder} = this.state;
        getWorkOrderServiceVarient({workorder: workOrder?.id})
            .then(async (resp) => {
                this.setState({newPricing: resp.data}, () => {
                    // if (ADDED_NEW) {
                    //     fetchWorkOrder(workOrder?.id);
                    // }
                    this.child.current.handleDispatchDataById()
                });
            })
            .catch((err) => {
                handleError(err);
            });
    };

    checkAddressSitePresent = (res) => {
        let site = res?.work_owner_contact?.length && res?.work_owner_contact[0]?.site?.length && res?.work_owner_contact[0]?.site[0]?.site;
        if (site) {
            return site;
        } else {
            return null;
        }
    };

    getDispatchFleetGroupData = (params = {}) => {
        getDispatchFleetGroup(params).then((res) => {
            this.setState({dispatchFleetGroup: res.data.results});
            this.setlineItems()
        }).catch((err) => {
            handleError(err);
        })
    };

    getWorkOrderInqueue = (params = {}) => {
        this.setState({loading: true});
        getWorkOrderGroupDispatch({...params, status: "IN_QUEUE", page: this.state.page})
            .then((res) => {
                this.setState({inqueue: res.data?.results, loading: false});
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
        this.setState({date: val}, () => {
            this.getWorkOrderInqueue({service_date: dateParams, warehouse: this.props.warehouseId});
            this.getDispatchFleetGroupData({service_date: dateParams, warehouse: this.props.warehouseId, active: this.props.activeKey ? "1" : "0"})
        })

    }

    handleTimeRange = (val) => {
        let value = val.toString().includes(":") ? val.split(":")[0] : val;
        return value < 12 ? "Am" : "Pm";
    };

    rangeFormat = (val) => {
        let value = val.split(" ")[0];
        let updateFormat;
        if (value > 10) {
            updateFormat = `${value}:00`;
        } else {
            updateFormat = `0${value}:00`;
        }
        return updateFormat;
      };
    
      
      onDragEnd = async (cardId,add) => {
          let findDroppableId = cardId.destination.droppableId.split("_")

            const params = {
                workorder: cardId.draggableId,
                vehicle: findDroppableId[0],
                service_date: this.state.closeDate,
                crew_chief: findDroppableId[1],
                start_time: findDroppableId[2].split(" ")[0],
                end_time: findDroppableId[3].split(" ")[0]
            }
          await updateDispatchFleetGroupData(params).then((res) =>{
          this.getWorkOrderInqueue({ service_date: this.state.closeDate, active: this.props.activeKey ? "1" : "0", warehouse: this.props.warehouseId });
          this.getDispatchFleetGroupData({ service_date: this.state.closeDate, active: this.props.activeKey ? "1" : "0", warehouse: this.props.warehouseId })
          message.success("Successfully dragged")
    
        }).catch((err) => {
          const {inqueue, dispatchFleetGroup} = this.state
          this.setState({inqueue: [...inqueue], dispatchFleetGroup: [...dispatchFleetGroup]})
        })
      };
    
      getShortName = (name) => {
        let findName = name?.split(" ");
        return findName[0]?.split("")[0] + findName[1]?.split("")[0];
    };

    getTimeSlots = () => {
        const range = Moment.range("2022-01-01 00:00", "2022-01-02 00:00");
        let hours = Array.from(range.by("hour", {excludeEnd: true, step: SlotHours}));
        hours = hours.map((m) => m.format("HH:mm"));
        return hours;
    };

    handleTimeByGroup = (crew_data) => {
        let newArr = [];
        let timeRange = []
        crew_data.forEach(i => {
            i.workorders.forEach(j => {
                timeRange.push([moment(j.workorder.start_time, "HH:mm").format("HH:mm"),
                moment(j.workorder.end_time, "HH:mm").format("HH:mm") ])
            })
        })

        crew_data.forEach((d) => {
            let crew = {}
            let crew_works = []
            d.workorders.forEach((item) => {
                const startTime = moment(item.workorder.start_time, "hh:mm")
                const endTime = moment(item.workorder.end_time, "hh:mm")

                let startSlot = ""
                let endSlot = ""
                const modifiedRange = timeRange.find((i, index) => {
                    const startTimeSlot = moment(i[0], "hh:mm")
                    const startStatus = startTimeSlot.isSame(startTime)
                    startSlot = startTimeSlot.format("hh:mm a")
                    const endTimeSlot = moment(i[1], "hh:mm")
                    const endStatus = endTimeSlot.isSame(endTime)
                    endSlot = endTimeSlot.format("hh:mm a")
                    return startStatus && endStatus
                });
                if (crew_works.length > 0) {

                    function checkRangeIndex(range) {
                        return range == startSlot;
                    }

                    const isExist = crew_works.map(i => i.start_slot).findIndex(checkRangeIndex)
                    if (isExist > -1) {
                        crew_works[isExist]['works'].push(item)
                    } else {
                        crew = {...d}
                        crew['works'] = [item]
                        crew['workorder_address'] = [item.workorder]
                        crew['start_slot'] = startSlot
                        crew['end_slot'] = endSlot
                        crew['status'] = item.status
                        crew_works.push(crew)
                    }
                } else {
                    crew = {...d}
                    crew['works'] = [item]
                    crew['workorder_address'] = [item.workorder]
                    crew['start_slot'] = startSlot
                    crew['end_slot'] = endSlot
                    crew['status'] = item.status
                    crew_works.push(crew)

                }

            });
            newArr.push(...crew_works)
          });
          const sortedTime = newArr.sort((a,b) => moment(a.start_slot, "hh:mm a").isBefore(moment(b.start_slot, "hh:mm a"))?-1:1)
        return sortedTime
    }

    

    render() {
        const {workOrder, data, newPricing, dispatchFleetGroup, workorderReview} = this.state;
        return (<>
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
                                                minHeight: "56px", width: "100%",
                                            }}
                                            className="box-1-header justify-content-center"
                                        >
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <Button className="arrow-btn"
                                                            onClick={this.handleDecrementDate}>
                                                        <img
                                                            src={Images.arrow_small_left}
                                                            alt={""}
                                                            className="img-fluid"
                                                        />
                                                    </Button>
                                                </li>
                                                <li className="list-inline-item">
                                                    {/* Tue, May 4{" "} */}
                                                    {`${this.state.date.toString().split(" ")[0]}, ${this.state.date.toString().split(" ")[1]} ${this.state.date.toString().split(" ")[2]}`}
                                                    {/* <img
                              src={Images.calendar_green}
                              className="img-fluid ml-1"
                              alt={""}
                            /> */}
                                                    <DatePicker format={'YYYY-MM-DD'}
                                                                className={"datePicker-calendar"}
                                                                onChange={this.handleDataCalendar}
                                                                allowClear={false}/>
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
                                    <DragDropContext onDragEnd={this.onDragEnd}>
                                        <div className="col-12 px-0 data-header-employees data-header-employees-scroll">
                                            <div
                                                className="data-header-employees-scroll-common data-inner-all overflow-hidden"
                                                onScroll={this.handleScroll}
                                            >
                                                <div className="row data-card-main mx-0">
                                                    {isEmpty(data) ? (
                                                        <div className="custom-right-scroll w-100" style={{
                                                            whiteSpace: 'nowrap', position: 'relative', overflow: 'auto'
                                                        }}>
                                                            <div className="fleet-data-left">
                                                                <div className="row mx-0">
                                                                    <div className="col-12 p-0">
                                                                        <div
                                                                            style={{height: "90px"}}
                                                                            className="data-details-inn w-100 d-flex align-items-center justify-content-center"
                                                                        >
                                                                            <h6 className="mb-0">Holding Bin</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{padding: '10px'}}
                                                                         className="col-12 custom-scroll-dispatch">
                                                                        <Droppable droppableId="droppable">
                                                                            {(provided, snapshot) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.droppableProps}
                                                                                >


                                                                                    {this.state.inqueue.map((res, index) => {
                                                                                        let site = this.checkAddressSitePresent(res);
                                                                                        return <Draggable
                                                                                            key={`${res.id}`}
                                                                                            draggableId={`${res.id}`}
                                                                                            index={index}
                                                                                        >
                                                                                            {(provided, snapshot) => (
                                                                                                <div
                                                                                                    ref={provided.innerRef}
                                                                                                    {...provided.dragHandleProps}
                                                                                                    {...provided.draggableProps}
                                                                                                >

                                                                                                    <div
                                                                                                        id={res.id.toString()}
                                                                                                        className="row custom-card-main">
                                                                                                        <Dropdown
                                                                                                            overlayClassName="add-remove-dropdown-main w-auto"
                                                                                                            placement="bottomCenter"
                                                                                                            trigger={'click'}
                                                                                                            overlay={this.editMenu}
                                                                                                        >
                                                                                                            <Button
                                                                                                                style={{
                                                                                                                    bottom: 'auto',
                                                                                                                    right: 0
                                                                                                                }}
                                                                                                                className="bg-transparent position-absolute px-3 border-0 elipsis-btn-card"
                                                                                                                onClick={(e) => e.preventDefault()}
                                                                                                            >
                                                                                                                <img
                                                                                                                    style={{height: '15px'}}
                                                                                                                    src={Images.elipsis_icon_gray}
                                                                                                                    alt=""
                                                                                                                    className="img-fluid"
                                                                                                                />
                                                                                                            </Button>
                                                                                                        </Dropdown>
                                                                                                        <div
                                                                                                            className="col-12 px-3">
                                                                                                            <h6 className="mb-0 position-relative">
                                                                                                            <span
                                                                                                                className="total-assign">{res.id}</span>{" "}
                                                                                                                <span
                                                                                                                    className="line-y">|</span> {res.project.name}{" "}
                                                                                                            </h6>
                                                                                                            <p className="mb-0">
                                                                                                                {res.work_owner_contact.length && res.work_owner_contact[0].account.name}
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
                                                                                                                className="tag-common rescheduled-div">
                                                                                                                {statusLabel(res.status)}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <Button
                                                                                                            className="common-project-btn assign-btn"
                                                                                                            onClick={() => this.showServiceVarient(true, res)}
                                                                                                        >
                                                                                                            Assign
                                                                                                            resources
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                    {provided.placeholder}
                                                                                                </div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    })}
                                                                                    {provided.placeholder}
                                                                                </div>
                                                                            )}
                                                                        </Droppable>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/*right repeat card*/}
                                                            {dispatchFleetGroup.length > 0 && dispatchFleetGroup.map((i, index) => ( 
                                                                // let site = this.checkAddressSitePresent(res);
                                                                <div id={`${i.id}`} className="fleet-data-right-main">
                                                                    <div className="row mx-0">
                                                                        <div className="col-12">
                                                                            <div className="row">
                                                                                <div
                                                                                    className="card-operator p-0 col-12">
                                                                                    <div
                                                                                        className="row mx-0 operator-card-main position-relative">
                                                                                        <div
                                                                                            className="col-12 d-flex align-items-center">
                                                                                            <div
                                                                                                className="operator-initial">
                                                                                                <img alt={" "}
                                                                                                     className="img-fluid"
                                                                                                     src={Images.truck_icon_green}/>
                                                                                            </div>
                                                                                            <div
                                                                                                className="operator-details">
                                                                                                <h6 className="mb-0">{i?.name}</h6>
                                                                                                {/*<p className="mb-0 text-green-tag">Active</p>*/}
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
                                                                                                <Link to={" "}>vac
                                                                                                    truck
                                                                                                    3800</Link>
                                                                                            </Breadcrumb.Item>
                                                                                            <Breadcrumb.Item>
                                                                                                <Link to={" "}>Vac
                                                                                                    Truck
                                                                                                    3800</Link>
                                                                                            </Breadcrumb.Item>
                                                                                            <Breadcrumb.Item>
                                                                                                Vac Truck 3800 w/
                                                                                                air
                                                                                                compressor
                                                                                            </Breadcrumb.Item>
                                                                                        </Breadcrumb>
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="col-12 custom-scroll-dispatch">
                                                                                    <div className="row">
                                                                                       
                                                                                                    {this.handleTimeByGroup(i.crew_data).map(res => {
                                                                                                        let site = this.checkAddressSitePresent(res?.workorder_address[0]);
                                                                                                        return (
                                                                                                        <Droppable
                                                                                                        droppableId={`${i.id}_${res.crew_chief_id}_${res.start_slot}_${res.end_slot}`}>
                                                                                                        {(provided, snapshot) => (
                                                                                                            <div
                                                                                                                ref={provided.innerRef}
                                                                                                                {...provided.droppableProps}
                                                                                                            >
                                                                                                         <div
                                                                                                            id={res.workorder?.id.toString()}
                                                                                                            className="col-12">
                                                                                                            <div
                                                                                                                className="row">
                                                                                                                {/*time*/}
                                                                                                                <div
                                                                                                                    className="col-12 time-schedule-bar">
                                                                                                                    {res.start_slot} - {res.end_slot}
                                                                                                                    <Dropdown
                                                                                                                        overlayClassName="add-remove-dropdown-main"
                                                                                                                        overlay={this.menu()}
                                                                                                                        trigger={["click"]}
                                                                                                                    >
                                                                                                                        <Button
                                                                                                                            className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                                                                                            onClick={(e) => e.preventDefault()}
                                                                                                                        >
                                                                                                                            <img
                                                                                                                                style={{height: '12px'}}
                                                                                                                                src={Images.more_black}
                                                                                                                                alt=""
                                                                                                                                className="img-fluid"
                                                                                                                            />
                                                                                                                        </Button>
                                                                                                                    </Dropdown>
                                                                                                                </div>
                                                                                                                <div
                                                                                                                    className="col-12 inner-card-common">
                                                                                                                    <div
                                                                                                                        className="row mx-0">
                                                                                                                        {/*crew-chif*/}
                                                                                                                        <div
                                                                                                                            className="col-12 custom-card-main card-crew-chief">
                                                                                                                            <div
                                                                                                                                className="row mx-0 align-items-center h-100">
                                                                                                                                <div
                                                                                                                                    className="d-flex align-items-center">
                                                                                                                                    <span
                                                                                                                                        className="name-avatar">{this.getShortName(res.crew_chief)}</span>
                                                                                                                                    {/* <h6 className="mb-0">Jacob
                                                                                                                                    Jones</h6> */}
                                                                                                                                    <h6 className="mb-0">{res.crew_chief}</h6>
                                                                                                                                </div>
                                                                                                                                <div
                                                                                                                                    className="d-flex align-items-center">
                                                                                                                                    {/* <div
                                                                                                                                    className="crew-chief-name">
                                                                                                                                    {res.crew_chief}
                                                                                                                                </div> */}
                                                                                                                                    <Dropdown
                                                                                                                                        overlayClassName="add-remove-dropdown-main"
                                                                                                                                        overlay={this.menu()}
                                                                                                                                        trigger={["click"]}
                                                                                                                                    >
                                                                                                                                        <Button
                                                                                                                                            className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                                                                                                            onClick={(e) => e.preventDefault()}
                                                                                                                                        >
                                                                                                                                            <img
                                                                                                                                                style={{height: '15px'}}
                                                                                                                                                src={Images.elipsis_icon_gray}
                                                                                                                                                alt=""
                                                                                                                                                className="img-fluid"
                                                                                                                                            />
                                                                                                                                        </Button>
                                                                                                                                    </Dropdown>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        {/*card data*/}
                                                                                                                        {res.works.map(j => (
                                                                                                                            <div
                                                                                                                                className="col-12">
                                                                                                                                <Draggable
                                                                                                                                    key={`${j.id}`}
                                                                                                                                    draggableId={`${j.id}`}
                                                                                                                                    index={index}
                                                                                                                                >
                                                                                                                                    {(provided, snapshot) => (
                                                                                                                                        <div
                                                                                                                                            style={{minWidth: '161px'}}
                                                                                                                                            className="row"
                                                                                                                                            ref={provided.innerRef}
                                                                                                                                            {...provided.dragHandleProps}
                                                                                                                                            {...provided.draggableProps}>
                                                                                                                                            <div
                                                                                                                                                className="col-12 custom-card-main">
                                                                                                                                                <Dropdown
                                                                                                                                                    overlayClassName="add-remove-dropdown-main w-auto"
                                                                                                                                                    placement="bottomCenter"
                                                                                                                                                    trigger={'click'}
                                                                                                                                                    overlay={() => this.editMenu(j)}
                                                                                                                                                >
                                                                                                                                                    <Button
                                                                                                                                                        style={{
                                                                                                                                                            bottom: 'auto',
                                                                                                                                                            right: '0'
                                                                                                                                                        }}
                                                                                                                                                        className="bg-transparent position-absolute px-2 border-0 elipsis-btn-card"
                                                                                                                                                        onClick={(e) => e.preventDefault()}
                                                                                                                                                    >
                                                                                                                                                        <img
                                                                                                                                                            style={{height: '15px'}}
                                                                                                                                                            src={Images.elipsis_icon_gray}
                                                                                                                                                            alt=""
                                                                                                                                                            className="img-fluid"
                                                                                                                                                        />
                                                                                                                                                    </Button>
                                                                                                                                                </Dropdown>
                                                                                                                                                <h6 className="mb-0">
                                                                                                                                                    <span
                                                                                                                                                        className="total-assign">{j.workorder?.id}</span>{" "}
                                                                                                                                                    <span
                                                                                                                                                        className="line-y">|</span> {j.workorder?.project?.name}
                                                                                                                                                </h6>
                                                                                                                                                <p className="mb-0">{j.workorder?.work_owner_contact?.length > 0 && j.workorder?.work_owner_contact[0].account.name}</p>
                                                                                                                                                <p className="site-address-dispatch">
                                                                                                                                                    <img
                                                                                                                                                        src={Images.location_gray_dispatch_14}
                                                                                                                                                        alt=""
                                                                                                                                                        className="img-fluid"/>
                                                                                                                                                    {site?.apartment || ""} {site?.street_address || ""}{" "}
                                                                                                                                                    {site?.city || ""} {site?.state}
                                                                                                                                                </p>
                                                                                                                                                <div
                                                                                                                                                    className="tag-common rescheduled-div">{statusLabel(j.status)}</div>
                                                                                                                                                <Button
                                                                                                                                                    // style={{backgroundColor: "#38BC94"}}
                                                                                                                                                    // onClick={() => this.showServiceVarient(true, j, true)}
                                                                                                                                                    onClick={() => this. reviewServiceVarient(true,j,true)}
                                                                                                                                                    className="common-project-btn assign-btn"
                                                                                                                                                >
                                                                                                                                                    Review
                                                                                                                                                </Button>
                                                                                                                                                
                                                                                                                                            </div>
                                                                                                                                        </div>

                                                                                                                                    )}
                                                                                                                                </Draggable>
                                                                                                                            </div>
                                                                                                                        ))}

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>

                                                                                                    
                                                                                                    {provided.placeholder}
                                                                                                </div>
                                                                                            )}
                                                                                        </Droppable>
                                                                                                        )
    })}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div> 
                                                            ))}
                                                        </div>) : (<div className="text-center">
                                                        <Spin/>
                                                    </div>)}
                                                </div>
                                            </div>
                                        </div>
                                    </DragDropContext>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DispatchReviewServiceVariantDrawer 
             visible={this.state.reviewVisible}
            //  ref={this.child}
             onClose={() => {
                //  this.getWorkOrderInqueue({service_date: this.state.closeDate, warehouse: this.props.warehouseId});
                //  this.getDispatchFleetGroupData({service_date: this.state.closeDate, warehouse: this.props.warehouseId, active: this.props.activeKey ? "1" : "0"})
                  this.reviewServiceVarient(false)
                //   this.props.handleUpdate()
                 }}
             workOrder={workorderReview}
             newPricing={newPricing}
             assignPending={this.state.assignPending}
            />
            <DispatchAssignServiceVariantDrawer
                visible={this.state.visible}
                ref={this.child}
                onClose={() => {
                    this.getWorkOrderInqueue({service_date: this.state.closeDate, warehouse: this.props.warehouseId});
                    this.getDispatchFleetGroupData({service_date: this.state.closeDate, warehouse: this.props.warehouseId, active: this.props.activeKey ? "1" : "0"})
                     this.showServiceVarient(false)
                     this.props.handleUpdate()
                    }}
                workOrder={workOrder}
                newPricing={newPricing}
                assignPending={this.state.assignPending}
            />
        </div>
            {this.state.serviceInfoData && 
            <EditServiceInformation visible={this.state.visibleServiceInfo}
                serviceInfoData={this.state.serviceInfoData}
                onClose={() => {
                     this.handleCalender("true")
                     this.showServiceInfo(false)}
                }/>
    }
            {this.state.warehouseData && 
            <EditWarehouseDispatch visible={this.state.visibleEditWarehouse}
                warehouseData={this.state.warehouseData}
                handleCalender = {this.handleCalender}
                onClose={()=> {
                    this.handleCalender("true")
                    this.showEditWarehouse(false)}
                }
            />
    }

        </>);
    }
}

export default VehicleFleetsTab;
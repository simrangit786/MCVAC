import React, {Component} from "react";
import {Breadcrumb, Button, DatePicker, Dropdown, Menu, Spin} from "antd";
import {Image as Images} from "../../../../Images";
// import {CheckOutlined} from "@ant-design/icons";
import Board from "react-trello";
import {CheckOutlined} from "@ant-design/icons";
import {
    getDispatchFleetKit,
    getWorkOrderDispatch, getWorkOrderServiceVarient, updateWorkOrderDispatch,
} from "../../../../../Controller/api/workOrderServices";
import {handleError} from "../../../../../Controller/Global";
import DispatchAssignServiceVarientModal from "../../drawer/DispatchAssignServiceVarientModal";
import isEmpty from "lodash/isEmpty";
import {Link} from "react-router-dom";
import moment from "moment";
import { getDecrementDate, getIncrementDate } from "../../../../../Controller/utils";

const menu = (<Menu>
    <Menu.Item key="0">
        <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
</Menu>);

class VehiclesTabsDispatchView extends Component {
    state = {
        visible: false, workOrder: [], data: {}, newPricing: [], page: 1, loading: false, inqueue: [],dispatchFleetKit: [],date: "",closeDate:""
    };


    child1 = React.createRef();



    showServiceVarient = (visible, res) => {
        this.setState({
            visible: visible, workOrder: res,
        }, () => {
            if (res !== undefined) {
                this.getSelectedServiceVariants();
            }
        });
    };

    componentDidMount() {
        this.handleCalender()
        this.props.handleFleetKitCall("fleetKit")

    }

    handleCalender = () => {
        let d = new Date();
        let dateParams = moment(d).format("YYYY-MM-DD");
        this.setState({closeDate: dateParams})
        this.setState({ date: d }, () => {
            this.getWorkOrderInqueue({ service_date: dateParams });
            this.getDispatchFleetKitData({ service_date: dateParams })
        });
      };

      handleIncreaseDate = () => {
        let dateInput = new Date(this.state.date);
        let increasedDate = getIncrementDate(dateInput,1)
        let dateParams = moment(increasedDate).format("YYYY-MM-DD")
        this.setState({closeDate: dateParams})
        this.setState({ date: increasedDate }, () => {
            this.getWorkOrderInqueue({ service_date: dateParams });
            this.getDispatchFleetKitData({ service_date: dateParams })
        });
      };
    
      handleDecrementDate = () => {
        var dateInput = new Date(this.state.date);
        let decreaseDate = getDecrementDate(dateInput,1)
        let dateParams = moment(decreaseDate).format("YYYY-MM-DD");
        this.setState({closeDate: dateParams})
        this.setState({ date: decreaseDate }, () => {
            this.getWorkOrderInqueue({ service_date: dateParams });
            this.getDispatchFleetKitData({ service_date: dateParams })
        });
      };
    getSelectedServiceVariants = () => {
        const {workOrder} = this.state;
        getWorkOrderServiceVarient({workorder: workOrder?.id})
            .then(async (resp) => {
                this.setState({newPricing: resp.data}, () => {
                });
            })
            .catch((err) => {
                handleError(err);
            });
    };

    getDispatchFleetKitData = (params={}) => {
        getDispatchFleetKit(params).then((res) => {
            this.setState({dispatchFleetKit: res.data.results})
            this.setlineItems();
        }).catch(err => {
            handleError(err)
        })
    }

    checkAddressSitePresent = (res) => {
        let site = res?.work_owner_contact?.length && res?.work_owner_contact[0]?.site?.length && res?.work_owner_contact[0]?.site[0]?.site;
        if (site) {
            return site;
        } else {
            return null;
        }
    };

    getWorkOrderInqueue = (params={}) => {
        this.setState({loading: true})
        getWorkOrderDispatch({...params,status: "IN_QUEUE", page: this.state.page})
            .then((res) => {
                this.setState({inqueue: res.data.results, loading: false});
                this.setlineItems();
            })
            .catch((err) => {
                handleError(err);
            });
    };

    handleRemove = (id) => {
        const params = {
            status: "SERVICE_REQUEST"
        }
        updateWorkOrderDispatch(params, id)
            .then((res) => {
                this.getWorkOrderInqueue()
                this.props.fetchWorkorder()
            })
            .catch((err) => {
                handleError(err);
            });
    }

    handleDataCalendar = (val) => {
        let dateParams = moment(val).format("YYYY-MM-DD")
        this.setState({date: val},() => {
            this.getWorkOrderInqueue({ service_date: dateParams });
            this.getDispatchFleetKitData({ service_date: dateParams })
        })
    
      }
    

    setlineItems = () => {
        const data = {
            lanes: [{
                // draggable:false,
                id: "lane1", title: <div
                    style={{height: '90px'}}
                    className="data-details-inn d-flex align-items-center justify-content-center">
                    <h6 className="mb-0">Holding Bin</h6>
                </div>, cards: this.state.inqueue.map((res) => {
                    let site = this.checkAddressSitePresent(res);
                    return {
                        id: res.id.toString(), title: false, description: (<div className="row">
                            <div className="w-100 d-inline-block px-3">
                                <h6 className="mb-0 position-relative">
                                    <Dropdown
                                        overlayClassName="add-remove-dropdown-main"
                                        placement="bottomCenter"
                                        overlay={<Menu>
                                            <Menu.Item
                                                onClick={() => this.handleRemove(res.id)}
                                                key="0"
                                            >
                                                <Button className="bg-transparent border-0 shadow-none p-0">
                                                    Remove
                                                </Button>
                                            </Menu.Item>
                                        </Menu>}
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
                        </div>),
                    };
                }),
            }, 
            ...this.state.dispatchFleetKit.map(i => {
                return (
                    {
                        id: `${i.id}`,
                        title:(<div className="card-operator">
                                                                <div className="row mx-0 operator-card-main position-relative">
                                                                    <div className="col-12 d-flex align-items-center">
                                                                        <div className="operator-initial">
                                                                            <img alt={' '} className="img-fluid"
                                                                                 src={Images.truck_icon_green}/>
                                                                        </div>
                                                                        <div className="operator-details">
                                                                            <h6 className="mb-0">Vehicles Name</h6>
                                                                            <p className='mb-0 text-green-tag'>{i?.name}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Breadcrumb className="custom-breadcrumb-dispatch"
                                                                                separator={'>'}>
                                                                             
                                                                        <Breadcrumb.Item>
                                                                            <Link to={' '}>Vac Trucks</Link>
                                                                        </Breadcrumb.Item>
                                                                        <Breadcrumb.Item>
                                                                            <Link to={' '}>Vac Truck 3800</Link>
                                                                        </Breadcrumb.Item>
                                                                        <Breadcrumb.Item>Vac Truck 3800 w/ air
                                                                            compressor</Breadcrumb.Item>
                                                                    </Breadcrumb>
                                                                </div>
                                                            </div>
                                    ),
                        cards: i.workorders.length > 0 && i.workorders.map((res) => {
                            let site = this.checkAddressSitePresent(res.workorder);
                            return {
                                id: "Card2", title: false, description: (<div className="row">
                                    <div className="w-100 d-inline-block px-3">
                                        <h6 className="mb-0">
                                            <span className="total-assign">{res.workorder?.project?.id}</span>{" "}
                                            <span className="line-y">|</span> {res.workorder?.project?.name}
                                        </h6>
                                        <p className="mb-0">
                                            {res.workorder?.work_owner_contact.length && res.workorder?.work_owner_contact[0].account.name}
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
                                            style={{backgroundColor: "#38BC94"}}
                                            className="common-project-btn assign-btn"
                                        >
                                            DISPATCH NOW
                                        </Button>
                                    </div>
                                </div>),
                            };
                        }),
                    }
                )
            })
            ],
        };
        this.setState({data});
    };

    render() {
        const {workOrder, data, newPricing} = this.state;
        return (<div className="row dispatch-left-min-header-row">
            {/* <div className="col-12">
                <div className="row">
                    <div className="col-12 col-sm-5">
                        <div className="search-bar-div w-100">
                            <Form className="position-relative">
                                <Input style={{width: '100%'}} placeholder="Search"/>
                                <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                    <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                </Button>
                            </Form>
                        </div>
                    </div>
                    <div className="col-12 col-sm-5 mt-0 dispatch-date-input-row">
                        <DatePicker/>
                    </div>
                    <div className="col-12 col-sm-2">
                        <div className="new-opportunity-btn-div">
                            <Button className="filter-btn filter-btn-dispatch">
                                <img alt={' '} className="img-fluid" src={Images.filter_icon}/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        <div className="row drag-drop-main-row mx-0">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 px-0 data-header-employees">
                                        {/* <div style={{
                                            minHeight: '56px'
                                        }} className="box-1-header">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <Button className="arrow-btn">
                                                        <img src={Images.arrow_small_left} alt={''}
                                                            className="img-fluid" />
                                                    </Button>
                                                </li>
                                                <li className="list-inline-item">
                                                    Tue, May 4  <img src={Images.calendar_green} className="img-fluid ml-1" alt={''} />
                                                </li>
                                                <li className="list-inline-item">
                                                    <Button className="arrow-btn">
                                                        <img src={Images.arrow_small_right} alt={''}
                                                            className="img-fluid" />
                                                    </Button>
                                                </li>
                                            </ul>
                                        </div> */}
                                        <div style={{
                                            minHeight: "56px", width: "100%"
                                        }} className="box-1-header justify-content-center">
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
                                                    {!isEmpty(data) ? (<Board
                                                        className={"custom-data-board"}
                                                        data={data}
                                                    />) : (<div className="text-center">
                                                        <Spin/>
                                                        {/* <h1>uydgbjknsk</h1> */}
                                                    </div>)}
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
            <DispatchAssignServiceVarientModal
                visible={this.state.visible}
                onClose={() => this.showServiceVarient(false)}
                workOrder={workOrder}
                newPricing={newPricing}
            />
        </div>);
    }
}

export default VehiclesTabsDispatchView;

import React, {Component} from 'react';
import {Button, DatePicker, Dropdown, Form, Input, Menu} from "antd";
import {Image as Images} from "../../../../Images";
// import {CheckOutlined} from "@ant-design/icons";
import Board from 'react-trello'
import {CheckOutlined} from "@ant-design/icons";

const menu = (<Menu>
    <Menu.Item key="0">
        <a href="https://www.antgroup.com">1st menu item</a>
    </Menu.Item>
</Menu>);
const data = {
    lanes: [{
        id: 'lane1',
        cards: [{
            id: 'Card1',
            title: <small className="d-flex align-items-center">302654-2 <img src={Images.recurrence} alt={' '}
                                                                              className="img-fluid ml-1"/></small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <Button className="common-project-btn assign-btn">Assign
                        resources</Button>
                </div>
            </div>,
            label: <div>
                <div className="tag-common rescheduled-div">In QUEUE</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        },
            // {
            //     id: 'Card2',
            //     title: 'Pay Rent',
            //     description: 'Transfer via NEFT',
            //     label: '5 mins',
            //     metadata: {sha: 'be312a1'}
            // }
        ]
    }, {
        id: 'lane2',
        cards: [
            {
            id: 'Card2',
            title: <small className="d-flex align-items-center">302654-2 <img src={Images.recurrence} alt={' '}
                                                                              className="img-fluid ml-1"/></small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <Button className="common-project-btn assign-btn">Assign
                        resources</Button>
                </div>
            </div>,
            label: <div>
                <div className="tag-common rescheduled-div">In QUEUE</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        },
            {
            id: 'Card21',
            style:{borderColor:"#38BC94"},
            title: <small className="d-flex align-items-center">302655
                {/*<img src={Images.recurrence} alt={' '} className="img-fluid ml-1"/>*/}
            </small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <Button className="common-project-btn btn-regular">
                        <CheckOutlined />
                        Dispatched
                    </Button>
                    <p className="site-address-dispatch">
                    <img src={Images.location_gray_dispatch_14} alt=""
                         className="img-fluid"/>123 W 112TH ST New York</p>
                </div>
            </div>,
            label: <div>
                <div style={{
                    color:'#38BC94'
                }} className="tag-common rescheduled-div">En Route</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        },
            {
            id: 'Card22',
            style:{borderColor:"#bdbdbd"},
            title: <small className="d-flex align-items-center">302655
                {/*<img src={Images.recurrence} alt={' '} className="img-fluid ml-1"/>*/}
            </small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <p className="site-address-dispatch mt-3">
                    <img src={Images.location_gray_dispatch_14} alt=""
                         className="img-fluid"/>123 W 112TH ST New York</p>
                </div>
            </div>,
            label: <div>
                <div style={{
                    color:'#4F4F4F'
                }} className="tag-common rescheduled-div">Completed</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        },
            {
            id: 'Card23',
            style:{borderColor:"#E39999"},
            title: <small className="d-flex align-items-center">302655
                {/*<img src={Images.recurrence} alt={' '} className="img-fluid ml-1"/>*/}
            </small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <p className="site-address-dispatch mt-3">
                    <img src={Images.location_gray_dispatch_14} alt=""
                         className="img-fluid"/>123 W 112TH ST New York</p>
                </div>
            </div>,
            label: <div>
                <div style={{
                    color:'#E39999'
                }} className="tag-common rescheduled-div">Completed</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        },
        ]
    }, {
        id: 'lane3', cards: [{
            id: 'Card3',
            style:{borderColor:"#3391FF"},
            title: <small className="d-flex align-items-center">302654-2 <img src={Images.recurrence} alt={' '}
                                                                              className="img-fluid ml-1"/></small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <Button className="common-project-btn dispatch-now">Dispatch Now</Button>
                    <p className="site-address-dispatch">
                    <img src={Images.location_gray_dispatch_14} alt=""
                         className="img-fluid"/>123 W 112TH ST New York</p>
                </div>
            </div>,
            label: <div>
                <div  style={{
                    color:'#3391FF'
                }} className="tag-common rescheduled-div">In QUEUE</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        }]
    }, {
        id: 'lane4', cards: [{
            id: 'Card4',
            title: <small className="d-flex align-items-center">302654-2 <img src={Images.recurrence} alt={' '}
                                                                              className="img-fluid ml-1"/></small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <Button className="common-project-btn assign-btn">Assign
                        resources</Button>
                </div>
            </div>,
            label: <div>
                <div className="tag-common rescheduled-div">In QUEUE</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        }]
    }, {
        id: 'lane5', cards: [{
            id: 'Card5',
            title: <small className="d-flex align-items-center">302654-2 <img src={Images.recurrence} alt={' '}
                                                                              className="img-fluid ml-1"/></small>,
            description: <div className="row">
                <div className="col-12">
                    <h6 className="mb-0">Project Name</h6>
                    <p className="mb-0">Site Owner Account</p>
                    <Button className="common-project-btn assign-btn">Assign
                        resources</Button>
                </div>
            </div>,
            label: <div>
                <div className="tag-common rescheduled-div">In QUEUE</div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button
                        className="ant-dropdown-link ant-dropdown-link-custom"
                        onClick={e => e.preventDefault()}>
                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                             className="img-fluid"/>
                    </Button>
                </Dropdown>
            </div>
        }]
    }]
}

class SuppliesTabsDispatchView extends Component {
    render() {
        return (<div className="row dispatch-left-min-header-row">
            <div className="col-12">
                <div className="row mx-0">
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
            </div>
            <div className="col-12">
                <div className="row mx-0">
                    <div className="col-12">
                        <div className="row drag-drop-main-row mx-0">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 px-0 data-header-employees">
                                        <div style={{
                                            minHeight: '56px'
                                        }} className="box-1-header">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <Button className="arrow-btn">
                                                        <img src={Images.arrow_small_left} alt={''}
                                                             className="img-fluid"/>
                                                    </Button>
                                                </li>
                                                <li className="list-inline-item">
                                                    Tue, May 4
                                                </li>
                                                <li className="list-inline-item">
                                                    <Button className="arrow-btn">
                                                        <img src={Images.arrow_small_right} alt={''}
                                                             className="img-fluid"/>
                                                    </Button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div style={{
                                            minHeight: '56px'
                                        }} className="box-2-header">
                                            <h6 className="mb-0">
                                                Supplies (15)
                                                <span className="ml-2">
                                                    <img src={Images.info_gray} alt={''} className={'img-fluid'}/>
                                                </span>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="col-12 px-0 data-header-employees">
                                        <div style={{
                                            minHeight: '70px',
                                            borderTop:'1px solid #e0e0e0'
                                        }} className="box-1-header justify-content-center">
                                            <h6 className="mb-0 small-heading-div">Supplies (18)</h6>
                                        </div>
                                        <div style={{
                                            minHeight: '70px',
                                            borderTop:'1px solid #e0e0e0'
                                        }} className="box-2-header box-2-header-update">
                                            <div className="card-box-header-2">
                                                <div className="card-operator">
                                                    {/*no-data-card*/}
                                                    <div className="row mx-0 no-data-card">
                                                        <h6 className="mb-0">No Supplies</h6>
                                                    </div>
                                                </div>
                                                <div className="card-operator">
                                                    <div className="row mx-0 operator-card-main position-relative">
                                                        <div className="col-12 d-flex align-items-center">
                                                            <div className="operator-initial">
                                                                <img alt={' '} className="img-fluid" src={Images.supply_green_dispatch}/>
                                                            </div>
                                                            <div className="operator-details">
                                                                <h6 className="mb-0">Large Waste Bin</h6>
                                                                <p className='mb-0'>Waste Bins</p>
                                                            </div>
                                                        </div>
                                                        <Dropdown overlay={menu} trigger={['click']}>
                                                            <Button
                                                                className="ant-dropdown-link bg-transparent ant-dropdown-link-custom"
                                                                onClick={e => e.preventDefault()}>
                                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                                     className="img-fluid"/>
                                                            </Button>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div className="card-operator">
                                                    <div className="row mx-0 operator-card-main position-relative">
                                                        <div className="col-12 d-flex align-items-center">
                                                            <div className="operator-initial">
                                                                <img alt={' '} className="img-fluid" src={Images.supply_green_dispatch}/>
                                                            </div>
                                                            <div className="operator-details">
                                                                <h6 className="mb-0">Large Waste Bin</h6>
                                                                <p className='mb-0'>Waste Bins</p>
                                                            </div>
                                                        </div>
                                                        <Dropdown overlay={menu} trigger={['click']}>
                                                            <Button
                                                                className="ant-dropdown-link bg-transparent ant-dropdown-link-custom"
                                                                onClick={e => e.preventDefault()}>
                                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                                     className="img-fluid"/>
                                                            </Button>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div className="card-operator">
                                                    <div className="row mx-0 operator-card-main position-relative">
                                                        <div className="col-12 d-flex align-items-center">
                                                            <div className="operator-initial">
                                                                <img alt={' '} className="img-fluid" src={Images.supply_green_dispatch}/>
                                                            </div>
                                                            <div className="operator-details">
                                                                <h6 className="mb-0">Large Waste Bin</h6>
                                                                <p className='mb-0'>Waste Bins</p>
                                                            </div>
                                                        </div>
                                                        <Dropdown overlay={menu} trigger={['click']}>
                                                            <Button
                                                                className="ant-dropdown-link bg-transparent ant-dropdown-link-custom"
                                                                onClick={e => e.preventDefault()}>
                                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                                     className="img-fluid"/>
                                                            </Button>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                                <div className="card-operator">
                                                    <div className="row mx-0 operator-card-main position-relative">
                                                        <div className="col-12 d-flex align-items-center">
                                                            <div className="operator-initial">
                                                                <img alt={' '} className="img-fluid" src={Images.supply_green_dispatch}/>
                                                            </div>
                                                            <div className="operator-details">
                                                                <h6 className="mb-0">Large Waste Bin</h6>
                                                                <p className='mb-0'>Waste Bins</p>
                                                            </div>
                                                        </div>
                                                        <Dropdown overlay={menu} trigger={['click']}>
                                                            <Button
                                                                className="ant-dropdown-link bg-transparent ant-dropdown-link-custom"
                                                                onClick={e => e.preventDefault()}>
                                                                <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                                     className="img-fluid"/>
                                                            </Button>
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 px-0 data-header-employees data-header-employees-scroll">
                                        <div className="common-box-calender box-1-header box-1-header-main d-inline-block p-0">
                                            <div style={{minHeight: '100px'}}
                                                 className="box-1-left d-flex align-items-center justify-content-center">
                                                <div className="no-time-div h-auto">No Time</div>
                                            </div>
                                            <div className="box-1-left scroll-time-list">
                                                <ul className="list-inline mb-0">
                                                    <li>07:00 AM</li>
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
                                                    <li>06:30 AM</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="data-header-employees-scroll-common">
                                            <div className="row mx-0 data-card-main">
                                                <div className="col-12 p-0">
                                                    <Board className={'custom-data-board'} data={data}/>
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
        </div>);
    }
}

export default SuppliesTabsDispatchView;
import React, {Component} from 'react';
import {Button, Checkbox, Collapse, Drawer, Dropdown, Menu, Radio, Select} from "antd";
import {Image as Images} from "../../../Images";
import {Link} from "react-router-dom";
import {CaretDownOutlined} from "@ant-design/icons";

const menu = (<Menu>
    <Menu.Item key="0">
        <Link to={''}>Remove</Link>
    </Menu.Item>
</Menu>);
const {Panel} = Collapse;
const {Option} = Select;

class WorkOrderViewDetailsDrawer extends Component {
    formRef = React.createRef();

    render() {
        return (<React.Fragment>
            <Drawer
                centered
                destroyOnClose={true}
                closable={true}
                title="Work Order"
                visible={this.props.visible}
                onClose={this.props.onClose}
                onCancel={() => this.props.onClose}
                className="main-all-form-modal main-drawer-div drawer-update"
                width={"600px"}
                placement={"right"}
                maskClosable={false}
                footer={false}
            >
                <div className="row inner-modal-main-row">
                    <div className="col-12">
                        <div className="row dispatch-word-card mx-0 mt-0">
                            <div className="col-12 position-relative">
                                <h6>
                                    <div className="work-id">302654</div>
                                    <div className="project-name">Project Name</div>
                                </h6>
                                <small>Site Owner Account</small>
                                <div style={{
                                    color: '#3391FF'
                                }} className="tag-common rescheduled-div">
                                    In QUEUE
                                </div>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Button className="ant-dropdown-link ant-dropdown-link-custom"
                                            onClick={e => e.preventDefault()}>
                                        <img src={Images.menu_dispatch_elipsis} alt={' '}
                                             className="img-fluid"/>
                                    </Button>
                                </Dropdown>
                            </div>
                            <div className="col-12 col-sm-7">
                                <p>
                                    <img src={Images.location_gray_dispatch_14} alt=""
                                         className="img-fluid"/>
                                    123 W 112TH ST New York</p>
                            </div>
                            <div className="col-12 col-sm-5 time-schedule-div position-relative">
                                <ul className="list-inline mb-0 text-right">
                                    <li className="list-inline-item">
                                        Apr 14, 2021
                                    </li>
                                    <li className="list-inline-item">|</li>
                                    <li className="list-inline-item">
                                        <Button className="repeats-btn">~ 2hr
                                            <img src={Images.recurrence} alt={' '} className="img-fluid"/>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Collapse className="custom-collapse-work-order" defaultActiveKey={['1']}>
                                    <Panel header={<div className="custom-collapse-row">
                                        <div className="custom-collapse-details d-flex align-items-center">
                                            <img src={Images.line_item_icon_green} alt={''} className="img-fluid m-1"/>
                                            Pneumatic Vac Excavation / NYC
                                        </div>
                                        <div className="dropdown-details">
                                            <Dropdown overlay={menu} trigger={['click']}>
                                                <Button
                                                    className="ant-dropdown-link bg-transparent ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                    <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                         className="img-fluid"/>
                                                </Button>
                                            </Dropdown>
                                        </div>
                                    </div>} key="1">
                                        <div className="row work-info-inner-collapse-content">
                                            <div className="col-12">
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Operator 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5"/>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Operator 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5"/>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Operator 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5"/>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 px-0 border-TB-1">
                                                        <div className="row content-row-details disabled">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Crew Chief</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5"/>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Employee'}
                                                                >
                                                                    <Option value="a">John Doe</Option>
                                                                    <Option value="b">John Doe 1</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Vehicle 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <h6 style={{fontWeight: '400'}}>Box Truck</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Vehicle'}
                                                        >
                                                            <Option value="a">Box Truck 101</Option>
                                                            <Option value="b">Box Truck 102</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details disabled">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Driver 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        {/*<h6 style={{fontWeight:'400'}}>Box Truck</h6>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">Select Employee</Option>
                                                            <Option value="b">Select Employee</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 px-0 border-TB-1">
                                                        <div className="row content-row-details">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Vehicle 2</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                <h6 style={{fontWeight: '400'}}>Pickup Truck</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Vehicle'}
                                                                >
                                                                    <Option value="a">Box Truck 101</Option>
                                                                    <Option value="b">Box Truck 102</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                        <div className="row content-row-details disabled">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Driver 2</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                {/*<h6 style={{fontWeight:'400'}}>Box Truck</h6>*/}
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Employee'}
                                                                >
                                                                    <Option value="a">Select Employee</Option>
                                                                    <Option value="b">Select Employee</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 px-0 border-TB-1">
                                                        <div className="row content-row-details">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Supply 1</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                <div className="row">
                                                                    <div className="col-12 col-sm-4">
                                                                        <h6 style={{fontWeight: '400'}}>QTY: 1</h6>
                                                                    </div>
                                                                    <div className="col-12 col-sm-8">
                                                                        <h6 style={{fontWeight: '400'}}>Power
                                                                            Washer</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Supply'}
                                                                >
                                                                    <Option value="a">Select Supply</Option>
                                                                    <Option value="b">Select Supply</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                        <div className="row content-row-details">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Supply 2</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                <div className="row">
                                                                    <div className="col-12 col-sm-4">
                                                                        <h6 style={{fontWeight: '400'}}>QTY: 1</h6>
                                                                    </div>
                                                                    <div className="col-12 col-sm-8">
                                                                        <h6 style={{fontWeight: '400'}}>Power Drill</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Supply'}
                                                                >
                                                                    <Option value="a">Select Supply</Option>
                                                                    <Option value="b">Select Supply</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Inventory Kit 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <div className="row align-items-center">
                                                            <div className="col-12 col-sm-4 pr-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    className="qty-select-box"
                                                                    defaultValue={'a'}
                                                                    placeholder={'Select Qty'}
                                                                >
                                                                    <Option value="a">QTY: 1</Option>
                                                                    <Option value="b">QTY: 2</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-8">
                                                                <h6 style={{
                                                                    fontWeight: '400'
                                                                }} className="mb-0">Bucket of Nails</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        {/*<Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3 pr-0">
                                                        <h6 className="mb-0"><Radio value={1}>Inventory Kit 1</Radio>
                                                        </h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <div className="row align-items-center">
                                                            <div className="col-12 col-sm-4 pr-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    className="qty-select-box"
                                                                    defaultValue={'a'}
                                                                    placeholder={'Select Qty'}
                                                                >
                                                                    <Option value="a">QTY: 1</Option>
                                                                    <Option value="b">QTY: 2</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-8 pr-0">
                                                                <div className="row align-items-center">
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <Select
                                                                            suffixIcon={<CaretDownOutlined/>}
                                                                            className="qty-select-box"
                                                                            defaultValue={'a'}
                                                                            placeholder={'Select Qty'}
                                                                        >
                                                                            <Option value="a">QTY: 1</Option>
                                                                            <Option value="b">QTY: 2</Option>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <h6 style={{
                                                                            fontWeight: '400'
                                                                        }} className="mb-0">9 Inch Nails</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        {/*<Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3 pr-0">
                                                        <h6 className="mb-0"><Radio value={1}>Inventory Kit 2</Radio>
                                                        </h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <div className="row">
                                                            <div className="col-12 col-sm-4 pr-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    className="qty-select-box"
                                                                    defaultValue={'a'}
                                                                    placeholder={'Select Qty'}
                                                                >
                                                                    <Option value="a">QTY: 1</Option>
                                                                    <Option value="b">QTY: 2</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-8 pr-0">
                                                                <div className="row align-items-center">
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <Select
                                                                            suffixIcon={<CaretDownOutlined/>}
                                                                            className="qty-select-box"
                                                                            defaultValue={'a'}
                                                                            placeholder={'Select Qty'}
                                                                        >
                                                                            <Option value="a">QTY: 1</Option>
                                                                            <Option value="b">QTY: 2</Option>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <h6 style={{
                                                                            fontWeight: '400'
                                                                        }} className="mb-0">9 Inch Nails</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        {/*<Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-11">
                                                        <h6 style={{
                                                            fontWeight: '400'
                                                        }} className="mb-0">
                                                            <span style={{
                                                                color: '#E39999'
                                                            }}>Inventory 1 has been deactivated</span>
                                                            , Click X to Activate </h6>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox checked={true} className="in_active"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Panel>
                                    <Panel header={<div className="custom-collapse-row">
                                        <div className="custom-collapse-details d-flex align-items-center">
                                            <img src={Images.line_item_icon_green} alt={''} className="img-fluid m-1"/>
                                            Pneumatic Vac Excavation / NYC
                                        </div>
                                        <div className="dropdown-details">
                                            <Dropdown overlay={menu} trigger={['click']}>
                                                <Button
                                                    className="ant-dropdown-link bg-transparent ant-dropdown-link-custom"
                                                    onClick={e => e.preventDefault()}>
                                                    <img src={Images.menu_dispatch_elipsis} alt={' '}
                                                         className="img-fluid"/>
                                                </Button>
                                            </Dropdown>
                                        </div>
                                    </div>} key="2">
                                        <div className="row work-info-inner-collapse-content">
                                            <div className="col-12">
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Operator 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5"/>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Operator 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5"/>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Operator 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5"/>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 px-0 border-TB-1">
                                                        <div className="row content-row-details disabled">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Crew Chief</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5"/>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Employee'}
                                                                >
                                                                    <Option value="a">John Doe</Option>
                                                                    <Option value="b">John Doe 1</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Vehicle 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <h6 style={{fontWeight: '400'}}>Box Truck</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Vehicle'}
                                                        >
                                                            <Option value="a">Box Truck 101</Option>
                                                            <Option value="b">Box Truck 102</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details disabled">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Driver 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        {/*<h6 style={{fontWeight:'400'}}>Box Truck</h6>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        <Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">Select Employee</Option>
                                                            <Option value="b">Select Employee</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 px-0 border-TB-1">
                                                        <div className="row content-row-details">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Vehicle 2</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                <h6 style={{fontWeight: '400'}}>Pickup Truck</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Vehicle'}
                                                                >
                                                                    <Option value="a">Box Truck 101</Option>
                                                                    <Option value="b">Box Truck 102</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                        <div className="row content-row-details disabled">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Driver 2</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                {/*<h6 style={{fontWeight:'400'}}>Box Truck</h6>*/}
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Employee'}
                                                                >
                                                                    <Option value="a">Select Employee</Option>
                                                                    <Option value="b">Select Employee</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 px-0 border-TB-1">
                                                        <div className="row content-row-details">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Supply 1</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                <div className="row">
                                                                    <div className="col-12 col-sm-4">
                                                                        <h6 style={{fontWeight: '400'}}>QTY: 1</h6>
                                                                    </div>
                                                                    <div className="col-12 col-sm-8">
                                                                        <h6 style={{fontWeight: '400'}}>Power
                                                                            Washer</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Supply'}
                                                                >
                                                                    <Option value="a">Select Supply</Option>
                                                                    <Option value="b">Select Supply</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                        <div className="row content-row-details">
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="mb-0">Supply 2</h6>
                                                            </div>
                                                            <div className="col-12 col-sm-5">
                                                                <div className="row">
                                                                    <div className="col-12 col-sm-4">
                                                                        <h6 style={{fontWeight: '400'}}>QTY: 1</h6>
                                                                    </div>
                                                                    <div className="col-12 col-sm-8">
                                                                        <h6 style={{fontWeight: '400'}}>Power Drill</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-sm-3 p-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    placeholder={'Select Supply'}
                                                                >
                                                                    <Option value="a">Select Supply</Option>
                                                                    <Option value="b">Select Supply</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-1 text-right">
                                                                <Checkbox/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3">
                                                        <h6 className="mb-0">Inventory Kit 1</h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <div className="row align-items-center">
                                                            <div className="col-12 col-sm-4 pr-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    className="qty-select-box"
                                                                    defaultValue={'a'}
                                                                    placeholder={'Select Qty'}
                                                                >
                                                                    <Option value="a">QTY: 1</Option>
                                                                    <Option value="b">QTY: 2</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-8">
                                                                <h6 style={{
                                                                    fontWeight: '400'
                                                                }} className="mb-0">Bucket of Nails</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        {/*<Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3 pr-0">
                                                        <h6 className="mb-0"><Radio value={1}>Inventory Kit 1</Radio>
                                                        </h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <div className="row align-items-center">
                                                            <div className="col-12 col-sm-4 pr-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    className="qty-select-box"
                                                                    defaultValue={'a'}
                                                                    placeholder={'Select Qty'}
                                                                >
                                                                    <Option value="a">QTY: 1</Option>
                                                                    <Option value="b">QTY: 2</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-8 pr-0">
                                                                <div className="row align-items-center">
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <Select
                                                                            suffixIcon={<CaretDownOutlined/>}
                                                                            className="qty-select-box"
                                                                            defaultValue={'a'}
                                                                            placeholder={'Select Qty'}
                                                                        >
                                                                            <Option value="a">QTY: 1</Option>
                                                                            <Option value="b">QTY: 2</Option>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <h6 style={{
                                                                            fontWeight: '400'
                                                                        }} className="mb-0">9 Inch Nails</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        {/*<Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-3 pr-0">
                                                        <h6 className="mb-0"><Radio value={1}>Inventory Kit 2</Radio>
                                                        </h6>
                                                    </div>
                                                    <div className="col-12 col-sm-5">
                                                        <div className="row">
                                                            <div className="col-12 col-sm-4 pr-0">
                                                                <Select
                                                                    suffixIcon={<CaretDownOutlined/>}
                                                                    className="qty-select-box"
                                                                    defaultValue={'a'}
                                                                    placeholder={'Select Qty'}
                                                                >
                                                                    <Option value="a">QTY: 1</Option>
                                                                    <Option value="b">QTY: 2</Option>
                                                                </Select>
                                                            </div>
                                                            <div className="col-12 col-sm-8 pr-0">
                                                                <div className="row align-items-center">
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <Select
                                                                            suffixIcon={<CaretDownOutlined/>}
                                                                            className="qty-select-box"
                                                                            defaultValue={'a'}
                                                                            placeholder={'Select Qty'}
                                                                        >
                                                                            <Option value="a">QTY: 1</Option>
                                                                            <Option value="b">QTY: 2</Option>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="col-12 col-sm-6 pr-0">
                                                                        <h6 style={{
                                                                            fontWeight: '400'
                                                                        }} className="mb-0">9 Inch Nails</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-3 p-0">
                                                        {/*<Select
                                                            suffixIcon={<CaretDownOutlined/>}
                                                            placeholder={'Select Employee'}
                                                        >
                                                            <Option value="a">John Doe</Option>
                                                            <Option value="b">John Doe 1</Option>
                                                        </Select>*/}
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox/>
                                                    </div>
                                                </div>
                                                <div className="row content-row-details">
                                                    <div className="col-12 col-sm-11">
                                                        <h6 style={{
                                                            fontWeight: '400'
                                                        }} className="mb-0">
                                                            <span style={{
                                                                color: '#E39999'
                                                            }}>Inventory 1 has been deactivated</span>
                                                            , Click X to Activate </h6>
                                                    </div>
                                                    <div className="col-12 col-sm-1 text-right">
                                                        <Checkbox checked={true} className="in_active"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
        </React.Fragment>);
    }
}

export default WorkOrderViewDetailsDrawer;
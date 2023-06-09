import React, {Component} from "react";
import {Button, DatePicker, Drawer, Form, Input, Select, Spin, TimePicker,} from "antd";
import {withRouter} from "react-router-dom";
import {Image as Images} from '../../../Images'
import {Option} from "antd/lib/mentions";

const layout = {
    labelCol: {span: 24}, wrapperCol: {span: 24},
};

class DispatchWorkOrderFilter extends Component {

    formRef = React.createRef();


    handleApplyFilter = () => {
        console.log( this.formRef.current.getFieldValue('project'),"owner")
        const filterObj = {
            project: this.formRef.current.getFieldValue('project')?.value,
            id:this.formRef.current.getFieldValue('workorder_Id'),
            service_start:this.formRef.current.getFieldValue('service_start')?.format("YYYY-MM-DD")||null,
            service_end:this.formRef.current.getFieldValue('service_end')?.format("YYYY-MM-DD")||null,
            start_time:this.formRef.current.getFieldValue('start_time')?.format("HH:mm:ss.sss")||null,
            end_time:this.formRef.current.getFieldValue('end_time')?.format("HH:mm:ss.sss")||null ,
            owner_account: this.formRef.current.getFieldValue('owner_account')?.value,
            customer_account: this.formRef.current.getFieldValue('customer_account')?.value,
            warehouse: this.formRef.current.getFieldValue('warehouse')?.value,
            site: this.formRef.current.getFieldValue('site')?.value
        }
        this.props.setFilterObj(filterObj);
        this.props.onClose();

    }

    render() {
        const {project, fetching} = this.props;
        return (<React.Fragment>
            <Drawer
                centered
                destroyOnClose={true}
                closable={true}
                title="Work Order Filter"
                visible={this.props.visible}
                onClose={this.props.onClose}
                onCancel={() => this.props.onClose}
                className="main-all-form-modal main-drawer-div drawer-update"
                width={"721px"}
                placement={"right"}
                maskClosable={false}
                footer={<div
                    style={{
                        textAlign: "right",
                    }}
                >
                    <Button onClick={this.clearValues} style={{marginRight: 10}}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleApplyFilter} type="primary">
                        Apply Filter
                    </Button>
                </div>}
            >
                {/* <div className="row mx-0 inner-modal-main-row">
                    <div className="col-12">
                        <div className="row mx-0">
                            <Form
                                ref={this.formRef}
                                {...layout}
                                hideRequiredMark={true}
                                className="main-inner-form w-100"
                            >
                                <div className="row">
                                    <div className="col-12 col-sm-6 border-right-1">
                                        <div className="row">
                                            <div className="col-12">
                                                <Form.Item
                                                    name="service_date"
                                                    label={"Service Date"}
                                                    rules={[{
                                                        required: false, // message: "this field is required",
                                                    },]}
                                                >
                                                    <div className="row">
                                                        <div
                                                            className="col-12 col-sm-6 pr-2 position-relative margin-btn-15">
                                                            <DatePicker/>
                                                            <span className="dash-line"/>
                                                        </div>
                                                        <div className="col-12 col-sm-6 pl-2 margin-btn-15">
                                                            <DatePicker/>
                                                        </div>
                                                        <div className="col-12 col-sm-6 pr-2 position-relative">
                                                            <TimePicker placeholder={'All Time'}
                                                                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}/>
                                                            <span className="dash-line"/>
                                                        </div>
                                                        <div className="col-12 col-sm-6 pl-2">
                                                            <TimePicker placeholder={'All Time'}
                                                                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}/>
                                                        </div>
                                                    </div>
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <Form.Item
                                                    name="created_date"
                                                    label={"Date Created"}
                                                    rules={[{
                                                        required: false, // message: "this field is required",
                                                    },]}
                                                >
                                                    <div className="row">
                                                        <div className="col-12 col-sm-6 pr-2 position-relative">
                                                            <DatePicker/>
                                                            <span className="dash-line"/>
                                                        </div>
                                                        <div className="col-12 col-sm-6 pl-2">
                                                            <DatePicker/>
                                                        </div>
                                                    </div>
                                                </Form.Item>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1">
                                                        <Form.Item
                                                            name="status"
                                                            label={"Status"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <Checkbox.Group className="common-checkbox w-100">
                                                                        <Row>
                                                                            <Col span={24}>
                                                                                <Checkbox value="service_request">Service
                                                                                    Request</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox value="in_queue">In
                                                                                    Queue</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox value="ready">Ready</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox value="en_route">En
                                                                                    Route</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox value="at_work">At
                                                                                    Work</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox
                                                                                    value="completed">Completed</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox value="partially_completed">Partially
                                                                                    Completed</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox
                                                                                    value="needs_to-be_rescheduled">Needs
                                                                                    to be
                                                                                    rescheduled</Checkbox>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <Checkbox value="not_accepted">Not
                                                                                    Accepted</Checkbox>
                                                                            </Col>
                                                                        </Row>
                                                                    </Checkbox.Group>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="status"
                                                            label={"Project"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Select Project"
                                                                     >
                                                                          <Select.Option value={1}>Project Name A</Select.Option>
                                                                          <Select.Option value={2}>Project Name A</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="vehicles"
                                                            label={"Vehicles"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Select Vehicles"
                                                                     >
                                                                          <Select.Option value={1}>Truck 101</Select.Option>
                                                                          <Select.Option value={2}>Truck 101</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="employees"
                                                            label={"Employees"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Search Employees"
                                                                     >
                                                                          <Select.Option value={1}>John Doe</Select.Option>
                                                                          <Select.Option value={2}>John Doe</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 px-0 position-relative">
                                                        <Form.Item
                                                            name="inventory"
                                                            label={"Inventory"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Search Inventory"
                                                                     >
                                                                          <Select.Option value={1}>Inventory Group</Select.Option>
                                                                          <Select.Option value={2}>Inventory Group</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="supply"
                                                            label={"Supply"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Search Supply"
                                                                     >
                                                                          <Select.Option value={1}>Supply Group</Select.Option>
                                                                          <Select.Option value={2}>Supply A</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="customer_account"
                                                            label={"Customer Account"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Search Customer"
                                                                     >
                                                                          <Select.Option value={1}>Customer A</Select.Option>
                                                                          <Select.Option value={2}>Customer A</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="site_owner_account"
                                                            label={"Site Owner Account"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Search Site Owner"
                                                                     >
                                                                          <Select.Option value={1}>Site Owner A</Select.Option>
                                                                          <Select.Option value={2}>Site Owner B</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="site"
                                                            label={"Site"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Search Site"
                                                                     >
                                                                          <Select.Option value={1}>Site  A</Select.Option>
                                                                          <Select.Option value={2}>Site  B</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row mx-0">
                                                    <div className="col-12 pt-2 px-0 border-top-1 position-relative">
                                                        <Form.Item
                                                            name="user"
                                                            label={"Users"}
                                                            rules={[{
                                                                required: false, // message: "this field is required",
                                                            },]}
                                                        >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                     <Select
                                                                          mode="multiple"
                                                                          allowClear
                                                                          style={{ width: '100%' }}
                                                                          placeholder="Search User"
                                                                     >
                                                                          <Select.Option value={1}>User  A</Select.Option>
                                                                          <Select.Option value={2}>User  B</Select.Option>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </Form.Item>
                                                        <Button className="search-btn-common position-absolute p-0 border-0 bg-transparent m-auto">
                                                            <img src={Images.search_icon_gray} className="img-fluid" alt="search icon"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div> */}

                <div className="row mx-0 inner-modal-main-row">
                    <div className="col-12">
                        <Form {...layout} className="main-inner-form" ref={this.formRef}>
                            <div className="row">
                                <div className="col-12">
                                    <Form.Item
                                        name="project"
                                        label={'Associated Project'}
                                        rules={[{
                                            required: false, // message: "this field is required",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            labelInValue
                                            notFoundContent={
                                                fetching ? <Spin size="small"/> : null
                                            }
                                            showSearch
                                            filterOption={false}
                                            onSearch={e => this.props.getProject({search: e})}
                                            onFocus={() => this.props.getProject()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                             src={Images.caret_small_icon_select}/>}
                                        >
                                            {project.map(i => {
                                                return (
                                                    <Option key={i.id} value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="workorder_Id"
                                        label={'Work Order ID'}
                                        rules={[{
                                            required: false
                                        }]}
                                        className="position-relative"
                                    >
                                        <Input
                                            placeholder={"Work Order ID"}
                                            name="workorder_Id"
                                        />
                                    </Form.Item>
                                </div>
                                {/* <div className="col-12"> */}
                                <div className="col-12 ">
                                    <Form.Item
                                        name="service_date"
                                        label={'Service Date'}
                                        rules={[{
                                            required: false, // message: "this field is required",
                                        },]}
                                        className=""
                                    >
                                        <div className="row position-relative">
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                name="service_start"
                                                >
                                                <DatePicker   format={"MM/DD/YYYY"} />

                                                </Form.Item>
                                            </div>
                                            <span className="dashed-line position-absolute"/>
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                name="service_end"
                                                >
                                                <DatePicker  format={"MM/DD/YYYY"}/>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="col-12 ">
                                    <Form.Item
                                        name="Service_time"
                                        label={'Service Time'}
                                        rules={[{
                                            required: false, // message: "this field is required",
                                        },]}
                                        className="position-relative"
                                    >
                                        <div className="row position-relative">
                                            <div className="col-12 col-sm-6">
                                                <Form.Item
                                                name="start_time" 
                                                >
                                                <TimePicker placeholder={'Select Estimated Start Time'}/>

                                                </Form.Item>
                                            </div>
                                            <span className="dashed-line position-absolute"/>
                                            <div className="col-12 col-sm-6">
                                            <Form.Item
                                            name="end_time" 
                                            >
                                                    
                                                <TimePicker  placeholder={'Select Estimated End Time'}/>
                                                    </Form.Item>
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="warehouse"
                                        label={'Warehouse / Dispatch Origin'}
                                        rules={[{
                                            required: false, // message: "this field is required",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            labelInValue
                                            notFoundContent={
                                                fetching ? <Spin size="small"/> : null
                                            }
                                            showSearch
                                            filterOption={false}
                                            onSearch={e => this.props.getWarehouse({search: e})}
                                            onFocus={() => this.props.getWarehouse()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                             src={Images.caret_small_icon_select}/>}
                                        >
                                            {this.props.warehouse.map(i => {
                                                return (
                                                    <Option key={i.id} value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="customer_account"
                                        label={'Billing Account'}
                                        rules={[{
                                            required: false, // message: "this field is required",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            labelInValue
                                            notFoundContent={
                                                fetching ? <Spin size="small"/> : null
                                            }
                                            showSearch
                                            filterOption={false}
                                            onSearch={e => this.props.getBillingAccount({search: e})}
                                            onFocus={() => this.props.getBillingAccount()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                             src={Images.caret_small_icon_select}/>}
                                        >
                                            {this.props.customer_acc.map(i => {
                                                return (
                                                    <Option key={i.id} value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="owner_account"
                                        label={'Site Manager Account'}
                                        rules={[{
                                            required: false, // message: "this field is required",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            labelInValue
                                            notFoundContent={
                                                fetching ? <Spin size="small"/> : null
                                            }
                                            showSearch
                                            filterOption={false}
                                            onSearch={e => this.props.getSitemanagerAcoount({search: e})}
                                            onFocus={() => this.props.getSitemanagerAcoount()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                             src={Images.caret_small_icon_select}/>}
                                        >
                                            {this.props.owner_acc.map(i => {
                                                return (
                                                    <Option key={i.id} value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="col-12">
                                    <Form.Item
                                        name="site"
                                        label={'Site'}
                                        rules={[{
                                            required: false, // message: "this field is required",
                                        },]}
                                        className="position-relative"
                                    >
                                        <Select
                                            labelInValue
                                            notFoundContent={
                                                fetching ? <Spin size="small"/> : null
                                            }
                                            showSearch
                                            filterOption={false}
                                            onSearch={e => this.props.getSites({search: e})}
                                            onFocus={() => this.props.getSites()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                             src={Images.caret_small_icon_select}/>}
                                        >
                                            {this.props.sites.map(i => {
                                                return (
                                                    <Option key={i.id} value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div>

                                {/* <div className="col-12">
                                    <Form.Item
                                        name="unit"
                                        label={'Unit'}
                                        rules={[{
                                            required: false
                                        }]}
                                        className="position-relative"
                                    >
                                        <Select
                                            labelInValue
                                            filterOption={false}
                                            showSearch
                                            // notFoundContent={
                                            //     loading ? <Spin size="small" /> : null
                                            // }
                                            onSearch={e => this.getUnitName({ search: e })}
                                            onFocus={() => this.getUnitName()}
                                            placeholder="Select"
                                            suffixIcon={<img alt={''} className="img-fluid"
                                                src={Images.caret_small_icon_select} />}
                                        > */}
                                {/* {Object.entries(allOptions).map((i, index, arr) =>  {
                                                        return (
                                                        <OptGroup
                                                        key={i && i[0]}
                                                        value={i && i[0]}
                                                        label={i && i[0]}
                                                        className={"kit-uom-optgroup"}
                                                    >
                                                    {i && 
                                                    i[1].map((u) => {
                                                        return (
                                                        <Option
                                                            key={u.id}
                                                            value={u.id}
                                                            className="text-lowercase"
                                                        >
                                                            {u.name}
                                                        </Option>
                                                        );
                                                    })}
                                                </OptGroup>
                                                            );
                                                        })} */}
                                {/* </Select> */}
                                {/* </Form.Item> */}
                                {/* </div> */}
                            </div>
                        </Form>
                    </div>
                </div>
            </Drawer>
        </React.Fragment>);
    }
}

export default withRouter(DispatchWorkOrderFilter);
import React, {useEffect, useRef, useState} from 'react';
import {Button, Collapse, Drawer, Dropdown, Form, Menu, Select} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from "../../../../../Images";
import { getInternalLocation } from '../../../../../../Controller/api/vehicleServices';
import { handleError } from '../../../../../../Controller/Global';
import { createWorkOrderWarehouse, deleteWorkOrderWarehouse, getWorkOrderById, getWorkOrderWarehouse } from '../../../../../../Controller/api/workOrderServices';

const layout = {
    labelCol: {span: 24}, wrapperCol: {span: 24},
};
const {Panel} = Collapse;
const {Option} = Select;
const EditWarehouseDispatch = (props) => {
    const formRef = useRef();
    
    const [warehouseVal,setWarehouseVal] = useState([])
    const [warehouse,setWarehouse] = useState(null)
    const [fetching,setFetching] = useState(false)
    function callback(key) {
        console.log(key);
    }

    useEffect(() => {
       handleGetWorkorder();
    },[])

    function handleGetWorkorder() {
        getWorkOrderById(props.warehouseData.workorder.id).then((res) => {
            setWarehouse(res.data)
        }).catch(err => {
            handleError(err)
        })

    }

    function fetchWarehouse(params = {}){
        setFetching(true)
        getInternalLocation(params)
          .then((res) => {
            setWarehouseVal(res.data.results)
          })
          .catch((err) => {
            handleError(err)
          }).finally(() => {
              setFetching(false)
          })
      };

      function handleSelect(obj) {
        formRef.current.setFieldsValue({
          warehouse: null,
        });
        const values = {
          work_order: props.warehouseData.workorder.id,
          warehouse: obj.value
    
        };
        createWorkOrderWarehouse(values).then((res) => {
            // props.handleCalender("true")
            handleGetWorkorder()
        //   this.props.fetchWorkOrder(this.props.workOrder.id)
          
        }).catch((err) => {
            handleError(err)
        })
      };

        function handleDeleteWarehouse(id){
            deleteWorkOrderWarehouse(id).then((res) => {
                handleGetWorkorder();
        
            })
          };


    return (<React.Fragment>
        <Drawer
            centered
            destroyOnClose={true}
            title={'Edit Warehouse / Dispatch'}
            visible={props.visible}
            onOk={props.onClose}
            // afterVisibleChange={this.populateVendorData}
            closable={true}
            onClose={props.onClose}
            onCancel={props.onClose}
            // onClose={() => {
            //   (this.state.unSavedExit ? this.setState({ drawerVisible: true }) :
            //     this.handleClose());
            // }
            // }
            // onCancel={() => {
            //   this.state.unSavedExit ? this.setState({ drawerVisible: true }) :
            //     this.handleClose()
            // }
            // }
            className="main-all-form-modal main-drawer-div internal-location drawer-update"
            width={"625px"}
            placement={"right"}
            footer={<div
                style={{
                    textAlign: "right",
                }}
            >
                <Button
                    // onClick={() => {
                    //   this.state.unSavedExit
                    //     ? this.setState({ drawerVisible: true })
                    //     : this.props.onClose();
                    // }}
                    style={{marginRight: 8}}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    // disabled={this.checkDisable()}
                    onClick={props.onClose}
                >
                    Continue
                </Button>
            </div>}
        >
            <div className="row mx-0 inner-modal-main-row">
                <div className="col-12">
                    <div className="row summary-info-inner-row">
                        <div className="col-12">
                            <Collapse
                                // onChange={this.populateData}
                                // accordion
                                defaultActiveKey={["1"]}
                                onChange={callback}
                                // activeKey={this.state.activeKey}
                                expandIcon={({isActive}) => (<CaretRightOutlined rotate={isActive ? 90 : 0}/>)}
                            >
                                <Panel
                                    header={<div className="col-12">
                                        <div
                                            className="info-card-heading-row row d-flex align-items-center justify-content-between">
                                            <span>Warehouse / Dispatch Origin *</span>
                                        </div>
                                    </div>}
                                    key="1"
                                >
                                    <div className="row common-form-card-row mx-0">
                                        <div className="col-12">
                                            <div className="row info-gray-div align-items-center">
                                                <h6 className="mb-0">
                                                    Please choose warehouse / Dispatch Origin
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-12 p-0">
                                            <Form
                                                // onFinish={this.handleSubmit}
                                                ref={formRef}
                                                {...layout}
                                                className="main-inner-form"
                                            >
                                                <div className="row">
                                                    <div className="col-12">
                                                        <Form.Item
                                                            dropdownClassName={"option-design-fix"}
                                                            name="warehouse"
                                                            label={"Warehouse *"}
                                                            // rules={[{
                                                            //     required: true, message: "Please select at Warehouse",
                                                            // },]}
                                                            className="position-relative"
                                                        >
                                                            <Select
                                                                labelInValue
                                                                disabled={warehouse?.workorder_warehouse?.length > 0}
                                                                // notFoundContent={fetching ? <Spin size="small"/> : null}
                                                                className="search-and-select-tag"
                                                                showSearch={true}
                                                                // disabled={selectedWarehouse.length > 0 ? true : false}
                                                                onFocus={() => fetchWarehouse()}
                                                                onSearch={(e) => fetchWarehouse({search: e})}
                                                                onChange={handleSelect}
                                                                placeholder="Search"
                                                                filterOption={false}
                                                                removeIcon={""}
                                                            >
                                                            {warehouseVal.length > 0 && warehouseVal.map(i => (
                                                                <Option key={i.id} value={i.id}>
                                                                    <div
                                                                        className="row custom-tree-row custom-tree-row-1">
                                                                        <div
                                                                            className="common-select-option-row col-12 d-flex align-items-center">
                                                                            <div
                                                                                style={{
                                                                                    width: "40px",
                                                                                }}
                                                                                className="float-left"
                                                                            >
                                                                                <img style={{height: '30px'}}
                                                                                     src={Images.location_black_icon}
                                                                                     alt={""}
                                                                                     className="img-fluid"/>

                                                                            </div>
                                                                            <div
                                                                                className="float-left warehouse-select-box">
                                                                                <h6 className="mb-0 w-100 d-inline-block ml-1">
                                                                                    {i.name}
                                                                                </h6>
                                                                                <p style={{
                                                                                    color: '#BDBDBD', fontSize: '11px'
                                                                                }} className="mb-0">
                                                                                    {/* 12233 Vose St.
                                                                                    New York, New York
                                                                                    10001 USA */}
                                                                                    {i.city} {i.state} {i.country}
                                                                                </p>
                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    display: "inline-block",
                                                                                }}
                                                                                className="text-green-tag text-center select-text-tier"
                                                                            >
                                                                                Warehouse
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Option>
                                                            ))
                                                            }
                                                            </Select>
                                                        </Form.Item>
                                                        <Button
                                                            className="search-icon bg-transparent border-0 p-0 position-absolute"
                                                            style={{top: 43, left: 25}}
                                                        >
                                                            <img src={Images.search_small_icon} alt=""
                                                                 className="img-fluid"/>
                                                        </Button>
                                                        <Button
                                                            // disabled={selectedWarehouse.length > 0 ? true : false}
                                                            className="create-btn-main position-absolute text-capitalize"
                                                            // onClick={() => this.showFacility(true)}
                                                        >
                                                            + Create
                                                        </Button>
                                                    </div>
                                                    {/*when-data-available*/}
                                                    {/* {this.state.newWarehouse ?  */}
                                                    <div className="col-12 col-sm-12">
                                                        <div className={"row mx-0"}>
                                                            {warehouse ? warehouse.workorder_warehouse.map(i => (
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <div
                                                                            className="row site-details-row-card mb-2 position-relative">
                                                                            <div
                                                                                className="col-12 col-sm-5 bg-gray-main p-0">
                                                                                <div
                                                                                    className="row mx-0 align-items-center pt-lg-3 pt-md-3 pt-3">
                                                                                    <div
                                                                                        className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                                                                                        <img
                                                                                            src={Images.location_black_icon}
                                                                                            alt=""
                                                                                            className="img-fluid"
                                                                                        />
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-12 col-sm-9 pl-lg-2">
                                                                                        <h6
                                                                                            style={{
                                                                                                fontSize: "15px",
                                                                                                color: "#4f4f4f",
                                                                                                fontWeight: "500",
                                                                                            }}
                                                                                            className="text-capitalize mb-0"
                                                                                        >
                                                                                            {i.warehouse?.name}
                                                                                        </h6>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-12 col-sm-7 px-3 pt-2 pb-4">
                                                                                <div
                                                                                    className="row">
                                                                                    <div
                                                                                        className="col-12 mb-3">
                                                                                        <Dropdown
                                                                                            overlayClassName="add-remove-dropdown-main"
                                                                                            placement="bottomCenter"
                                                                                            overlay={<Menu>
                                                                                                <Menu.Item
                                                                                                    onClick={() => {
                                                                                                        warehouse && handleDeleteWarehouse(warehouse.workorder_warehouse[0].id)
                                                                                                    }}
                                                                                                    key="0"
                                                                                                >
                                                                                                    <Button
                                                                                                        className="bg-transparent border-0 shadow-none p-0">
                                                                                                        Remove
                                                                                                    </Button>
                                                                                                </Menu.Item>
                                                                                            </Menu>}
                                                                                            trigger={["click"]}
                                                                                        >
                                                                                            <Button
                                                                                                style={{
                                                                                                    width: '20px',
                                                                                                    right: '0',
                                                                                                    bottom: 'auto',
                                                                                                    top: '-5px'
                                                                                                }}
                                                                                                className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                                                                                onClick={(e) => e.preventDefault()}
                                                                                            >
                                                                                                <img
                                                                                                    src={Images.black_dots_elipsis}
                                                                                                    alt=""
                                                                                                    className="img-fluid"
                                                                                                />
                                                                                            </Button>
                                                                                        </Dropdown>
                                                                                        <h6 className="text-uppercase">
                                                                                            ADDRESS
                                                                                        </h6>
                                                                                        {/* <p style={{color: '#333333'}}
                                                                                           className="mb-0">
                                                                                            12233 Vose St.
                                                                                            New York, New York
                                                                                            10001 USA </p> */}
                                                                                            <p style={{color: '#333333'}}
                                                                                           className="mb-0">
                                                                                           {i.warehouse?.city} {i.warehouse?.state} {i.warehouse?.country} </p>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-12 mb-3">
                                                                                        <h6 className="text-uppercase">
                                                                                            EMAIL ADDRESS
                                                                                        </h6>
                                                                                        <p
                                                                                            className="mb-0"
                                                                                            style={{
                                                                                                width: 100,
                                                                                                color: '#333333'
                                                                                            }}
                                                                                        >
                                                                                            {i.warehouse?.email}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-12">
                                                                                        <h6 className="text-uppercase">
                                                                                            PHONE NUMBER
                                                                                        </h6>
                                                                                        <p style={{color: '#333333'}}
                                                                                           className="mb-0">
                                                                                            {/* 111-111-1111 */}
                                                                                            {i.warehouse?.phone}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                             )) :
                                                            <div className="col-12">
                                                                <div
                                                                    className="row no-data-card-row align-items-center justify-content-center">
                                                                    <div className="col-12 text-center">
                                                                        <img src={Images.location_gray}
                                                                             alt={"location-icon"}
                                                                             className="img-fluid"/>
                                                                        <h6 className="mb-0">No warehouses</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-12 validate-div-col text-md-right">
                                                    <Form.Item>
                                                        <Button className="validate-btn-main" htmlType="submit">
                                                            Save and Continue
                                                        </Button>
                                                    </Form.Item>
                                                    {/* <button onClick={()=>{deleteCustomer(3)}}> Delete </button> */}
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>

    </React.Fragment>)
};

export default EditWarehouseDispatch;
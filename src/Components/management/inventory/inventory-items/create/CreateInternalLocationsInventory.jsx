import React, { Component } from "react";
import { Button, Dropdown, Form, InputNumber, Menu, message, Select, } from "antd";
import { Image as Images } from "../../../../Images";
import CreateInternalLocationDrawer from "./CreateInternalLocationDrawer";
import { getInternalLocation } from "../../../../../Controller/api/labourServices";
import { formatPhone } from "../../../../../Controller/utils";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";
import { debounce } from 'lodash';
import {
    createInventoryLocation,
    deleteLocationInventory,
    getInventoryLocationById,
    updateInventoryLocationQty,
} from "../../../../../Controller/api/inventoryServices";

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateInternalLocationsInventory extends Component {
    formRef = React.createRef();
    state = {
        visible: false,
        location: [],
        selectValue: null,
        sites: [],
        newSites: [],
        unit_type:'',
    };

    showFacility = (visible) => {
        this.setState({
            visible: visible,
        });
    };

    menu = (item, index) => (
        <Menu>
            <Menu.Item key="0">
                <Button
                    className="border-0 p-0 shadow-none bg-transparent"
                    onClick={() => this.handleRemove(item.id)}
                >
                    Remove
                </Button>
            </Menu.Item>
            <Menu.Item key="1">
                <Button
                    className="border-0 p-0 shadow-none bg-transparent"
                    onClick={() => this.handleEdit(item.internal_location)}
                >
                    Edit
                </Button>
            </Menu.Item>
        </Menu>
    );

    componentDidMount() {
        if (this.props.match?.params.id) {
            this.getInventoryLocation();
        }
    }

    getInventoryLocation = () => {
        getInventoryLocationById({ inventory_item: this.props.match.params.id })
            .then((res) => {
                this.setState({
                    newSites: res.data.results[0].location || [],
                });
            })
            .catch((err) => {
                handleError(err);
            });
    };

    fetchContacts = (params = {}) => {
        const data = {
            ...params,
            // inventory_id: this.props.match.params.id,
            // type: "INVENTORY"
        };
        getInternalLocation(data)
            .then((res) => {
                this.setState({ contacts: res.data.results });
            })
            .catch((err) => {
            });
    };

    handleEdit = (item) => {
        this.setState({ editData: item, visible: true });
    };

    handleRemove = (id) => {
        deleteLocationInventory(id)
            .then((res) => {
                let newSites = [...this.state.newSites];
                let newArr = newSites.filter((i) => {
                    return id !== i.id;
                });
                this.setState(
                    { newSites: newArr },
                    () => this.props.getInventoryItem()
                    // ,() => {
                    // this.formRef.current.setFieldsValue({
                    //     internal_locations: this.state.newSites?.map(value => {
                    //         return {value: value.internal_location.id, label: value.internal_location.name}
                    //     }),
                    //     // uom: {value: res.data.uom.id, label: res.data.uom.name}
                    // })
                );
                message.success("deleted!");
            })
            .catch((err) => {
                handleError(err);
            });
    };

    handleSubmit = () => {
        this.props.setInventory(this.props.inventory, 6);
        message.success("Inventory updated successfully!");
    };

    showContact = () => {
        this.setState({ visible: false, editData: null });
    };

    handleSelect = (e) => {
        // const locationId = this.state.contacts.find(i => i.id === e.value).id;
        const Id = this.props.match.params.id
            ? this.props.match.params.id
            : this.props.inventory?.id;
        this.formRef.current.setFieldsValue({
            internal_locations: null,
        });
        let sites = this.state.newSites.map((i) => i.internal_location.id);
        let newItem = this.state.contacts.find((i) => e == i.id);
        sites.push(newItem.id);
        this.setState({ sites });

        let unit_type_check = this.state.unit_type==='COM' 

        const data = {
            inventory_item: Id,
            unit_type: this.state.unit_type,
            uom: unit_type_check ? null : this.state.selectValue,
            com: unit_type_check ? this.state.selectValue :null,
            internal_location_id: sites.map((i) => i),
            location: [],
        };
        createInventoryLocation(data)
            .then((res) => {
                //    message.success('success')
                this.props.getInventoryItem();
                this.setState({ newSites: res.data.location });
            })
            .catch((err) => {
                handleError(err)
            });
    };

    // handleDeselect = e => {
    //     const deleteItem = this.state.newSites.find(i => i.internal_location.id === e.value);
    //       deleteLocationInventory(deleteItem.id).then(res => {
    //         let newSites = [...this.state.newSites];
    //         let newArr = newSites.drawer(i => {
    //             return (
    //                 e.value !== i.internal_location.id
    //             )
    //         })
    //         this.setState({newSites: newArr})
    //         // message.success('deleted!');
    //     }).catch(err => {
    //         handleError(err)
    //     })
    // }

    callbackContact = (item, newItem) => {
        if (newItem) {
            let newArr = this.state.newSites.map((i) => i.internal_location);
            newArr.push(item);
            // this.setState({newSites: newArr})
        let unit_type_check = this.state.unit_type==='COM' 
            const data = {
                disposal: this.props.match.params.id,
                unit_type: this.state.unit_type,
                uom: unit_type_check ? null : this.state.selectValue,
                com: unit_type_check ? this.state.selectValue :null,
                internal_location_id: newArr.map((i) => i.id),
                inventory_item: this.props.inventory.id,
                location: [],
            };
            createInventoryLocation(data)
                .then((res) => {
                    //    message.success('success')
                    this.setState({ newSites: res.data.location });
                    //     ,() => {
                    //     this.formRef.current.setFieldsValue({
                    //         internal_locations: this.state.newSites?.map(value => {
                    //             return {value: value.internal_location.id, label: value.internal_location.name}
                    //         }),
                    //         // uom: {value: res.data.uom.id, label: res.data.uom.name}
                    //     })
                    //    })
                })
                .catch((err) => {
                    if (err.response) {
                        Object.keys(err.response.data).map((e) => {
                            message.error(err.response.data[e]);
                        });
                    }
                });
        } else {
            const Index = this.state.newSites.findIndex(
                (i) => i.internal_location.id == item.id
            );
            const newArr = this.state.newSites.slice();
            newArr[Index].internal_location = item;
            this.setState({ newSites: newArr });
            //     , () => {
            //     this.formRef.current.setFieldsValue({
            //         internal_locations: this.state.newSites.map(value => {
            //             return {value: value.internal_location.id, label: value.internal_location.name}
            //         })
            //     })
            // })
        }
    };

    handleQtyChange = (e, item, index) => {
        let value = e.target.value;
        if (value) {
            var newArr = this.state.newSites.slice();
            newArr[index].qty = value;
            this.setState({ newSites: newArr });
            const params = {
                qty: value,
                type: "INVENTORY",
                id: item.id,
                inventory_id: this.props.match.params.id,
            };
            this.updateLocation(params, item);
        }
    };

    handleMinQtyChange = (e, item, index) => {
        let value = e.target.value;
        if (value) {
            var newArr = this.state.newSites.slice();
            newArr[index].min_qty = value;
            this.setState({ newSites: newArr });
            const params = {
                min_qty: value,
                type: "INVENTORY",
                id: item.id,
                inventory_id: this.props.match.params.id,
            };
            this.updateLocation(params, item);
        }
    };

    handleMaxQtyChange = (e, item, index) => {
        let value = e.target.value;
        if (value) {
            var newArr = this.state.newSites.slice();
            newArr[index].max_qty = value;
            this.setState({ newSites: newArr });
            const params = {
                max_qty: value,
                type: "INVENTORY",
                id: item.id,
                inventory_id: this.props.match.params.id,
            };
            this.updateLocation(params, item);
        }
    };

    handleUnitCostChange = (e, item, index) => {
        let value = e.target.value;
        if (value) {
            var newArr = this.state.newSites.slice();
            newArr[index].unit_cost = value;
            this.setState({ newSites: newArr });
            const params = {
                unit_cost: value,
                type: "INVENTORY",
                id: item.id,
                inventory_id: this.props.match.params.id,
            };
            this.updateLocation(params, item);
        }
    };

    updateLocation = (params, item) => {
        updateInventoryLocationQty(item.id, params)
            .then()
            .catch((err) => {
                if (err.response) {
                    Object.keys(err.response.data).map((e) => {
                        message.error(err.response.data[e]);
                    });
                }
            });
    };
    handleSelectChange = (data) => {
        let value = data.value
        if (value) {
            let unit_type = (typeof (value) === 'string' && value.includes('COM')) ? 'COM' : 'UOM';
            let selectid;
            if (unit_type === 'COM') {
                let splitt = value?.split('_');
                selectid = parseInt(splitt[splitt.length - 1]);
            }
            else {
                selectid = value;
            }
            this.setState({ selectValue: selectid, unit_type })
        }

    };

    debounceEvent = (...args) => {
        this.debouncedEvent = debounce(...args);
        return (e) => {
            return this.debouncedEvent(e);
        };
    };
    render() {
        return (
            <React.Fragment>
                <div className="row common-form-card-row">
                    <div className="col-12 px-0">
                        <Form
                            ref={this.formRef}
                            onFinish={this.handleSubmit}
                            {...layout}
                            hideRequiredMark={true}
                            className="main-inner-form"
                        >
                            <div className="row col-12-12">
                                {/*<div className="col-12">*/}
                                {/*    <div className="row mx-0 info-card-heading-row-info align-items-center">*/}
                                {/*        <div*/}
                                {/*            className="info-icon-card-flag-info d-flex align-items-center justify-content-center">*/}
                                {/*            <img src={Images.info_yellow} alt="" className="img-fluid" />*/}
                                {/*        </div>*/}
                                {/*        <div className="info-icon-card-details-info">*/}
                                {/*            <h6 className="mb-0">The cost in these sections is purely for reports.</h6>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="col-12">
                                    <div className="row mx-0 info-gray-div align-items-center">
                                        <h6 className="mb-0">
                                            This section gives us the information we need in order to
                                            account an inventory item (e.g. garbage bag) at a
                                            warehouse
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="uom"
                                        label={"Unit of Measurement *"}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: "Please select Universal UOM",
                                        //     },
                                        // ]}
                                    >
                                        <Select
                                            labelInValue
                                            suffixIcon={
                                                <img
                                                    alt=""
                                                    src={Images.caret_down_small_select}
                                                    className="img-fluid"
                                                />
                                            }
                                            placeholder="Select Option"
                                            onChange={this.handleSelectChange}
                                        >
                                            {this.props.inventory?.uom_array?.map((i) => {
                                                return (
                                                    <Select.Option key={i.id} value={i.id}>
                                                        {i.name} ({i.symbol})
                                                    </Select.Option>
                                                );

                                            })}

                                            {this.props.inventory?.com?.map(
                                                (i) => {
                                                    let COM_ID = `COM_${i.id}`
                                                    return (
                                                        <Select.Option
                                                            key={COM_ID}
                                                            value={COM_ID}
                                                        >
                                                            {i.name} ({i.abbreviation})
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-12">
                                    <div className="row mx-0 divider-row">
                                        You are choosing a unit of measurement from your pre-selected
                                        custom and universal units of measurement.
                                    </div>
                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        name="internal_locations"
                                        label={"Warehouses"}
                                        rules={[
                                            {
                                                required: false,
                                                message: "",
                                            },
                                        ]}
                                        className="position-relative remove-cross-icon search-overlap"
                                    >
                                        <Select
                                            // mode="multiple"
                                            // showSearch={true}
                                            dropdownClassName="option-design-fix"
                                            className="custom-search-select"
                                            disabled={!this.state.selectValue}
                                            // mode="multiple"
                                            showSearch={true}
                                            placeholder="Search"
                                            notFoundContent={null}
                                            filterOption={false}
                                            // onFocus={() => this.fetchContacts({ type: "INVENTORY" })}
                                            onFocus={() => this.fetchContacts()}
                                            // onSearch={(e) => this.fetchContacts({ search: e, type: "INVENTORY" })}
                                            onSearch={this.debounceEvent((e) => this.fetchContacts({ search: e }), 1000)}
                                            // onChange={this.handleSelect}
                                            onChange={this.handleSelect}
                                        // onDeselect={this.handleDeselect}
                                        // value={this.state.newSites.map(i => ({value: i.internal_location.id, label: i.internal_location.name})
                                        // )}
                                        >
                                            {this.state.contacts?.map((d) => (
                                                // <Option key={d.id} value={d.id}>{`${d.name}`}</Option>
                                                <Option key={d.id} value={d.id}>
                                                    <div className="row custom-tree-row custom-tree-row-1">
                                                        <div
                                                            className="common-select-option-row col-12 d-flex align-items-center">
                                                            <div
                                                                style={{
                                                                    width: "40px",
                                                                }}
                                                                className="float-left"
                                                            >
                                                                <img style={{ height: '30px' }}
                                                                    src={Images.location_black_icon} alt={""}
                                                                    className="img-fluid" />

                                                            </div>
                                                            <div className="float-left warehouse-select-box">
                                                                <h6 className="mb-0 w-100 d-inline-block ml-1">
                                                                    {d.name}
                                                                </h6>
                                                                <p style={{
                                                                    color: '#BDBDBD',
                                                                    fontSize: '11px'
                                                                }} className="mb-0">
                                                                    {d.street_address || ""}, {d.city || ""},{" "}
                                                                    {d.state || ""},{d.zip || ""} {d.country || ""}
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
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                                        <img
                                            src={Images.search_small_icon}
                                            alt=""
                                            className="img-fluid"
                                        />
                                    </Button>
                                    <Button
                                        className="create-btn-main position-absolute text-capitalize"
                                        disabled={!this.state.selectValue}
                                        onClick={() => this.showFacility(true)}
                                    >
                                        + Create
                                    </Button>
                                </div>

                                {this.state.newSites.length > 0 ? (
                                    this.state.newSites.map((item, index) => {
                                        let selectName= item?.unit_type == 'COM'?item?.com?.abbreviation :item?.uom?.symbol ;
                                        return (
                                            <div
                                                className="col-12 location-row-main"
                                                key={item.internal_location.id}
                                            >
                                                <div className="row mx-0">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-12 p-0">
                                                                <h6 className="mb-0">Location {index + 1}</h6>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="row site-details-row-card site-details-row-card-2 radius-bottom-0  position-relative">
                                                            <div className="col-12 col-sm-3">
                                                                <div className="site-name-location">
                                                                    <img
                                                                        src={Images.location_black_icon}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                    <span>{item.internal_location.name}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="text-uppercase">ADDRESS</h6>
                                                                <p className="mb-0">{`${item.internal_location.street_address} ${item.internal_location.name} ${item.internal_location.city} ${item.internal_location.state} ${item.internal_location.country}`}</p>
                                                            </div>
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="text-uppercase">
                                                                    EMAIL ADDRESS
                                                                </h6>
                                                                <p className="mb-0">
                                                                    {item.internal_location.email}
                                                                </p>
                                                            </div>
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="text-uppercase">PHONE NUMBER</h6>
                                                                <p className="mb-0">
                                                                    {formatPhone(item.internal_location.phone)}
                                                                </p>
                                                            </div>
                                                            <Dropdown
                                                                overlayClassName="add-remove-dropdown-main"
                                                                overlay={() => this.menu(item, index)}
                                                                trigger={["click"]}
                                                            >
                                                                <Button
                                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                                    onClick={(e) => e.preventDefault()}
                                                                >
                                                                    <img
                                                                        src={Images.more_black}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                </Button>
                                                            </Dropdown>
                                                        </div>
                                                        {/*<div className="row contact-green-small-heading mt-3 position-relative">*/}
                                                        {/*    <h5 className="mb-0 bg-white">QTY</h5>*/}
                                                        {/*</div>*/}
                                                        <div className="row custom-design-update">
                                                            <div
                                                                className="col-12 table-responsive mt-0 custom-internal-location">
                                                                <div className="row mx-0 custom-table-thead">
                                                                    <div className="custom-th-main">
                                                                        <div>
                                                                            Min QTY
                                                                            <br />
                                                                            <span className="font-weight-light">
                                                                                (REORDER POINT)
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="custom-th-main">
                                                                        <div>
                                                                            Max QTY
                                                                            <br />{" "}
                                                                            <span className="font-weight-light">
                                                                                (SINGLE RESTOCK QTY)
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="custom-th-main">
                                                                        <div>Current QTY</div>
                                                                    </div>
                                                                </div>
                                                                <div className="row mx-0 custom-table-tbody">
                                                                    <div className="custom-td position-relative">
                                                                        <InputNumber
                                                                            value={item.min_qty || 0}
                                                                            onBlur={(e) =>
                                                                                this.handleMinQtyChange(e, item, index)
                                                                            }
                                                                        />
                                                                        <small
                                                                            style={{ top: "22px" }}
                                                                            className="position-absolute unit-cost-name"
                                                                        >
                                                                            {selectName}
                                                                        </small>
                                                                    </div>
                                                                    <div className="custom-td position-relative">
                                                                        <InputNumber
                                                                            value={item.max_qty || 0}
                                                                            onBlur={(e) =>
                                                                                this.handleMaxQtyChange(e, item, index)
                                                                            }
                                                                        />
                                                                        <small
                                                                            style={{ top: "22px" }}
                                                                            className="position-absolute unit-cost-name"
                                                                        >
                                                                            {selectName}
                                                                        </small>
                                                                    </div>
                                                                    <div className="custom-td position-relative">
                                                                        <InputNumber
                                                                            value={item.qty || 0}
                                                                            onBlur={(e) =>
                                                                                this.handleQtyChange(e, item, index)
                                                                            }
                                                                        />
                                                                        <small
                                                                            style={{ top: "22px" }}
                                                                            className="position-absolute unit-cost-name"
                                                                        >
                                                                            {selectName}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/*<div className="row contact-green-small-heading mt-3 position-relative">*/}
                                                        {/*    <h5 className="mb-0 bg-white">Unit Cost</h5>*/}
                                                        {/*</div>*/}
                                                    </div>
                                                </div>
                                                {/*<div className="row">*/}
                                                {/*    <div className="col-12 col-sm-6">*/}
                                                {/*        /!* <Form.Item*/}
                                                {/*            className="position-relative"*/}
                                                {/*            name="unit_cost"*/}
                                                {/*            label={"Unit Cost *"} rules={[{*/}
                                                {/*            required: true,*/}
                                                {/*            message: 'this field is required'*/}
                                                {/*        }]}> *!/*/}
                                                {/*        /!* <InputNumber placeholder="$0.00"/> *!/*/}
                                                {/*        <label className="mt-3" style={{ fontWeight: '500' }}>Unit Cost *</label>*/}
                                                {/*        <div className="row">*/}
                                                {/*            <div className="col-12">*/}
                                                {/*                <small className="add-dollar position-absolute">$</small>*/}
                                                {/*                <InputNumber*/}
                                                {/*                    style={{ paddingLeft: 12 }}*/}
                                                {/*                    value={item.unit_cost || 0}*/}
                                                {/*                    onBlur={e => this.handleUnitCostChange(e, item, index)}>*/}
                                                {/*                </InputNumber>*/}
                                                {/*                <small*/}
                                                {/*                    style={{ right: '30px' }}*/}
                                                {/*                    className="position-absolute unit-cost-name">{selectName}</small>*/}
                                                {/*            </div>*/}
                                                {/*        </div>*/}
                                                {/*        /!* </Form.Item> *!/*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-12">
                                        <div className="row mx-0 common-card-upload">
                                            <div className="col-12 text-center">
                                                <img
                                                    src={Images.location_gray}
                                                    alt={""}
                                                    className="img-fluid"
                                                />
                                                <h6 className="mb-0 color-gray-3">No Warehouses</h6>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-12 p-0 validate-div-col text-md-right">
                                <Form.Item>
                                    <Button htmlType="submit" className="validate-btn-main">
                                        Save and Continue
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>

                {/*more-black*/}
                <CreateInternalLocationDrawer
                    callbackContact={this.callbackContact}
                    fetchContacts={this.fetchContacts}
                    editData={this.state.editData}
                    visible={this.state.visible}
                    onClose={(values) => this.showContact(false, values)}
                />
            </React.Fragment>
        );
    }
}

export default withRouter(CreateInternalLocationsInventory);

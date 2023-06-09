import React, {Component} from "react";
import {Button, Collapse, Divider, Input, InputNumber, Radio, Select, Space, Spin} from "antd";
import {CaretDownOutlined, CaretRightOutlined} from "@ant-design/icons";
import {Image as Images} from "../../../Images";
import {
    FLEET_GROUP, SUPPLY_GROUP, MANAGEMENT_TREE_TYPES, LABOR, TYPES,
} from "../../../../Controller/utils";
import {
    getFleetData,
} from "../../../../Controller/api/vehicleServices";
import {handleError} from "../../../../Controller/Global";
import {
    getSupplyDispatch,
} from "../../../../Controller/api/supplyServices";
import {
    getLaborEmployees,
} from "../../../../Controller/api/labourServices";
import {Menu} from "antd";
import {
    updateDispatchData,
} from "../../../../Controller/api/dispatchServices";
import {Option} from "antd/lib/mentions";

const {Panel} = Collapse;

class WorkOrderAssignServiceTableMain extends Component {
    state = {
        rows: [],
        qty: 1,
        fetching: false,
        employees: [],
        supplyData: [],
        fleetData: [],
        totalCount: 0,
        totalSupplyCount: 0,
        totalFleetCount: 0,
        page: 1,
    };
    menu = (<Menu>
            <Menu.Item
                key="0"
                onClick={() => this.props.handleRemoveWarning(true, this.props.newPricing?.id)}
            >
                Remove
            </Menu.Item>
        </Menu>);

    static getDerivedStateFromProps(props) {
        return {rows: [...props.child]};
    }

    handleSupplySelect = (e, id) => {
        let params = {
            supply_assignee: [{
                id: id, value: e.value === "Assign" ? null : e.value,
            },],
        };
        this.handleUpdateDispatch(params);
    };

    handleFleetSelect = (e, id, kit_ID, value) => {
        if (value === "FLEET_KIT") {
            let params = {
                fleet_kit_assignee: [{
                    id: kit_ID, value: e.value === "Assign" ? null : e.value, child: id
                },],
            };
            this.handleUpdateDispatch(params);
        } else {
            let params = {
                fleet_assignee: [{
                    id: id, value: e.value === "Assign" ? null : e.value,

                },],
            };
            this.handleUpdateDispatch(params);
        }
    };

    fetchSupplyGroups = (params = {}) => {
        this.setState({fetching: true});
        const data = {
            ...params,
        }
        getSupplyDispatch(data)
            .then((res) => {
                if (this.state.page == 1) {
                    this.setState({supplyData: res.data.results, totalSupplyCount: res.data.count});
                } else {
                    this.setState((prevState) => {
                        return {supplyData: [...prevState.supplyData, ...res.data.results]}
                    })
                }
            })
            .catch((err) => {
                handleError(err);
            }).finally(() => {
            this.setState({fetching: false})
        })
    };

    fetchFleetGroups = (params = {}) => {
        this.setState({fetching: true});
        const data = {
            ...params,
        }
        getFleetData(data)
            .then((res) => {
                if (this.state.page == 1) {
                    this.setState({fleetData: res.data.results, totalFleetCount: res.data.count});
                } else {
                    this.setState((prevState) => {
                        return {fleetData: [...prevState.fleetData, ...res.data.results]}
                    })
                }
            })
            .catch((err) => {
                handleError(err);
            }).finally(() => {
            this.setState({fetching: false})
        })
    };

    handleUpdateDispatch = (params) => {
        updateDispatchData(params, this.props.workorderData?.id)
            .then((res) => {
                this.props.fetchWorkOrder()
            })
            .catch((err) => {
                handleError(err);
            });
    };

    fetchEmployees = (params = {}) => {
        this.setState({fetching: true})
        const data = {
            ...params,
        }
        getLaborEmployees(data)
            .then((res) => {
                if (this.state.page == 1) {
                    this.setState({employees: res.data.results, totalCount: res.data.count});
                } else {
                    this.setState((prevState) => {
                        return {employees: [...prevState.employees, ...res.data.results]}
                    })
                }
            })
            .catch((err) => {
                handleError(err);
            }).finally(() => {
            this.setState({fetching: false})
        })
    };

    handleSelect = (e, id) => {
        let params = {
            labor_assignee: [{
                id: id, value: e.value === "Assign" ? null : e.value,
            },],
        };
        this.handleUpdateDispatch(params);
    };

    handlePagination = (val) => {
        if (val === "LABOR") {
            this.setState((prevState) => {
                return {page: prevState.page + 1}
            }, () => {
                this.fetchEmployees({page: this.state.page});
            })
        } else if (val === "SUPPLY") {
            this.setState((prevState) => {
                return {page: prevState.page + 1}
            }, () => {
                this.fetchSupplyGroups({page: this.state.page});
            })

        } else if (val === "FLEET") {
            this.setState((prevState) => {
                return {page: prevState.page + 1}
            }, () => {
                this.fetchFleetGroups({page: this.state.page});
            })
        }

    }

    handleFleetKit = (item, kit_child, kitRow, kit_ID) => {
        const fleetItem = this.props.workorderData?.fleet_kit_assignee?.find((i) => i.child === item.id);
        const fleetAssigneekit = {
            label: fleetItem?.name, value: fleetItem?.value, key: fleetItem?.value,
        };
        return (<div className="custom-table-row custom-table-row-level-1 row mx-0">
                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                    <div>Fleet Group</div>
                </div>
                <div
                    className={`custom-table-cell-td` + (!kitRow ? " last-child " : "")}
                >
                    <div className="name-info-div p-0 position-relative">
                        {kit_child && (<span className="rectangle-icon-div position-absolute">
                <img
                    src={Images.rectangle_gray_icon}
                    alt=""
                    className={"img-fluid"}
                />
              </span>)}
                        <span style={kit_child && {paddingLeft: "30px"}}>
              {item?.kit_child ? item?.item?.name : item.name || "-"}
            </span>
                    </div>
                </div>
                {!this.props.workorderDispatchView ? <div className="custom-table-cell-td background-white-div p-0">
                    <div className="editalble-form-data d-flex align-items-center">
                        <Select
                            labelInValue
                            className={"custom-search-select custom-search-update"}
                            placeholder="+ Assign"
                            filterOption={false}
                            value={fleetAssigneekit.value ? fleetAssigneekit : undefined}
                            showSearch
                            onFocus={() => {
                                this.setState({page: 1}, () => {
                                    this.fetchFleetGroups({page: this.state.page})
                                })
                            }}
                            onSearch={(e) => this.fetchFleetGroups({search: e})}
                            onChange={(e) => this.handleFleetSelect(e, item.id, kit_ID, "FLEET_KIT")}
                            dropdownRender={(options) => (<>
                                    {options}
                                    <Divider style={{margin: '0 0 10px'}}/>
                                    <Space align="center" className="d-flex align-items-center justify-content-center"
                                           style={{padding: '0 8px 4px'}}>
                                        <div className="row">
                                            <div className="col-12 text-center create-div">
                                                {this.state.fetching ? (
                                                    <Spin/>) : (this.state.fleetData.length !== this.state.totalFleetCount && (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center">
                                                            <Button className="load-more-btn w-auto bg-transprent"
                                                                    onClick={(e) => {
                                                                        this.handlePagination("FLEET")
                                                                        e.stopPropagation();
                                                                    }}>
                                                                Load More
                                                            </Button>
                                                            {/* <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span> */}
                                                        </div>))}
                                            </div>
                                        </div>
                                    </Space>
                                </>)}
                        >
                            <Option value="Assign">Assign</Option>
                            {this.state.fleetData.length == 0 ? (<div className="text-center">
                                    No Data
                                </div>) : <>
                                {this.state.fleetData.map((i) => {
                                    return (<>
                                            <Option value={i.id}>
                                                {i.name}
                                            </Option>
                                        </>);
                                })}
                            </>}
                            {/* </OptGroup> */}
                        </Select>
                    </div>
                </div> : <div className="custom-table-cell-td justify-content-start">
                    <div className="px-3">{fleetAssigneekit.label ? fleetAssigneekit.label : "+ Assign"}</div>
                </div>}

                <div className="custom-table-cell-td px-0">
                    <div
                        className="editalble-form-data editalble-form-data-select d-flex align-items-center px-3"></div>
                </div>

                <div className="custom-table-cell-td">
                    -
                    <div/>
                </div>
                <div className="custom-table-cell-td">
                    -
                    <div/>
                </div>
                <div className="custom-table-cell-td px-3">
                    {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                </div>
                <div className="custom-table-cell-td px-3">
                    <span>foot (ft)</span>
                </div>
            </div>);
    }

    renderRow = (item, kit_child, kitRow) => {
        const {fleetData, totalFleetCount, fetching, supplyData, totalSupplyCount} = this.state
        switch (item.type) {
            case FLEET_GROUP:
                const fleetItem = this.props.workorderData?.fleet_assignee?.find((i) => i.id === item.id);
                const fleetAssignee = {
                    label: fleetItem?.name, value: fleetItem?.value, key: fleetItem?.value,
                };
                return (<div className="custom-table-row custom-table-row-level-1 custom-table-proposal row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>{MANAGEMENT_TREE_TYPES.FLEET_GROUP.name}</div>
                        </div>
                        <div className="custom-table-cell-td px-3">
                            <div>{item.name}</div>
                        </div>
                        {!this.props.workorderDispatchView ?
                            <div className="custom-table-cell-td background-white-div p-0">
                                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                    <Select
                                        labelInValue
                                        className={"custom-search-select custom-search-update"}
                                        placeholder="+ Assign"
                                        // notFoundContent={fetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        value={fleetAssignee.value ? fleetAssignee : undefined}
                                        showSearch
                                        onFocus={() => {
                                            this.setState({page: 1}, () => {
                                                this.fetchFleetGroups({page: this.state.page})
                                            })
                                        }}
                                        onSearch={(e) => {
                                            this.setState({page: 1}, () => {
                                                this.fetchFleetGroups({search: e})

                                            })
                                        }}
                                        onChange={(e) => this.handleFleetSelect(e, item.id)}
                                        dropdownRender={(options) => (<>
                                                {options}
                                                <Divider style={{margin: '0 0 10px'}}/>
                                                <Space align="center"
                                                       className="d-flex align-items-center justify-content-center"
                                                       style={{padding: '0 8px 4px'}}>
                                                    <div className="row">
                                                        <div className="col-12 text-center create-div">
                                                            {fetching ? (
                                                                <Spin/>) : (fleetData.length !== totalFleetCount && (
                                                                    <div
                                                                        className="d-flex align-items-center justify-content-center">
                                                                        <Button
                                                                            className="load-more-btn w-auto bg-transprent"
                                                                            onClick={(e) => {
                                                                                // this.handleFleetPagination();
                                                                                this.handlePagination("FLEET")
                                                                                e.stopPropagation();
                                                                            }}>
                                                                            Load More
                                                                        </Button>
                                                                        {/* <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span> */}
                                                                    </div>))}
                                                        </div>
                                                    </div>
                                                </Space>
                                            </>)}
                                    >
                                        <Option value="Assign">Assign</Option>
                                        {fleetData.length == 0 ? (<div className="text-center">
                                                No Data
                                            </div>) : <>
                                            {fleetData.map((i) => {
                                                return (<>
                                                        <Option value={i.id}>
                                                            {i.name}
                                                        </Option>
                                                    </>);
                                            })}
                                            {/* {this.state.fleetData.length !== totalFleetCount &&
                      <div className="text-center">
                      <Spin />
                      </div>
                    } */}
                                        </>}
                                        {/* </OptGroup> */}
                                    </Select>
                                </div>
                            </div> : <div className="custom-table-cell-td justify-content-start px-3">
                                <div>{fleetAssignee ? fleetAssignee.label : "+ Assign"}</div>
                            </div>}
                        <div className="custom-table-cell-td justify-content-start px-3">
                            <div>-</div>
                        </div>
                        <div className="custom-table-cell-td">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td px-3">
                            -
                        </div>
                        <div className="custom-table-cell-td px-3">
                            {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                        </div>
                        <div className="custom-table-cell-td">
                            <div className="px-3">Hours</div>
                        </div>
                        {/* <div className="custom-table-cell-td custom-table-cell-td-8">
                  <div>-</div>
                </div> */}
                    </div>);
            case SUPPLY_GROUP:
                const supplyItem = this.props.workorderData?.supply_assignee?.find((i) => i.id === item.id);
                const supplyAssignee = {
                    label: supplyItem?.name, value: supplyItem?.value, key: supplyItem?.value,
                };
                return (<div className="custom-table-row custom-table-row-level-1 row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>{MANAGEMENT_TREE_TYPES.SUPPLY_GROUP.name}</div>
                        </div>
                        <div className="custom-table-cell-td px-3">
                            <div>{item.name}</div>
                        </div>
                        {!this.props.workorderDispatchView ? (
                            <div className="custom-table-cell-td background-white-div p-0">
                                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                    <Select
                                        labelInValue
                                        className={"custom-search-select custom-search-update"}
                                        placeholder="+ Assign"
                                        // notFoundContent={fetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        value={supplyAssignee.value ? supplyAssignee : undefined}
                                        showSearch
                                        onFocus={() => {
                                            this.setState({page: 1}, () => {
                                                this.fetchSupplyGroups({page: this.state.page})
                                            })
                                        }}
                                        onSearch={(e) => {
                                            this.setState({page: 1}, () => {
                                                this.fetchSupplyGroups({search: e})

                                            })
                                        }}
                                        onChange={(e) => this.handleSupplySelect(e, item.id)}
                                        dropdownRender={(options) => (<>
                                                {options}
                                                <Divider style={{margin: '0 0 10px'}}/>
                                                <Space align="center"
                                                       className="d-flex align-items-center justify-content-center"
                                                       style={{padding: '0 8px 4px'}}>
                                                    <div className="row">
                                                        <div className="col-12 text-center create-div">
                                                            {fetching ? (
                                                                <Spin/>) : (supplyData.length !== totalSupplyCount && (
                                                                    <div
                                                                        className="d-flex align-items-center justify-content-center">
                                                                        <Button
                                                                            className="load-more-btn w-auto bg-transprent"
                                                                            onClick={(e) => {
                                                                                // this.handleSupplyPagination();
                                                                                this.handlePagination("SUPPLY")
                                                                                e.stopPropagation();
                                                                            }}>
                                                                            Load More
                                                                        </Button>
                                                                        {/* <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span> */}
                                                                    </div>))}
                                                        </div>
                                                    </div>
                                                </Space>
                                            </>)}
                                    >
                                        <Option value="Assign">Assign</Option>
                                        {this.state.supplyData.length == 0 ? (<div className="text-center">
                                                No Data
                                            </div>) : (supplyData.map((i) => {
                                                return (<>
                                                        <Option value={i.id}>{i.name}</Option>
                                                    </>);
                                            }))}
                                        {/* </OptGroup> */}
                                    </Select>
                                </div>
                            </div>) : (<div className="custom-table-cell-td justify-content-start px-3">
                                <div>{supplyAssignee ? supplyAssignee.label : "+ Assign"}</div>
                            </div>)}
                        <div className="custom-table-cell-td justify-content-start px-3">
                            <div>-</div>
                        </div>
                        <div className="custom-table-cell-td">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td">
                            <div/>
                        </div>
                        <div className="custom-table-cell-td px-3">
                            {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                        </div>
                        <div className="custom-table-cell-td px-3">
                            <div className="">Hours/Day</div>
                        </div>
                        {/* <div className="custom-table-cell-td custom-table-cell-td-8">
                  <div>-</div>
                </div> */}
                    </div>);
            case "INVENTORY_ITEM":
                return (<div className="custom-table-row custom-table-row-level-1 row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                            <div>Inventory Item</div>
                        </div>
                        <div
                            className={`custom-table-cell-td` + (!kitRow ? " last-child " : "")}
                        >
                            <div className="name-info-div p-0 position-relative">
                                {kit_child && (<span className="rectangle-icon-div position-absolute">
                    <img
                        src={Images.rectangle_gray_icon}
                        alt=""
                        className={"img-fluid"}
                    />
                  </span>)}
                                <span style={kit_child && {paddingLeft: "30px"}}>
                  {item?.kit_child ? item?.item?.name : item.name || "-"}
                </span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td">
                            <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                <span className="px-3">-</span>
                            </div>
                        </div>
                        <div className="custom-table-cell-td px-0">
                            <div
                                className="editalble-form-data editalble-form-data-select d-flex align-items-center px-3"></div>
                        </div>

                        <div className="custom-table-cell-td">
                            -
                            <div/>
                        </div>
                        <div className="custom-table-cell-td">
                            -
                            <div/>
                        </div>
                        <div className="custom-table-cell-td px-3">
                            {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                        </div>
                        <div className="custom-table-cell-td px-3">
                            <span>{item.uom?.name || "-"}</span>
                        </div>
                    </div>);
            case "INVENTORY_KIT":
                return (<>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                                <div>{TYPES.inventory_kit.title}</div>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div>{item.name}</div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                    <span className="px-3">-</span>
                                </div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div>-</div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div/>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div/>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                            </div>
                            <div className="custom-table-cell-td">
                                <span> pieces (pc)</span>
                            </div>
                            {/* <div className="custom-table-cell-td custom-table-cell-td-8">
                    <div>-</div>
                  </div> */}
                        </div>
                        {item.children.length > 0 && item.children.map((n, ind) => {
                            let kitRow = item.children.length > ind + 1;
                            return this.renderRow(n, true, kitRow);
                        })}
                        {item.data?.inventory_package_items?.map((p) => (<div
                                key={p.id}
                                className="custom-table-row custom-table-row-level-1 row mx-0"
                            >
                                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                                    <div>Inventory Group</div>
                                </div>
                                <div className="custom-table-cell-td">
                                    <div className="name-info-div position-relative">
                    <span className="rectangle-icon-div position-absolute">
                      <img
                          src={Images.rectangle_gray_icon}
                          alt=""
                          className={"img-fluid"}
                      />
                    </span>
                                        <span>{p.item.name}</span>
                                    </div>
                                </div>
                                <div className="custom-table-cell-td">
                                    <div>-</div>
                                </div>
                                <div className="custom-table-cell-td">
                                    <div
                                        className="editalble-form-data d-flex align-items-center justify-content-center">
                                        <span className="px-3">-</span>
                                    </div>
                                </div>
                                <div className="custom-table-cell-td">
                                    <div></div>
                                </div>
                                <div className="custom-table-cell-td">
                                    <div>{p.quantity}</div>
                                </div>
                                <div className="custom-table-cell-td">
                                    <span>pieces (pc)</span>
                                </div>
                            </div>))}
                    </>);
            case "FLEET_KIT":
                return (<>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                                <div>{TYPES.fleet_kit.title}</div>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div>{item.name}</div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                    <span className="px-3">-</span>
                                </div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div>-</div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div/>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div/>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                            </div>
                            <div className="custom-table-cell-td">
                                <span> pieces (pc)</span>
                            </div>
                            {/* <div className="custom-table-cell-td custom-table-cell-td-8">
                    <div>-</div>
                  </div> */}
                        </div>
                        {item?.children?.length > 0 && item.children.map((n, ind) => {
                            let kitRow = item?.children?.length > ind + 1;
                            return this.handleFleetKit(n, true, kitRow, item.id);
                        })}
                    </>)
            case "DISPOSAL":
                return (<>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                                <div>Disposal</div>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div className="name-info-div p-0 position-relative">
                                    <span>{item.name}</span>
                                </div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                    <span className="px-3">-</span>
                                </div>
                            </div>
                            <div className="custom-table-cell-td px-0">
                                <div className="editalble-form-data editalble-form-data-select">
                                    <span className="text-capitalize"></span>
                                </div>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div>{item.container_quantity}</div>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div>{item.container_type}</div>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                                <div/>
                            </div>
                            <div className="custom-table-cell-td">
                                <span>{item.uom?.name || "-"}</span>
                                <div/>
                            </div>
                        </div>
                    </>);
            case LABOR:
                const foundItem = this.props.workorderData?.labor_assignee?.find((i) => i.id === item.id);
                const selectedAssignee = {
                    label: foundItem?.name, value: foundItem?.value, key: foundItem?.value,
                };

                const {totalCount, employees, page} = this.state;

                return (<>
                        <div className="custom-table-row custom-table-row-level-1 row mx-0">
                            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                                <div>Labor</div>
                            </div>
                            <div className="custom-table-cell-td gray-2-color px-3">
                                <div>{item.name}</div>
                            </div>
                            {!this.props.workorderDispatchView ?
                                <div className="custom-table-cell-td background-white-div p-0">
                                    <div className="editalble-form-data d-flex align-items-center">
                                        <Select
                                            labelInValue
                                            className={"custom-search-select custom-search-update"}
                                            placeholder="+ Assign"
                                            filterOption={false}
                                            value={selectedAssignee.value ? selectedAssignee : undefined}
                                            showSearch
                                            onFocus={() => {
                                                this.setState({page: 1}, () => {
                                                    this.fetchEmployees({page: page})
                                                })
                                            }}
                                            onSearch={(e) => {
                                                this.setState({page: 1}, () => {
                                                    this.fetchEmployees({search: e})
                                                })
                                            }}
                                            onChange={(e) => this.handleSelect(e, item.id)}
                                            dropdownRender={(options) => (<>
                                                    {options}
                                                    <Divider style={{margin: '0 0 10px'}}/>
                                                    <Space align="center"
                                                           className="d-flex align-items-center justify-content-center"
                                                           style={{padding: '0 8px 4px'}}>
                                                        <div className="row">
                                                            <div className="col-12 text-center create-div">
                                                                {this.state.fetching ? (
                                                                    <Spin/>) : (employees.length !== totalCount && (<div
                                                                            className="d-flex align-items-center justify-content-center">
                                                                            <Button
                                                                                className="load-more-btn w-auto bg-transprent"
                                                                                onClick={(e) => {
                                                                                    this.handlePagination("LABOR");
                                                                                    e.stopPropagation();
                                                                                }}>
                                                                                Load More
                                                                            </Button>
                                                                            {/* <span className="remaining-tag">{`(${(totalCount - lineItems.length)})` || 0}</span> */}
                                                                        </div>))}
                                                            </div>
                                                        </div>
                                                    </Space>
                                                </>)}
                                        >
                                            <Option value="Assign">Assign</Option>

                                            <>
                                                {employees.map((i) => {
                                                    return (<>
                                                            <Option key={i.id} value={i.id}>
                                                                {i.first_name} {i.last_name}
                                                            </Option>
                                                        </>);
                                                })}
                                            </>


                                            {/* // )} */}
                                        </Select>
                                    </div>
                                </div> : <div className="custom-table-cell-td justify-content-start">
                                    <div className="px-3">{selectedAssignee ? selectedAssignee.label : "+ Assign"}</div>
                                </div>}
                            <div className="custom-table-cell-td justify-content-start">
                                <div className="px-3">-</div>
                            </div>
                            <div className="custom-table-cell-td">
                                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                                    {/*<span className="px-3">8</span>*/}
                                </div>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                <div/>
                            </div>
                            <div className="custom-table-cell-td px-3">
                                {item.modified_quantity ? item.modified_quantity : (item.qty || 1)}
                                <div/>
                            </div>
                            <div className="custom-table-cell-td">
                                <span>Hours</span>
                                <div/>
                            </div>
                        </div>
                    </>);
            default:
                return <></>;
        }
    };
    stopEvtBubbling = (e) => {
        e.stopPropagation();
    };

    render() {
        const {
            newPricing, foundRegion, allOptions
        } = this.props;
        const foundUom = allOptions?.find((i) => i.id === newPricing?.variant_data?.pricing_uom?.id);
        return (<React.Fragment>
                <div className="col-12 custom-table-body custom-table-body-update p-0">
                    <Collapse
                        accordion
                        defaultActiveKey={["1"]}
                        expandIcon={({isActive}) => (<CaretRightOutlined rotate={isActive ? 90 : 0}/>)}
                        className="custom-table-collapse-main"
                    >
                        <Panel
                            header={<React.Fragment>
                                <div
                                    className={newPricing?.resource_type === "DISPOSAL" ? "custom-table-row custom-collapse-line-item custom-table-row-level-1 line-item-grid row mx-0 disposal-added" : "custom-table-row custom-collapse-line-item custom-table-row-level-1 line-item-grid row mx-0 work-order-dispatch-thead"}>
                                    <div
                                        className="custom-table-cell-td wage-info-collapse-td gray-2-color d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <img
                                                alt={""}
                                                // src={Images.line_item_icon_green}
                                                src={newPricing?.resource_type === "INVENTORY_KIT" ? Images.inventory_kit_variant : newPricing?.resource_type === "INVENTORY_ITEM" ? Images.inventory_item_variant : newPricing?.resource_type === "DISPOSAL" ? Images.no_disposal_black : newPricing?.resource_type === "SUPPLY_GROUP" ? Images.supply_icon_black : Images.line_item_black}
                                                className="img-fluid mr-2"
                                            />
                                            {newPricing?.resource_type === "INVENTORY_KIT" || newPricing?.resource_type === "INVENTORY_ITEM" || newPricing?.resource_type == "DISPOSAL" || newPricing?.resource_type === "SUPPLY_GROUP" ? newPricing?.resource_id?.name : `${newPricing?.variant_data?.line_item?.name} ${foundRegion && "/"} ${foundRegion?.title || ""} - ${newPricing?.variant_data?.name}`}
                                        </div>
                                    </div>
                                    {newPricing?.resource_type === "DISPOSAL" && <div
                                        className="custom-table-cell-td background-white-div p-0"
                                        onClick={this.stopEvtBubbling}
                                    >
                                        <span>{newPricing?.container_quantity ? parseInt(newPricing?.container_quantity) : "-"}</span>
                                       {/* <InputNumber
                                                value={newPricing?.container_quantity}
                                                onBlur={(e) => {
                                                    this.props.handleChangeContainer({container_quantity: e.target.value}, newPricing.id)
                                                
                                                }}
                                            /> */}
                                    </div>}

                                    {newPricing?.resource_type === "DISPOSAL" &&

                                        <div
                                            className="custom-table-cell-td background-white-div p-0"
                                            onClick={this.stopEvtBubbling}
                                        >
                                            <span>{newPricing?.container_type || "-"}</span>
                                        </div>

                                    }
                                    <div
                                        className="custom-table-cell-td gray-2-color pl-0 text-center"
                                        onClick={this.stopEvtBubbling}
                                    >
                                        {newPricing.workorder_qty || "1"}
                                    </div>
                                    <div
                                        className="custom-table-cell-td gray-2-color px-3"
                                        onClick={this.stopEvtBubbling}
                                    >
                                        <div className="d-inline-block w-100">
                                        {newPricing?.resource_type === "DISPOSAL" ? newPricing?.disposal_unit_id :
                          newPricing.selected_unit == "UOM"
                            ? `${foundUom?.name} (${foundUom?.symbol})`
                            : newPricing.selected_unit == "HOURS"
                              ? "Hours (hrs)"
                              : "Day (d)"}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>}
                            key="1"
                        >
                            {this.state.rows.map((r, i) => {
                                let obj = {};
                                if (r.kit) {
                                    let kitRow = this.state.rows.length > i + 1;
                                    obj = {
                                        id: r.id,
                                        item: r.item,
                                        qty: r.quantity,
                                        kit_uom: r.kit?.unit,
                                        type: "INVENTORY_ITEM",
                                        kit_child: true,
                                    };
                                    return this.renderRow(obj, true, kitRow);
                                } else {
                                    return this.renderRow(r);
                                }
                            })}
                        </Panel>
                    </Collapse>
                </div>
            </React.Fragment>);
    }
}

export default WorkOrderAssignServiceTableMain;

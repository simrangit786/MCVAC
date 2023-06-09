import React, { Component } from "react";
import { Button, Form, InputNumber, Select, Spin } from "antd";
import {
  CaretDownOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Image as Images } from "../../../../Images";
import {
  calculatePercentage,
  FLEET_GROUP,
  LABOR,
  laborCalculations,
  MANAGEMENT_TREE_TYPES,
  SUPPLY_GROUP,
  supplyCalculation,
  TYPES,
  vehicleCalculations,
} from "../../../../../Controller/utils";
import { getFleetGroupById } from "../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../Controller/Global";
import { getSupplyGroupById } from "../../../../../Controller/api/supplyServices";
import {
  getLaborGroup,
  getLaborGroupById,
} from "../../../../../Controller/api/labourServices";
import {
  getInventoryById,
  getInventoryKitItem,
} from "../../../../../Controller/api/inventoryServices";
import GeneratePriceForm from "./GeneratePriceForm";
import { getDisposalById } from "../../../../../Controller/api/disposalServices";
import { getBaseUnitrate } from "../../../../../Controller/unitConversion";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
// import {getVendorLocation} from "../../../../../Controller/api/lineItemsServices";
// import { data } from 'jquery';

const { Option, OptGroup } = Select;

class GeneratePricingTable extends Component {
  state = {
    rows: [],
    groups: [],
    loading: true,
    visibleWageTypeConfirmation: false,
    selectedWageType: null,
    // vendors: [],
    // internal_locations: []
  };

  handleChangeTime = (e, item) => {
    let rows = [...this.state.rows].map((r) => {
      if (r.id === item.id && item.item_type === "labor_child") {
        return { ...r, time: e === "delete_row" ? r.time || undefined : e };
      } else {
        return { ...r };
      }
    });
    if (e === "delete_row") {
      this.wageTypeModalHandler(true, item);
    }
    // else {
    //     let rows = [...this.state.rows].map(r => {
    //         if (r.id === item.id && item.item_type === 'labor_child') {
    //             return {...r, time: e}
    //         } else {
    //             return {...r}
    //         }
    //     });
    //     this.setState({rows})
    // }
    this.setState({ rows });
  };

  wageTypeModalHandler = (visibleWageTypeConfirmation, selectedWageType) => {
    this.setState({ visibleWageTypeConfirmation, selectedWageType });
  };

  handleChangeUom = (e, item) => {
    //  console.log(e, item, "UOM TEST")
    let baseValue =
      getBaseUnitrate[item.uom ? item.uom : item.resource_item.uom];
    let calcByValue = getBaseUnitrate[e] / baseValue || 1;
    // console.log(calcByValue,"value")
    // console.log(baseValue, calcByValue, "HK TEST")
    // console.log(calcByValue);
    let rows = [...this.state.rows].map((r) => {
      if (
        (r.id === item.id && r.item_type === "INVENTORY_ITEM") ||
        (r.id === item.id && r.item_type === "DISPOSAL")
      ) {
        // console.log(r.data.unit_cost * calcByValue, "unit_cost")
        return {
          ...r,
          data: { ...r.data, unit_cost: r.data.unit_cost * calcByValue },
          resource_item: {
            ...r.resource_item,
            unit_cost: r.resource_item.unit_cost * calcByValue,
          },
          uom: e,
          calcByValue,
        };
      } else {
        return { ...r };
      }
    });
    this.setState({ rows });
    // console.log(this.state.rows,"rows")
  };

  handleHoursChange = (e, item) => {
    let rows = [...this.state.rows].map((r) => {
      if (r.id === item.id) {
        return { ...r, hours: e || 1 };
      } else {
        if (r.kit_child && r.kit_id == `kit${item.id + item.kitIndex}`) {
          // console.log(e, r.initQuantity, e * r.initQuantity, "---")
          return { ...r, quantity: e * r.initQuantity };
        } else {
          return { ...r };
        }
      }
    });
    // console.log(rows, 'hours')
    this.setState({ rows });
  };

  handleChange = async (e, item) => {
    // debugger
    // console.log(e, item)
    const newArr = [];
    // let rows = [...this.state.rows].map(async r => {
    for (let r of this.state.rows) {
      if (r.id === item.id && item.item_type === "labor_child") {
        let newLaborData = await getLaborGroupById(e.value);
        // console.log(newLaborData, "laborData")
        // .then(res => {
        //     debugger
        let newData = { ...r, type_id: e, data: newLaborData.data };
        //     console.log(newData, "newData")
        // })
        // console.log(newData, "after")
        // let obj = this.state.groups.find(i => i.id === e);
        newArr.push(newData);
        // return newData;
      } else {
        newArr.push(r);
        // return {...r}
      }
    }
    // console.log(newArr);
    // });
    this.setState({ rows: newArr });
  };

  fetchGroup = (params = {}) => {
    getLaborGroup(params)
      .then((res) => {
        this.setState({ groups: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  componentDidMount() {
    this.handleData();
    // this.getVendorLocation()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.margin !== this.props.margin) {
      this.handleData();
    }
  }

  // getVendorLocation = () => {
  //     getVendorLocation()
  //     .then(res => {
  //         this.setState({vendors: res.data.account, internal_locations: res.data.internal_location})
  //     }).catch(err => {
  //     handleError(err)
  // })
  // }

  handleData = async () => {
    this.fetchGroup();
    let a = [...this.props.child];
    let b = [];
    if (!this.props.view && !this.props.priceChild) {
      for (const [i, item] of a.entries()) {
        if (item.item_type == "INVENTORY_KIT") {
          item.kitIndex = a.findIndex((n) => n.id === item.id);
          b.push(item);
        } else {
          b.push(item);
        }
        if (item.item_type == LABOR || item.item_type == "labor_child") {
          if (a[i + 1]?.item_type !== "labor_child") {
            console.log(item, "newlabor");
            let obj = {
              item_type: "add",
              id: "add",
              name: item.name || item.resource_name,
            };
            b.push(obj);
          }
        }
        if (item.item_type == "INVENTORY_KIT") {
          const params = {
            kit: item.item_id,
          };
          const newData = await getInventoryKitItem(params);
          newData.data.results.forEach((newItem, index) => {
            newItem.item.item_type = "INVENTORY_ITEM";
            newItem.item.kit_child = true;
            newItem.item.kit_id = `kit${item.id + item.kitIndex}`;
            newItem.item.initQuantity = newItem.quantity;
            newItem.item.kit_uom = newItem.kit?.unit;
            b.push(newItem.item);
          });
        }
      }
    }
    let c = b.length > 0 ? b : a;
    // console.log('handle data',c)
    let newA = c.map((item, index) => {
      switch (item.item_type) {
        case FLEET_GROUP:
          this.setState({ loading: true });
          getFleetGroupById(item.item_id)
            .then((res) => {
              item.data = res.data;
              this.setState({ loading: false });
            })
            .catch((err) => {
              handleError(err);
              this.setState({ loading: false });
            });
          return item;
        case SUPPLY_GROUP:
          this.setState({ loading: true });
          getSupplyGroupById(item.item_id)
            .then((res) => {
              item.data = res.data;
              this.setState({ loading: false });
            })
            .catch((err) => {
              handleError(err);
              this.setState({ loading: false });
            });
          return item;
        case "labor_child":
          this.setState({ loading: true });
          getLaborGroupById(item?.type_id?.value)
            .then((res) => {
              this.setState({ loading: false });
              item.data = res.data;
            })
            .catch((err) => {
              handleError(err);
              this.setState({ loading: false });
            });
          return item;
        case "INVENTORY_ITEM":
          this.setState({ loading: true });
          getInventoryById(item.item_id ? item.item_id : item.id)
            .then((res) => {
              item.data = res.data;
              this.setState({ loading: false });
            })
            .catch((err) => {
              handleError(err);
              this.setState({ loading: false });
            });
          return item;
        case "INVENTORY_KIT":
          return item;
        case "DISPOSAL":
          getDisposalById(item.item_id)
            .then((res) => {
              item.data = res.data;
              this.setState({ loading: false });
            })
            .catch((err) => {
              handleError(err);
              this.setState({ loading: false });
            });
          return item;
        default:
          item.data = null;
          this.setState({ loading: false });
          return item;
      }
    });
    this.setState({ rows: newA, loading: false });
  };

  handleAddMore = (item, i) => {
    let a = this.state.rows;
    let obj = { item_type: "labor_child", id: "child" + i, name: item.name };
    a.splice(i, 0, obj);
    this.setState({ rows: a });
  };

  updateTable = () => {
    let rows = this.state.rows
      .map((item) => {
        // if(item.item_type != 'labor_child')
        // delete item.data;
        // }
        delete item.pricing;
        return { ...item };
      })
      .filter((p) => p.type !== "add");
    // console.log(rows, "update table")
    return rows;
  };

  handleVendorLocationChange = (e, item) => {
    let rows = [...this.state.rows].map((r) => {
      if (
        (r.id === item.id && r.item_type === "INVENTORY_ITEM") ||
        (r.id === item.id && r.item_type === "DISPOSAL")
      ) {
        return { ...r, selectedVendorLocation: e };
      } else {
        return { ...r };
      }
    });
    this.setState({ rows });
  };

  renderRow = (item, i, nextRow, kitRow) => {
    let { margin, view } = this.props;
    switch (item.item_type) {
      case FLEET_GROUP:
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>{MANAGEMENT_TREE_TYPES.FLEET_GROUP.name}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2">
              <div>{item.resource_name}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <div className="editalble-form-data d-flex align-items-center">
                <span className="px-3">-</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <div className="editalble-form-data d-flex align-items-center">
                <span className="px-3">-</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div>Hours</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5">
              <div className="editalble-form-data">
                <Form className="position-relative">
                  <InputNumber
                    value={item.hours || 1}
                    disabled={view}
                    onChange={(e) => this.handleHoursChange(e, item)}
                    placeholder={0}
                  />
                  <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                    <EditOutlined />
                  </Button>
                </Form>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
              {/* {console.log(vehicleCalculations(item.data), "fleet calculation")} */}
              <div>${vehicleCalculations(item.data)}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{margin || 0}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                ${calculatePercentage(vehicleCalculations(item.data), margin)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                $
                {(
                  (item.hours || 1) *
                    calculatePercentage(
                      vehicleCalculations(item.data),
                      margin
                    ) || 0
                ).toFixed(2)}
              </div>
            </div>
          </div>
        );
      case SUPPLY_GROUP:
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>{MANAGEMENT_TREE_TYPES.SUPPLY_GROUP.name}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2">
              <div>{item.resource_name}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <div className="editalble-form-data d-flex align-items-center">
                <span className="px-3">-</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <div className="editalble-form-data d-flex align-items-center">
                <span className="px-3">-</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div>Hours</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5">
              <div className="editalble-form-data">
                <Form className="position-relative">
                  {/* {console.log(item.hours, "qty")} */}
                  <InputNumber
                    value={item.hours || 1}
                    disabled={view}
                    onChange={(e) => this.handleHoursChange(e, item)}
                    placeholder={0}
                  />
                  <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                    <EditOutlined />
                  </Button>
                </Form>
                {/*<span className="px-3">8</span>*/}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
              <div>${supplyCalculation(item.data) || 0.0}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{margin || 0}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                $
                {calculatePercentage(supplyCalculation(item.data), margin) ||
                  0.0}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              {/* {console.log(supplyCalculation(item.data))} */}
              <div>
                $
                {(
                  (item.hours || 1) *
                    calculatePercentage(supplyCalculation(item.data), margin) ||
                  0
                ).toFixed(2) || 0.0}
              </div>
            </div>
          </div>
        );
      case "INVENTORY_ITEM":
        // console.log(item, "inventory-item")
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>Inventory Item</div>
            </div>
            <div
              className={
                `custom-table-cell-td custom-table-cell-td-2` +
                (kitRow ? " last-child " : "")
              }
            >
              <div className="name-info-div p-0 position-relative">
                {item.kit_child && (
                  <span className="rectangle-icon-div position-absolute">
                    <img
                      src={Images.rectangle_gray_icon}
                      alt=""
                      className={"img-fluid"}
                    />
                  </span>
                )}
                <span style={item.kit_child && { paddingLeft: "30px" }}>
                  {item.resource_name ? item.resource_name : item.name}
                </span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <div className="editalble-form-data d-flex align-items-center">
                <span className="px-3">-</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <div className="editalble-form-data editalble-form-data-select d-flex align-items-center">
                <span className="px-3">-</span>
                {/* <Form className="position-relative">
                                    <Select
                                        suffixIcon={
                                            <img src={Images.caret_down_small_select} alt="" className="img-fluid"/>
                                        }
                                        placeholder={'Select'}
                                        onChange={e => this.handleVendorLocationChange(e, item)}
                                        value={item?.selectedVendorLocation ? item?.selectedVendorLocation : null}
                                        disabled={view}
                                        >
                                        <OptGroup label="Warehouses">
                                            {this.state.internal_locations.map(i => {
                                                return (
                                                    <Option value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </OptGroup>
                                        <OptGroup label="Vendors">
                                            {this.state.vendors.map(i => {
                                                return (
                                                    <Option value={i.id}>{i.name}</Option>
                                                )
                                            })}
                                        </OptGroup>
                                    </Select>
                                </Form> */}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4 px-0">
              <div className="editalble-form-data editalble-form-data-select d-flex align-items-center">
                {item?.kit_child ? (
                  <span className="px-3 text-capitalize">
                    {item?.kit_uom?.name?.toLowerCase()}
                  </span>
                ) : (
                  <Form>
                    <Select
                      suffixIcon={
                        <img
                          src={Images.caret_down_small_select}
                          alt=""
                          className="img-fluid"
                        />
                      }
                      disabled={view}
                      onChange={(e) => this.handleChangeUom(e, item)}
                      placeholder={"Please Select"}
                      value={
                        item.uom
                          ? item.uom
                          : item.data?.uom?.id
                          ? item.data?.uom?.id
                          : "select"
                      }
                      // defaultValue={'select'}
                    >
                      <Option value={"select"}>Select</Option>
                      {item?.data?.uom_array?.map((opt) => (
                        <Option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.symbol})
                        </Option>
                      ))}
                    </Select>
                  </Form>
                )}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5">
              <div className="editalble-form-data">
                <Form className="position-relative">
                  <InputNumber
                    value={
                      (item.kit_child
                        ? item.quantity
                          ? item.quantity
                          : item.initQuantity
                        : item.hours) || 1
                    }
                    disabled={item.kit_child ? true : view ? true : false}
                    onChange={(e) => this.handleHoursChange(e, item)}
                    placeholder={0}
                  />
                  <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                    <EditOutlined />
                  </Button>
                </Form>
                {/* <span className="px-3">-</span> */}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
              <div>
                $
                {Number(
                  item.kit_child
                    ? item?.unit_cost
                    : // (item?.calcByValue || 1) * (
                      item?.resource_item?.unit_cost ||
                        // ))
                        0
                ).toFixed(2)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{item.data?.margin || 0}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                $
                {Number(
                  calculatePercentage(
                    item.kit_child
                      ? item?.unit_cost
                      : // (item?.calcByValue || 1) *
                        item?.resource_item?.unit_cost || 0,
                    item.data?.margin || 0
                  )
                ).toFixed(2)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                $
                {(
                  ((item.kit_child
                    ? item.quantity
                      ? item.quantity
                      : item.initQuantity
                    : item.hours) || 1) *
                    calculatePercentage(
                      (item.kit_child
                        ? item?.unit_cost
                        : item?.resource_item?.unit_cost) || 0,
                      item.data?.margin
                    ) || 0
                ).toFixed(2)}
              </div>
            </div>
          </div>
        );
      case "INVENTORY_KIT":
        return (
          <>
            <div className="custom-table-row custom-table-row-level-1 row mx-0">
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>{TYPES.inventory_kit.title}</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-2">
                <div>{item.resource_name}</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <div className="editalble-form-data d-flex align-items-center">
                  <span className="px-3">-</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <div className="editalble-form-data editalble-form-data-select d-flex align-items-center">
                  {/* <Form className="position-relative">
                                    <Select
                                        suffixIcon={
                                            <img src={Images.caret_down_small_select} alt="" className="img-fluid"/>
                                        }
                                        placeholder={'Select'}
                                         >
                                        <OptGroup label="Warehouses">
                                            <Option value="a">McVac PA</Option>
                                            <Option value="b">McVac PA</Option>
                                        </OptGroup>
                                        <OptGroup label="Vendors">
                                            <Option value="c">Grouch Land</Option>
                                        </OptGroup>
                                    </Select>
                                </Form> */}
                  <span className="px-3">-</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-4">
                <div>Unit</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5">
                <div className="editalble-form-data">
                  <Form className="position-relative">
                    <InputNumber
                      value={item.hours || 1}
                      disabled={view}
                      onChange={(e) => this.handleHoursChange(e, item)}
                      placeholder={0}
                    />
                    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                      <EditOutlined />
                    </Button>
                  </Form>
                  {/* <span className="px-3">-</span> */}
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div />
              </div>
              {/* <div className="custom-table-cell-td custom-table-cell-td-6">
                            <div>${item.data?.inventory_package_items?.reduce((p, i) => p + (i.item.unit_cost * i.quantity), 0) || 0.00}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-7">
                            <div>{item.data?.inventory_package_items?.reduce((p, i) => p + parseFloat(i.item?.margin || 0), 0).toFixed(2) || "-"}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                            <div>${item.data?.inventory_package_items?.reduce((p, i) => p + parseFloat(calculatePercentage(i.item.unit_cost * i.quantity, i.item.margin)), 0).toFixed(2) || 0.00}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-8">
                        <div>${(item.hours * (item.data?.inventory_package_items?.reduce((p, i) => p + parseFloat(calculatePercentage(i.item.unit_cost * i.quantity, i.item.margin)), 0).toFixed(2))) || 0.00}</div>
                        </div> */}
            </div>
            {item.data?.inventory_package_items?.map((p) => (
              <div
                key={p.id}
                className="custom-table-row custom-table-row-level-1 row mx-0"
              >
                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                  <div>Inventory Group</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-2">
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
                <div className="custom-table-cell-td custom-table-cell-td-3">
                  <div className="editalble-form-data d-flex align-items-center">
                    <span className="px-3">-</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-3">
                  <div className="editalble-form-data d-flex align-items-center">
                    <span className="px-3">-</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-4">
                  <div>Amount</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-5">
                  <div className="editalble-form-data">
                    {/*<Form className="position-relative">*/}
                    {/*    <InputNumber placeholder={8}/>*/}
                    {/*    <Button*/}
                    {/*        className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">*/}
                    {/*        <EditOutlined/>*/}
                    {/*    </Button>*/}
                    {/*</Form>*/}
                    <span className="px-3">-</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-6">
                  <div>${p.item.unit_cost * p.quantity}</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>{p.item.margin || 0}%</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-8">
                  <div>
                    $
                    {calculatePercentage(
                      p.item.unit_cost * p.quantity,
                      p.item.margin
                    ) || 0}
                  </div>
                </div>
              </div>
            ))}
          </>
        );
      case "DISPOSAL":
        return (
          <>
            <div className="custom-table-row custom-table-row-level-1 row mx-0">
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>Disposal</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-2">
                <div className="name-info-div p-0 position-relative">
                  {/*<span className="rectangle-icon-div position-absolute">*/}
                  {/*    <img src={Images.rectangle_gray_icon} alt="" className={"img-fluid"}/>*/}
                  {/*</span>*/}
                  <span>{item.resource_name}</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <div className="editalble-form-data d-flex align-items-center">
                  <span className="px-3">-</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <div className="editalble-form-data editalble-form-data-select d-flex align-items-center">
                  <Form className="position-relative">
                    <Select
                      suffixIcon={
                        <img
                          src={Images.caret_down_small_select}
                          alt=""
                          className="img-fluid"
                        />
                      }
                      placeholder={"Select"}
                      onChange={(e) => this.handleVendorLocationChange(e, item)}
                      disabled={view}
                      value={
                        item?.selectedVendorLocation
                          ? item?.selectedVendorLocation
                          : null
                      }
                    >
                      <OptGroup label="Warehouses">
                        {item.data?.internal_location.map((i) => {
                          return (
                            <Option value={i.id}>
                              {i.internal_location.name}
                            </Option>
                          );
                        })}
                      </OptGroup>
                      <OptGroup label="Vendors">
                        {item.data?.vendor.map((i) => {
                          return <Option value={i.id}>{i.vendor.name}</Option>;
                        })}
                      </OptGroup>
                    </Select>
                  </Form>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-4 px-0">
                <div className="editalble-form-data editalble-form-data-select">
                  <Form className="position-relative">
                    <Select
                      suffixIcon={
                        <img
                          src={Images.caret_down_small_select}
                          alt=""
                          className="img-fluid"
                        />
                      }
                      disabled={view}
                      onChange={(e) => this.handleChangeUom(e, item)}
                      value={
                        item.uom
                          ? item.uom
                          : item.data?.uom?.id
                          ? item.data?.uom?.id
                          : "select"
                      }
                      placeholder={"Please Select"}
                      // defaultValue={'select'}
                    >
                      <Option value={"select"}>Select</Option>
                      {/* {console.log(item?.data?.uom_array, "hjdfgsdjhfgjdhsfg")} */}
                      {item?.data?.uom_array?.map((opt) => (
                        <Option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.symbol})
                        </Option>
                      ))}
                    </Select>
                  </Form>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5">
                <div className="editalble-form-data">
                  <Form className="position-relative">
                    <InputNumber
                      value={item.hours || 1}
                      disabled={view}
                      onChange={(e) => this.handleHoursChange(e, item)}
                      placeholder={0}
                    />
                    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                      <EditOutlined />
                    </Button>
                  </Form>
                  {/* <span className="px-3">-</span> */}
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                <div>${item?.data?.unit_cost || 0.0}</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div>{item.data?.margin || 0}%</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div>
                  $
                  {Number(
                    calculatePercentage(
                      item?.data?.unit_cost || 0,
                      item.data?.margin || 0
                    )
                  ).toFixed(2)}
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div>
                  $
                  {(
                    (item.hours || 1) *
                      calculatePercentage(
                        item?.data?.unit_cost || 0,
                        item.data?.margin
                      ) || 0
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          </>
        );
      case "labor_child":
        // console.log(item, "hardik")
        // let newItem = this.state.groups.find(i => {
        //     return item.type_id?.value == i.id;
        // })
        // console.log(item, "labor_child")
        let newItem = item?.data;
        return (
          <>
            <div
              className={`custom-table-row custom-table-row-level-1 row mx-0 ${
                this.props.view && "view-dropdowns-tbl"
              }`}
            >
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>{TYPES.labor.title}</div>
              </div>
              <div
                className={
                  `custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info pr-lg-0 ` +
                  (nextRow ? " last-child " : "")
                }
              >
                <div
                  className={`editalble-form-data ${
                    this.props.view && "caret-arrow-hide"
                  }`}
                >
                  <Form className="position-relative">
                    <span className="rectangle-icon-div position-absolute">
                      <img
                        src={Images.rectangle_gray_icon}
                        alt=""
                        className={"img-fluid"}
                      />
                    </span>
                    <Select
                      value={item.time || "select"}
                      disabled={view}
                      onChange={(e) => this.handleChangeTime(e, item)}
                      placeholder={"Please Select"}
                    >
                      <Option value="select">Select</Option>
                      <Option value="straight_time">Straight Time</Option>
                      <Option value="over_time">Over Time</Option>
                      <Option value="double_time">Double Time</Option>
                      <Option value="off_shift">Off Shift</Option>
                      <Option value="night_time">Night Time Off Shift</Option>
                      <Option className="text-danger" value="delete_row">
                        Delete Row
                      </Option>
                    </Select>
                    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 search-btn-icon">
                      <CaretDownOutlined />
                    </Button>
                  </Form>
                </div>
                {/*<div className="name-info-div position-relative">*/}

                {/*    <span>{item.name}</span>*/}
                {/*    <CaretDownOutlined/>*/}
                {/*</div>*/}
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3 custom-table-cell-td-labor-group">
                <div className="editalble-form-data editalble-form-data-edit">
                  <Form className="position-relative">
                    <Select
                      value={
                        {
                          value: item.type_id?.value,
                          label: item.type_id?.label,
                          key: item.type_id?.id,
                        } || undefined
                      }
                      disabled={view}
                      showSearch={true}
                      labelInValue
                      className="pricing-group"
                      filterOption={false}
                      onSearch={(e) => this.fetchGroup({ search: e })}
                      onFocus={() => this.fetchGroup()}
                      onChange={(e) => this.handleChange(e, item)}
                      placeholder={"Search"}
                    >
                      {this.state.groups.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.labor_group_name}
                        </Option>
                      ))}
                    </Select>
                    {!item.type_id && (
                      <Button className="bg-transparent position-absolute border-0 shadow-none p-0 search-btn-icon">
                        <SearchOutlined />
                      </Button>
                    )}
                  </Form>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <div className="editalble-form-data d-flex align-items-center">
                  <span className="px-3">-</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-4">
                <div>Hours</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5">
                <div className="editalble-form-data">
                  <Form className="position-relative">
                    <InputNumber
                      value={item.hours || 1}
                      disabled={view}
                      onChange={(e) => this.handleHoursChange(e, item)}
                      placeholder={0}
                    />
                    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                      <EditOutlined />
                    </Button>
                  </Form>
                  {/*<span className="px-3">8</span>*/}
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                {newItem?.table_data && item.time ? (
                  <div>${laborCalculations(newItem, item.time, item.name)}</div>
                ) : (
                  0
                )}
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div>{margin}%</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                {newItem?.table_data && item.time ? (
                  <div>
                    $
                    {calculatePercentage(
                      laborCalculations(newItem, item.time, item.name),
                      margin
                    )}
                  </div>
                ) : (
                  0
                )}
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                {newItem?.table_data && item.time ? (
                  <div>
                    $
                    {(
                      (item.hours || 1) *
                        calculatePercentage(
                          laborCalculations(newItem, item.time, item.name),
                          margin
                        ) || 0
                    ).toFixed(2)}
                  </div>
                ) : (
                  0
                )}
              </div>
            </div>
          </>
        );
      case LABOR:
        return (
          <>
            <div className="custom-table-row custom-table-row-level-1 row mx-0">
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>Labor</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-2 gray-2-color">
                <div>{item.resource_name}</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <div className="editalble-form-data d-flex align-items-center">
                  <span className="px-3">-</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <div className="editalble-form-data d-flex align-items-center">
                  <span className="px-3">-</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-4">
                <div>Hours</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5">
                <div className="editalble-form-data text-right">
                  {/*<span className="px-3">8</span>*/}
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div />
              </div>
            </div>
          </>
        );
      case "add":
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color green-light-color-div">
              <div>Labor</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2 green-light-color-div">
              <div className="name-info-div position-relative">
                <span className="rectangle-icon-div rectangle-icon-div-green position-absolute">
                  <img
                    src={Images.rectangle_green_icon}
                    alt=""
                    className={"img-fluid"}
                  />
                </span>
                <Button
                  onClick={() => this.handleAddMore(item, i)}
                  className="add-new-row-btn"
                >
                  <img
                    src={Images.new_add_plus_green_icon}
                    alt={""}
                    className="img-fluid"
                  />
                  <span>Add Wage Type</span>
                </Button>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3 green-light-color-div">
              <div className={"px-3"}>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <div className="editalble-form-data d-flex align-items-center">
                <span className="px-3">-</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4 green-light-color-div">
              <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5 green-light-color-div">
              <div className="px-3">-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6 green-light-color-div">
              <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7 green-light-color-div">
              <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8 green-light-color-div">
              <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8 green-light-color-div">
              <div>-</div>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  totalPrice = (table_data) => {
    // console.log(item, "dsds")
    let data = table_data;
    let { margin } = this.props;
    let newPrice = 0;
    for (let i = 0; i < data?.length; i++) {
      if (data[i].item_type == "labor_child") {
        // const newItem = this.state?.groups?.drawer(grp => {
        //     return data[i]?.type_id?.value == grp.id;
        // })
        const newItem = data[i].data;
        // console.log(newItem)
        newPrice =
          newPrice +
          (data[i].hours || 1) *
            Number(
              calculatePercentage(
                laborCalculations(newItem, data[i].time, data[i].name),
                margin
              )
            );
        // console.log(newPrice, "laborprice")
      } else if (data[i].item_type == FLEET_GROUP) {
        newPrice =
          newPrice +
          (data[i].hours || 1) *
            Number(
              calculatePercentage(vehicleCalculations(data[i].data), margin)
            );
        // console.log((data[i].hours || 1) * Number(calculatePercentage(vehicleCalculations(data[i].data), margin)), "fleetprice")
      } else if (data[i].item_type == SUPPLY_GROUP) {
        newPrice =
          newPrice +
          (data[i].hours || 1) *
            Number(
              calculatePercentage(supplyCalculation(data[i].data), margin)
            );
      } else if (data[i].item_type == "INVENTORY_ITEM") {
        // console.log(data[i], "inventory")
        if (data[i].kit_child) {
          newPrice =
            newPrice +
            ((data[i].quantity ? data[i].quantity : data[i].initQuantity) ||
              1) *
              Number(
                calculatePercentage(
                  data[i]?.unit_cost || 0,
                  data[i]?.margin || 0
                )
              );
        } else {
          // console.log(data[i], "not child")
          newPrice =
            newPrice +
            (data[i].hours || 1) *
              Number(
                calculatePercentage(
                  data[i].data?.unit_cost || 0,
                  data[i]?.data?.margin || 0
                )
              );
        }
      } else if (data[i].item_type == "DISPOSAL") {
        // console.log(data[i], "disposal")
        newPrice =
          newPrice +
          (data[i].hours || 1) *
            Number(
              calculatePercentage(
                data[i]?.data?.unit_cost || 0,
                data[i]?.data?.margin || 0
              )
            );
      }
    }
    // console.log(newPrice, "totalPrice")
    return newPrice.toFixed(2);
  };

  hourPrice = (table_data) => {
    let data = table_data;
    let newHoursArr = [];
    for (let i = 0; i < data?.length; i++) {
      if (data[i].item_type == "labor_child") {
        newHoursArr.push(data[i].hours);
      } else if (data[i].item_type == FLEET_GROUP) {
        newHoursArr.push(data[i].hours);
      } else if (data[i].item_type == SUPPLY_GROUP) {
        newHoursArr.push(data[i].hours);
      }
      // else if (data[i].item_type == 'INVENTORY_ITEM') {
      //     newHoursArr.push(!data[i].kit_child ? data[i].hours : data[i].quantity ? data[i].quantity : data[i].initQuantity)
      // }
      // else if (data[i].item_type == 'DISPOSAL') {
      //     newHoursArr.push(data[i].hours)
      // }
    }
    const newArr = newHoursArr.filter((i) => i != undefined);
    if (isFinite(Math.max(...newArr))) {
      return (this.totalPrice(table_data) / Math.max(...newArr)).toFixed(2);
    } else {
      return this.totalPrice(table_data);
    }
  };

  render() {
    // console.log(this.state.rows, "render")
    // console.log(this.totalPrice(this.props.newPrice), this.hourPrice(this.props.newPrice), "fdsfds")
    if (this.state.loading) {
      return (
        <div className="text-center">
          <Spin />
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="col-12 table-responsive main-table-div position-relative">
          <div className="row mx-0 custom-table-main-row custom-table-header1 custom-update-table">
            <div className="col-12 update-header">
              <div className="row custom-table-header custom-table-header-2">
                <div className="custom-table-cell-th custom-table-cell-th-1">
                  <div className="custom-th-heading">Type</div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-2">
                  <div className="custom-th-heading">Name / Info</div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-3">
                  <div className="custom-th-heading">Labor Group</div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-3">
                  <div className="custom-th-heading">Facility</div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-4">
                  <div className="custom-th-heading">Uom</div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-5">
                  <div className="custom-th-heading">Qty/Day Estimate</div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-6">
                  <div className="custom-th-heading">
                    Cost
                    <br />
                    Per unit
                  </div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-7">
                  <div className="custom-th-heading">Margin</div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-8">
                  <div className="custom-th-heading">
                    Price
                    <br />
                    Per Unit
                  </div>
                </div>
                <div className="custom-table-cell-th custom-table-cell-th-9">
                  <div className="custom-th-heading">Price</div>
                </div>
              </div>
            </div>
            <div className="col-12 custom-table-body p-0">
              {this.state.rows.map((r, i) => {
                const nextRowExist = this.state.rows.length > i + 1;
                let nextRow = null;
                let kitRow = null;
                if (nextRowExist) {
                  nextRow = this.state.rows[i + 1].item_type !== "labor_child";
                  kitRow = this.state.rows[i + 1].kit_child !== true;
                } else {
                  if (r.item_type === "labor_child") {
                    nextRow = true;
                  } else if (r.kit_child === true) {
                    kitRow = true;
                  }
                }
                return this.renderRow(r, i, nextRow, kitRow);
              })}
            </div>
          </div>
        </div>
        {/*{!this.props.view && <>*/}
        {/*    <div className="col-12 mb-lg-3 mb-md-4 mb-sm-3">*/}
        {/*        <div*/}
        {/*            className="w-100 row mx-0 price-estimated-row-table align-items-center position-absolute">*/}
        {/*            <div className="col-12 col-sm-12 col-md-9 offset-md-3 p-0">*/}
        {/*                <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center pl-lg-2">*/}
        {/*                    <li className="list-inline-item">*/}
        {/*                    <span className="d-flex align-items-center">*/}
        {/*                        <img alt={""} className="img-fluid mr-2" src={Images.info_small}/>*/}
        {/*                        Estimated Hourly Price:*/}
        {/*                    </span>*/}
        {/*                    </li>*/}
        {/*                    <li className="list-inline-item">*/}
        {/*                        $1,746.00*/}
        {/*                    </li>*/}
        {/*                    <li className="list-inline-item pl-3">*/}
        {/*                    <span className="d-flex align-items-center">*/}
        {/*                        Estimated Daliy Price:*/}
        {/*                    </span>*/}
        {/*                    </li>*/}
        {/*                    <li className="list-inline-item">*/}
        {/*                        ${this.totalPrice(this.props.newPrice)}*/}
        {/*                    </li>*/}
        {/*                </ul>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</>}*/}
        {this.props.formPrice && (
          <GeneratePriceForm
            totalPrice={this.totalPrice(this.state.rows)}
            hourPrice={this.hourPrice(this.state.rows)}
            newFunc={this.props.newFunc}
            newPrice={this.props.newPrice}
          />
        )}
        <CommonWarningModal
          visible={this.state.visibleWageTypeConfirmation}
          onClose={() => {
            let rows = [...this.state.rows].map((r) => {
              if (
                r.id === this.state.selectedWageType.id &&
                this.state.selectedWageType.item_type === "labor_child"
              ) {
                return { ...r, time: r.time || "select" };
              } else {
                return { ...r };
              }
            });
            this.setState({ rows, visibleWageTypeConfirmation: false });
          }}
          deleteWageType
          updateAfterDltdWageType={() => {
            let rows = [...this.state.rows].filter(
              (r) => r.id !== this.state.selectedWageType.id
            );
            this.setState({ rows, visibleWageTypeConfirmation: false });
          }}
          heading={"Are you sure you want to delete this wage type?"}
          subHeadingUOM={
            "If you choose to delete this wage type, your data will disappear."
          }
        />
      </React.Fragment>
    );
  }
}

export default GeneratePricingTable;

import React, { Component } from "react";
import { Collapse, Dropdown, InputNumber, Menu, Select, Spin } from "antd";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../Images";
// import GeneratePriceForm from "./GeneratePriceForm";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { getFleetGroupById } from "../../../../Controller/api/vehicleServices";
import { getSupplyGroupById } from "../../../../Controller/api/supplyServices";
import { getLaborGroupById } from "../../../../Controller/api/labourServices";
import { getInventoryById } from "../../../../Controller/api/inventoryServices";
import { getDisposalById } from "../../../../Controller/api/disposalServices";
import { calculatePercentage, FLEET_GROUP, formatPrice, LABOR, MANAGEMENT_TREE_TYPES, SUPPLY_GROUP, TYPES } from "../../../../Controller/utils";
import { debounce } from "lodash";
import { handleError } from "../../../../Controller/Global";
import CommonViewModal from "../../../modals/CommonViewModal";


const { Option } = Select;
const { Panel } = Collapse;

class ProjectsServiceVarientCustomView extends Component {
  state = {
    rows: [],
    groups: [],
    loading: true,
    qty: 1,
    warningVisible: false,
    pricingUom: []
  };
  // static getDerivedStateFromProps(props) {
  //     return {qty: props.newPricing?.quantity || 1}
  // }
  handleChangeTime = (e, item) => {
    if (e === "delete_row") {
      let rows = [...this.state.rows].filter((r) => r.id !== item.id);
      this.setState({ rows });
    } else {
      let rows = [...this.state.rows].map((r) => {
        if (r.id === item.id && item.item_type === "labor_child") {
          return { ...r, time: e };
        } else {
          return { ...r };
        }
      });
      this.setState({ rows });
    }
  };
  handleHoursChange = (e, item) => {
    let rows = [...this.state.rows].map((r) => {
      if (r.id === item.id) {
        return { ...r, hours: e || 1 };
      } else {
        if (r.kit_child && r.kit_id == `kit${item.id + item.kitIndex}`) {
          console.log(e, r.initQuantity, e * r.initQuantity, "---");
          return { ...r, quantity: e * r.initQuantity };
        } else {
          return { ...r };
        }
      }
    });
    this.setState({ rows });
  };
  handleChange = (e, item) => {
    let rows = [...this.state.rows].map((r) => {
      if (r.id === item.id && item.item_type === "labor_child") {
        let obj = this.state.groups.find((i) => i.id === e);
        return { ...r, type_id: e, data: obj };
      } else {
        return { ...r };
      }
    });
    this.setState({ rows });
  };
  // fetchGroup = (params = {}) => {
  //   getLaborGroup(params)
  //     .then((res) => {
  //       this.setState({ groups: res.data.results });
  //     })
  //     .catch((err) => {
  //       handleError(err);
  //     });
  // };
  componentDidMount() {
    const { newPricing } = this.props
    this.formatVal(newPricing?.price_per_unit)
    this.handleData();
    // this.setState({qty: this.props.newPricing?.quantity || 1})
    this.setState({ qty: this.props.newPricing?.project_qty || 1 });
    this.handlePricingUom()
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { newPricing } = this.props
    console.log("service check")
    if (prevProps.newPricing?.price_per_unit !== newPricing?.price_per_unit) {
      this.formatVal(newPricing.price_per_unit)
    }
    if (prevProps.margin !== this.props.margin) {
      this.handleData();
    }
  }
  handlePricingUom = () => {
    const newArr = [];
    const variant_data = { ...this.props.newPricing?.variant_data };
    if (variant_data?.daily_price || variant_data?.hourly_price || variant_data?.pricing_uom) {
      if (variant_data?.daily_price) {
        const obj = {
          label: 'Day (d)',
          value: 'DAY'
        }
        newArr.push(obj);
      }
      if (variant_data?.hourly_price) {
        const obj = {
          label: 'Hours (hrs)',
          value: 'HOURS'
        }
        newArr.push(obj)
      }
      if (variant_data?.pricing_uom && variant_data?.price) {
        const obj = {
          label: variant_data.pricing_uom?.name,
          value: 'UOM',
          symbol: `(${variant_data?.pricing_uom?.symbol})`
        }
        newArr.push(obj)
      }
    } else {
      const obj = {
        label: 'Day (d)',
        value: 'DAY'
      }
      newArr.push(obj)
    }

    this.setState({ pricingUom: newArr })
  }
  handleData = async () => {
    // this.fetchGroup();
    let a = [];
    if (this.props.child) {
      a = [...this.props.child];
    }
    let b = [];
    if (!this.props.view && !this.props.priceChild) {
      for (const item of a) {
        if (item.item_type == "INVENTORY_KIT") {
          item.kitIndex = a.findIndex((n) => n.id === item.id);
          b.push(item);
        } else {
          b.push(item);
        }
        if (item.item_type == "LABOR") {
          let obj = { item_type: "add", id: "add", name: item.resource_name };
          b.push(obj);
        }
        // else if (item.item_type == 'INVENTORY_KIT') {
        //     console.log(item)
        //     const params = {
        //         kit: item.item_id
        //     }
        //     const newData = await getInventoryKitItem(params)
        //     newData.data.results.forEach((newItem, index) => {
        //         console.log(newItem, "fdsfdsf")
        //         newItem.item.item_type = 'INVENTORY_ITEM';
        //         newItem.item.kit_child = true;
        //         newItem.item.kit_id = `kit${item.id + item.kitIndex}`;
        //         newItem.item.initQuantity = newItem.quantity;
        //         newItem.item.kit_uom = newItem.kit?.unit;
        //         b.push(newItem.item)
        //     })
        // }
      }
    }
    let c = b.length > 0 ? b : a;
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
          getLaborGroupById(item.item_id)
            .then((res) => {
              this.setState({ loading: false });
              item.data = res.data;
            })
            .catch((err) => {
              this.setState({ loading: false });
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
    console.log(newA, "fjsdjgfj");
    this.setState({ rows: newA, loading: false });
  };
  handleAddMore = (item, i) => {
    // console.log(item, "name")
    let a = this.state.rows;
    let obj = { item_type: "labor_child", id: "child" + i, name: item.name };
    a.splice(i, 0, obj);
    this.setState({ rows: a });
  };
  updateTable = () => {
    let rows = this.state.rows
      .map((item) => {
        delete item.data;
        delete item.pricing;
        return { ...item };
      })
      .drawer((p) => p.type !== "add");
    return rows;
  };
  menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => this.props.handleRemoveWarning(true, this.props.newPricing?.id)}>
        Remove
      </Menu.Item>
    </Menu>
  );
  handleFleetKit = (item,kit_child,kitRow) => {
    return (
      <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>Fleet Group</div>
            </div>
            <div
              className={
                `custom-table-cell-td custom-table-cell-td-2` +
                (!kitRow ? " last-child " : "")
              }
            >
              <div className="name-info-div p-0 position-relative">
                {kit_child && (
                  <span className="rectangle-icon-div position-absolute">
                    <img
                      src={Images.rectangle_gray_icon}
                      alt=""
                      className={"img-fluid"}
                    />
                  </span>
                )}
                <span style={kit_child && { paddingLeft: "30px" }}>
                  {item?.kit_child ? item?.item?.name : item.name || "-"}
                </span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <span className="px-3">-</span>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div className="editalble-form-data d-flex align-items-center justify-content-center">
                <span className="px-3">
                  {
                   
                    item.qty || 1
                  }
                </span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5 px-0">
              <div className="editalble-form-data editalble-form-data-select d-flex align-items-center px-3">
                {
                  item?.kit_child ? (
                    <span className="text-capitalize">
                      {item?.kit_uom?.name || "-"}
                    </span>
                  ) : (
                    <span className="text-capitalize">
                      {item?.uom?.name || "-"}
                    </span>
                  )
                }
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
              <div>{item.price_unit ? `$${item.price_unit}` : "-"}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>-</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-9">
              <div>{item.total_price ? `$${item.total_price}` : "-"}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-9">
              <div>-</div>
            </div>
          </div>
    );
  }
  renderRow = (item, kit_child, kitRow) => {
    // let { margin, view, viewProposalTable } = this.props;
    // console.log(item, "dss")
    // console.log(item, "all")
    // console.log(item, "renderRow")
    switch (item.type) {
      case FLEET_GROUP:
        return (
          <div className="custom-table-row custom-table-row-level-1 custom-table-proposal row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>{MANAGEMENT_TREE_TYPES.FLEET_GROUP.name}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2">
              <div>{item.name}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <span className="px-3">-</span>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div className="editalble-form-data d-flex align-items-center justify-content-center">
                <span className="px-3">{item.qty || 1}</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start px-3">
              <div>Hours</div>
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
            <div className="custom-table-cell-td custom-table-cell-td-9">
              <div />
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>-</div>
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
              <div>{item.name}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <span className="px-3">-</span>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div className="editalble-form-data d-flex align-items-center justify-content-center">
                <span className="px-3">{item.qty || 1}</span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start px-3">
              <div>Hours</div>
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
            <div className="custom-table-cell-td custom-table-cell-td-9">
              <div />
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>-</div>
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
                (!kitRow ? " last-child " : "")
              }
            >
              <div className="name-info-div p-0 position-relative">
                {kit_child && (
                  <span className="rectangle-icon-div position-absolute">
                    <img
                      src={Images.rectangle_gray_icon}
                      alt=""
                      className={"img-fluid"}
                    />
                  </span>
                )}
                <span
                  style={kit_child && { paddingLeft: "30px" }}
                >
                  {item?.kit_child ? item?.item?.name : (item.name || "-")}
                </span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-3">
              <span className="px-3">-</span>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-4">
              <div className="editalble-form-data d-flex align-items-center justify-content-center">
                <span className="px-3">
                  {
                    // (item.kit_child
                    //   ? item.quantity
                    //     ? item.quantity
                    //     : item.initQuantity
                    //   : "")
                    item.qty || 1}
                </span>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5 px-0">
              <div className="editalble-form-data editalble-form-data-select d-flex align-items-center px-3">
                {item?.kit_child ? (
                  <span className="text-capitalize">{item?.kit_uom?.name || "-"}</span>
                ) :
                  <span className="text-capitalize">{item?.uom?.name || "-"}</span>
                  // (
                  // <Form>
                  //   <Select
                  //     // labelInValue
                  //     suffixIcon={
                  //       <img
                  //         src={Images.caret_down_small_select}
                  //         alt=""
                  //         className="img-fluid"
                  //       />
                  //     }
                  //     placeholder={"Please Select"}
                  //     defaultValue={"select"}
                  //   >
                  //     <Option value={"select"}>Select</Option>
                  //     {item?.data?.uom_array?.map((opt) => (
                  //       <Option key={opt.id} value={opt.id}>
                  //         {opt.name} ({opt.symbol})
                  //       </Option>
                  //     ))}
                  //   </Select>
                  // </Form>
                  // )
                }
              </div>
            </div>
            {/* <div className="custom-table-cell-td custom-table-cell-td-5">
                          <div
                              className="editalble-form-data">
                              <Form className="position-relative">
                                  <InputNumber value={(item.kit_child ? (item.quantity ? item.quantity : item.initQuantity) : item.hours) || 1} disabled={item.kit_child ? true : view ? true : false}
                                               onChange={(e) => this.handleHoursChange(e, item)}
                                               placeholder={0}/>
                                  <Button
                                      className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                      <EditOutlined/>
                                  </Button>
                              </Form>
                              {/* <span className="px-3">-</span>
                          </div>
                      </div>
                      <div className="custom-table-cell-td custom-table-cell-td-6">
                          <div>${(item.kit_child ? item?.unit_cost : item?.resource_item?.unit_cost) || 0}</div>
                      </div>
                      <div className="custom-table-cell-td custom-table-cell-td-7">
                          <div>{item.data?.margin || 0}%</div>
                      </div>
                      <div className="custom-table-cell-td custom-table-cell-td-8">
                          <div>${calculatePercentage((item.kit_child ? item?.unit_cost : item?.resource_item?.unit_cost) || 0, item.data?.margin || 0)}</div>
                      </div>
                      <div className="custom-table-cell-td custom-table-cell-td-8">
                          <div>${(((item.kit_child ? (item.quantity ? item.quantity : item.initQuantity) : item.hours) || 1)* (calculatePercentage((item.kit_child ? item?.unit_cost : item?.resource_item?.unit_cost) || 0, item.data?.margin)) || 0).toFixed(2)}</div>
                      </div> */}
            <div className="custom-table-cell-td custom-table-cell-td-6">
              <div />
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div />
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div />
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-9">
              <div />
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>-</div>
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
                <div>{item.name}</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <span className="px-3">-</span>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-4">
                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                  <span className="px-3">{item.qty || 1}</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5">
                <div>Unit</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                {/* <div className="editalble-form-data">
                                  {/* <Form className="position-relative">
                                      <InputNumber value={item.hours || 1} disabled={view}
                                                  onChange={(e) => this.handleHoursChange(e, item)}
                                                  placeholder={0}/>
                                      <Button
                                          className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                                          <EditOutlined/>
                                      </Button>
                                  </Form>
                                  <span className="px-3">-</span>
                              </div> */}
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-9">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div>-</div>
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
            {item.children.length > 0 &&
              item.children.map((n, ind) => {
                let kitRow = item.children.length > ind + 1;
                return this.renderRow(n, true, kitRow)
              })
            }
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
                  <div className="editalble-form-data d-flex align-items-center justify-content-center">
                    <span className="px-3">-</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-4">
                  <div>Amount</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-5">
                  <div className="editalble-form-data d-flex align-items-center justify-content-center">
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
        case "FLEET_KIT":
          return (
            <>
              <div className="custom-table-row custom-table-row-level-1 row mx-0">
                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                  <div>{TYPES.fleet_kit.title}</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-2">
                  <div>{item.name}</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-3">
                  <span className="px-3">-</span>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-4">
                  <div className="editalble-form-data d-flex align-items-center justify-content-center">
                    <span className="px-3">{item.qty || 1}</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-5">
                  <div>Unit</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-6">
                  {item.price_unit ? `$${item.price_unit}` : "-" }
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>-</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-8">
                  <div>-</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-9">
                  <div>{item.total_price ? `$${item.total_price}` : "-" }</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-8">
                  <div>-</div>
                </div>
              </div>
              {item.children?.length > 0 &&
                item?.children.map((n, ind) => {
                  let kitRow = item.children?.length > ind + 1;
                  return this.handleFleetKit(n, true, kitRow);
                })}

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
                  <span>{item.name}</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <span className="px-3">{item?.facility_type === "VENDOR" ? item?.facility_id?.vendor?.name : item?.facility_type === "WAREHOUSE" ? item?.facility_id?.internal_location.name : "-"}</span>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-4">
                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                  <span className="px-3">{item.qty || 1}</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5 px-0">
                <div className="editalble-form-data editalble-form-data-select">
                  <span className="text-capitalize">{item?.uom?.name || "-"}</span>
                  {/* <Form className="position-relative">
                      <Select
                        suffixIcon={
                          <img
                            src={Images.caret_down_small_select}
                            alt=""
                            className="img-fluid"
                          />
                        }
                        // onChange={(e) => this.handleChangeTime(e, item)}
                        placeholder={"Please Select"}
                        defaultValue={"select"}
                      >
                        <Option value={"select"}>Select</Option>
                        {/* {console.log(item?.data?.uom_array, "hjdfgsdjhfgjdhsfg")}
                        {item?.data?.uom_array?.map((opt) => (
                          <Option key={opt.id} value={opt.id}>
                            {opt.name} ({opt.symbol})
                          </Option>
                        ))}
                      </Select>
                    </Form> */}
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
              <div className="custom-table-cell-td custom-table-cell-td-9">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8 d-flex justify-content-start">
                <span className="text-capitalize">{item?.doc_type ? item?.doc_type === "BILL_OF_LADING" ? "Bill of Lading" : item?.doc_type === "NEITHER" ? "Neither" :  "Manifest" : "-"}</span>
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
                <div>{item.name}</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-3">
                <span className="px-3">-</span>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-4">
                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                  <span className="px-3">{item.qty}</span>
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start">
                <div className="px-3">Hours</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                <div className="editalble-form-data d-flex align-items-center justify-content-center">
                  {/*<span className="px-3">8</span>*/}
                </div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-9">
                <div />
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-8">
                <div>-</div>
              </div>
              {/* <div className="custom-table-cell-td custom-table-cell-td-8">
                              <div/>
                          </div> */}
            </div>
          </>
        );
      default:
        return <></>;
    }
  };
  stopEvtBubbling = (e) => {
    e.stopPropagation();
  };
  handlePriceChange = () => {
    const { newPricing } = this.props
    this.props.handlePriceUnit(true, newPricing.id)
  }

  handleInputsBlur = e => {
    console.log(e, e.target.value, "value")
    let value = e.target.value;
    if (value) {
      this.formatVal(value)
    }
  }

  formatVal = (val) => {
    let value = val?.toString() || "0"
    console.log(value, "))")
    let parseVal = value?.replace(/\$\s?|(,*)/g, "").toLocaleString(undefined, { minimumFractionDigits: 2 })
    let moneyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    this.setState({ priceUnit: moneyFormatter.format(parseVal) })
  }

  debounceEvent = (...args) => {
    this.debouncedEvent = debounce(...args);
    return (e) => {
      return this.debouncedEvent(e);
    };
  };
  // returnUomOptions = newPricing => {
  //   if(newPricing?.variant?.daily_price) {
  //     return <Option value="DAY">Day (d)</Option>
  //   }
  //   if(newPricing?.variant?.hourly_price) {
  //     return <Option value="HOURS">Hours (hrs)</Option>
  //   }
  //   // if(newPricing?.variant?.pricing_uom) {
  //   //   <Option value="UOM">
  //   //     {newPricing?.variant?.pricing_uom?.name} ({newPricing?.variant?.pricing_uom?.symbol})
  //   //   </Option>
  //   // }
  //   if(newPricing?.variant?.daily_price && newPricing?.variant?.hourly_price && newPricing?.variant?.pricing_uom) {
  //     return (
  //       <>
  //       <Option value="DAY">Day (d)</Option>
  //       <Option value="HOURS">Hours (hrs)</Option>
  //       <Option value="UOM">
  //       {newPricing?.variant?.pricing_uom?.name} ({newPricing?.variant?.pricing_uom?.symbol})
  //       </Option>
  //       </>
  //     )
  //   }
  //   else if(newPricing?.variant?.daily_price && newPricing?.variant?.hourly_price) {
  //    return <>
  //     <Option value="DAY">Day (d)</Option>
  //     <Option value="HOURS">Hours (hrs)</Option>
  //     </>
  //   }
  //   else if(newPricing?.variant?.hourly_price && newPricing?.variant?.pricing_uom) {
  //     return <>
  //      <Option value="HOURS">Hours (hrs)</Option>
  //      <Option value="UOM">
  //       {newPricing?.variant?.pricing_uom?.name} ({newPricing?.variant?.pricing_uom?.symbol})
  //      </Option>
  //      </>
  //    }
  //    else if(newPricing.variant.daily_price && newPricing)
  // }
  render() {
    const { newPricing, viewProposalTable, view, allOptions, foundRegion, removeThreeDots } = this.props;
    // console.log(newPricing,"newpricing")
    const foundUom = allOptions?.find((i) => i.id === newPricing?.variant_data?.pricing_uom?.id);
    // const {uomValue} = this.state;
    // console.log(this.totalPrice(this.props.newPrice), this.hourPrice(this.props.newPrice), "fdsfds")
    if (this.state.loading) {
      return (
        <div className="text-center">
          <Spin />
        </div>
      );
    }
    // return (
    //   <React.Fragment>
    //     <div className="col-12 custom-table-body p-0">
    //       <Collapse
    //         accordion
    //         defaultActiveKey={["1"]}
    //         expandIcon={({ isActive }) => (
    //           <CaretRightOutlined rotate={isActive ? 90 : 0} />
    //         )}
    //         className="custom-table-collapse-main"
    //       >
    //         <Panel
    //           header={
    //             <React.Fragment>
    //               <div className="custom-table-row custom-collapse-line-item custom-table-row-level-1 line-item-grid row mx-0">
    //                 <div className="custom-table-cell-td wage-info-collapse-td gray-2-color">
    //                   <div className="d-flex align-items-center">
    //                     <img
    //                       alt={""}
    //                       src={Images.line_item_icon_green}
    //                       className="img-fluid mr-2"
    //                     />
    //                     {newPricing?.manually_added
    //                       ? newPricing?.name
    //                       : `${newPricing?.line_item?.name} / ${newPricing?.name}`}
    //                   </div>
    //                 </div>
    //                 <div
    //                   className="custom-table-cell-td background-white-div p-0"
    //                   onClick={this.stopEvtBubbling}
    //                 >
    //                   {view ? (
    //                     <span>{this.state.qty}</span>
    //                   ) : (
    //                     <InputNumber
    //                       value={this.state.qty || 1}
    //                       onChange={(value) => this.setState({ qty: value })}
    //                       onBlur={(e) =>
    //                         this.props.handleQuantitySelectChange(
    //                           e.target.value
    //                         )
    //                       }
    //                     />
    //                   )}
    //                 </div>
    //                 <div
    //                   className="custom-table-cell-td px-2 gray-2-color"
    //                   onClick={this.stopEvtBubbling}
    //                 >
    //                   {newPricing?.manually_added ? (
    //                     newPricing?.type === "INVENTORY_ITEM" ? (
    //                       <span>
    //                         {newPricing.uom?.name} ({newPricing.uom?.symbol})
    //                       </span>
    //                     ) : (
    //                       <span>
    //                         {newPricing.unit?.name} ({newPricing.unit?.symbol})
    //                       </span>
    //                     )
    //                   ) : view ? (
    //                     <span>
    //                       {newPricing.selectedUnit == "a"
    //                         ? `${foundUom?.name} (${foundUom?.symbol})`
    //                         : newPricing.selectedUnit == "c"
    //                         ? "Hours (hrs)"
    //                         : "Day (d)"}
    //                     </span>
    //                   ) : (
    //                     <Select
    //                       dropdownClassName="border-green"
    //                       className="edit-select-box w-100"
    //                       suffixIcon={<CaretDownOutlined />}
    //                       defaultValue="b"
    //                       onChange={(value) =>
    //                         this.props.handleUnitSelectChange(value)
    //                       }
    //                       value={newPricing.selectedUnit}
    //                     >
    //                       <Option value="b">Day (d)</Option>
    //                       <Option value="c">Hours (hrs)</Option>
    //                       <Option value="a">
    //                         {foundUom?.name} ({foundUom?.symbol})
    //                       </Option>
    //                     </Select>
    //                   )}
    //                 </div>
    //                 <div
    //                   className="custom-table-cell-td justify-content-center px-2 d-flex gray-2-color"
    //                   onClick={this.stopEvtBubbling}
    //                 >
    //                   <span className="d-inline-block w-100">
    //                     ${" "}
    //                     {newPricing.manually_added
    //                       ? newPricing?.type === "INVENTORY_ITEM"
    //                         ? newPricing.item_pricing_value || 0.0
    //                         : newPricing.kit_pricing_value || 0.0
    //                       : newPricing.selectedUnit == "a"
    //                       ? newPricing?.price || 0.0
    //                       : newPricing.selectedUnit == "b"
    //                       ? newPricing?.daily_price || 0.0
    //                       : newPricing.selectedUnit == "c"
    //                       ? newPricing?.hourly_price || 0.0
    //                       : 0.0}
    //                   </span>
    //                 </div>
    //                 {/* <div
    //                                                         className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex gray-2-color">
    //                                                         <span>50%</span>
    //                                                     </div> */}
    //                 <div
    //                   className="custom-table-cell-td gray-2-color pl-0 text-center"
    //                   onClick={this.stopEvtBubbling}
    //                 >
    //                   <Checkbox
    //                     defaultChecked={false}
    //                     checked={newPricing?.taxable}
    //                     disabled={view}
    //                     // onChange={onChange}
    //                     onChange={(e) =>
    //                       this.props.handleCheckBox(e.target.checked, "TAX")
    //                     }
    //                   />
    //                 </div>
    //                 <div
    //                   className="custom-table-cell-td gray-2-color pl-0 text-center"
    //                   onClick={this.stopEvtBubbling}
    //                 >
    //                   <Checkbox
    //                     checked={newPricing?.include_subtotal}
    //                     defaultChecked
    //                     disabled={view}
    //                     onChange={(e) =>
    //                       this.props.handleCheckBox(
    //                         e.target.checked,
    //                         "INCLUDE_SUBTOTAL"
    //                       )
    //                     }
    //                     // onChange={onChange}
    //                   />
    //                 </div>
    //                 <div
    //                   className="custom-table-cell-td gray-2-color px-3"
    //                   onClick={this.stopEvtBubbling}
    //                 >
    //                   <div className="d-inline-block w-100">
    //                     $
    //                     {this.state.qty *
    //                       (newPricing.manually_added
    //                         ? newPricing?.type === "INVENTORY_ITEM"
    //                           ? newPricing.item_pricing_value || 0.0
    //                           : newPricing.kit_pricing_value || 0.0
    //                         : newPricing.selectedUnit == "a"
    //                         ? newPricing?.price || 0.0
    //                         : newPricing.selectedUnit == "b"
    //                         ? newPricing?.daily_price || 0.0
    //                         : newPricing.selectedUnit == "c"
    //                         ? newPricing?.hourly_price || 0.0
    //                         : 0.0) || 0.0}
    //                   </div>
    //                 </div>
    //               </div>
    //             </React.Fragment>
    //           }
    //           key="1"
    //         >
    //           {this.state.rows.map((r, i) => {
    //             const nextRowExist = this.state.rows.length > i + 1;
    //             let nextRow = null;
    //             let kitRow = null;
    //             if (nextRowExist) {
    //               nextRow = this.state.rows[i + 1].item_type !== "labor_child";
    //               kitRow = this.state.rows[i + 1].kit_child !== true;
    //             } else {
    //               if (r.item_type === "labor_child") {
    //                 nextRow = true;
    //               } else if (r.kit_child === true) {
    //                 kitRow = true;
    //               }
    //             }
    //             return this.renderRow(r, i, nextRow, kitRow);
    //           })}
    //         </Panel>
    //       </Collapse>
    //     </div>

    //     {/*{!this.props.view && <>*/}
    //     {/*    <div className="col-12 mb-lg-3 mb-md-4 mb-sm-3">*/}
    //     {/*        <div*/}
    //     {/*            className="w-100 row mx-0 price-estimated-row-table align-items-center position-absolute">*/}
    //     {/*            <div className="col-12 col-sm-12 col-md-9 offset-md-3 p-0">*/}
    //     {/*                <ul className="list-inline mb-0 pricing-estimated-ul d-flex align-items-center pl-lg-2">*/}
    //     {/*                    <li className="list-inline-item">*/}
    //     {/*                    <span className="d-flex align-items-center">*/}
    //     {/*                        <img alt={""} className="img-fluid mr-2" src={Images.info_small}/>*/}
    //     {/*                        Estimated Hourly Price:*/}
    //     {/*                    </span>*/}
    //     {/*                    </li>*/}
    //     {/*                    <li className="list-inline-item">*/}
    //     {/*                        $1,746.00*/}
    //     {/*                    </li>*/}
    //     {/*                    <li className="list-inline-item pl-3">*/}
    //     {/*                    <span className="d-flex align-items-center">*/}
    //     {/*                        Estimated Daliy Price:*/}
    //     {/*                    </span>*/}
    //     {/*                    </li>*/}
    //     {/*                    <li className="list-inline-item">*/}
    //     {/*                        ${this.totalPrice(this.props.newPrice)}*/}
    //     {/*                    </li>*/}
    //     {/*                </ul>*/}
    //     {/*            </div>*/}
    //     {/*        </div>*/}
    //     {/*    </div>*/}
    //     {/*</>}*/}
    //     {/* {this.props.formPrice &&
    //                 <GeneratePriceForm totalPrice={this.totalPrice(this.state.rows)}
    //                                    hourPrice={this.hourPrice(this.state.rows)}
    //                                    newFunc={this.props.newFunc}
    //                                    newPrice={this.props.newPrice}
    //                 />} */}
    //   </React.Fragment>
    // );
    return (
      <React.Fragment>
        <div className="col-12 custom-table-body p-0">
          <Collapse
            accordion
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            className="custom-table-collapse-main"
          >
            <Panel
              header={
                <React.Fragment>
                  <div
                    className="custom-table-row custom-collapse-line-item custom-table-row-level-1 line-item-grid row mx-0">
                    <div
                      className="custom-table-cell-td wage-info-collapse-td gray-2-color d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img
                          alt={""}
                          // src={Images.line_item_icon_green}
                          src={
                            newPricing?.resource_type === "INVENTORY_KIT"
                              ? Images.inventory_kit_variant
                              : newPricing?.resource_type === "INVENTORY_ITEM"
                              ? Images.inventory_item_variant
                              : newPricing?.resource_type === "DISPOSAL"
                              ? Images.no_disposal_black
                              : newPricing?.resource_type === "SUPPLY_GROUP"
                              ? Images?.supply_icon_black
                              : Images.line_item_black
                          }
                          className="img-fluid mr-2"
                        />
                        {newPricing?.resource_type === "INVENTORY_KIT" || newPricing?.resource_type === "INVENTORY_ITEM" || newPricing?.resource_type === "DISPOSAL" || newPricing?.resource_type === "SUPPLY_GROUP"
                          ? newPricing?.resource_id?.name
                          // : `${newPricing?.variant_data?.line_item?.name} ${foundRegion && '/'} ${foundRegion?.title || ""} - ${newPricing?.variant_data?.name}`}
                          : newPricing?.variant_data?.display_name ?`${newPricing?.variant_data?.display_name}` : "-"}
                      </div>
                      {!removeThreeDots &&
                        <Dropdown overlay={this.menu} trigger={['click']}>
                          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <img alt="remove-icon"
                              src={Images.black_dots_elipsis}
                              className="img-fluid"
                            />
                          </a>
                        </Dropdown>
                      }
                    </div>
                    <div
                      className="custom-table-cell-td background-white-div p-0"
                      onClick={this.stopEvtBubbling}
                    >
                      {view ? (
                        <span>{parseInt(newPricing?.project_qty) || "1"}</span>
                      ) : (
                        <InputNumber
                          value={newPricing?.project_qty || 1}
                          // onChange={(value) => this.setState({ qty: value })}
                          onBlur={(e) => {
                            console.log(newPricing?.id, "")
                            this.props.handleQuantitySelectChange(
                              e.target.value, newPricing?.id
                            )

                          }
                          }
                        />
                      )}
                    </div>
                    <div
                      className="custom-table-cell-td p-0 gray-2-color d-flex justify-content-center"
                      onClick={this.stopEvtBubbling}
                    >
                      {newPricing?.manually_added ? (
                        newPricing?.type === "INVENTORY_ITEM" ? (
                          <span>
                            {newPricing.uom?.name} ({newPricing.uom?.symbol})
                          </span>
                        ) : (
                          <span>
                            {newPricing.unit?.name} ({newPricing.unit?.symbol})
                          </span>
                        )
                      ) : view ? (
                        <span>
                          {newPricing?.resource_type === "DISPOSAL" ? newPricing?.disposal_unit_id :
                          newPricing.selected_unit == "UOM"
                            ? `${foundUom?.name} (${foundUom?.symbol})`
                            : newPricing.selected_unit == "HOURS"
                              ? "Hours (hrs)"
                              : "Day (d)"}
                        </span>
                      ) :
                        // (newPricing?.variant?.daily_price || newPricing?.variant?.hourly_price || newPricing?.variant?.pricing_uom)
                        //   ?
                        <>


                          {/* {this.returnUomOptions(newPricing)}
                           */}
                          {/* {newPricing?.variant?.daily_price &&
                          <Option value="DAY">Day (d)</Option>
                          }
                          {newPricing?.variant?.hourly_price &&
                          <Option value="HOURS">Hours (hrs)</Option>
                          }
                          {newPricing?.variant?.pricing_uom &&
                          <Option value="UOM">
                            {newPricing?.variant?.pricing_uom?.name} ({newPricing?.variant?.pricing_uom?.symbol})
                          </Option>
                          } */}

                          {
                            this.state.pricingUom?.length <= 1 ?

                              this.state.pricingUom?.map(i =>
                                <span value={i.value}>{i.label}{i?.symbol}</span>
                              )
                              :
                              <Select
                                dropdownClassName="border-green"
                                className="edit-select-box bg-white edit-box-custom w-100"
                                suffixIcon={<CaretDownOutlined />}
                                // defaultValue="b"
                                // open={this.state.open}
                                onChange={(value) =>
                                  this.props.handleUnitSelectChange(value, newPricing?.id)
                                }
                                placeholder="select"
                                value={newPricing.selected_unit || undefined}
                              >
                                {
                                  this.state.pricingUom?.map(i =>
                                    <Option value={i.value}>{i.label}{i?.symbol}</Option>
                                  )
                                }
                              </Select>
                          }

                        </>
                        // :
                        // <span>Day (d)</span>
                      }
                    </div>
                    <div
                      className={`custom-table-cell-td background-white-div p-0 ${this.props.view ? "background-f2" : ''}`}
                      onClick={(e) => {
                        this.handlePriceChange()
                        this.stopEvtBubbling(e)
                      }}
                    >
                      <span className="d-inline-block w-100">
                        <InputNumber
                          disabled={view}
                          value={this.state.priceUnit || 0.00}
                          onChange={this.debounceEvent((e) => this.props.handlePricePerUnitChange(e, newPricing?.id), 1000)}
                          // onChange={(e =>this.props.handlePricePerUnitChange(e, newPricing?.id),300)}
                          onBlur={this.handleInputsBlur}
                        // formatter={(value) =>
                        //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        // }
                        />
                        {/* ${" "} {formatPrice(newPricing?.price_per_unit) || 0.00} */}
                        {/* {newPricing.manually_added
                          ? newPricing?.type === "INVENTORY_ITEM"
                            ? newPricing.item_pricing_value || 0.0
                            : newPricing.kit_pricing_value || 0.0
                          : newPricing.selectedUnit == "a"
                          ? newPricing?.price || 0.0
                          : newPricing.selectedUnit == "b"
                          ? newPricing?.daily_price || 0.0
                          : newPricing.selectedUnit == "c"
                          ? newPricing?.hourly_price || 0.0
                          : 0.0} */}
                      </span>
                    </div>
                    {/* <div
                                                            className="custom-table-cell-td custom-table-cell-td-6 justify-content-end d-flex gray-2-color">
                                                            <span>50%</span>
                                                        </div> */}
                    <div
                      className="custom-table-cell-td gray-2-color pl-0 text-center"
                      onClick={this.stopEvtBubbling}
                    >
                      <Checkbox
                        defaultChecked={false}
                        checked={newPricing?.taxable}
                        disabled={view}
                        // onChange={onChange}
                        onChange={(e) =>
                          this.props.handleCheckBox(e.target.checked, newPricing?.id, "TAX")
                        }
                      />
                    </div>
                    <div
                      className="custom-table-cell-td gray-2-color pl-0 text-center"
                      onClick={this.stopEvtBubbling}
                    >
                      <Checkbox
                        checked={newPricing?.include_subtotal}
                        defaultChecked
                        disabled={view}
                        onChange={(e) =>
                          this.props.handleCheckBox(
                            e.target.checked,
                            newPricing?.id,
                            "INCLUDE_SUBTOTAL"
                          )
                        }
                      // onChange={onChange}
                      />
                    </div>
                    <div
                      className="custom-table-cell-td gray-2-color px-3"
                      onClick={this.stopEvtBubbling}
                    >
                      <div className="d-inline-block w-100">
                        $ {formatPrice(newPricing?.total_price)}
                        {/* {this.state.qty *
                          (newPricing.manually_added
                            ? newPricing?.type === "INVENTORY_ITEM"
                              ? newPricing.item_pricing_value || 0.0
                              : newPricing.kit_pricing_value || 0.0
                            : newPricing.selectedUnit == "a"
                            ? newPricing?.price || 0.0
                            : newPricing.selectedUnit == "b"
                            ? newPricing?.daily_price || 0.0
                            : newPricing.selectedUnit == "c"
                            ? newPricing?.hourly_price || 0.0
                            : 0.0) || 0.0} */}
                      </div>

                    </div>
                    <div
                      className="custom-table-cell-td gray-2-color px-3"> <span
                      className="text-capitalize">{newPricing?.document_type ? newPricing?.document_type === "BILL_OF_LADING" ? "Bill of Lading" : newPricing?.document_type === "NEITHER" ? "Neither" : "Manifest" : "-"}</span></div>
                  </div>
                </React.Fragment>
              }
              key="1"
            >
              {this.state.rows.map((r, i) => {
                //  const nextRowExist = this.state.rows.length > i + 1;
                //  let nextRow = null;
                //  let kitRow = null;
                //  if (nextRowExist) {
                //    nextRow = this.state.rows[i + 1].item_type !== "labor_child";
                //    kitRow = this.state.rows[i + 1].kit_child !== true;
                //  } else {
                //    if (r.item_type === "labor_child") {
                //      nextRow = true;
                //  if (r.type === 'INVENTORY_KIT') {
                //    kitRow = true;
                //  }
                //  }
                let obj = {};
                if (r.kit) {
                  let kitRow = this.state.rows.length > i + 1;
                  obj = {
                    id: r.id,
                    item: r.item,
                    qty: r.quantity,
                    kit_uom: r.kit?.unit,
                    type: 'INVENTORY_ITEM',
                    kit_child: true
                  }
                  return this.renderRow(obj, true, kitRow);
                }
                else {
                  console.log("hk")
                  return this.renderRow(r);
                }
              })}
            </Panel>
          </Collapse>
        </div>

        <CommonViewModal
          footerText={"ok"}
          visible={this.props.modalVisible}
          onClose={this.props.closeViewModal}
          heading={
            this.props.taxCheckBox ? (this.props.taxVisible ? (
              <div>
                This is now taxable.
              </div>)
              : (
                <div>
                  This is now nontaxable.
                </div>
              )) : (this.props.subtotalVisible ? (
                <div>
                  This is now included in the subtotal
                </div>) : (
                <div>
                  This is now excluded from the subtotal.
                </div>
              )
            )

          }
          subHeading={this.props.taxCheckBox ? (this.props.taxVisible ? (
            <div>To make it nontaxable, please uncheck the checkbox.</div>
          ) : (<div>
            To make it taxable, please check the checkbox.
          </div>)
          ) : (this.props.subtotalVisible ? (
            <div>
              To make it excluded, uncheck the check box.
            </div>) : (
            <div>
              To include it again, please check the checkbox.
            </div>
          )
          )
          }
          footer={"ok"}
        />
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
        {/* {this.props.formPrice &&
                    <GeneratePriceForm totalPrice={this.totalPrice(this.state.rows)}
                                       hourPrice={this.hourPrice(this.state.rows)}
                                       newFunc={this.props.newFunc}
                                       newPrice={this.props.newPrice}
                    />} */}
      </React.Fragment>
    );

  }
}
export default ProjectsServiceVarientCustomView;
import { CaretDownOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, InputNumber, Select } from "antd";
import React, { Component } from "react";
import { getLaborGroup } from "../../../../../Controller/api/labourServices";
import { addLaborChild, deleteBackendPricing, getLineItemPricingById, updatePricingRow } from "../../../../../Controller/api/lineItemsServices";
import { handleError } from "../../../../../Controller/Global";
import { FLEET_GROUP, formatMoney, formatPrice, LABOR, SUPPLY_GROUP } from "../../../../../Controller/utils";
import { Image as Images } from "../../../../Images";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import {debounce} from "lodash";
import GeneratePriceForm from "./GeneratePriceForm";

const {Option, OptGroup} = Select;

class PricingTableNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
    rows: [],
    groups: [],
    selectedWageType: null,
    visibleWageTypeConfirmation: false
  }
}

static getDerivedStateFromProps(props) {
  return {rows: props.rows}
}

async componentDidMount() {
  const {rows, view} = this.props;
  if(!view) {
    await this.props.getBackendPricing();
    this.fetchGroup();
  }
  this.setState({rows})
}

componentDidUpdate(prevProps, prevState) {
  if(prevState.margin != this.state.margin) {
     this.setState({rows: this.props.rows})
  }
}


handleGroupChange = (e, item) => {
  let params = {
    group: e.value
  }
  this.updateTableRow(item.id, params)
}


  handleAddMore = (item) => {
    const params = {
      parent: item.parent ? item.parent : item.id,
      type: 'LABOR_CHILD',
    }
    addLaborChild(params).then(res => {
      this.setState({rows: res.data}, () => {
        this.props.getBackendPricing()
      })
    }).catch(err => {
      handleError(err)
    })
  }

  getUpdatedPricing = id => {
    getLineItemPricingById(id).then(res => {
      this.props.setSelectedPricing(res.data)
    }).catch(err => {
      handleError(err)
    })
  }

  handleChangeName = (value, item, parent) => {
    // console.log(value)  
    // const foundIndex = parent.children.findIndex(n => n.id === item.id);
    // let rows = [...this.state.rows];
    // // parent.children[foundIndex] = {...item, name: value}
    // let parent = {
    //   ...parent,
    //   children: 
    // }
    // console.log(rows);
    // this.setState({rows});
    if (value === "delete_row") {
      this.wageTypeModalHandler(true, item);
    }
    else {
    let params = {
      name: value
    }
    this.updateTableRow(item.id, params)
  }
  }

  handleChangeUom = (e, item) => {
    const selectedValArr = typeof(e.value) === 'string' && e.value.split('_');
    console.log(selectedValArr, "dsdsf");
    let params = {
      uom: e.value == "select" ? null : selectedValArr.length > 0 ? selectedValArr[selectedValArr?.length - 1] : e.value,
      uom_type: e.value == "select" ? null : selectedValArr.length > 0 ? 'COM' : 'UOM'
    }
    // if(e.value != "select") {
     this.updateTableRow(item.id, params)
    // }
  }

  handleChangeDocument = (e,item) => {
    // console.log(e.value,item,"itemmmmmm")
    let params = {
      doc_type: e.value
    }
    if(e.value != "select") {
      this.updateTableRow(item.id, params)
    }
  }

  wageTypeModalHandler = (visibleWageTypeConfirmation, selectedWageType) => {
    this.setState({ visibleWageTypeConfirmation, selectedWageType });
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

  // debounceEvent = (...args) => {
  //   this.debouncedEvent = debounce(...args);
  //   return (e) => {
  //     e.persist();
  //     return this.debouncedEvent(e);
  //   };
  // };

  handleChangeQty = (e, item, parent) => {
    // console.log(value)  
    // const foundIndex = parent.children.findIndex(n => n.id === item.id);
    // let rows = [...this.state.rows];
    // // parent.children[foundIndex] = {...item, name: value}
    // let parent = {
    //   ...parent,
    //   children: 
    // }
    // console.log(rows);
    // this.setState({rows});
    let {value} = e.target
    let params = {
      qty: value
    }
    if(value != 0) { 
    this.updateTableRow(item.id, params)
    }
  }

  addNewRow = item => {
    return (
      <div className="custom-table-row custom-table-row-level-1 row mx-0">
        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color green-light-color-div">
          <div>Labor</div>
        </div>
        <div className="custom-table-cell-td custom-table-cell-td-2 green-light-color-div">
          <div className="name-info-div position-relative">
            <span className="rectangle-icon-div position-absolute">
              <img
                src={Images.rectangle_green_icon}
                alt=""
                className={"img-fluid"}
              />
            </span>
            <Button
              onClick={() => this.handleAddMore(item)}
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
        <div className="custom-table-cell-td custom-table-cell-td-8">
            <div>-</div>
         </div>
      </div>
    );
  }

    handleInventoryItem = (item, kit_child, kitRow) => {
      const {view} = this.props;
   return (
	<div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>Inventory Item</div>
            </div>
            <div
              className={
                `custom-table-cell-td custom-table-cell-td-2`
                 +
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
                <span style={kit_child && { paddingLeft: "30px"}}>
                  {item.name}
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
                {kit_child ? (
                  <span className="px-3 text-capitalize">
                    {item?.uom ? `${item?.uom?.name?.toLowerCase()} (${item?.uom?.symbol})` : "-"}
                  </span>
                ) : 
                (
                  <Form>
                    <Select
                      labelInValue
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
                      value={item.uom ?
                        (item.uom_type === 'COM' ?
                        {value: `COM_${item.uom?.id}`, label: `${item.uom.name} (${item.uom.abbreviation})`} 
                        :
                        {value: item.uom?.id, label: `${item.uom.name} (${item.uom.symbol})`})
                        : {value: "select", label: 'Select'}}
                    >
                      <Option value={"select"}>Select</Option>
                      {item?.inventory_uom?.map((opt) => (
                        <Option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.symbol})
                        </Option>
                      ))}
                      {item?.inventory_com?.map((opt) => {
                           const COM_ID = `COM_${opt.id}`;
                           return (
                          <Option key={COM_ID} value={COM_ID}>
                            {opt.name} ({opt.abbreviation})
                          </Option>
                           )
                      })}
                    </Select>
                  </Form>
                )}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5">
              <div className="editalble-form-data">
                <Form className="position-relative">
                  <InputNumber
                    // value={
                    //   (item.parent
                    //     ? item.quantity
                    //       ? item.quantity
                    //       : item.initQuantity
                    //     : item.hours) || 1
                    // }
                    value={item.qty}
                    disabled={item.parent ? true : view ? true : false}
                    // onChange={(e) => this.handleHoursChange(e, item)}
                    onBlur={value => this.handleChangeQty(value, item)}
                    // onChange={value => this.debounceEvent(this.handleChangeQty(value, item), 300)}
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
                {formatPrice(item?.cost)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{item?.margin}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>
                $
                {formatPrice(item?.price_unit)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>
                $
                {formatPrice(item?.total_price)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                -
              </div>
            </div>
          </div>
        );
    }
    handleFleetKit = (item, kit_child, kitRow) => {
      const {view} = this.props;
   return (
	<div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>Fleet Group</div>
            </div>
            <div
              className={
                `custom-table-cell-td custom-table-cell-td-2`
                 +
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
                <span style={kit_child && { paddingLeft: "30px"}}>
                  {item.name}
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
                {kit_child ? (
                  <span className="px-3 text-capitalize">
                    {item?.uom ? `${item?.uom?.name?.toLowerCase()} (${item?.uom?.symbol})` : "-"}
                  </span>
                ) : 
                (
                  <Form>
                    <Select
                      labelInValue
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
                      value={item.uom ?
                        (item.uom_type === 'COM' ?
                        {value: `COM_${item.uom?.id}`, label: `${item.uom.name} (${item.uom.abbreviation})`} 
                        :
                        {value: item.uom?.id, label: `${item.uom.name} (${item.uom.symbol})`})
                        : {value: "select", label: 'Select'}}
                    >
                      <Option value={"select"}>Select</Option>
                      {item?.inventory_uom?.map((opt) => (
                        <Option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.symbol})
                        </Option>
                      ))}
                      {item?.inventory_com?.map((opt) => {
                           const COM_ID = `COM_${opt.id}`;
                           return (
                          <Option key={COM_ID} value={COM_ID}>
                            {opt.name} ({opt.abbreviation})
                          </Option>
                           )
                      })}
                    </Select>
                  </Form>
                )}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-5">
              <div className="editalble-form-data">
                <Form className="position-relative">
                  <InputNumber
                    // value={
                    //   (item.parent
                    //     ? item.quantity
                    //       ? item.quantity
                    //       : item.initQuantity
                    //     : item.hours) || 1
                    // }
                    value={item.qty}
                    disabled={item.parent ? true : view ? true : false}
                    // onChange={(e) => this.handleHoursChange(e, item)}
                    onBlur={value => this.handleChangeQty(value, item)}
                    // onChange={value => this.debounceEvent(this.handleChangeQty(value, item), 300)}
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
                {formatPrice(item?.cost)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{item?.margin}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                $
                {formatPrice(item?.price_unit)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                $
                {formatPrice(item?.total_price)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>
                -
              </div>
            </div>
          </div>
        );
    }
    laborChild = (item, parent, nextRow) => {
      const {view} = this.props
        return (
          <>
            <div
              className={`custom-table-row custom-table-row-level-1 row mx-0 ${
                this.props.view && "view-dropdowns-tbl"
              }`}
            >
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>Labor</div>
              </div>
              <div
                className={
                  `custom-table-cell-td custom-table-cell-td-2 custom-table-cell-td-name-info pr-lg-0  
                  ${!nextRow ? " last-child " : ""}`}
              >
                <div
                  className={`editalble-form-data
                    ${this.props.view && "caret-arrow-hide"}`}
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
                      value={item.name || "select"}
                      disabled={view}
                      onChange={e => this.handleChangeName(e, item, parent)}
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
                          value: item.group?.id,
                          label: item.group?.labor_group_name,
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
                      onChange={(e) => this.handleGroupChange(e, item)}
                      placeholder={"Search"}
                    >
                      {this.state.groups.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.labor_group_name}
                        </Option>
                      ))}
                    </Select>
                    {/* {!item.type_id && (
                      <Button className="bg-transparent position-absolute border-0 shadow-none p-0 search-btn-icon">
                        <SearchOutlined />
                      </Button>
                    )} */}
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
                      value={item.qty || 1}
                      disabled={view}
                      onBlur={value => this.handleChangeQty(value, item)}
                      // onChange={value => this.debounceEvent(this.handleChangeQty(value, item), 300)}
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
                {/* {newItem?.table_data && item.time ? (
                  <div>${laborCalculations(newItem, item.time, item.name)}</div>
                ) : (
                  0
                )} */}
                {`$${formatPrice(item?.cost) || 0.00}`}
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                <div>{item.margin}%</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                {`$${formatPrice(item?.price_unit) || 0.00}`}
                {/* {newItem?.table_data && item.time ? (
                  <div>
                    $
                    {calculatePercentage(
                      laborCalculations(newItem, item.time, item.name),
                      margin
                    )}
                  </div>
                ) : (
                  0
                )} */}
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                {`$${formatPrice(item?.total_price) || 0.00}`}
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
                    <div>-</div>
                    </div>
            </div>
          </>
        );
    }
    
    renderRow = (item) => {
      const {view} = this.props;
        switch(item.type) {
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
                    <div className="custom-table-cell-td custom-table-cell-td-8">
                    <div>-</div>
                    </div>

                  </div>
                  {item?.children?.map((n, index) => {
                    let nextRow = item.children.length > index + 1;
                    return (
                      this.laborChild(n, item, nextRow)
                     )
                  })}
                  {!item.children && !view &&
                   this.addNewRow(item)}
                  {
                  item?.children?.map((i, index) => {
                    if(item.children.length === (index + 1) && !view) {
                    return (
                            this.addNewRow(i)
                    )
                    }
                  })}
                </>
              );
        case FLEET_GROUP:
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>Fleet Group</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2">
              <div>{item.name}</div>
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
                    value={item.qty || 1}
                    disabled={view}
                    onBlur={value => this.handleChangeQty(value, item)}
                    placeholder={0}
                  />
                  <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                    <EditOutlined />
                  </Button>
                </Form>
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-6">
              <div>${formatPrice(item?.cost)}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{item?.margin || 0}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>
                ${formatPrice(item?.price_unit)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>
                $
                {formatPrice(item?.total_price)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>-</div>
            </div>
          </div>
        );
        case SUPPLY_GROUP:
        return (
          <div className="custom-table-row custom-table-row-level-1 row mx-0">
            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
              <div>Supply Group</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-2">
              <div>{item.name}</div>
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
                    value={item.qty || 1}
                    disabled={view}
                    // onChange={(e) => this.handleHoursChange(e, item)}
                    onBlur={e => this.handleChangeQty(e, item)}
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
              <div>${formatPrice(item?.cost)}</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>{item.margin || 0}%</div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>
                ${formatPrice(item?.price_unit)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-7">
              {/* {console.log(supplyCalculation(item.data))} */}
              <div>
                ${formatPrice(item?.total_price)}
              </div>
            </div>
            <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>-</div>
            </div>
          </div>
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
                    {/* <span className="rectangle-icon-div position-absolute">
                       <img src={Images.rectangle_gray_icon} alt="" className={"img-fluid"}/>
                    </span> */}
                    <span>{`${item.disposal_code || ""} ${item?.disposal_code ? '-' : ''} ${item.name}`}</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-3">
                  <div className="editalble-form-data d-flex align-items-center">
                    <span className="px-3">-</span>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-3">
                  <div className="editalble-form-data editalble-form-data-select d-flex align-items-center blank-red">
                    <Form className="position-relative">
                      <Select
                        labelInValue
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
                        value={item?.facility_type === "WAREHOUSE" ? 
                          {value: item?.facility_id?.id, label: item?.facility_id?.internal_location.name}
                          : 
                          item?.facility_type === "VENDOR" ?
                          {value: item?.facility_id?.id, label: item?.facility_id?.vendor.name}
                          : undefined
                          // item?.selectedVendorLocation
                          //   ? item?.selectedVendorLocation
                          //   : null
                        }
                      >
                        <OptGroup label="Warehouses">
                          {item?.warehouse.map((i) => {
                            return (
                              <Option value={i.id}>
                                {i.internal_location.name}
                              </Option>
                            );
                          })}
                        </OptGroup>
                        <OptGroup label="Vendors">
                          {item?.vendor.map((i) => {
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
                        labelInValue
                        suffixIcon={
                          <img
                            src={Images.caret_down_small_select}
                            alt=""
                            className="img-fluid"
                          />
                        }
                        disabled={view}
                        onChange={(e) => this.handleChangeUom(e, item)}
                        // value={
                        //   item.uom
                        //     ? item.uom
                        //     : item.uom?.id
                        //     ? item.data?.uom?.id
                        //     : "select"
                        // }
                        value={item.uom ?
                          (item.uom_type === 'COM' ?
                          {value: `COM_${item.uom?.id}`, label: `${item.uom.name} (${item.uom.abbreviation})`} 
                          :
                          {value: item.uom?.id, label: `${item.uom.name} (${item.uom.symbol})`})
                          : {value: "select", label: 'Select'}}
                        placeholder={"Please Select"}
                        // defaultValue={'select'}
                      >
                       
                        <Option value={"select"}>Select</Option>
                        {/* {console.log(item?.data?.uom_array, "hjdfgsdjhfgjdhsfg")} */}
                        {item?.disposal_uom?.map((opt) => (
                          <Option key={opt.id} value={opt.id}>
                            {opt.name} ({opt.symbol})
                          </Option>
                        ))}
                         {item?.disposal_com?.map((opt) => {
                           const COM_ID = `COM_${opt.id}`;
                           return (
                          <Option key={COM_ID} value={COM_ID}>
                            {opt.name} ({opt.abbreviation})
                          </Option>
                           )
                        })}
                      </Select>
                    </Form>
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-5">
                  <div className="editalble-form-data">
                    <Form className="position-relative">
                      <InputNumber
                        value={item.qty || 1}
                        disabled={view}
                        // onChange={(e) => this.handleHoursChange(e, item)}
                        onBlur={value => this.handleChangeQty(value, item)}
                        // onChange={value => this.debounceEvent(this.handleChangeQty(value, item), 300)}
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
                  <div>${formatPrice(item?.cost) || "-"}</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>{item?.margin || "-"}%</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>
                    $
                    {formatPrice(item?.price_unit) || "-"}
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>
                    $
                    {formatPrice(item?.total_price) || "-"}
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-4 px-0">
                  <div className="editalble-form-data editalble-form-data-select d-flex align-items-center blank-red">
                    <Form className="position-relative">
                      <Select
                        labelInValue
                        suffixIcon={
                          <img
                            src={Images.caret_down_small_select}
                            alt=""
                            className="img-fluid"
                          />
                        }
                        disabled={view}
                        onChange={(e) => this.handleChangeDocument(e, item)}
                        value={ item.doc_type ? 
                          ({value: item.doc_type ,label: `${item.doc_type === "BILL_OF_LADING" ? "Bill of Lading" : item.doc_type === "NEITHER" ? "Neither" :"Manifest" }`} )
                          : null}
                        placeholder={"Select"}
                      >
                        {/* <Option value={"select"}>Select</Option> */}
                          <Option value={"MANIFEST"}>Manifest</Option>
                          <Option value={"BILL_OF_LADING"}>Bill of Lading</Option>
                          <Option value={"NEITHER"}>Neither</Option>
                        {/* ))} */}
                      </Select>
                    </Form>
                  </div>
                </div>
              </div>
            </>
          );

          case "INVENTORY_ITEM":
        // console.log(item, "inventory-item")
        return (
                  this.handleInventoryItem(item)
        );
        case "INVENTORY_KIT": 
        return (
          <>
            <div className="custom-table-row custom-table-row-level-1 row mx-0">
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>Inventory Kit</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-2">
                <div>{item.name}</div>
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
                  {/* <Form className="position-relative">
                    <InputNumber
                      value={item.qty}
                      disabled={view}
                      // onChange={(e) => this.handleHoursChange(e, item)}
                      placeholder={0}
                    />
                    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                      <EditOutlined />
                    </Button>
                  </Form> */}
                  <span className="px-3">-</span>
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
              <div className="custom-table-cell-td custom-table-cell-td-8">
              <div>-</div>
            </div>
              </div>
              {item?.children?.map((n, index) => {
                let kitRow = item.children.length > index + 1;
                return this.handleInventoryItem(n, true, kitRow)
              })}
            </>
          )
        //   case "FLEET_GROUP":
        // // console.log(item, "inventory-item")
        // return (
        //           this.handleFleetKit(item)
        // );
        case "FLEET_KIT" : 
        return (
          <>
            <div className="custom-table-row custom-table-row-level-1 row mx-0">
              <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color">
                <div>Fleet Kit</div>
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-2">
              <div className="d-flex align-items-center"> 
                <div>{item.name}</div>
                </div>
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
              <div className="custom-table-cell-td custom-table-cell-td-6">
                
                  {/* <Form className="position-relative">
                    <InputNumber
                      value={item.qty}
                      disabled={view}
                      // onChange={(e) => this.handleHoursChange(e, item)}
                      placeholder={0}
                    />
                    <Button className="bg-transparent position-absolute border-0 shadow-none p-0 pencil-btn-edit">
                      <EditOutlined />
                    </Button>
                  </Form> */}
                  <span className="px-3">{item.qty}</span>
                
              </div>
              <div className="custom-table-cell-td custom-table-cell-td-6">
                  <div>${formatPrice(item?.cost) || "-"}</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>{item?.margin || "-"}%</div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>
                    $
                    {formatPrice(item?.price_unit) || "-"}
                  </div>
                </div>
                <div className="custom-table-cell-td custom-table-cell-td-7">
                  <div>
                    $
                    {formatPrice(item?.total_price) || "-"}
                  </div>
                </div>
              <div className="custom-table-cell-td custom-table-cell-td-7">
              <div>-</div>
            </div>
              </div>
              {item?.children?.map((n, index) => {
                let fleetKit = item.children.length > index + 1;
                return this.handleFleetKit(n, true, fleetKit)
              })}
            </>
          )
        }
    }

    handleVendorLocationChange = (e, item) => {
      let newArr = [...item.vendor, ...item.warehouse];
      let foundItem = newArr.find(i => i.id === e.value);
      let type = foundItem.vendor ? 'VENDOR' : 'WAREHOUSE';
      const params = {
          facility_id: e.value,
          facility_type: type
      }
      this.updateTableRow(item.id, params)
    }

    updateTableRow = (id, params) => {
      updatePricingRow(id, params).then(res => {
        this.props.getBackendPricing()
        this.getUpdatedPricing(this.props?.selectedPricing?.id)
        // this.setState({rows: res.data})
      }).catch(err => {
        handleError(err)
      })
    }

    render() {
        const {selectedPricing} = this.props;
        const {rows} = this.state;
        return (   
            <>
            <div className="col-12 table-responsive main-table-div position-relative">
          <div className="row mx-0 custom-table-main-row custom-table-header1 custom-update-table service-variant-update">
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
                <div className="custom-table-cell-th custom-table-cell-th-9">
                  <div className="custom-th-heading">Document</div>
                </div>
              </div>
            </div>
            <div className="col-12 custom-table-body p-0">
                {rows.map((i, index) => {
                    return (
                        this.renderRow(i)
                    )
                })}
            </div>
            </div>
            </div>
            <CommonWarningModal
          visible={this.state.visibleWageTypeConfirmation}
          onClose={() => {
            // let rows = [...this.state.rows].map((r) => {
            //   if (
            //     r.id === this.state.selectedWageType.id &&
            //     this.state.selectedWageType.item_type === "labor_child"
            //   ) {
            //     return { ...r, time: r.time || "select" };
            //   } else {
            //     return { ...r };
            //   }
            // });
            this.setState({ visibleWageTypeConfirmation: false });
          }}
          deleteWageType
          updateAfterDltdWageType={() => {
            const {selectedWageType} = this.state;
            deleteBackendPricing(selectedWageType.id).then(() => {
              this.props.getBackendPricing();
            }).catch(err => {
              handleError(err)
            }).finally(() => {
              this.setState({visibleWageTypeConfirmation: false})
            })
          }}
          heading={"Are you sure you want to delete this wage type?"}
          subHeadingUOM={
            "If you choose to delete this wage type, your data will disappear."
          }
        />
         {this.props.formPrice && (
          <GeneratePriceForm
            selectedPricing={selectedPricing}
            // totalPrice={selectedPricing?.daily_price}
            // hourPrice={selectedPricing?.hourly_price}
            // suggested_daily_price={selectedPricing?.suggested_daily_price}
            // suggested_hourly_price={selectedPricing?.suggested_hourly_price}
              newFunc={this.props.newFunc}
            //   newPrice={this.props.newPrice}
          />
        )}
            </>
        )
    }
}

export default PricingTableNew;

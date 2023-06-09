import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import { getInventoryKitItem } from "../../../../../Controller/api/inventoryServices";
import {
  calculatePercentage,
  formatMoney,
} from "../../../../../Controller/utils";
import { handleError } from "../../../../../Controller/Global";

class InventoryKitsItemsView extends Component {
  state = {
    items: [],
  };

  componentDidMount() {
    this.fetchKits();
  }

  fetchKits = (params = {}) => {
    getInventoryKitItem({ ...params, kit: this.props.match.params.id })
      .then((res) => {
        this.setState({ items: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { items } = this.state;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            this.props.editBtn ? "custom-summary no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12">
            <div
              className={`row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
                this.props.editBtn ? "design-update-bar" : ""
              }`}
            >
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
                  <Input
                    onChange={(e) => this.fetchKits({ search: e.target.value })}
                    placeholder="Search"
                  />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              <ul className="mb-0 list-inline">
                <li className="list-inline-item">
                  {this.props.editBtn ? null : (
                    <Button
                      className="view-all-btn text-uppercase"
                      onClick={this.props.onTabChange}
                    >
                      VIEW ALL{" "}
                    </Button>
                  )}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 pb-3">
            <div className="row mx-0 sub-total-row">
              <div className="col-2">
                <h6 className="mb-0">Subtotal</h6>
              </div>
              <div className="col-2">
                <h6 className="mb-0">
                  $
                  {items
                    .reduce(
                      (p, i) =>
                        p +
                        parseFloat(
                          calculatePercentage(
                            i.item?.unit_cost * i.quantity,
                            i.item?.margin || 0
                          )
                        ),
                      0
                    )
                    .toFixed(2)}
                </h6>
              </div>
            </div>
            {items.length > 0 ?
              <div className="col-12 table-responsive main-table-div position-relative wage-table">
              <div className="row mx-0 custom-table-main-row custom-table-main-row-wage-info-main inventory-items-table">
                <div className="col-12 custom-table-change table-change-inventoryKit">
                  <div className="row mx-0">
                    <div className="col-12">
                      <div className="row custom-table-header">
                        <div className="custom-table-cell-th custom-table-cell-th-1">
                          <div className="custom-th-heading">TYPE</div>
                        </div>
                        <div className="custom-table-cell-th custom-table-cell-th-2">
                          <div className="custom-th-heading">Name / Info</div>
                        </div>
                        <div className="custom-table-cell-th custom-table-cell-th-3">
                          <div className="custom-th-heading">UOM</div>
                        </div>
                        <div className="custom-table-cell-th custom-table-cell-th-4">
                          <div className="custom-th-heading">QTY</div>
                        </div>
                        <div className="custom-table-cell-th custom-table-cell-th-5">
                          <div className="custom-th-heading">
                            Price <br />
                            Per Unit
                          </div>
                        </div>
                        <div className="custom-table-cell-th custom-table-cell-th-6">
                          <div className="custom-th-heading">Price</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 custom-table-body p-0">
                      <div className="custom-table-row custom-table-row-level-1 row mx-0">
                        <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                          <div className="px-3">Inventory Kit</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-2">
                          {/* <span>Filter Replacment Kit</span> */}
                          <span>{this.props?.kit?.name}</span>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-3 gray-2-color">
                          {/* <div className="px-3">pieces (pc)</div> */}
                          <div className="px-3">{`${this.props?.kit?.unit?.name}(${this.props?.kit?.unit?.symbol})`}</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-4">
                          <div>1</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start">
                          <div className="px-3"> -</div>
                        </div>
                        <div className="custom-table-cell-td custom-table-cell-td-6 justify-content-start">
                          <div className="pr-2"> 
                  {items
                    .reduce(
                      (p, i) =>
                        p +
                        parseFloat(
                          calculatePercentage(
                            i.item?.unit_cost * i.quantity,
                            i.item?.margin || 0
                          )
                        ),
                      0
                    )
                    .toFixed(2)}</div>
                        </div>
                      </div>
                      {this.state.items.map((kitItem, idx) => {
                        const nextRowExist = this.state.items?.length > idx + 1;
                        // let nextRow = null
                        let last_elem = null;
                        if (!nextRowExist) {
                          // nextRow = this.state.rows[i + 1].item_type !== "labor_child"
                          last_elem = true;
                        }
                        return (
                          <div className="custom-table-row custom-table-row-level-1 row mx-0">
                            <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                              <div className="px-3">Inventory Item</div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-2">
                              <div className="name-info-div position-relative">
                                <span
                                  className={
                                    !last_elem
                                      ? "rectangle-icon-div position-absolute"
                                      : "rectangle-icon-div position-absolute remove-tree-bottom-line"
                                  }
                                >
                                  <img
                                    src={Images.rectangle_gray_icon}
                                    alt=""
                                    className={"img-fluid"}
                                  />
                                </span>
                                <span>{kitItem?.item?.name}</span>
                              </div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-3">
                              <div className="editalble-form-data uom-select-fixes px-3">
                                <span>
                                  {(kitItem?.uom
                                    ? kitItem?.uom?.name
                                    : kitItem?.item?.uom?.name) || "-"}
                                </span>
                                {/* <Form className="position-relative">
                                                                    <Select
                                                                        // value={'select'}
                                                                        // placeholder={"Please Select"}
                                                                        labelInValue
                                                                        placeholder="Select Option"
                                                                        onChange={(value) => { this.handleSelectChange(value, kitItem.id) }}
                                                                        defaultValue={kitItem?.uom ? {value: kitItem?.uom?.id, label: kitItem?.uom?.name} : {value: kitItem?.item?.uom?.id, label: kitItem?.item?.uom?.name}}
                                                                    >
                                                                        {/* <Option value="select">Select</Option>
                                                                        <Option value="a">pieces (pc)</Option>
                                                                        <Option value="b">pieces (pc)</Option>
                                                                        <Option value="c">pieces (pc)</Option>
                                                                        <Option value="d">pieces (pc)</Option>
                                                                        <Option value="e">pieces (pc)</Option>
                                                                        <Option value="f">pieces (pc)</Option> */}
                                {/* {Object.entries(UnitTypes).map((ut, index, arr) => {
                                                                            return (
                                                                                <OptGroup key={ut && ut[0] && ut[0]} value={ut && ut[0] && ut[0]} label={ut && ut[0] && ut[0]} className={"kit-uom-optgroup"}>
                                                                                    {ut && ut[1] && ut[1].map((u) => {
                                                                                        return <Option key={u.id} value={u.id} className="text-lowercase">{u.name}</Option>
                                                                                    })}
                                                                                </OptGroup>
                                                                            )
                                                                        })}
                                                                        {kitItem?.item?.uom_array?.map(i => {
                                                                            return (
                                                                                <Option key={i.id}
                                                                                    value={i.id}>{i.name} ({i.symbol})</Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    <Button
                                                                        className="bg-transparent position-absolute border-0 shadow-none p-0 search-btn-icon">
                                                                        <CaretDownOutlined />
                                                                    </Button>
                                                                </Form> */}
                              </div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-4">
                              <div className="editalble-form-data">
                                {/* <Form className="position-relative">
                                                                    <InputNumber placeholder={'0'} onChange={(v) => this.updateKitQuantity(v, kitItem?.id)} defaultValue={kitItem?.quantity} />
                                                                </Form> */}
                                <span>{kitItem?.quantity || 1}</span>
                              </div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-5 justify-content-start">
                              {/* <div className="px-3">$2.04</div> */}
                              <div className="px-3">
                                {calculatePercentage(
                                  kitItem?.item?.unit_cost,
                                  kitItem?.item?.margin || 0
                                )}
                              </div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-6 position-relative justify-content-start">
                              {/* <div className="pr-2">$2.04</div> */}
                              <div className="pr-2">
                                {(calculatePercentage(
                                  kitItem?.item?.unit_cost,
                                  kitItem?.item?.margin || 0
                                ) * (kitItem?.quantity || 1)).toFixed(2)}
                              </div>
                              {/* <Dropdown overlayClassName='inventory-kit-dropdown' overlay={() => this.menu(kitItem.id)}
                                                                trigger={['click']}>
                                                                <a className="ant-dropdown-link dropdown-row-a"
                                                                    onClick={e => e.preventDefault()}>
                                                                    <img src={Images.eva_more_elisis} alt={""}
                                                                        className="img-fluid" />
                                                                </a>
                                                            </Dropdown> */}
                            </div>
                          </div>
                        );
                      })}
                      {/* <div className="custom-table-row custom-table-row-level-1 row mx-0">
                                                <div className="custom-table-cell-td custom-table-cell-td-1 gray-2-color background-white-div">
                                                    <div className="px-3">Inventory Kit</div>
                                                </div>
                                                <div className="custom-table-cell-td custom-table-cell-td-2">
                                                    <div className="name-info-div position-relative">
                                                        <span className="rectangle-icon-div position-absolute">
                                                            <img src={Images.rectangle_gray_icon} alt=""
                                                                className={"img-fluid"} />
                                                        </span>
                                                        <span>Coolant</span>
                                                    </div>
                                                </div>
                                                <div className="custom-table-cell-td custom-table-cell-td-3 bg-white">
                                                    <div className="editalble-form-data">
                                                        <Form className="position-relative">
                                                            <Select value={'select'}
                                                                placeholder={"Please Select"}>
                                                                <Option value="select">Select</Option>
                                                                <Option value="a">pieces (pc)</Option>
                                                                <Option value="b">pieces (pc)</Option>
                                                                <Option value="c">pieces (pc)</Option>
                                                                <Option value="d">pieces (pc)</Option>
                                                                <Option value="e">pieces (pc)</Option>
                                                                <Option value="f">pieces (pc)</Option>
                                                            </Select>
                                                            <Button
                                                                className="bg-transparent position-absolute border-0 shadow-none p-0 search-btn-icon">
                                                                <CaretDownOutlined />
                                                            </Button>
                                                        </Form>
                                                    </div>
                                                </div>
                                                <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div">
                                                    <div className="editalble-form-data">
                                                        <Form className="position-relative">
                                                            <InputNumber placeholder={'0'} />
                                                        </Form>
                                                    </div>
                                                </div>
                                                <div className="custom-table-cell-td custom-table-cell-td-5">
                                                    <div className="px-3">$2.04</div>
                                                </div>
                                                <div className="custom-table-cell-td custom-table-cell-td-6 position-relative pr-4">
                                                    <div className="pr-2">$2.04</div>
                                                    <Dropdown overlayClassName='inventory-kit-dropdown' overlay={() => this.menu()}
                                                        trigger={['click']}>
                                                        <a className="ant-dropdown-link dropdown-row-a"
                                                            onClick={e => e.preventDefault()}>
                                                            <img src={Images.eva_more_elisis} alt={""}
                                                                className="img-fluid" />
                                                        </a>
                                                    </Dropdown>
                                                </div>
                                            </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
                :
              <div className="row mt-3 mx-0 no-data-card-row align-items-center justify-content-center">
                 <div className="col-12 text-center cursor-pointer">
                     <img src={Images.inventory_item_empty} alt="" className="img-fluid"/>
                     <h6 className="mb-0 text-gray-tag">No Inventory Items</h6>
                 </div>
              </div>
            }
            {/* {items.length > 0 ?
                        <div className="row mt-2">
                            {items && items.map(i => {
                                const uom = i?.uom ? i.uom : i.item.uom;
                                return (
                                    <div className="col-12 col-sm-6" key={i.id}>
                                        <div
                                            className="row mx-0 add-vehicles-main-row align-items-center position-relative">
                                            <div className="add-vehicles-img float-left">
                                                <img src={Images.inventory_green_box_icons} alt={""}
                                                     className="img-fluid"/>
                                            </div>
                                            <div
                                                className="add-vehicles-content d-flex align-items-center justify-content-between float-left">
                                                <div>
                                                    <h6>
                                                        {i.item.name}
                                                    </h6>

                                                    <p className="mb-0">
                                                        {`UOM: ${uom?.symbol || "-"} , QTY: ${i.quantity}`}
                                                    </p>

                                                </div>
                                                <div>
                                                    <h6>Total: $
                                                        {parseFloat(calculatePercentage(i.item?.unit_cost * i.quantity, i.item?.margin || 0)).toFixed(2) || 0.00}
                                                    </h6>
                                                    <p className="mb-0 text-right">
                                                        {formatMoney(calculatePercentage(i.item?.unit_cost, i.item?.margin || 0) || "0.00")} / {uom?.symbol || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div> */}
            {/* :
                        <div className="row mt-3 mx-0 no-data-card-row align-items-center justify-content-center">
                           <div className="col-12 text-center cursor-pointer">
                               <img src={Images.inventory_item_empty} alt="" className="img-fluid"/>
                               <h6 className="mb-0 text-gray-tag">No Inventory Items</h6>
                           </div>
                        </div>
                        } */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(InventoryKitsItemsView);

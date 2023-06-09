import React, { Component } from "react";
import {
  Breadcrumb,
  Button,
  Collapse,
  Dropdown,
  Form,
  InputNumber,
  Menu,
  message,
  Select,
  Spin,
  Table,
} from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import {
  createInventoryKitItem,
  deleteInventoryKitItem,
  getInventoryKitItem,
  getInventoryPackageItem,
  updateInventoryKitItem,
} from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";
import { debounce } from "lodash";
import {
  formatMoney,
  calculatePercentage,
  getPercentedValue,
  parseMoney,
} from "../../../../../Controller/utils";
import {
  CaretDownOutlined,
  CaretRightOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { getSubUnitName } from "../../../../../Controller/api/disposalServices";
import DeleteItemModal from "../../../../modals/DeleteItemModal";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option, OptGroup } = Select;

// var last_elem = false;

class InventoryKitsCreate extends Component {
  state = {
    kitItems: [],
    inventory: [],
    fetching: false,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
    uom: [],
    removeVisible: false,
    deleteID: null,
    last_elem: false,
  };
  formRef = React.createRef();

  getKitItems = () => {
    getInventoryKitItem({ kit: this.props.kit.id })
      .then((res) => {
        this.setState({ kitItems: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  updateKitQuantity = debounce((quantity, id) => {
    updateInventoryKitItem(id, { quantity: quantity || 1 })
      .then((res) => {
        this.getKitItems();
      })
      .catch((err) => {
        handleError(err);
      });
    }, 400)

  handleSelectChange = debounce((select, id) => {
    updateInventoryKitItem(id, { uom: select.value })
      .then((res) => {
        this.getKitItems();
      })
      .catch((err) => {
        handleError(err);
      });
  }, 400);

  getItems = (params = {}) => {
    getInventoryPackageItem({...params, tier_type: 'INVENTORY_ITEM'})
      .then((res) => {
        this.setState({
          inventory: res.data.results.filter((p) => p.children.length === 0),
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSelect = (id) => {
    this.formRef.current.resetFields();
    const {kitItems} = this.state;
    const foundItem = kitItems.find(i => i.item.id == id);
    if(foundItem) {
      message.error('Inventory Item added already!')
    }
    else {
    let data = {
      item: id,
      kit: this.props.kit.id,
    };
    createInventoryKitItem(data)
      .then((res) => {
        this.getKitItems();
      })
      .catch((err) => {handleError(err)});
    }
  };

  handleDeleteKitItem = (id) => {
    this.showRemoveModal(false);
    deleteInventoryKitItem(id)
      .then((res) => {
        this.getKitItems();
        this.showRemoveModal(false);
      })
      .catch((err) => {
        handleError(err);
        this.showRemoveModal(false);
      });
  };

  removeKitItem = (id) => {
    this.setState({ deleteID: id }, this.showRemoveModal(true));
    // deleteInventoryKitItem(id).then(res => {
    //     this.getKitItems()
    // }).catch(err => {
    //     handleError(err)
    // })
  };
  getSubunits = () => {
    getSubUnitName()
      .then((res) => {
        this.setState({ uom: res.data });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  showRemoveModal = (visible) => {
    this.setState({ removeVisible: visible });
  };

  componentDidMount() {
    this.getKitItems();
    this.getSubunits();
  }

  menu = (id) => {
    return (
      <Menu>
        <Menu.Item key="0">
          <a onClick={() => this.removeKitItem(id)} href="#">
            Remove
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  showMsg = () => {
    message.success("Inventory kit updated successfully!");
  };

  render() {
    const { fetching, kitItems, inventory } = this.state;
    const UnitTypes = {};

    this.state.uom.forEach((item) => {
      if (!UnitTypes[item.unit_type.name]) {
        UnitTypes[item.unit_type.name] = [];
      }
      UnitTypes[item.unit_type.name].push(item);
    });
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      Please add all the inventory items belong to this kit.
                    </h6>
                  </div>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="item"
                    label={
                      <div className="d-flex align-items-center">
                        <span>Inventory Items</span>
                      </div>
                    }
                    className="position-relative"
                  >
                    <Select
                      showSearch={true}
                      placeholder="Search"
                      className={"custom-search-select"}
                      dropdownClassName={"custom-search-select"}
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.getItems()}
                      onSearch={(e) => this.getItems({ search: e , tier_type:"INVENTORY_ITEM"})}
                      onChange={this.handleSelect}
                    >
                      {/*{inventory.map(d => (
                                                <Option key={d.id}
                                                        value={d.id}>{d.name}</Option>
                                            ))}*/}

                      {this.state.inventory.map((item, index) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            <div className="row custom-tree-row custom-tree-row-1 mx-0">
                              <div
                                className="common-select-option-row col-12"
                                style={{ paddingRight: "5%" }}
                              >
                                <div
                                  style={{
                                    width: "40px",
                                  }}
                                  className="float-left"
                                >
                                  <img
                                    style={{
                                      height: "30px",
                                    }}
                                    src={Images.inventory_green_single}
                                    alt={""}
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="float-left warehouse-select-box">
                                  <h6 className="mb-0 w-100 d-inline-block">
                                    {item.name}
                                  </h6>
                                  <Breadcrumb
                                    separator={
                                      <img
                                        src={Images.arrow_small_breadcrumb}
                                        alt={""}
                                        className="img-fluid"
                                      />
                                    }
                                  >
                                    {item.breadcrumb.map((b, i) => {
                                      return (
                                        <Breadcrumb.Item key={b}>
                                          <a href={"#"}>{b}</a>
                                        </Breadcrumb.Item>
                                      );
                                    })}
                                    <Breadcrumb.Item>
                                      {item.name}
                                    </Breadcrumb.Item>
                                    {/* <Breadcrumb.Item key={1}>
                                                                    <a href={'#'}>Nail</a>
                                                                </Breadcrumb.Item>
                                                                <Breadcrumb.Item key={2}>
                                                                    <a href={'#'}>Wood Nails</a>
                                                                </Breadcrumb.Item>
                                                                <Breadcrumb.Item>
                                                                    4” Nail
                                                                </Breadcrumb.Item> */}
                                  </Breadcrumb>
                                </div>
                                <div
                                  style={{
                                    paddingTop: "15px",
                                    display: "inline-block",
                                  }}
                                  className="text-green-tag text-center select-text-tier"
                                >
                                  Inventory Item
                                </div>
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                      {/* <Option key={2}
                                                    value={'a'}>
                                                <div
                                                    className="row custom-tree-row custom-tree-row-1 mx-0">
                                                    <div className="common-select-option-row col-12">
                                                        <div style={{
                                                            width: '40px'
                                                        }} className="float-left">
                                                            <img style={{
                                                                height: '30px'
                                                            }} src={Images.inventory_green_single} alt={""}
                                                                 className="img-fluid"/>
                                                        </div>
                                                        <div className="float-left warehouse-select-box">
                                                            <h6 className="mb-0 w-100 d-inline-block">4” Nail</h6>
                                                            <Breadcrumb separator={
                                                                <img src={Images.arrow_small_breadcrumb} alt={""}
                                                                     className="img-fluid"/>
                                                            }>
                                                                <Breadcrumb.Item key={1}>
                                                                    <a href={'#'}>Nail</a>
                                                                </Breadcrumb.Item>
                                                                <Breadcrumb.Item key={2}>
                                                                    <a href={'#'}>Wood Nails</a>
                                                                </Breadcrumb.Item>
                                                                <Breadcrumb.Item>
                                                                    4” Nail
                                                                </Breadcrumb.Item>
                                                            </Breadcrumb>
                                                        </div>
                                                        <div
                                                            style={{
                                                                paddingTop: '15px',
                                                                display: 'inline-block'
                                                            }}
                                                            className="text-green-tag text-center select-text-tier">
                                                            Inventory Item
                                                        </div>
                                                    </div>
                                                </div>
                                            </Option> */}
                    </Select>
                  </Form.Item>
                  <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                    <img
                      src={Images.search_small_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </Button>
                </div>

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
                              <div className="custom-th-heading">
                                Name / Info
                              </div>
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
                            <div className="custom-table-cell-td custom-table-cell-td-3">
                              {/* <div className="px-3">pieces (pc)</div> */}
                              <div className="px-3">{`${this.props?.kit?.unit?.name}(${this.props?.kit?.unit?.symbol})`}</div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-4">
                              <div> 1</div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-5">
                              <div className="px-3"> -</div>
                            </div>
                            <div className="custom-table-cell-td custom-table-cell-td-6 pr-4">
                              <div className="pr-2"> {`$ ${
                    kitItems
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
                    .toFixed(2)}`}</div>
                            </div>
                          </div>
                          {this.state.kitItems.map((kitItem, idx) => {
                            const nextRowExist =
                              this.state.kitItems?.length > idx + 1;
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
                                <div className="custom-table-cell-td custom-table-cell-td-3 bg-white">
                                  <div className="editalble-form-data uom-select-fixes">
                                    <Form className="position-relative">
                                      <Select
                                        // value={'select'}
                                        // placeholder={"Please Select"}
                                        labelInValue
                                        placeholder="Select Option"
                                        onChange={(value) => {
                                          this.handleSelectChange(
                                            value,
                                            kitItem.id
                                          );
                                        }}
                                        defaultValue={
                                          kitItem?.uom
                                            ? {
                                                value: kitItem?.uom?.id,
                                                label: kitItem?.uom?.name,
                                              }
                                            : {
                                                value: kitItem?.item?.uom?.id,
                                                label: kitItem?.item?.uom?.name,
                                              }
                                        }
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
                                                                                })} */}
                                        {kitItem?.item?.uom_array?.map((i) => {
                                          return (
                                            <Option key={i.id} value={i.id}>
                                              {i.name} ({i.symbol})
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                      <Button className="bg-transparent position-absolute border-0 shadow-none p-0 search-btn-icon">
                                        <CaretDownOutlined />
                                      </Button>
                                    </Form>
                                  </div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-4 background-white-div">
                                  <div className="editalble-form-data">
                                    <Form className="position-relative">
                                      <InputNumber
                                        // placeholder={"0"}
                                        onChange={(v) =>
                                          this.updateKitQuantity(v, kitItem?.id)
                                        }
                                        value={kitItem?.quantity || 1}
                                      />
                                    </Form>
                                  </div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-5">
                                  {/* <div className="px-3">$2.04</div> */}
                                  <div className="px-3">
                                    {calculatePercentage(
                                      kitItem?.item?.unit_cost,
                                      kitItem?.item?.margin || 0
                                    )}
                                  </div>
                                </div>
                                <div className="custom-table-cell-td custom-table-cell-td-6 position-relative pr-4">
                                  {/* <div className="pr-2">$2.04</div> */}
                                  <div className="pr-2">
                                    {
                                    (calculatePercentage(
                                      kitItem?.item?.unit_cost,
                                      kitItem?.item?.margin || 0
                                    ) * kitItem?.quantity).toFixed(2)
                                    }
                                  </div>
                                  <Dropdown
                                    overlayClassName="inventory-kit-dropdown"
                                    overlay={() => this.menu(kitItem.id)}
                                    trigger={["click"]}
                                  >
                                    <a
                                      className="ant-dropdown-link dropdown-row-a"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <img
                                        src={Images.eva_more_elisis}
                                        alt={""}
                                        className="img-fluid"
                                      />
                                    </a>
                                  </Dropdown>
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
                  <p className="sub-total-text inventory-sub-total">Subtotal:
                  <span className="sub-total-amount">{`$ ${
                    kitItems
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
                    .toFixed(2)}`}</span></p>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="validate-btn-main"
                      onClick={this.showMsg}
                    >
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <DeleteItemModal
          okTtile={"Yes, I want to remove"}
          cancelText={"No, cancel this action"}
          okAction={() => {
            this.handleDeleteKitItem(this.state.deleteID);
          }}
          onClose={() => {
            this.setState({ deleteID: null });
            this.showRemoveModal(false);
          }}
          heading={"Are you sure you want to remove this Inventory Item?"}
          subHeading={
            "If you choose to remove this Inventory Item, and you already have service variants set up, this might cause issues."
          }
          visible={this.state.removeVisible}
          id={this.state.deleteID}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(InventoryKitsCreate);

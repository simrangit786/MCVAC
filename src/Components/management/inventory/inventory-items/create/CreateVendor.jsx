import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Select,
} from "antd";
import { Image as Images } from "../../../../Images";
import { getVendorAccount } from "../../../../../Controller/api/vendorAccountServices";
import CreateVendorDrawer from "./CreateVendorDrawer";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";
import {
  createInventoryVendor,
  deleteVendorInventory,
  getInventoryVendorById,
  updateInventoryVendorQty,
} from "../../../../../Controller/api/inventoryServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateVendor extends Component {
  state = {
    visible: false,
    location: [],
    newLoc: [],
    selectValue: null,
  };

  formRef = React.createRef();

  showVendor = (visible) => {
    this.setState({
      visible: visible,
      editData: null
    });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getInventoryVendor();
    }
    this.getAllAccounts();
  }

  getInventoryVendor = () => {
    getInventoryVendorById({ inventory_item: this.props.match.params.id })
      .then((res) => {
        // console.log(res.data.results)
        this.setState({
          newLoc: res.data.results[0].vendor,
          //  selectValue: res.data.results[0].uom?.id
        });
        // this.formRef.current.setFieldsValue({
        //     // vendors: this.state.newLoc?.map(value => {
        //     //     // console.log(value, "--==--")
        //     //     return {value: value.vendor.id, label: value.vendor.name}
        //     // }),
        //     uom: {value: res.data.results[0].uom?.id, label: res.data.results[0].uom?.name}
        // })
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getAllAccounts = () => {
    getVendorAccount()
      .then((res) => {
        this.setState({ location: res.data.results });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  handleSelectChange = (e) => {
    this.setState({ selectValue: e.value });
  };

  handleRefNumChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newLoc.slice();
      newArr[index].reference_number = value;
      this.setState({ newLoc: newArr });
      const params = {
        reference_number: value,
        id: item.id,
        inventory_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  handleItemSelectChange = (value, item, index) => {
    // let value = e.target.value;
    if (value) {
      let unit_type = (typeof(value) === 'string' && value.includes('COM')) ? 'COM' : 'UOM';
      let selectableValue;
      let params = {};
      var newArr = this.state.newLoc.slice();
      if(unit_type === 'COM') {
        let splittedArr = value?.split('_');
        selectableValue = splittedArr[splittedArr.length - 1];
        newArr[index].vendor_com = selectableValue;
        newArr[index].unit_type = unit_type;
        params.vendor_com = selectableValue;
      }
      else {
        selectableValue = value;
        newArr[index].vendor_uom = selectableValue;
        newArr[index].unit_type = unit_type;
        params.vendor_uom = selectableValue;
      }
      this.setState({ newLoc: newArr });
       params = {
        ...params,
        id: item.id,
        unit_type,
        inventory_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
    // if (value) {
    //   var newArr = this.state.newLoc.slice();
    //   newArr[index].vendor_uom = value;
    //   this.setState({ newLoc: newArr });
    //   const params = {
    //     vendor_uom: value,
    //     id: item.id,
    //     inventory_id: this.props.match.params.id,
    //   };
    //   this.updateVendorMeasurement(params, item);
    // }
  };

  handleUnitCostChange = (e, item, index) => {
    let value = e.target.value;
    if (value) {
      var newArr = this.state.newLoc.slice();
      newArr[index].unit_cost = value;
      this.setState({ newLoc: newArr });
      const params = {
        unit_cost: value,
        id: item.id,
        inventory_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  updateVendorMeasurement = (params, item) => {
    updateInventoryVendorQty(item.id, params)
      .then()
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  handleSelect = (e) => {
    const Id = this.props.match.params.id
      ? this.props.match.params.id
      : this.props.inventory.id;
    this.formRef.current.setFieldsValue({
      vendors: null,
    });
    let sites = this.state.newLoc?.map((i) => i.vendor.id);
    let newItem = this.state.location.find((i) => e == i.id);
    sites.push(newItem.id);
    const data = {
      inventory_item: Number(Id),
      uom: this.state.selectValue,
      vendor_id: sites.map((i) => i),
      vendor: [],
    };
    createInventoryVendor(data)
      .then((res) => {
        //    message.success('success')
        this.setState({ newLoc: res.data.vendor });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  showVendorContact = () => {
    this.setState({ visibleVendors: false, editVendorData: null })
  }
  // handleDeselect = e => {
  //     const deleteItem = this.state.newLoc.find(i => i.vendor.id === e.value);
  //       deleteVendorInventory(deleteItem.id).then(res => {
  //         let newLoc = [...this.state.newLoc];
  //         let newArr = newLoc.drawer(i => {
  //             return (
  //                 e.value !== i.vendor.id
  //             )
  //         })
  //         this.setState({newLoc: newArr})
  //     }).catch(err => {
  //         handleError(err)
  //     })
  // }

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
          onClick={() => this.handleEdit(item.vendor)}
        >
          Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleEdit = (item) => {
    this.setState({ editData: item, visible: true });
  };

  handleVendorInfo = (item, newVendor) => {
    if (newVendor) {
      let newArr = this.state.newLoc.map((i) => i.vendor);
      newArr.push(item);
      const data = {
        inventory_item: this.props.match.params.id,
        vendor_id: newArr.map((i) => i.id),
        vendor: [],
      };
      createInventoryVendor(data).then((res) => {
        this.setState({ newLoc: res.data.vendor })
        this.showVendorContact();
      })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    }
    else {
    const Index = this.state.newLoc.findIndex(
      (i) => i.vendor?.id == item.id
    );
    const newArr2 = this.state.newLoc.slice();
    newArr2[Index].vendor = item;
    this.setState({ newLoc: newArr2 });
    }
  }

  handleVendorAddress = (main, billing, newItem) => {
    const newArr = this.state.newLoc.slice();
    if (newItem) {
      const Index = this.state.newLoc.findIndex(
        (i) => i.vendor?.id == main.account
      );
      newArr[Index].vendor.main_address = main;
      newArr[Index].vendor.billing_address = billing;
    }
    else {
      if (main) {
        const Index = this.state.newLoc.findIndex(
          (i) => i.vendor?.main_address?.id == main.id
        );
        newArr[Index].vendor.main_address = main;
      }

      if (billing) {
        const Index = this.state.newLoc.findIndex(
          (i) => i.vendor?.billing_address?.id == billing.id
        );
        newArr[Index].vendor.billing_address = billing;
      }
    }
    this.setState({ newLoc: newArr });
  }



  handleRemove = (id) => {
    deleteVendorInventory(id)
      .then((res) => {
        let newLoc = [...this.state.newLoc];
        let newArr = newLoc.filter((i) => {
          return id !== i.id;
        });
        this.setState({ newLoc: newArr });
        //     , () => {
        //     this.formRef.current.setFieldsValue({
        //         vendors: this.state.newLoc?.map(value => {
        //             // console.log(value, "--==--")
        //             return {value: value.vendor.id, label: value.vendor.name}
        //         }),
        //         // uom: {value: res.data.uom.id, label: res.data.uom.name}
        //     })
        // })
        message.success("deleted!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSubmit = () => {
    this.props.setInventory(this.props.inventory, 7);
    message.success("Inventory updated successfully!");
  };

  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                {/*<div className="col-12">*/}
                {/*    <div className="row mx-0 info-card-heading-row-info align-items-center">*/}
                {/*        <div*/}
                {/*            className="info-icon-card-flag-info d-flex align-items-center justify-content-center">*/}
                {/*            <img src={Images.info_yellow} alt="" className="img-fluid"/>*/}
                {/*        </div>*/}
                {/*        <div className="info-icon-card-details-info">*/}
                {/*            <h6 className="mb-0">Internal and External Locations are purely for*/}
                {/*                reports.</h6>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      This section tells us how many suppliers this inventory
                      item can come from, what each suppliers’ costs, and what
                      each supplier charges us for it. This also gives us the
                      data in order to create a purchase order for this
                      inventory item.
                    </h6>
                  </div>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="vendors"
                    label={"Vendors"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative remove-cross-icon search-overlap"
                  >
                    <Select
                      // labelInValue
                      // disabled={!this.state.selectValue}
                      // mode="multiple"
                      placeholder="Search"
                      showSearch={true}
                      filterOption={false}
                      onFocus={() => this.getAllAccounts()}
                      onChange={this.handleSelect}
                      dropdownClassName="option-design-fix"
                      className="custom-search-select"
                    // onDeselect={this.handleDeselect}
                    // value={this.state.newLoc?.map(i => ({value: i.vendor.id, label: i.vendor.name})
                    // )}
                    >
                      {this.state.location.map((d) => (
                        // <Option key={d.id} value={d.id}>
                        //   {d.name}
                        // </Option>
                        <Option key={d.id} value={d.id}>
                          <div className="row custom-tree-row custom-tree-row-1">
                            <div className="common-select-option-row col-12 d-flex align-items-center">
                              <div
                                style={{
                                  width: "40px",
                                }}
                                className="float-left"
                              >
                                <img style={{ height: '30px' }} src={Images.vendor_icon} alt={""} className="img-fluid" />

                              </div>
                              <div className="float-left warehouse-select-box">
                                <h6 className="mb-0 w-100 d-inline-block ml-1">
                                  {d.name}
                                </h6>
                                <p style={{
                                  color: '#BDBDBD',
                                  fontSize: '11px'
                                }} className="mb-0">
                                  {d.main_address?.street_address || ""},{" "}
                                  {d.main_address?.city || ""},{" "}
                                  {d.main_address?.state || ""},
                                  {d.main_address?.zip_code || ""}{" "}
                                  {d.main_address?.country || ""}
                                </p>
                              </div>
                              <div
                                style={{
                                  display: "inline-block",
                                }}
                                className="text-green-tag text-center select-text-tier"
                              >
                                Vendor
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
                    className="create-btn-main position-absolute"
                    onClick={() => this.showVendor(true)}
                  >
                    + Create
                  </Button>
                </div>
              </div>
              <div className="row">
                {this.state.newLoc?.length > 0 ? (
                  this.state.newLoc?.map((i, index) => {
                    const main_address = i.vendor?.main_address
                    const selectName = this.props.inventory?.uom_array?.find(
                      (n) => n.id === i.vendor_uom
                    )?.symbol;
                    return (
                      <div className="col-12 col-12-12">
                        <div className="row location-row-main">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12">
                                <h6 className="mb-3">Vendor {index + 1}</h6>
                              </div>
                              <div className="col-12">
                                <div className="row mx-0 site-details-row-card site-details-row-card-2 radius-bottom-0  position-relative">
                                  <div className="col-12 col-sm-3">
                                    <div className="site-name-location">
                                      <img
                                        src={Images.waste_management_black_icon}
                                        alt=""
                                        className="img-fluid"
                                      />
                                      <span>{i.vendor?.name}</span>
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-3">
                                    <h6 className="text-uppercase">ADDRESS</h6>
                                    <p className="mb-0">
                                      {`${main_address?.street_address || ""
                                        } ${main_address?.city || ""
                                        } ${main_address?.state || ""} ${main_address?.country || ""
                                        }`}
                                    </p>
                                  </div>
                                  <div className="col-12 col-sm-3">
                                    <h6 className="text-uppercase">
                                      EMAIL ADDRESS
                                    </h6>
                                    <p className="mb-0">{main_address?.email || "-"}</p>
                                  </div>
                                  <div className="col-12 col-sm-3">
                                    <h6 className="text-uppercase">
                                      PHONE NUMBER
                                    </h6>
                                    <p className="mb-0">{main_address?.phone || "-"}</p>
                                  </div>
                                  <Dropdown
                                    overlayClassName="add-remove-dropdown-main"
                                    overlay={() => this.menu(i, index)}
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
                                <div className="row mx-0 custom-design-update">
                                  <div className="col-12">
                                    <Form.Item
                                      className="position-relative"
                                      // name="item_reference_number"
                                      label={"Item Reference Number *"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "this field is required",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="00000"
                                        type="number"
                                        defaultValue={i.reference_number}
                                        onBlur={(e) =>
                                          this.handleRefNumChange(e, i, index)
                                        }
                                      />
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <Form.Item
                                      label={"Unit of Measurement *"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "this field is required",
                                        },
                                      ]}
                                    >
                                      <Select
                                        // labelInValue
                                        suffixIcon={
                                          <img
                                            alt=""
                                            src={Images.caret_down_small_select}
                                            className="img-fluid"
                                          />
                                        }
                                        placeholder="Select Option"
                                        onChange={(e) =>
                                          this.handleItemSelectChange(
                                            e,
                                            i,
                                            index
                                          )
                                        }
                                       value={i?.unit_type === "UOM" ? i?.vendor_uom : `COM_${i?.vendor_com}`}
                                      >
                                        {this.props.inventory?.uom_array?.map(
                                          (i) => {
                                            return (
                                              <Select.Option
                                                key={i.id}
                                                value={i.id}
                                              >
                                                {i.name} ({i.symbol})
                                              </Select.Option>
                                            );
                                          }
                                        )}
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
                                    <small className="small-text-input">
                                      You're choosing Unit of Measurement's from
                                      your pre-
                                      <br />
                                      selected custom and universal Unit of
                                      Measurement.
                                    </small>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <Form.Item
                                      className="position-relative"
                                      // name="unit_cost"
                                      label={"Unit Cost *"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "this field is required",
                                        },
                                      ]}
                                    >
                                      <small className="vendor-dollar position-absolute">
                                        $
                                      </small>
                                      <InputNumber
                                        placeholder="0.00"
                                        style={{ paddingLeft: 12 }}
                                        value={i.unit_cost}
                                        onBlur={(e) =>
                                          this.handleUnitCostChange(e, i, index)
                                        }
                                      />
                                      <small
                                        style={{ top: "14px" }}
                                        className="position-absolute unit-cost-name"
                                      >
                                        {selectName}
                                      </small>
                                    </Form.Item>
                                  </div>
                                  {/* <div className="col-12">
                                                            <div className="row mx-0 site-details-row-card site-details-row-card-2  position-relative">
                                                                <div className="col-12 col-sm-3">
                                                                    <div className="site-name-location">
                                                                        <img src={Images.location_black_icon} alt=""
                                                                             className="img-fluid"/>
                                                                        <span>Main address</span>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-sm-3">
                                                                    <h6 className="text-uppercase">ADDRESS</h6>
                                                                    <p className="mb-0">  {i?.vendor.main_address?.apartment}
                                                                    {i?.vendor.main_address?.city}, {i?.vendor.main_address?.state}
                                                                        {i?.vendor.main_address?.zip_code} {i?.vendor.main_address?.country}</p>

                                                                </div>
                                                                <div className="col-12 col-sm-3">
                                                                    <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                                                                    <p className="mb-0">{i?.vendor.main_address?.email}</p>
                                                                </div>
                                                                <div className="col-12 col-sm-3">
                                                                    <h6 className="text-uppercase">PHONE NUMBER</h6>
                                                                    <p className="mb-0">{i?.vendor.main_address?.phone}</p>
                                                                </div>
                                                                {/* <Dropdown overlayClassName="add-remove-dropdown-main"
                                                                          overlay={() => this.menu()}
                                                                          trigger={['click']}>
                                                                    <Button
                                                                        className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                                        onClick={e => e.preventDefault()}>
                                                                        <img src={Images.more_black} alt=""
                                                                             className="img-fluid"/>
                                                                    </Button>
                                                                </Dropdown>
                                                            </div>
                                                        </div> */}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/*<div className="col-12">*/}
                          {/*    <div*/}
                          {/*        className="row mx-0 contact-green-small-heading mt-3 position-relative">*/}
                          {/*        <h5 className="mb-0 bg-white">Unit Cost</h5>*/}
                          {/*    </div>*/}
                          {/*</div>*/}
                        </div>
                        {/* <div className="row location-row-main">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h6 className="mb-3">External Location 2</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div
                                                        className="row mx-0 contact-green-small-heading mt-3 position-relative">
                                                        <h5 className="mb-0 bg-white">Unit Cost</h5>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12 col-sm-6">
                                                            <Form.Item
                                                                className="position-relative"
                                                                name="item_reference_number"
                                                                label={"Item Reference Number *"} rules={[{
                                                                required: true,
                                                                message: 'this field is required'
                                                            }]}>
                                                                <InputNumber placeholder="000001"/>
                                                            </Form.Item>
                                                        </div>
                                                        <div className="col-12 col-sm-6">
                                                            <Form.Item
                                                                className="position-relative"
                                                                name="unit_cost"
                                                                label={"Unit Cost *"} rules={[{
                                                                required: true,
                                                                message: 'this field is required'
                                                            }]}>
                                                                <InputNumber placeholder="$1.00/lbs"/>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12">
                    <div className="row mx-0 common-card-upload">
                      <div className="col-12 text-center">
                        <img
                          src={Images.vendor_gray_icon}
                          alt={""}
                          className="img-fluid"
                        />
                        <h6 className="mb-0 color-gray-3">No Vendors</h6>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-12 mt-0 validate-div-col text-md-right mt-4">
                  <Form.Item>
                    <Button htmlType="submit" className="validate-btn-main">
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <CreateVendorDrawer
          editData={this.state.editData}
          visible={this.state.visible}
          handleVendorInfo={this.handleVendorInfo}
          handleVendorAddress={this.handleVendorAddress}
          onClose={() => this.showVendor(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateVendor);

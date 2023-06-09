import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  InputNumber,
  Menu,
  message,
  Select,
} from "antd";
import { Image as Images } from "../../../../Images";
import CreateVendor from "../../../../drawers/disposal/CreateVendor";
import { getVendorAccount } from "../../../../../Controller/api/vendorAccountServices";
import {
  createDisposalVendor,
  deleteVendorDisposal,
  getDisposalVendorById,
  updateVendorQty,
} from "../../../../../Controller/api/disposalServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateDropOffFacilities extends Component {
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
    });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getDisposalVendor();
    }
    this.getAllAccounts();
  }

  getDisposalVendor = () => {
    getDisposalVendorById({ disposal: this.props.match.params.id })
      .then((res) => {
        // console.log(res.data.results)
        this.setState({
          newLoc: res.data.results[0].vendor,
          selectValue: res.data.results[0].uom?.id,
        });
        this.formRef.current.setFieldsValue({
          // vendors: this.state.newLoc?.map(value => {
          //     // console.log(value, "--==--")
          //     return {value: value.vendor.id, label: value.vendor.name}
          // }),
          uom: {
            value: res.data.results[0].uom?.id,
            label: res.data.results[0].uom?.name,
          },
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getAllAccounts = (params) => {
    getVendorAccount(params)
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
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
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
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  handleItemSelectChange = (value, item, index) => {
    // let value = e.target.value;
    if (value) {
      var newArr = this.state.newLoc.slice();
      newArr[index].vendor_uom = value;
      this.setState({ newLoc: newArr });
      const params = {
        vendor_uom: value,
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateVendorMeasurement(params, item);
    }
  };

  updateVendorMeasurement = (params, item) => {
    updateVendorQty(item.id, params)
      .then((res) => {
        // console.log("success")
      })
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
      : this.props.disposal.id;
    this.formRef.current.setFieldsValue({
      vendors: null,
    });
    let sites = this.state.newLoc.map((i) => i.vendor.id);
    let newItem = this.state.location.find((i) => e == i.id);
    sites.push(newItem.id);
    const data = {
      disposal: Number(Id),
      // uom: this.state.selectValue,
      vendor_id: sites.map((i) => i),
      vendor: [],
    };
    createDisposalVendor(data)
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

  handleDeselect = (e) => {
    const deleteItem = this.state.newLoc.find((i) => i.vendor.id === e.value);
    deleteVendorDisposal(deleteItem.id)
      .then((res) => {
        let newLoc = [...this.state.newLoc];
        let newArr = newLoc.filter((i) => {
          return e.value !== i.vendor.id;
        });
        this.setState({ newLoc: newArr });
      })
      .catch((err) => {
        handleError(err);
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
    </Menu>
  );

  handleRemove = (id) => {
    deleteVendorDisposal(id)
      .then((res) => {
        let newLoc = [...this.state.newLoc];
        let newArr = newLoc.filter((i) => {
          return id !== i.id;
        });
        this.setState({ newLoc: newArr });
        // , () => {
        // this.formRef.current.setFieldsValue({
        //     vendors: this.state.newLoc?.map(value => {
        //         // console.log(value, "--==--")
        //         return {value: value.vendor.id, label: value.vendor.name}
        //     }),
        //     // uom: {value: res.data.uom.id, label: res.data.uom.name}
        // })
        // })
        message.success("deleted successfully!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSubmit = () => {
    this.props.setDisposal(this.props.disposal, 7);
    message.success("disposal updated successfully!");
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
                <div className="col-12">
                  <div className="row mx-0 info-card-heading-row-info align-items-center">
                    <div className="info-icon-card-flag-info d-flex align-items-center justify-content-center">
                      <img
                        src={Images.info_yellow}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="info-icon-card-details-info">
                      <h6 className="mb-0">
                        Internal and External Locations are purely for reports.
                      </h6>
                    </div>
                  </div>
                </div>
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="uom" label={"Unit of Measurement *"} rules={[{
                                        required: true,
                                        message: 'this field is required'
                                    }]}>

                                        <Select
                                            labelInValue
                                            suffixIcon={
                                                <img alt="" src={Images.caret_down_small_select}
                                                     className="img-fluid"/>
                                            }
                                            placeholder="Select Option"
                                            onChange={this.handleSelectChange}
                                        >
                                            {this.props.disposal?.uom_array?.map(i => {
                                                return (
                                                    <Select.Option key={i.id}
                                                                   value={i.id}>{i.name} ({i.symbol})</Select.Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </div> */}
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
                      showSearch={true}
                      placeholder="Search"
                      filterOption={false}
                      onFocus={() => this.getAllAccounts()}
                      onSearch={(e) =>
                        this.getAllAccounts({ search: e, type: "DISPOSAL" })
                      }
                      onChange={this.handleSelect}
                      // onDeselect={this.handleDeselect}
                      // value={this.state.newLoc.map(i => ({value: i.vendor.id, label: i.vendor.name})
                      // )}
                    >
                      {this.state.location.map((d) => (
                        <Option key={d.id} value={d.id}>
                          {d.name}
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
                    Create
                  </Button>
                </div>
              </div>
              <div className="row">
                {this.state.newLoc.length > 0 ? (
                  this.state.newLoc.map((i, index) => {
                    const selectName = this.props.disposal?.uom_array?.find(
                      (n) => n.id === i.vendor_uom
                    )?.symbol;
                    return (
                      <div className="col-12 col-12-12">
                        <div className="row location-row-main">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12">
                                <h6 className="mb-3">
                                  External Location {index + 1}
                                </h6>
                              </div>
                              <div className="col-12">
                                <div className="row mx-0 align-items-center internal-location-row position-relative">
                                  <img
                                    src={Images.waste_management_black_icon}
                                    alt=""
                                    className="img-fluid"
                                  />
                                  <h5 className="my-0 inn-heading">
                                    {i.vendor.name}
                                  </h5>
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
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="row mx-0 contact-green-small-heading mt-3 position-relative">
                              <h5 className="mb-0 bg-white">Unit Cost</h5>
                            </div>
                            <div className="row">
                              <div className="col-12 col-sm-6">
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
                                  <InputNumber
                                    placeholder="00000"
                                    value={i.reference_number}
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
                                      this.handleItemSelectChange(e, i, index)
                                    }
                                    value={i?.vendor_uom}
                                  >
                                    {this.props.disposal?.uom_array?.map(
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
                                  </Select>
                                </Form.Item>
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
                          src={Images.location_gray}
                          alt={""}
                          className="img-fluid"
                        />
                        <h6 className="mb-0">No External Locations</h6>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-12 validate-div-col text-md-right">
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
        <CreateVendor
          visible={this.state.visible}
          onClose={() => this.showVendor(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateDropOffFacilities);

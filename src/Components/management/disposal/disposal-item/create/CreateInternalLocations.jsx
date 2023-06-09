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
import CreateInternalLocationDisposal from "../../../../drawers/disposal/CreateInternalLocationDisposal";
import { getInternalLocation } from "../../../../../Controller/api/labourServices";
import { formatPhone } from "../../../../../Controller/utils";
import {
  createDisposalLocation,
  deleteLocationDisposal,
  getDisposalLocationById,
  updateLocationQty,
} from "../../../../../Controller/api/disposalServices";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateInternalLocations extends Component {
  formRef = React.createRef();
  state = {
    visible: false,
    location: [],
    selectValue: null,
    sites: [],
    newSites: [],
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
    if (this.props.match.params.id) {
      this.getDisposalLocation();
    }
  }

  getDisposalLocation = () => {
    getDisposalLocationById({ disposal: this.props.match.params.id })
      .then((res) => {
        // console.log(res.data.results)
        this.setState({
          newSites: res.data.results[0].location,
          selectValue: res.data.results[0].uom.id,
        });
        this.formRef.current.setFieldsValue({
          // internal_locations: this.state.newSites?.map(value => {
          //     return {value: value.internal_location.id, label: value.internal_location.name}
          // }),
          uom: {
            value: res.data.results[0].uom.id,
            label: res.data.results[0].uom.name,
          },
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
      type: "DISPOSAL",
    };
    getInternalLocation(data)
      .then((res) => {
        this.setState({ contacts: res.data.results });
      })
      .catch((err) => {});
  };

  handleEdit = (item) => {
    this.setState({ editData: item, visible: true });
  };

  handleRemove = (id) => {
    deleteLocationDisposal(id)
      .then((res) => {
        let newSites = [...this.state.newSites];
        let newArr = newSites.filter((i) => {
          return id !== i.id;
        });
        this.setState({ newSites: newArr }, () => {
          this.props.getDisposalItem();
        });
        // , () => {
        // this.formRef.current.setFieldsValue({
        //     internal_locations: this.state.newSites?.map(value => {
        //         return {value: value.internal_location.id, label: value.internal_location.name}
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
    this.props.setDisposal(this.props.disposal, 6);
    this.props.getDisposalItem();
    message.success("Disposal updated successfully!");
  };

  showContact = () => {
    this.setState({ visible: false, editData: null });
  };

  handleSelect = (e) => {
    const Id = this.props.match.params.id
      ? this.props.match.params.id
      : this.props.disposal.id;
    // console.log(e)
    // const locationId = this.state.contacts.find(i => i.id === e.value).id;
    this.formRef.current.setFieldsValue({
      internal_locations: null,
    });
    let sites = this.state.newSites.map((i) => i.internal_location.id);
    let newItem = this.state.contacts.find((i) => e == i.id);
    sites.push(newItem.id);
    this.setState({ sites });
    const data = {
      disposal: Id,
      uom: this.state.selectValue,
      internal_location_id: sites.map((i) => i),
      location: [],
    };
    createDisposalLocation(data)
      .then((res) => {
        this.props.getDisposalItem();
        this.setState({ newSites: res.data.location });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  // handleDeselect = e => {
  //     const deleteItem = this.state.newSites.find(i => i.internal_location.id === e.value);
  //       deleteLocationDisposal(deleteItem.id).then(res => {
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
    // console.log(item, newItem, "----")
    if (newItem) {
      let newArr = this.state.newSites.map((i) => i.internal_location);
      newArr.push(item);
      // this.setState({newSites: newArr})
      // console.log("ndsbchnds")
      const data = {
        disposal: this.props.match.params.id,
        uom: this.state.selectValue,
        internal_location_id: newArr.map((i) => i.id),
        location: [],
      };
      createDisposalLocation(data)
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
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
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
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
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
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
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
        type: "DISPOSAL",
        id: item.id,
        disposal_id: this.props.match.params.id,
      };
      this.updateLocation(params, item);
    }
  };

  updateLocation = (params, item) => {
    updateLocationQty(item.id, params)
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
  handleSelectChange = () => {
    this.setState({
      selectValue: this.formRef.current.getFieldValue("uom").value,
    });
  };

  render() {
    const selectName = this.props.disposal?.uom_array?.find(
      (i) => i.id === this.state.selectValue
    )?.symbol;
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
                <div className="col-12">
                  <div className="row  mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">Lorem ipsum</h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="uom"
                    label={"Unit of Measurement *"}
                    rules={[
                      {
                        required: true,
                        message: "Please select Universal UOM",
                      },
                    ]}
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
                      {this.props.disposal?.uom_array?.map((i) => {
                        return (
                          <Select.Option key={i.id} value={i.id}>
                            {i.name} ({i.symbol})
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="internal_locations"
                    label={"Warehouses"}
                    className="position-relative remove-cross-icon search-overlap"
                  >
                    <Select
                      // mode="multiple"
                      // showSearch={true}
                      // labelInValue
                      showSearch={true}
                      disabled={!this.state.selectValue}
                      // mode="multiple"
                      placeholder="Search"
                      notFoundContent={null}
                      filterOption={false}
                      onFocus={() => this.fetchContacts({ type: "DISPOSAL" })}
                      onSearch={(e) =>
                        this.fetchContacts({ search: e, type: "DISPOSAL" })
                      }
                      // onChange={this.handleSelect}
                      onChange={this.handleSelect}
                      // onDeselect={this.handleDeselect}
                      // value={this.state.newSites.map(i => ({value: i.internal_location.id, label: i.internal_location.name})
                      //     )}
                    >
                      {this.state.contacts?.map((d) => (
                        <Option key={d.id} value={d.id}>{`${d.name}`}</Option>
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
                    onClick={() => this.showFacility(true)}
                  >
                    Create
                  </Button>
                </div>

                {this.state.newSites.length > 0 ? (
                  this.state.newSites.map((item, index) => {
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
                            <div className="row site-details-row-card site-details-row-card-2  position-relative">
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
                            <div className="row contact-green-small-heading mt-3 position-relative">
                              <h5 className="mb-0 bg-white">QTY</h5>
                            </div>
                            <div className="row">
                              <div className="col-12 p-0 table-responsive custom-internal-location">
                                <div className="row mx-0 custom-table-thead">
                                  <div className="custom-th-main">
                                    <div>
                                      Min QTY
                                      <br />
                                      (UOM)
                                    </div>
                                  </div>
                                  <div className="custom-th-main">
                                    <div>
                                      Max QTY
                                      <br />
                                      (UOM)
                                    </div>
                                  </div>
                                  <div className="custom-th-main">
                                    <div>
                                      QTY
                                      <br />
                                      (UOM)
                                    </div>
                                  </div>
                                </div>
                                <div className="row mx-0 custom-table-tbody">
                                  <div className="custom-td position-relative">
                                    <InputNumber
                                      value={item.min_qty || 0}
                                      onBlur={(e) =>
                                        this.handleMinQtyChange(e, item, index)
                                      }
                                    ></InputNumber>
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
                                    ></InputNumber>
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
                                    ></InputNumber>
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
                            <div className="row contact-green-small-heading mt-3 position-relative">
                              <h5 className="mb-0 bg-white">Unit Cost</h5>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6">
                            {/* <Form.Item
                                                            className="position-relative"
                                                            name="unit_cost"
                                                            label={"Unit Cost *"} rules={[{
                                                            required: true,
                                                            message: 'this field is required'
                                                        }]}> */}
                            {/* <InputNumber placeholder="$0.00"/> */}
                            <label
                              className="mt-3"
                              style={{ fontWeight: "500" }}
                            >
                              Unit Cost *
                            </label>
                            <div className="row">
                              <div className="col-12">
                                <small className="add-dollar position-absolute">
                                  $
                                </small>
                                <InputNumber
                                  style={{ paddingLeft: "12px" }}
                                  value={item.unit_cost || 0}
                                  onBlur={(e) =>
                                    this.handleUnitCostChange(e, item, index)
                                  }
                                ></InputNumber>
                                <small
                                  style={{ right: "30px" }}
                                  className="position-absolute unit-cost-name"
                                >
                                  {selectName}
                                </small>
                              </div>
                            </div>
                            {/* </Form.Item> */}
                          </div>
                        </div>
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
                        <h6 className="mb-0">No Warehouses</h6>
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
        <CreateInternalLocationDisposal
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

export default withRouter(CreateInternalLocations);

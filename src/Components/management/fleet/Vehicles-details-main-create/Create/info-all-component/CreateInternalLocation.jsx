import React, { Component } from "react";
import { Button, Dropdown, Form, Menu, message, Select, Spin } from "antd";
import { Image as Images } from "../../../../../Images";
import { withRouter } from "react-router-dom";
import CreateInternalLocationDrawer from "./CreateInternalLocationDrawer";
import {
  getInternalLocation,
  updateVehicle,
} from "../../../../../../Controller/api/vehicleServices";
import { formatPhone } from "../../../../../../Controller/utils";
import { handleError } from "../../../../../../Controller/Global";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateInternalLocation extends Component {
  state = {
    contacts: [],
    sites: [],
    fetching: false,
    visible: false,
  };
  formRef = React.createRef();

  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleEdit(item)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Edit
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button
          onClick={() => this.handleRemove(item)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleEdit = (item) => {
    this.setState({ editData: item, visible: true });
  };

  handleRemove = () => {
    this.setState({ sites: [] });
  };

  fetchContacts = (params = {}) => {
    const data = {
      // fleet_id: this.props.match.params.id,
      ...params,
      // type: "FLEET"
    };
    getInternalLocation(data)
      .then((res) => {
        this.setState({ contacts: res.data.results });
      })
      .catch((err) => {});
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      const params = {
        fleet_id: this.props.match.params.id,
        type: "FLEET",
      };
      getInternalLocation(params)
        .then((res) => {
          this.setState({ sites: res.data.results });
          // this.formRef.current.setFieldsValue({
          //     contacts: this.state.sites[0]?.name
          // })
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }

  handleSelect = (e) => {
    // console.log(e, "e" )
    this.formRef.current.setFieldsValue({
      contacts: null,
    });
    let sites = this.state.contacts.filter((i) => {
      // console.log(i, "i")
      return i.id == e;
    });
    this.setState({ sites });
  };

  callbackContact = (data) => {
    this.setState({ sites: [data] });
    // let {sites} = this.state;
    // sites = [ data]
    // this.setState({sites, contacts: sites})

    this.formRef.current.setFieldsValue({
      contacts: this.state.sites[0].name,
    });
  };

  handleSubmit = () => {
    let data = {
      type: "FLEET",
      internal_location: this.state.sites[0]?.id,
    };
    updateVehicle(this.props.vehicle.id, data)
      .then((res) => {
        message.success("Vehicle updated successfully!");
        this.props.setVehicle(res.data, 4);
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  showContact = () => {
    this.setState({ visible: false, editData: null });
  };

  render() {
    const { fetching, contacts } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                You can only choose one warehouse per vehicle.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              hideRequiredMark={true}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <Form.Item
                    name="contacts"
                    label={
                      <div>
                        Warehouse <sup>*</sup>
                      </div>
                    }
                    rules={[
                      {
                        required: false,
                        //    message: 'this field is required'
                      },
                    ]}
                    className="position-relative remove-cross-icon search-overlap"
                  >
                    <Select
                      className="custom-search-select"
                      // mode="multiple"
                      showSearch={true}
                      placeholder="Search"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      // onFocus={() => this.fetchContacts({type: "FLEET"})}
                      onFocus={() => this.fetchContacts({})}
                      // onSearch={(e) => this.fetchContacts({search: e, type: "FLEET"})}
                      onSearch={(e) => this.fetchContacts({ search: e })}
                      onChange={this.handleSelect}
                    >
                      {contacts.map((d) => {
                        //     <Option key={d.id}
                        //             value={d.id}>{`${d.name}`}</Option>
                        // ))}
                        // <Option value={1}>
                        return (
                          <Option key={d.id} value={d.id}>
                            <div className="row mx-0 custom-tree-row custom-tree-row-1 align-items-center justify-content-between">
                              <div className="common-select-option-row">
                                <div className="select-option-details d-flex align-items-center">
                                  <div className={"select-option-icon"}>
                                    <img
                                      style={{
                                        height: "30px",
                                      }}
                                      src={Images.location_black_icon}
                                      alt={""}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <h6 className="mb-0">
                                    {d.name}
                                    <br />
                                    <small
                                      style={{
                                        color: "#BDBDBD",
                                        fontSize: "11px",
                                        lineHeight: "8px",
                                      }}
                                    >
                                      {d.street_address || ""}, {d.city || ""},{" "}
                                      {d.state || ""},{d.zip || ""}{" "}
                                      {d.country || ""}
                                    </small>
                                  </h6>
                                </div>
                              </div>
                              <div className="text-green-tag select-text-tier">
                                Warehouse
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                      {/* // </Option> */}
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
                    onClick={() => {
                      this.setState({ visible: true });
                    }}
                  >
                   + Create
                  </Button>
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  {this.state.sites.length === 0 && (
                    <div className="col-12">
                      <div className="row add-site-blank-row align-items-center">
                        <div className="col-12 text-center">
                          <img
                            src={Images.location_gray}
                            alt=""
                            className="img-fluid"
                          />
                          <span className="d-inline-block w-100">
                            No Warehouse
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {this.state.sites.map((item) => (
                    <div className="col-12">
                      <div
                        key={item.id}
                        className="row site-details-row-card position-relative"
                      >
                        <div className="col-12 col-sm-3">
                          <div className="site-name-location">
                            <img
                              src={Images.location_gray}
                              alt=""
                              className="img-fluid"
                            />
                            <span>{item.name}</span>
                          </div>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">ADDRESS</h6>
                          <p className="mb-0">{`${item.street_address} ${item.name} ${item.city} ${item.state} ${item.country}`}</p>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                          <p className="mb-0">{item.email}</p>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">PHONE NUMBER</h6>
                          <p className="mb-0">{formatPhone(item.phone)}</p>
                        </div>
                        <Dropdown
                          overlayClassName="add-remove-dropdown-main"
                          overlay={this.menu(item)}
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
                  ))}
                </div>
              </div>
              <div className="col-12 validate-div-col text-md-right">
                <Form.Item>
                  <Button htmlType="submit" className="validate-btn-main">
                    Save and Continue
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
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

export default withRouter(CreateInternalLocation);

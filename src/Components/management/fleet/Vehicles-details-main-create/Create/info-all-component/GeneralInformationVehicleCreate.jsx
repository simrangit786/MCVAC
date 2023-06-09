import React, { Component } from "react";
import { Button, Form, Input, InputNumber, message, Select, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../../Images";
import { getContact } from "../../../../../../Controller/api/contactsServices";
import {
  createVehicle,
  getFleetGroup,
  getRegion,
  updateVehicle,
} from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import { getEmployees } from "../../../../../../Controller/api/labourServices";
import CustomSelectOption from "../../../../../CustomSelectOption";
import { FLEET_GROUP, getShortName } from "../../../../../../Controller/utils";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class GeneralInformationVehicleCreate extends Component {
  state = {
    groups: [],
    regions: [],
    employees: [],
    fetching: false,
    vehicle_package_item: [],
  };
  formRef = React.createRef();

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.vehicle !== this.props.vehicle) {
      await this.fetchGroups();
      this.formRef.current.setFieldsValue({
        ...this.props.vehicle,
        fleet_group: { value: this.props.vehicle?.fleet_group?.id, label: this.props.vehicle?.fleet_group?.name },
        operator: {
          value: this.props.vehicle?.operator?.id || null,
          label: `${this.props.vehicle?.operator?.first_name || "Select"} ${this.props.vehicle?.operator?.last_name || " "}` 
        },
      });
    }
  }

  // componentDidMount() {
  //     this.fetchGroups()
  //     this.formRef.current.setFieldsValue({
  //         ...this.props.vehicle,
  //         fleet_group: this.props.fleet_group,
  //         operator: {value: this.props.vehicle?.operator?.id, label: this.props.vehicle?.operator?.first_name}
  //    })
  // }

  fetchGroups = (params = {}) => {
    this.setState({ fetching: true });
    params.tier_type = FLEET_GROUP;
    getFleetGroup(params)
      .then((res) => {
        this.setState({ groups: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  handleSubmit = (values) => {
    values.fleet_group = values?.fleet_group?.value;
    values.operator = values?.operator?.value;
    if (this.props.vehicle) {
      updateVehicle(this.props.vehicle.id, values)
        .then((res) => {
          this.props.setVehicle(res.data, 2);
          message.success("Vehicle updated successfully");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createVehicle(values)
        .then((res) => {
          this.props.setVehicle(res.data, 2);
          message.success("Vehicle created successfully");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  getRegion = (params = {}) => {
    this.setState({ fetching: true });
    getRegion(params)
      .then((res) => {
        this.setState({ regions: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  getOperator = (params = {}) => {
    this.setState({ fetching: true });
    getEmployees(params)
      .then((res) => {
        this.setState({ employees: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  render() {
    const { fetching, groups, regions, employees } = this.state;
    const { fleet_group, onChange } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input Vehicle’s general information.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="vehicle_id" label={"Vehicle ID *"}
                                               rules={[{
                                                   required: true,
                                                   message: 'this field is required'
                                               }]} className="position-relative">
                                        <InputNumber style={{backgroundColor: "#F2F2F2"}} placeholder="Vehicle Id" />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6"></div> */}
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Vehicle Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="Vehicle Name" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="fleet_group"
                    label={
                      <div className="d-flex align-items-center">
                        <span>Vehicle Group *</span>
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      labelInValue
                      optionLabelProp={"label"}
                      showSearch={true}
                      placeholder="Search Vehicle Groups"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onChange={(v) => {
                        onChange("fleet_group", v);
                      }}
                      value={fleet_group}
                      dropdownClassName="custom-select-drop-main"
                      onFocus={() => this.fetchGroups()}
                      onSearch={(e) => this.fetchGroups({ search: e })}
                    >
                      {groups.map((d, index) => (
                        <Option key={index} value={d.id} label={d.name}>
                          <div className="row option-with-image align-item-center px-2 mx-0">
                            <div className="option-icon">
                              <img
                                src={Images.fleet_group_truck}
                                className="img-fluid"
                              />
                            </div>
                            <div className="option-txt">
                              <CustomSelectOption
                                data={d}
                                img={
                                  d.tier_type ? null : Images.fleet_group_truck
                                }
                                type={"Fleet Group"}
                              />
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="status"
                    label={"Status *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder={"Select status"}
                    >
                      <Option value={"ACTIVE"}>Active</Option>
                      <Option value={"INACTIVE"}>Inactive</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="operator"
                    label={"Current Operator"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      labelInValue
                      showSearch={true}
                      optionLabelProp={'label'}
                      placeholder="Current Operator"
                      // defaultValue={{ value: "Select" }}
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.getOperator()}
                      onSearch={(e) => this.getOperator({ search: e })}
                    >
                      {employees.map((d) => (
                        <Option key={d.id} value={d.id} label={`${d.first_name} ${d.last_name}`}>
                          {/* {d.first_name} */}
                          <div className="row custom-tree-row custom-tree-row-1">
                            <div className="common-select-option-row col-12 d-flex align-items-center">
                              <div
                                style={{
                                  width: "40px",
                                }}
                                className="float-left"
                              >
                                {/* <img style={{
                                                                    height:'30px'
                                                                }} src={Images.person_group_green_icon} alt={""}
                                                                     className="img-fluid"/> */}
                                <span
                                  style={{
                                    background: "#7FD4BA",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                  }}
                                  className="d-flex justify-content-center align-items-center"
                                >
                                  {getShortName(d.first_name, d.last_name)}
                                </span>
                              </div>
                              <div className="float-left warehouse-select-box">
                                <h6 className="mb-0 w-100 d-inline-block ml-1">
                                  {d.first_name} {d.last_name}
                                </h6>
                              </div>
                              <div
                                style={{
                                  display: "inline-block",
                                }}
                                className="text-green-tag text-center select-text-tier"
                              >
                                Employee
                              </div>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="region"
                    label={"Region"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      showSearch={true}
                      placeholder="Search Vehicle Groups"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.getRegion()}
                      onSearch={(e) => this.getRegion({ search: e })}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                    >
                      {regions.map((d) => (
                        <Option key={d.id} value={d.id}>
                          {d.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                {/* <div className="col-12 col-sm-6">
                  <Form.Item
                    name="vehicle"
                    label={"Vehicle"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="M-16Ò" />
                  </Form.Item>
                </div> */}
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="year"
                    label={"Year *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"2019"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="make"
                    label={"Make"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="Chevrolet" />
                  </Form.Item>
                </div>

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="model"
                    label={"Model *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="Silverado 1500" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="trim"
                    label={"Trim"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="Work Truck" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="color"
                    label={"Color"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="Gray" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="type"
                    label={"Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder="Pickup Truck" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="fuel_type"
                    label={"Fuel Type"}
                    // rules={[
                    //   {
                    //     required: false,
                    //     message: "this field is required",
                    //   },
                    // ]}
                    className="position-relative"
                  >
                    <Select
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder={"Select Fuel Type"}
                    >
                      <Option value={"GASOLINE"}>Gasoline</Option>
                      <Option value={"DIESEL"}>Diesel</Option>
                      <Option value={"LIQUIFIED_PETROLEUM"}>
                        Liquified Petroleum
                      </Option>
                      <Option value={"ETHANOL"}>Ethanol</Option>
                      <Option value={"COMPRESSED_NATURAL_GAS"}>
                        Compressed Natural Gas
                      </Option>
                      <Option value={"BIODIESEL"}>Biodiesel</Option>
                      <Option value={"FLEX_FUEL"}>Flex Fuel</Option>
                    </Select>
                  </Form.Item>
                </div>
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
      </React.Fragment>
    );
  }
}

export default withRouter(GeneralInformationVehicleCreate);

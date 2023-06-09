import React, { Component } from "react";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../../Images";
import {
  getBlock,
  getDuty,
  getVehicleById,
  getWeight,
  updateVehicle,
} from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateTechnicalDetails extends Component {
  state = {
    blocks: [],
    weight: [],
    duty: [],
    fetching: false,
  };
  formRef = React.createRef();

  componentDidMount() {
    // this.formRef.current.setFieldsValue({
    //   ...this.props.vehicle,
    // });
    if (this.props.match.params.id) {
      getVehicleById(this.props.match.params.id)
      .then((res)=>{
        this.formRef.current.setFieldsValue({
          ...res.data,
        });
      }).catch(err=>{
        handleError(err)
      })
    }
  }

  fetchBlock = (params = {}) => {
    this.setState({
      fetching: true,
    });
    getBlock(params)
      .then((res) => {
        this.setState({ blocks: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  fetchDuty = (params = {}) => {
    this.setState({
      fetching: true,
    });
    getDuty(params)
      .then((res) => {
        this.setState({ duty: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  fetchWeight = (params = {}) => {
    this.setState({
      fetching: true,
    });
    getWeight(params)
      .then((res) => {
        this.setState({ weight: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  handleSubmit = (values) => {
    updateVehicle(this.props.vehicle.id, values)
      .then((res) => {
        this.props.setVehicle(res.data, 8);
        message.success("Vehicle updated successfully");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { blocks, duty, weight } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">Please input technical details.</h6>
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
                <div className="col-12 small-heading-in-form">
                  <h6 className="mt-0">General</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="body_type"
                    label={"Body Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Body Type"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="body_sub_type"
                    label={"Body Subtype"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Body Subtype"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="drive_type"
                    label={"Drive Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Drive Type"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="brake_system"
                    label={"Brake System"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Brake System"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="msrp"
                    label={"MSRP"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Fuel</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="fuel_tank_1_capacity"
                    label={"Fuel Tank 1 Capacity"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="fuel_tank_2_capacity"
                    label={"Fuel Tank 2 Capacity"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="epa_city"
                    label={"EPA City"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="epa_highway"
                    label={"EPA Highway"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="epa_combined"
                    label={"EPA Combined"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Dimensions</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="front_track_width"
                    label={"Front Track Width"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="ground_clearance"
                    label={"Ground Clearance"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="height"
                    label={"Height "}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="length"
                    label={"Length"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="rear_track_width"
                    label={"Rear Track Width"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="width"
                    label={"Width"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="wheelbase"
                    label={"Wheelbase"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Tires & Wheels</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="front_tire_psi"
                    label={"Front Tire PSI"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="rear_tire_psi"
                    label={"Rear Tire PSI"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="rear_axle"
                    label={"Rear Axle"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6" />
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="front_tire_type"
                    label={"Front Tire Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="front_wheel_diameter"
                    label={"Front Wheel Diameter"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="rear_tire_type"
                    label={"Rear Tire Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="rear_wheel_diameter"
                    label={"Rear Wheel Diameter"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Weight and Capacity</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="towing_capacity"
                    label={"Towing Capacity"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="curb_weight"
                    label={"Curb Weight"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="gross_vehicle_weight_training"
                    label={"Gross Vehicle Weight Training"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="bed_length"
                    label={"Bed Length"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="max_payload"
                    label={"Max Payload"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Engine</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="engine_summary"
                    label={"Engine Summary"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Vortec 4.8L"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="engine_brand"
                    label={"Engine Brand"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Vortec"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="aspiration"
                    label={"Aspiration"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Turbo Charger"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="block_type"
                    label={"Block Type"}
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
                      onSearch={(v) => this.fetchBlock({ search: v })}
                      onFocus={() => this.fetchBlock()}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder={"Block Type"}
                    >
                      {blocks.map((b) => (
                        <Option value={b.id}>{b.title}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="bore"
                    label={"Bore"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"3.8"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="cam_type"
                    label={"Cam Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"OHV"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="compression"
                    label={"Compression"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"8.8"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="cylinders"
                    label={"Cylinders"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"8"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="fuel_induction"
                    label={"Fuel Induction"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Direct Injection"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="fuel_quantity"
                    label={"Fuel Quality"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"8.7"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="max_hp"
                    label={"Max HP"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"307"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="max_torque"
                    label={"Max Torque"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"333"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="oil_capacity"
                    label={"Oil Capacity"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"7.6"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="redline_rpm"
                    label={"Redline RPM"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"6000"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="stroke"
                    label={"Stroke"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"7.6"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="valves"
                    label={"Valves"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"16"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Transmission</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="transmission_summary"
                    label={"Transmission Summary"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"4-Speed Automatic"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="transmission_brand"
                    label={"Transmission Brand"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Allison 1000"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="transmission_type"
                    label={"Transmission Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Automatic"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="transmission_gears"
                    label={"Transmission Gears"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"4"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Volume</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="cargo_volume"
                    label={"Cargo Volume"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"239.17"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="interior_volume"
                    label={"Interior Volume"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"239.17"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="passenger_volume"
                    label={"Passenger Volume"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"120.8"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Duty Type & Weight Class</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="duty_type"
                    label={"Duty Type"}
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
                      onSearch={(v) => this.fetchDuty({ search: v })}
                      onFocus={() => this.fetchDuty()}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder={"Duty Type"}
                    >
                      {duty.map((b) => (
                        <Option value={b.id}>{b.title}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="weight_class"
                    label={"Weight Class"}
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
                      onSearch={(v) => this.fetchWeight({ search: v })}
                      onFocus={() => this.fetchWeight()}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder={"Weight"}
                    >
                      {weight.map((b) => (
                        <Option value={b.id}>{b.title}</Option>
                      ))}
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

export default withRouter(CreateTechnicalDetails);

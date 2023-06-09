import React, { Component } from "react";
import { Button, Form, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../../Images";
import { getVehicleById, updateVehicle } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import { getSubUnitName } from "../../../../../../Controller/api/disposalServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateMetrics extends Component {
  formRef = React.createRef();

  state = {
    allOptions: [],
  };

  componentDidMount() {
    // this.formRef.current.setFieldsValue({
    //   ...this.props.vehicle,
    //   fuel_volume_unit: this.props.vehicle?.fuel_volume_unit?.id,
    //   secondary_meter_unit: this.props.vehicle?.secondary_meter_unit?.id,
    //   current_meter_unit: this.props.vehicle?.current_meter_unit?.id,
    // });
    // this.getSubUnitName();

    if (this.props.match.params.id) {
      getVehicleById(this.props.match.params.id)
      .then((res)=>{
        this.formRef.current.setFieldsValue({
            ...res.data,
            fuel_volume_unit: res.data?.fuel_volume_unit?.id,
            secondary_meter_unit: res.data?.secondary_meter_unit?.id,
            current_meter_unit: res.data?.current_meter_unit?.id,
          });
       this.getSubUnitName();
      }).catch(err=>{
        handleError(err)
      })
    }
  }

  handleSubmit = (values) => {
    updateVehicle(this.props.vehicle.id, values)
      .then((res) => {
        this.props.setVehicle(res.data, 6);
        message.success("Vehicle updated successfully");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getSubUnitName = (params) => {
    getSubUnitName(params)
      .then((res) => {
        this.setState({ allOptions: res.data });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    const { allOptions } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">please choose metrics.</h6>
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="current_meter_unit"
                    label={"Current Meter Unit *"}
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
                      placeholder={"Select Meter Unit"}
                      showSearch
                      filterOption={false}
                      onSearch={value => this.getSubUnitName({search: value})}
                    >
                      {allOptions.map((v) => {
                        return (
                          <Option key={v.id} value={v.id}>
                            {v.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="secondary_meter_unit"
                    label={"Secondary Meter Unit"}
                    // rules={[
                    //   {
                    //     required: true,
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
                      placeholder={"Select Secondary Meter Unit"}
                      showSearch
                      filterOption={false}
                      onSearch={value => this.getSubUnitName({search: value})}
                    >
                      {allOptions.map((v) => {
                        return (
                          <Option key={v.id} value={v.id}>
                            {v.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="fuel_volume_unit"
                    label={"Fuel Volume Unit *"}
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
                      placeholder={"Select Volume Unit"}
                      showSearch
                      filterOption={false}
                      onSearch={value => this.getSubUnitName({search: value})}
                    >
                      {allOptions
                        .filter((i) => i.unit_type.id === 4)
                        .map((v) => {
                          return (
                            <Option key={v.id} value={v.id}>
                              {v.name}
                            </Option>
                          );
                        })}
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

export default withRouter(CreateMetrics);

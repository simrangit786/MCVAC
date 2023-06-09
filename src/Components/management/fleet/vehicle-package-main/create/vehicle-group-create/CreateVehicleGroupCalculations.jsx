import React, { Component } from "react";
import { Button, Form, InputNumber, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { updateFleetGroup } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import { Image as Images } from "../../../../../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateVehicleGroupCalculations extends Component {
  state = {
    loading: false,
    data: null,
    total: 0,
  };
  formRef = React.createRef();

  handleSubmit = (values) => {
    // values.name = this.props.data.name;
    // values.vehicle_package_item = this.props.data.id;

    updateFleetGroup(this.props.data.id, values)
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  componentDidMount() {
    if (this.props.data) {
      this.formRef.current.setFieldsValue({
        ...this.props.data,
      });
      this.handleFormChange();
    }
  }

  handleFormChange = () => {
    let { getFieldValue, setFieldsValue } = this.formRef.current;
    let per_day_dpr =
      getFieldValue("purchase_cost") /
        getFieldValue("estimated_life") /
        getFieldValue("estimated_days") || 0;
    let insurance_per_day =
      getFieldValue("estimated_days") / getFieldValue("annual_premium") || 0;
    let fuel_per_day =
      getFieldValue("average_price") / getFieldValue("average_gallon") || 0;
    let reg_per_day =
      getFieldValue("annual_fee") / getFieldValue("estimated_days") || 0;
    let permit_per_day =
      getFieldValue("annual_permit_fee") / getFieldValue("estimated_days") || 0;
    let maintenance_per_day =
      getFieldValue("maintenance_per_year") / getFieldValue("estimated_days") ||
      0;
    setFieldsValue({
      per_day_dpr: per_day_dpr.toFixed(2),
      insurance_per_day: insurance_per_day.toFixed(2),
      fuel_per_day: fuel_per_day.toFixed(2),
      reg_per_day: reg_per_day.toFixed(2),
      permit_per_day: permit_per_day.toFixed(2),
      maintenance_per_day: maintenance_per_day.toFixed(2),
    });
    this.setState({
      total:
        parseFloat(per_day_dpr.toFixed(2)) +
        parseFloat(insurance_per_day.toFixed(2)) +
        parseFloat(fuel_per_day.toFixed(2)) +
        parseFloat(reg_per_day.toFixed(2)) +
        parseFloat(permit_per_day.toFixed(2)) +
        parseFloat(maintenance_per_day.toFixed(2)),
    });
  };

  render() {
    let { loading } = this.state;
    if (loading) {
      return (
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0 text-center">
            <Spin />
          </div>
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              onFieldsChange={this.handleFormChange}
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 notes-all-common">
                    <div className="col-2 p-0">
                      <div className="row mx-0 icon-info-notes align-items-center h-100 justify-content-center">
                        <img
                          src={Images.information_green_icon}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                    </div>
                    <div className="col-10">
                      <div className="row mx-0 h-100 icon-info-details align-items-center">
                        <small className="small-text-main">
                          Vehicle calculationsat the group level and at the
                          vehicle level are
                          <b className="text-black-50">NOT</b>
                          associated
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h5>Vehicle Group Calculations</h5>
                  <h6>Per Day Depr</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="estimated_days"
                    label={"Estimated Days of Use per Year *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="estimated_life"
                    label={"Estimated Life (Years) *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="average_hours"
                    label={"Average Hours per Day *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="purchase_cost"
                    label={"Purchase Cost *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6 offset-md-6">
                  <Form.Item
                    name="per_day_dpr"
                    label={"Per Day Depr *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber disabled={true} placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Insurance per Day</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="annual_premium"
                    label={"Annual Auto Insurance Premium *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    disabled={true}
                    name="insurance_per_day"
                    label={"Insurance per Day *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Fuel per Day</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="average_price"
                    label={"Average Fuel Price per Gallon *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="average_gallon"
                    label={"Average Gallons per Day *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6 offset-md-6">
                  <Form.Item
                    name="fuel_per_day"
                    label={"Fuel per Day *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber disabled={true} placeholder={"0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Registration per Day</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="annual_fee"
                    label={"Annual Registration Fee *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="reg_per_day"
                    label={"Registration per Day *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber disabled={true} placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Permit per Day</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="annual_permit_fee"
                    label={"Annual Permit Fee *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="permit_per_day"
                    label={"Permit per Day *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber disabled={true} placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Maintenance</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="maintenance_per_year"
                    label={"Maintenance per Year *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="maintenance_per_day"
                    label={"Maintenance per Day *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber disabled={true} placeholder={"$0.00"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6 offset-sm-6">
                  <ul className="list-inline text-md-right">
                    <li className="list-inline-item">Total Cost per Day:</li>
                    <li className="list-inline-item">${this.state.total}</li>
                  </ul>
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

export default withRouter(CreateVehicleGroupCalculations);

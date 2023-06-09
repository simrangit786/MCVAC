import React, { Component } from "react";
import { Button, Form, InputNumber, message } from "antd";
import { withRouter } from "react-router-dom";
import { getVehicleById, updateVehicle } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import { Image as Images } from "../../../../../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateVehicleCalculations extends Component {
  formRef = React.createRef();

  state = {
    total: null,
  };

  componentDidMount() {
    // this.formRef.current.setFieldsValue({
    //   ...this.props.vehicle,
    // });
    // this.handleFormChange();
    if (this.props.match.params.id) {
      getVehicleById(this.props.match.params.id)
      .then((res)=>{
        this.formRef.current.setFieldsValue({
          ...res.data,
        });
        this.handleFormChange();
      }).catch(err=>{
        handleError(err)
      })
    }
  }

  handleSubmit = (values) => {
    updateVehicle(this.props.vehicle.id, values)
      .then((res) => {
        this.props.setVehicle(res.data, 3);
        message.success("Vehicle updated successfully");
      })
      .catch((err) => {
        handleError(err);
      });
  };
  handleFormChange = () => {
    let { getFieldValue, setFieldsValue } = this.formRef.current;
    let per_day_dpr =
      getFieldValue("purchase_cost") /
        getFieldValue("estimated_life") /
        getFieldValue("estimated_days") || 0;
    let insurance_per_day =
      getFieldValue("annual_premium") / getFieldValue("estimated_days") || 0;
    let fuel_per_day =
      getFieldValue("average_price") / getFieldValue("average_gallon") || 0;
    let reg_per_day =
      getFieldValue("annual_fee") / getFieldValue("estimated_days") || 0;
    let permit_per_day =
      getFieldValue("annual_permit_fee") / getFieldValue("estimated_days") || 0;
    let maintenance_per_day =
      getFieldValue("maintenance_per_year") / getFieldValue("estimated_days") ||
      0;
    let other_cost_per_day =
      getFieldValue("other_cost_per_year") / getFieldValue("estimated_days") ||
      0;
    setFieldsValue({
      per_day_dpr: per_day_dpr.toFixed(2),
      insurance_per_day: insurance_per_day.toFixed(2),
      fuel_per_day: fuel_per_day.toFixed(2),
      reg_per_day: reg_per_day.toFixed(2),
      permit_per_day: permit_per_day.toFixed(2),
      maintenance_per_day: maintenance_per_day.toFixed(2),
      other_cost_per_day: other_cost_per_day.toFixed(2),
    });
    this.setState({
      total:
        parseFloat(per_day_dpr.toFixed(2)) +
        parseFloat(insurance_per_day.toFixed(2)) +
        parseFloat(fuel_per_day.toFixed(2)) +
        parseFloat(reg_per_day.toFixed(2)) +
        parseFloat(permit_per_day.toFixed(2)) +
        parseFloat(maintenance_per_day.toFixed(2)) +
        parseFloat(other_cost_per_day.toFixed(2)),
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Vehicle calculations at the group level and at the vehicle level
                are NOT associated.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFieldsChange={this.handleFormChange}
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                {/* <div className="col-12">
                                    <div className="row mx-0 notes-all-common">
                                        <div className="col-2 p-0">
                                            <div
                                                className="row mx-0 icon-info-notes align-items-center h-100 justify-content-center">
                                                <img src={Images.information_green_icon} alt={""}
                                                     className="img-fluid"/>
                                            </div>
                                        </div>
                                        <div className="col-10">
                                            <div className="row mx-0 h-100 icon-info-details align-items-center">
                                                <small className="small-text-main">
                                                    Vehicle calculations at the group level and at the vehicle level
                                                    are&nbsp;
                                                    <b className="text-black-50">NOT&nbsp;</b>
                                                    associated
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                <div className="col-12 small-heading-in-form">
                  <h6>Per Day Depr</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="estimated_days"
                    label={"Estimated Days of use per year *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber
                      // formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      placeholder={"0"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="estimated_life"
                    label={"Estimated Life (Years) *"}
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
                    <InputNumber type="number" placeholder={"0"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="purchase_cost"
                    label={"Purchase Cost *"}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="per_day_dpr"
                    label={"Per Day Depr *"}
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
                      disabled={true}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 small-heading-in-form">
                  <h6>Insurance Cost</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="annual_premium"
                    label={"Annual Auto Insurance Premium *"}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="insurance_per_day"
                    label={"Insurance per Day *"}
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
                      disabled={true}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 small-heading-in-form">
                  <h6>Fuel Cost</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="average_price"
                    label={"Average Fuel Price per Gallon *"}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="average_gallon"
                    label={"Average Gallons per Day *"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber
                      // formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      placeholder={"0"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6 offset-sm-6">
                  <Form.Item
                    name="fuel_per_day"
                    label={"Fuel per Day *"}
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
                      disabled={true}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 small-heading-in-form">
                  <h6>Registration Cost</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="annual_fee"
                    label={"Annual Registration Fee *"}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="reg_per_day"
                    label={"Registration Per Day *"}
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
                      disabled={true}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 small-heading-in-form">
                  <h6>Permit Cost</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="annual_permit_fee"
                    label={"Annual Permit Fee *"}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="permit_per_day"
                    label={"Permit per Day *"}
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
                      disabled={true}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Maintenance Cost</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="maintenance_per_year"
                    label={"Maintenance per Year *"}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="maintenance_per_day"
                    label={"Maintenance per Day *"}
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
                      disabled={true}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 small-heading-in-form">
                  <h6>Other Cost</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="other_cost_per_year"
                    label={"Other Cost per Year"}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="other_cost_per_day"
                    label={"Other Cost per Day"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber
                      disabled={true}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6 offset-sm-6">
                  <ul className="list-inline text-md-right">
                    <li className="list-inline-item">Total Cost per Day:</li>
                    <li className="list-inline-item">
                      ${this.state.total?.toFixed(2)}
                    </li>
                  </ul>
                  <ul className="list-inline text-md-right">
                    <li className="list-inline-item">Total Cost per Hour:</li>
                    <li className="list-inline-item">
                      ${(this.state.total / (this.formRef.current?.getFieldValue('average_hours'))?.toFixed(2) || 0.00)}
                    </li>
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

export default withRouter(CreateVehicleCalculations);

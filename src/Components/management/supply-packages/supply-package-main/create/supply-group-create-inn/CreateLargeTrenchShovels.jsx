import React, { Component } from "react";
import { Button, Form, Input, InputNumber, message } from "antd";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../../Controller/Global";
import {
  updateSupplyGroup,
  getSupplyGroupById,
} from "../../../../../../Controller/api/supplyServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateLargeTrenchShovels extends Component {
  state = {
    loading: false,
    data: null,
    total: 0,
  };
  formRef = React.createRef();

  componentDidMount() {
    if (this.props.item) {
      this.formRef.current.setFieldsValue({
        ...this.props.item,
      });
      this.handleFormChange();
      this.getResource();
    }
  }
  getResource = () => {
    this.setState({ fetching: true });
    getSupplyGroupById(this.props.item.id)
      .then((res) => {
        this.setState({ resources: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        this.setState({ fetching: false });
      });
  };

  handleFormChange = () => {
    let { getFieldValue, setFieldsValue } = this.formRef.current;
    let per_day_dpr =
      getFieldValue("purchase_price") /
        getFieldValue("estimate_life") /
        getFieldValue("estimated_days") || 0;
    let insurance_per_day =
      getFieldValue("annual_premium") / getFieldValue("estimated_days") || 0;
    let fuel_per_day =
      getFieldValue("annual_premium") / getFieldValue("average_gallon") || 0;
    let reg_per_day =
      getFieldValue("annual_registration_fee") /
        getFieldValue("estimated_days") || 0;
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
        parseFloat(reg_per_day.toFixed(2)) +
        parseFloat(permit_per_day.toFixed(2)) +
        parseFloat(maintenance_per_day.toFixed(2)) +
        parseFloat(other_cost_per_day.toFixed(2)),
    });
  };

  handleSubmit = (values) => {
    // values.name = this.props.data.name
    // values.supply_package_item = this.props.data.id
    values.measurement_unit = "UNITS";

    updateSupplyGroup(this.props.item.id, values)
      .then((res) => {
        message.success("Supply Family updated successfully");
        this.setState({
          data: res.data,
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0">
            <Form
              onFieldsChange={this.handleFormChange}
              onFinish={this.handleSubmit}
              {...layout}
              ref={this.formRef}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 small-heading-in-form">
                  <h5>Supply Group Calculations</h5>
                  <h6>Per Day Depreciation</h6>
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
                    <Input placeholder={"Enter here"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="estimate_life"
                    label={"Estimated Life (Years) *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"Enter here"} />
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
                    <InputNumber placeholder={"Enter here"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="purchase_price"
                    label={"Purchase Price *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
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
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="per_day_dpr"
                    label={"Per Day Depreciation"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
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
                  <h6>Insurance per Day</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="annual_premium"
                    label={"Annual Insurance Premium"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
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
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
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
                  <h6>Registration per Day</h6>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="annual_registration_fee"
                    label={"Annual Registration Fee *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
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
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
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
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
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

export default withRouter(CreateLargeTrenchShovels);

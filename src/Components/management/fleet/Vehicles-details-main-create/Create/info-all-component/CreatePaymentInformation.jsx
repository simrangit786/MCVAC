import React, { Component } from "react";
import { Button, DatePicker, Form, Input, InputNumber, message } from "antd";
import { withRouter } from "react-router-dom";
import { getVehicleById, updateVehicle } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import moment from "moment";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { TextArea } = Input;

class CreatePaymentInformation extends Component {
  formRef = React.createRef();

  componentDidMount() {
    // this.formRef.current.setFieldsValue({
    //   ...this.props.vehicle,
    //   acquisition_date: this.props.vehicle.acquisition_date
    //     ? moment(this.props.vehicle.acquisition_date)
    //     : null,
    //   first_payment_date: this.props.vehicle.first_payment_date
    //     ? moment(this.props.vehicle.first_payment_date)
    //     : null,
    //   acquisition_end_date: this.props.vehicle.acquisition_end_date
    //     ? moment(this.props.vehicle.acquisition_end_date)
    //     : null,
    //   purchase_date: this.props.vehicle.purchase_date
    //     ? moment(this.props.vehicle.purchase_date)
    //     : null,
    //   warrant_expiration_date: this.props.vehicle.warrant_expiration_date
    //     ? moment(this.props.vehicle.warrant_expiration_date)
    //     : null,
    // });

    if (this.props.match.params.id) {
      getVehicleById(this.props.match.params.id)
      .then((res)=>{
        this.formRef.current.setFieldsValue({
            ...res.data,
            acquisition_date: res.data?.acquisition_date
              ? moment(res.data?.acquisition_date)
              : null,
            first_payment_date: res.data?.first_payment_date
              ? moment(res.data?.first_payment_date)
              : null,
            acquisition_end_date: res.data?.acquisition_end_date
              ? moment(res.data?.acquisition_end_date)
              : null,
            purchase_date: res.data?.purchase_date
              ? moment(res.data?.purchase_date)
              : null,
            warrant_expiration_date: res.data?.warrant_expiration_date
              ? moment(res.data?.warrant_expiration_date)
              : null,
          });
      }).catch(err=>{
        handleError(err)
      })
    }
  }

  handleSubmit = (values) => {
    updateVehicle(this.props.vehicle.id, values)
      .then((res) => {
        this.props.setVehicle(res.data, 9);
        message.success("Vehicle updated successfully");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">Please input payment information.</h6>
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
                  <h6 className="mt-0">Payment</h6>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="acquisition_type"
                    label={"Acquisition Type"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="monthaly_cost"
                    label={"Monthly Cost"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      type="number"
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="acquisition_date"
                    label={"Acquisition Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <DatePicker />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="loan_amount"
                    label={"Loan Amount"}
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
                    name="capitalized_cost"
                    label={"Capitalized Cost"}
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
                    name="down_payment_amount"
                    label={"Down Payment Amount"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber
                      placeholder={"$0.00"}
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="annual_percentage_rate"
                    label={"Annual Percentage Rate"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input type="number" placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="first_payment_date"
                    label={"First Payment Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <DatePicker />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="number_of_payment"
                    label={"Number of Payments"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="reference_number"
                    label={"Reference Number"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="residual_value"
                    label={"Residual Value "}
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
                <div className="col-12 col-sm-6" />
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="mileage_cap"
                    label={"Mileage Cap"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="mileage_charge"
                    label={"Mileage Charge"}
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
                    name="acquisition_end_date"
                    label={"Acquisition End Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <DatePicker />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="generate_expenses"
                    label={"Generate Expenses"}
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
                    name="vendor_name"
                    label={"Vendor Name"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="lender_name"
                    label={"Lender Name"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="notes"
                    label={"Notes"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <TextArea
                      placeholder={"Notes"}
                      className={"text-area-main text-area-task"}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 small-heading-in-form">
                  <h6>Purchase & Warranty</h6>
                </div>

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="purchase_date"
                    label={"Purchase Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      placeholder={"mm/dd/yyyy"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="purchase_price"
                    label={"Purchase Price"}
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
                    name="purchase_master_value"
                    label={"Purchase Meter Value"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="purchase_vendor"
                    label={"Purchase Vendor"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Input"} />
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="purchase_comment"
                    label={"Purchase Comment"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <TextArea
                      placeholder={"Purchase Comment"}
                      className={"text-area-main text-area-task"}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="warrant_expiration_date"
                    label={"Warranty Expiration Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <DatePicker placeholder={"mm/dd/yyyy"} />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="warrant_expiration_meter"
                    label={"Warranty Expiration Meter"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Input"} />
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

export default withRouter(CreatePaymentInformation);

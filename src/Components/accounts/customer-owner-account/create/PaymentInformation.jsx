import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Select,
  Spin,
  Table,
  Upload,
} from "antd";
import { Image as Images } from "../../../Images";
import { createCustomerPaymentInfo } from "../../../../Controller/api/customerAccountServices";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class PaymentInformation extends Component {
  state = {
    buttonLoading: false,
    duns: null,
    ein: null,
  };
  formRef = React.createRef();

  onSubmit = (values) => {
    let duns_num = values.duns_number.replace(/-/g, "");
    values.duns_number = duns_num;
    let eIn = values.ein?.replace(/-/g, "");
    values.ein = eIn;
    this.setState({ buttonLoading: true });
    values.account = this.props.account.id;
    values.default_sales_tax = values.tax_exemption ? "EXEMPT" : "NON_EXEMPT";

    createCustomerPaymentInfo(values)
      .then((res) => {
        message.success("Payment Created Successfully");
        this.props.setPayment(res.data,3);
        this.setState({ buttonLoading: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
        this.setState({ buttonLoading: false });
      });
  };
  onNumberOnlyChange = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isValid = new RegExp("[0-9]").test(keyValue);
    // const isValidecimal = new RegExp(".").test(keyValue);
    if (!isValid) {
      event.preventDefault();
      return;
    }
  };
  handleDunChange = (val) => {
    let value = val.target.value;
    value = value
      ?.match(/\d*/g)
      .join("")
      .match(/(\d{0,2})(\d{0,3})(\d{0,4})/)
      .slice(1)
      .join("-")
      .replace(/-*$/g, "");
    this.setState({ duns: value }, () => {
      this.formRef.current.setFieldsValue({ duns_number: this.state.duns });
    });
  };
  handleEinChange = (val) => {
    let value = val.target.value;
    value = value
      ?.match(/\d*/g)
      .join("")
      .match(/(\d{0,2})(\d{0,7})/)
      .slice(1)
      .join("-")
      .replace(/-*$/g, "");
    this.setState({ ein: value }, () => {
      this.formRef.current.setFieldsValue({ ein: this.state.ein });
    });
  };

  render() {
    let { buttonLoading } = this.state;
    let { payment } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.onSubmit}
              hideRequiredMark={true}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="credit_rating"
                    label={"Credit Rating *"}
                    className="position-relative"
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Select
                      disabled={payment}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Credit Rating"
                    >
                      <Option value={"LOW_RISK"}>Low Risk</Option>
                      <Option value={"MODERATE_RISK"}>Moderate Risk</Option>
                      <Option value={"HIGH_RISK"}>High Risk</Option>
                      <Option value={"SEVERE_RISK"}>Severe Risk</Option>
                      <Option value={"OUT_OF_BUSINESS"}>Out of Business</Option>
                    </Select>
                  </Form.Item>
                  <span className="small-text-div-select position-absolute">
                    Please upload credit rating related documents in the
                    documents section.
                  </span>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="payment_term"
                    label={"Payment Term *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Select
                      disabled={payment}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Select Payment Term"
                    >
                      <Option value={"ON_RECEIPT"}>On receipt</Option>
                      <Option value={"DAYS_15"}>15 Days</Option>
                      <Option value={"NET_30"}>Net 30</Option>
                      <Option value={"NET_60"}>Net 60</Option>
                      <Option value={"NET_30_2_PERCENT"}>
                        Net 30 2% 10 day discount
                      </Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="credit_limit"
                    label={"Credit Limit *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input disabled={payment} placeholder="Credit Limit" />
                  </Form.Item>
                </div>
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="sales_tax_type" label={"Sales Tax Type *"} rules={[{
                                        required: true,
                                        message: 'this field is required'
                                    }]}>
                                        <Select disabled={payment}
                                                suffixIcon={
                                                    <img alt="" src={Images.caret_down_small_select}
                                                         className="img-fluid"/>
                                                }
                                                placeholder="Sales Tax Type"
                                        >
                                            <Option value={"CONTRACTOR"}>Contractor</Option>
                                        </Select>
                                    </Form.Item>
                                </div> */}
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="duns_number"
                    label={"DUNS Number *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input
                      disabled={payment}
                      // formatter={value => `${value}`.match(/\d*/g).join('').match(/(\d{0,2})(\d{0,3})(\d{0,4})/).slice(1).join('-')
                      //     .replace(/-*$/g, '')}
                      // parser={value => value.replace(/\$\s?|(-*)/g, '')}
                      placeholder="00-000-0000"
                      onChange={(val) => this.handleDunChange(val)}
                      onKeyPress={this.onNumberOnlyChange}
                      maxLength={"11"}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="Active"
                    label={"Active"}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "this field is required",
                    //   },
                    // ]}
                  >
                    <Select
                      disabled={payment}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Please select"
                    >
                      <Option value={true}>Yes</Option>
                      <Option value={false}>No</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item name="ein" label={"EIN"} rules={[]}>
                    <Input
                      // formatter={value => `${value}`.match(/\d*/g).join('')
                      //     .match(/(\d{0,2})(\d{0,7})/).slice(1).join('-')
                      //     .replace(/-*$/g, '')}
                      //     parser={value => value.replace(/\$\s?|(-*)/g, '')}
                      placeholder="00-0000000"
                      onChange={(val) => this.handleEinChange(val)}
                      onKeyPress={this.onNumberOnlyChange}
                      maxLength={"10"}
                    />
                  </Form.Item>
                </div>

                {/*<div className="col-12 col-sm-6"/>*/}
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="tax_exemption"
                    label={"Sales Tax Exemption Status *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Select
                      disabled={payment}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Default Sales Tax"
                    >
                      <Option value={true} key="a">
                        Exempt
                      </Option>
                      <Option value={false} key="b">
                        Non Exempt
                      </Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item name="entity_type" label={"Entity Type"}>
                    <Select
                      disabled={payment}
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Select Entity type"
                    >
                      <Option value={"INDIVIDUAL"}>
                        Individual/sole proprietor or single-member LLC
                      </Option>
                      <Option value={"CORPORATION"}>C Corporation</Option>
                      <Option value={"S_CORPORATION"}>S Corporation</Option>
                      <Option value={"PARTNERSHIP"}>Partnership</Option>
                      <Option value={"TRUST"}>Trust/estate</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      disabled={payment}
                      loading={buttonLoading}
                      htmlType="submit"
                      className="validate-btn-main"
                    >
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

export default PaymentInformation;

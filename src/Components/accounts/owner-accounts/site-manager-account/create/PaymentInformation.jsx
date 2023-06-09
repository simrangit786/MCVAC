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
import { Image as Images } from "../../../../Images";
import {
  createOwnerPayment,
  updateOwnerPayment,
  getOneOwnerAccount,
} from "../../../../../Controller/api/ownerAccountServices";
import { withRouter } from "react-router-dom";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class PaymentInformation extends Component {
  state = {
    buttonLoading: false,
    paymentLoaded: false,
  };
  formRef = React.createRef();
  onSubmit = (values) => {
    this.setState({ buttonLoading: true });
    values.account = this.props?.account?.id;
    if (this.props.payment) {
      updateOwnerPayment(this.props.payment.id, values)
        .then((res) => {
          this.setState({ buttonLoading: false });
          message.success("Account updated successfully");
          this.props.setPayment(res.data,3);
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
          this.setState({ buttonLoading: false });
        });
    } else {
      createOwnerPayment(values)
        .then((res) => {
          this.setState({ buttonLoading: false });
          message.success("Account updated successfully");
          this.props.setPayment(res.data,3);
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
          this.setState({ buttonLoading: false });
        });
    }
  };

  componentDidMount() {
      if (this.props.match.params.id == this.props.account.id) {
          let payment = {...this.props.payment}
          getOneOwnerAccount(this.props.match.params.id).then(res => {
              payment = {...res.data.payment_information}
              // this.formRef.current.setFieldsValue({
              //     ...payment,
                  // tax_exemption: payment.tax_exemption
              // })
          })
      }
  }

  render() {
    const { buttonLoading } = this.state;
    const { payment } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please choose this account’s tax exemption status.{" "}
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.onSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item
                                        name="credit_rating"
                                        label={"Credit Rating *"}
                                        className="position-relative"
                                        rules={[{
                                            required: true,
                                            message: 'this field is required'
                                        }]}>
                                        <Select
                                            suffixIcon={
                                                <img alt="" src={Images.caret_down_small_select}
                                                     className="img-fluid"/>
                                            }
                                            placeholder="Credit Rating"
                                        >
                                            <Option value={"LOW_RISK"} >Low Risk</Option>
                                            <Option value={"MODERATE_RISK"} >Moderate Risk</Option>
                                            <Option value={"HIGH_RISK"}>High Risk</Option>
                                            <Option value={"SEVERE_RISK"}>Severe Risk</Option>
                                            <Option value={"OUT_OF_BUSINESS"} >Out of Business</Option>
                                        </Select>
                                    </Form.Item>
                                    <span className="small-text-div-select position-absolute">Please upload credit rating related documents in the documents section.</span>
                                </div> */}
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="payment_term" label={"Payment Term *"} rules={[{
                                        required: true,
                                        message: 'this field is required'
                                    }]}>

                                        <Select
                                            suffixIcon={
                                                <img alt="" src={Images.caret_down_small_select}
                                                     className="img-fluid"/>
                                            }
                                            placeholder="Select Payment Term"
                                        >
                                            <Option value={"ON_RECEIPT"}>On receipt</Option>
                                            <Option value={"DAYS_15"}>15 Days</Option>
                                            <Option value={"NET_30"} >Net 30</Option>
                                            <Option value={"NET_60"} >Net 60</Option>
                                            <Option value={"NET_30_2_PERCENT"}>Net 30 2% 10 day discount</Option>
                                        </Select>
                                    </Form.Item>
                                </div> */}
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="credit_limit" label={"Credit Limit *"} rules={[{
                                        required: true,
                                        message: 'this field is required'
                                    }]}>

                                        <Input placeholder={'Credit Limit'}/>
                                    </Form.Item>
                                </div> */}
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="sales_tax_type" label={"Sales Tax Type *"} rules={[{
                                        required: true,
                                        message: 'this field is required'
                                    }]}>

                                        <Select
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

                {
                  //  <div className="col-12 col-sm-6">
                  //     <Form.Item name="duns_number" label={"DUNS Number *"} rules={[{
                  //         required: true,
                  //         message: 'this field is required'
                  //     }]}>
                  //         <InputNumber
                  //             formatter={value => `${value}`.match(/\d*/g).join('')
                  //                 .match(/(\d{0,2})(\d{0,3})(\d{0,4})/).slice(1).join('-')
                  //                 .replace(/-*$/g, '')}
                  //             parser={value => value.replace(/\$\s?|(-*)/g, '')}
                  //             placeholder="00-000-0000"/>
                  //     </Form.Item>
                  // </div>
                }
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="active" label={"Active"} rules={[{
                                        required: true,
                                        message: 'this field is required'
                                    }]}>

                                        <Select
                                            suffixIcon={
                                                <img alt="" src={Images.caret_down_small_select}
                                                     className="img-fluid"/>
                                            }
                                            placeholder="Please select"
                                        >
                                            <Option value={true}>Yes</Option>
                                            <Option value={false}>No</Option>
                                        </Select>
                                    </Form.Item>
                                </div> */}
                {
                  // <div className="col-12 col-sm-6">
                  //     <Form.Item name="ein" label={"EIN"} rules={[]}>
                  //          <InputNumber formatter={value => `${value}`.match(/\d*/g).join('')
                  //                          .match(/(\d{0,2})(\d{0,7})/).slice(1).join('-')
                  //                          .replace(/-*$/g, '')}
                  //                      parser={value => value.replace(/\$\s?|(-*)/g, '')}
                  //                      placeholder="00-0000000"/>
                  //     </Form.Item>
                  // </div>
                }

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="tax_exemption"
                    label={"Sales Tax Exemption Status *"}
                    initialValue={payment?.tax_exemption}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Select
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Default Sales Tax"
                      // defaultValue={payment?.tax_exemption}
                    >
                      {/* <Option value={true}>Yes</Option>
                                            <Option value={false}>No</Option> */}
                      <Option value={true}>Exempt</Option>
                      <Option value={false}>Non Exempt</Option>
                    </Select>
                  </Form.Item>
                </div>
                {/* 
                                <div className="col-12 col-sm-6">
                                    <Form.Item name="entity_type" label={"Entity Type"}>
                                        <Select disabled={payment}
                                                suffixIcon={
                                                    <img alt="" src={Images.caret_down_small_select}
                                                         className="img-fluid"/>
                                                }
                                                placeholder="Select Entity type"
                                        >
                                            <Option value={"INDIVIDUAL"}>Individual/sole proprietor or single-member LLC</Option>
                                            <Option value={"CORPORATION"}>C Corporation</Option>
                                            <Option value={"S_CORPORATION"}>S Corporation</Option>
                                            <Option value={"PARTNERSHIP"}>Partnership</Option>
                                            <Option value={"TRUST"} >Trust/estate</Option>
                                        </Select>
                                    </Form.Item>
                                </div> */}
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      loading={buttonLoading}
                      htmlType={"submit"}
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

export default withRouter(PaymentInformation);

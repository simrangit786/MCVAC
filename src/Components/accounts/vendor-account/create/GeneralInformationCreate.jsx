import React, {Component} from 'react';
import {Button, Form, Input, Select, InputNumber, message} from "antd";
import {Image as Images} from "../../../Images";
import { handleError } from '../../../../Controller/Global';
import { createVendorAccount, updateVendorAccount } from '../../../../Controller/api/vendorAccountServices';
import { formatEin } from '../../../../Controller/utils';

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
class GeneralInformationCreate extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

    componentDidMount() {
      this.formRef.current.setFieldsValue({
          account_type: 'VENDOR'
      })
    }

    componentDidUpdate(prevProps) {
      if(this.props.vendor != prevProps.vendor) {
        this.formRef.current.setFieldsValue({
          ...this.props.vendor,
          ein: this.props.vendor?.ein ? formatEin(this.props.vendor?.ein) : null,
          account_type: 'VENDOR'
      })
      }
    }

    handleCreateVendor = (values) => {
      const type = {
        ...values,
        account_type: "VENDOR",
      };
  
      if (this.props.vendor) {
        updateVendorAccount(type, this.props.vendor.id)
          .then((res) => {
            this.setState({ vendor: res.data });
            message.success("Vendor Account Updated Successfully");
            this.props.setVendor(res.data,2)
          })
          .catch((err) => {
            handleError(err)
          });
      }
      else {
        createVendorAccount(type)
          .then((res) => {
            message.success("Vendor Account Created Successfully");
            // this.setState(prevState => {
            // return {vendor: res.data,unSavedExit: true, activeKey: [...prevState.activeKey,'2']}
            // })
            this.setState({vendor: res.data})
            this.props.setVendor(res.data,2)
            // this.props.handleVendorInfo(res.data, true)
        })
          .catch((err) => {
           handleError(err)
          });
      }
    };

    handleEinChange = e => {
      let value = formatEin(e.target.value);
      this.setState({ ein: value }, () => {
        this.formRef.current.setFieldsValue({ ein: this.state.ein });
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
  

    render() {
        return (
        <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleCreateVendor}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      Please input general information here.
                    </h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Account Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input placeholder="Account Name" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                      name="account_type"
                      label={"Account Type *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                  >
                    <Select
                        disabled={true}
                        showArrow={false}
                        suffixIcon={
                          <img
                              alt=""
                              src={Images.caret_down_small_select}
                              className="img-fluid"
                          />
                        }
                        placeholder="Vendor"
                    >
                      <Option value={"VENDOR"}>Vendor</Option>
                    </Select>
                  </Form.Item>
                    </div>
                <div className="col-12 col-sm-6">
                      <Form.Item
                        name="ein"
                        label={"EIN"}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                      >
                         <Input
                                    placeholder="00-0000000"
                                    onKeyPress={this.onNumberOnlyChange}
                                    maxLength={"10"}
                                    onChange={this.handleEinChange}
                                  />
                      </Form.Item>
                    </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                        name="account_1099"
                        label={"1099"}
                        rules={[
                          {
                            required: false,
                            // message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                  >
                        <Select
                          showArrow={false}
                          suffixIcon={
                            <img
                              alt=""
                              src={Images.caret_down_small_select}
                              className="img-fluid"
                            />
                          }
                          placeholder="Select"
                        >
                          <Option value={"YES"}>Yes</Option>
                          <Option value={"NO"}>No</Option>
                        </Select>
                      </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                    <Form.Item
                      name="epa_id"
                      label={"EPA ID"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <Input
                        placeholder="ABC123456789"
                      />
                    </Form.Item>
                  </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      // loading={buttonLoading}
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

export default GeneralInformationCreate;
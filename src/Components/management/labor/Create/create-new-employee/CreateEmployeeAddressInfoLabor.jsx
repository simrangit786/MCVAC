import React, { Component } from "react";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import { updateEmployee } from "../../../../../Controller/api/labourServices";
import { handleError, TYPES } from "../../../../../Controller/Global";
import { Image as Images } from "../../../../Images";
import { countries } from "../../../../../Controller/country";
import { uniqBy, orderBy } from 'lodash';
import { getAccountCounty } from '../../../../../Controller/api/customerAccountServices';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateEmployeeAddressInfoLabor extends Component {
  state = {
    county: [],
    updateMainState: null,
  }
  formRef = React.createRef();

  componentDidMount() {
    if (this.props.employee) {
      this.formRef.current.setFieldsValue({
        ...this.props.employee,
        country: this.props.employee.country
          ? this.props.employee.country
          : "United States",
      });
    }

    getAccountCounty({ ordering: 'county' })
      .then(response => {
        this.setState({ county: response.data })
        this.setState({ updateMainState: response.data })
      })
      .catch((err) => {
        handleError(err)
        this.setState({ load: false })
      })
  }

  handleSubmit = (values) => {
    updateEmployee(this.props.employee.id, values)
      .then((res) => {
        message.success("Employee Updated successfully!");
        this.props.setEmployee(res.data, 3);
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleCountyChange = (e) => {
    this.formRef.current.setFieldsValue({
      state: null,
    })
    const getState = this.state.county.filter(item => item.county === e)
    this.setState({ updateMainState: getState })
    if (getState?.length === 1) {
      this.formRef.current.setFieldsValue({
        state: getState[0].state
      })

    }
  }
  render() {
    let { county, updateMainState } = this.state;

    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input employee’s address, phone number, email, and
                payroll ID.{" "}
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              hideRequiredMark={true}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-6 border-rit-div">
                  <div className="row">
                    <div className="col-12">
                      <h4>Main Address</h4>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="street"
                        label={"Street Address *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                      >
                        <Input placeholder="Street Address" />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="apartment"
                        label={"Apartment, Suite, etc"}
                        rules={[
                          {
                            required: false,
                          },
                        ]}
                      >
                        <Input placeholder="Apartment, Suite, etc" />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="county"
                        label={"County"}
                        rules={[
                          {
                            required: false,
                            message: "this field is required",
                          },
                        ]}
                      >
                        <Select
                          showSearch

                          suffixIcon={
                            <img
                              alt=""
                              src={Images.caret_down_small_select}
                              className="img-fluid"
                            />
                          }
                          onChange={this.handleCountyChange}

                          placeholder="Select"
                        // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                        >

                          {uniqBy(county, "county").map((c) => (
                            <Select.Option key={c.id} value={c.county}>
                              {c.county}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="city"
                            label={"City *"}
                            rules={[
                              {
                                required: true,
                                message: "this field is required",
                              },
                            ]}
                          >
                            <Input placeholder="City" />
                          </Form.Item>
                        </div>
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="state"
                            label={"State/Province *"}
                            rules={[
                              {
                                required: true,
                                message: "this field is required",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              suffixIcon={
                                <img
                                  alt=""
                                  src={Images.caret_down_small_select}
                                  className="img-fluid"
                                />
                              }

                              placeholder="Select"

                            // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                            >                              {(uniqBy(orderBy(updateMainState, "state"), 'state')).map((c) => (
                              <Select.Option key={c.id} value={c.state}>
                                {c.state}
                              </Select.Option>
                            ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="zip_code"
                            label={"ZIP/Postal Code *"}
                            rules={[
                              {
                                required: true,
                                message: "this field is required",
                              },
                            ]}
                          >
                            <Input placeholder="Zip/Postal Code" />
                          </Form.Item>
                        </div>
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="country"
                            label={"Country *"}
                            rules={[
                              {
                                required: true,
                                message: "this field is required",
                              },
                            ]}
                          >
                            <Select
                              showSearch={true}
                              suffixIcon={
                                <img
                                  alt=""
                                  src={Images.caret_down_small_select}
                                  className="img-fluid"
                                />
                              }
                              placeholder="Country"
                            >
                              {countries.map((c) => (
                                <Select.Option value={c.name}>
                                  {c.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12 position-relative">
                      <h4>Contact Information</h4>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        className="number-arrow-none"
                        name="phone"
                        label={"Phone Number *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`
                              .match(/\d*/g)
                              .join("")
                              .match(/(\d{0,3})(\d{0,3})(\d{0,14})/)
                              .slice(1)
                              .join("-")
                              .replace(/-*$/g, "")
                          }
                          parser={(value) => value.replace(/\$\s?|(-*)/g, "")}
                          placeholder="Phone Number"
                          maxLength="22"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="email"
                        label={"Email Address *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                          { type: "email", message: "Provide valid email!" },
                        ]}
                      >
                        <Input placeholder="Email Address" />
                      </Form.Item>
                    </div>
                  </div>
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

export default CreateEmployeeAddressInfoLabor;

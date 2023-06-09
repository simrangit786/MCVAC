import React, { Component } from "react";
import {
  Button,
  Form,
  Input,
  Checkbox,
  message,
  InputNumber,
  Select,
  Spin,
} from "antd";
import {
  createCustomerBillingAddress,
  createCustomerMainAddress,
  getAccountCounty,

} from "../../../../Controller/api/customerAccountServices";
import { countries } from "../../../../Controller/country";
import { Image as Images } from "../../../Images";
import { orderBy, uniqBy } from "lodash";
import { handleError } from '../../../../Controller/Global';


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class AddressInformation extends Component {
  state = {
    checked: false,
    county: [],
    updateMainState: null,
    updateBillingState: null,
  };
  formRef = React.createRef();
  handleSubmit = (values) => {
    let main = {
      street_address: values.street_address,
      apartment: values.apartment,
      city: values.city,
      state: values.state,
      zip_code: values.zip_code,
      country: values.country,
      phone: values.phone,
      email: values.email,
      account: this.props.account.id,
    };
    let billing = {
      street_address: values.street_address_1,
      apartment: values.apartment_1,
      city: values.city_1,
      state: values.state_1,
      zip_code: values.zip_code_1,
      country: values.country_1,
      is_same_main_address: this.state.checked,
      account: this.props.account.id,
    };
    createCustomerMainAddress(main)
      .then((resp) => {
        createCustomerBillingAddress(billing).then((res) => {
          let address = {
            main_address: resp.data,
            billing_address: res.data,
          };
          this.props.setAddress(address, 4);
          message.success("Address created Successfully");
        });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };



  handleCheckbox = (e) => {
    this.setState({ checked: e.target.checked }, () => {
      if (this.state.checked) {
        let { setFieldsValue, getFieldValue } = this.formRef.current;
        setFieldsValue({
          street_address_1: getFieldValue("street_address"),
          apartment_1: getFieldValue("apartment"),
          city_1: getFieldValue("city"),
          state_1: getFieldValue("state"),
          zip_code_1: getFieldValue("zip_code"),
          country_1: getFieldValue("country"),
          county_1: getFieldValue("county")
        });
      }
    });
  };

  phoneNumberValidate = (rule, value, callback) => {
    if (value?.toString().length < 10) callback("minimum digits should be 10");
    else callback();
  };

  componentDidMount() {
    this.formRef.current.setFieldsValue({
      country: "United States",
      country_1: "United States",
    });


    getAccountCounty({ ordering: 'county' })
      .then(response => {
        this.setState({ county: response.data })
        this.setState({ updateMainState: response.data })
        this.setState({ updateBillingState: response.data })
      })
      .catch((err) => {
        handleError(err)
        this.setState({ load: false })
      })
  }


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

  handleBillingCountyChange = (e) => {
    this.formRef.current.setFieldsValue({
      state_1: null,
    })
    const getState = this.state.county.filter(item => item.county === e)
    this.setState({ updateBillingState: getState })
    if (getState?.length === 1) {
      this.formRef.current.setFieldsValue({
        state_1: getState[0].state
      })
    }
  }



  render() {
    let { county, updateMainState, updateBillingState } = this.state;
    let { address } = this.props;
    // console.log(address, "dfsf")
    let main = null;
    let billing = null;
    if (address) {
      main = address;
      billing = address;
    }
    return (

      <React.Fragment>
        <div className="row common-form-card-row mx-0">
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
                        name="street_address"
                        label={"Street Address *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                      >
                        <Input
                          disabled={address}
                          placeholder="Street Address"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="apartment"
                        label={"Apartment, Suite, etc"}
                      >
                        <Input
                          disabled={address}
                          placeholder="Apartment, Suite, etc"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6">
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
                            <Input disabled={address} placeholder="City" />
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
                            {updateMainState?.length !== 1 ?
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
                              >
                                {(uniqBy(orderBy(updateMainState, "state"), 'state')).map((c) => (
                                  <Select.Option key={c.id} value={c.state}>
                                    {c.state}
                                  </Select.Option>
                                ))}
                              </Select> :
                              <Input placeholder="state" />
                            }
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
                            <Input
                              disabled={address}
                              placeholder="Zip/Postal Code"
                            />
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
                              placeholder="Please select Country"
                            // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                            >
                              {countries.map((c) => (
                                <Select.Option key={c.name} value={c.name}>
                                  {c.name}
                                </Select.Option>
                              ))}
                            </Select>
                            {/* <Input disabled={address} placeholder="Country" defaultValue={main?.country ? main?.country : 'United States'} /> */}
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="phone"
                        label={"Phone Number *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                          { validator: this.phoneNumberValidate },
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
                          placeholder="123-456-7890"
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
                        ]}
                      >
                        <Input disabled={address} placeholder="Email Address" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12 position-relative">
                      <h4>Billing Address</h4>
                      <div className="same-address-label position-absolute">
                        <Form.Item name="is_same_main_address">
                          <Checkbox
                            disabled={address}
                            checked={this.state.checked}
                            onChange={(e) => this.handleCheckbox(e)}
                          >
                            Same as Main Address
                          </Checkbox>
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="street_address_1"
                        label={"Street Address"}
                        rules={[
                          {
                            required: false,
                            message: "this field is required",
                          },
                        ]}
                      >
                        <Input
                          disabled={address}
                          placeholder="Street Address"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <Form.Item
                        name="apartment_1"
                        label={"Apartment, Suite, etc"}
                      >
                        <Input
                          disabled={address}
                          placeholder="Apartment, Suite, etc"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="county_1"
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
                              onChange={this.handleBillingCountyChange}
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
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="city_1"
                            label={"City"}
                            rules={[
                              {
                                required: false,
                                message: "this field is required",
                              },
                            ]}
                          >
                            <Input disabled={address} placeholder="City" />
                          </Form.Item>
                        </div>
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="state_1"
                            label={"State/Province *"}
                            rules={[
                              {
                                required: true,
                                message: "this field is required",
                              },
                            ]}
                          >
                            {updateBillingState?.length !== 1 ?
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
                                onFocus={this.onCountyFocus}
                              // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                              >

                                {(uniqBy(orderBy(updateBillingState, "state"), 'state')).map((c) => (
                                  <Select.Option key={c.id} value={c.state}>
                                    {c.state}
                                  </Select.Option>
                                ))}
                              </Select> :
                              <Input placeholder="state" />
                            }
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="zip_code_1"
                            label={"ZIP/Postal Code"}
                            rules={[
                              {
                                required: false,
                                message: "this field is required",
                              },
                            ]}
                          >
                            <Input
                              disabled={address}
                              placeholder="Zip/Postal Code"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12 col-sm-6">
                          <Form.Item
                            name="country_1"
                            label={"Country"}
                            rules={[
                              {
                                required: false,
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
                              placeholder="Please select Country"
                            // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                            >
                              {countries.map((c) => (
                                <Select.Option key={c.name} value={c.name}>
                                  {c.name}
                                </Select.Option>
                              ))}
                            </Select>
                            {/* <Input disabled={address} placeholder="Country"
                                                            defaultValue={billing?.country ? billing?.country : 'United States'} /> */}
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      disabled={address}
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

export default AddressInformation;

import React, { Component } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import DrawerRequiredSuccessModal from "../../modals/DrawerRequiredSuccessModal";
import {
  createBillingAdd,
  createMainAdd,
  createVendorAccount,
  updateBillingAdd,
  updateMainAdd,
  updateVendorAccount,
} from "../../../Controller/api/vendorAccountServices";
import { countries } from "../../../Controller/country";
import DrawersUnsavedExitModal from "../../modals/DrawersUnsavedExitModal";
import { formatEin } from "../../../Controller/utils";
import { getAccountCounty } from '../../../Controller/api/customerAccountServices';
import { handleError } from '../../../Controller/Global';
import { uniqBy, orderBy } from 'lodash';
import { Image as Images } from "../../Images";


const { Panel } = Collapse;
const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function onChange(e) {
  // console.log(`checked = ${e.target.checked}`);
}

class CreateVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      requiredSuccessModalVisible: false,
      unSavedExit: false,
      activeKey: ['1'],
      county: [],
      updateMainState: null,
      updateBillingState: null,
    };
  }

  formRef = React.createRef();
  mainRef = React.createRef();

  populateVendorData = () => {
    if (this.props.editVendorData && this.formRef?.current) {
      this.formRef.current.setFieldsValue({
        name: this.props.editVendorData.name,
        ein: this.props.editVendorData?.ein,
        account_1099: this.props.editVendorData?.account_1099
      });
      this.mainRef.current.setFieldsValue({
        ...this.props.editVendorData.main_address,
        phone_number: this.props.editVendorData?.main_address?.phone,
        apartment_1: this.props.editVendorData.billing_address?.apartment,
        street_address_1: this.props.editVendorData.billing_address?.street_address,
        country_1: this.props.editVendorData.billing_address?.country,
        city_1: this.props.editVendorData.billing_address?.city,
        state_1: this.props.editVendorData.billing_address?.state,
        zip_code_1: this.props.editVendorData.billing_address?.zip_code,
        county_1: this.props.editVendorData.billing_address?.county

      })
    } else {
      if (this.formRef?.current) {
        this.formRef.current.setFieldsValue({
          country: "US",
          country_1: "US"
        });
      }
    }
  };

  populateData = (e) => {
    if (e == "2") {
      if (this.mainRef?.current) {
        this.mainRef.current.setFieldsValue({
          country: "US",
          country_1: "US",
        });
      }
    }
  };

  showRequiredSuccessModal = (visible) => {
    this.setState({
      requiredSuccessModalVisible: visible,
    });
  };

  handleCreateVendor = (values) => {
    const type = {
      ...values,
      account_type: "VENDOR",
    };

    if (this.props.editVendorData) {
      // updateVendorAccount(type, this.state.vendor.id)
      updateVendorAccount(type, this.props.editVendorData.id)
        .then((res) => {
          this.setState({ vendor: res.data });
          message.success("Vendor Account Updated Successfully");
          if (this.props.editVendorData) {
            this.props.handleVendorInfo(res.data)
          }
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    }
    else {
      createVendorAccount(type)
        .then((res) => {
          message.success("Vendor Account Created Successfully");
          this.setState(prevState => {
            return { vendor: res.data, unSavedExit: true, activeKey: [...prevState.activeKey, '2'] }
          })

          this.props.handleVendorInfo(res.data, true)
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    }
  };

  handleSubmit = (values) => {
    let main = {
      street_address: values.street_address,
      apartment: values.apartment,
      county: values.county,
      city: values.city,
      state: values.state,
      zip_code: values.zip_code,
      country: values.country || 'US',
      phone: values.phone_number,
      email: values.email,
      account: this.state.vendor?.id || this.props.editVendorData.id,
    };
    let billing = {
      street_address: values.street_address_1,
      apartment: values.apartment_1,
      county: values.county_1,
      city: values.city_1,
      state: values.state_1,
      zip_code: values.zip_code_1,
      country: values.country_1 || 'US',
      is_same_main_address: this.state.checked,
      account: this.state.vendor?.id || this.props.editVendorData.id,
    };
    if (this.props.editVendorData?.main_address && this.props.editVendorData?.billing_address) {
      if (this.props.editVendorData) {
        updateMainAdd(main, this.props.editVendorData?.main_address.id)
          .then((resp) => {
            updateBillingAdd(billing, this.props.editVendorData?.billing_address.id).then((res) => {
              this.setState({
                main: resp.data,
                billing: res.data,
              }, () => {
                this.setState({ unSavedExit: false })
              })
              // this.props.setAddress(address);
              message.success("Address updated Successfully");
              this.props.handleVendorAddress(resp.data, res.data)

            });
          })
          .catch((err) => {
            if (err.response) {
              Object.keys(err.response.data).map((e) => {
                message.error(err.response.data[e]);
              });
            }
          });
      }
    } else {
      createMainAdd(main)
        .then((resp) => {
          createBillingAdd(billing).then((res) => {
            this.setState({
              main: resp.data,
              billing: res.data,
            }, () => {
              this.setState({ requiredSuccessModalVisible: true }, () => {
                this.setState({ unSavedExit: false })
              })
            });
            // this.props.setAddress(address);
            message.success("Address created Successfully");
            this.props.handleVendorAddress(resp.data, res.data, true)
          });
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    }
    this.checkDisable();
  };

  handleCheckbox = (e) => {
    this.setState({ checked: e.target.checked }, () => {
      if (this.state.checked) {
        let { setFieldsValue, getFieldValue } = this.mainRef.current;
        setFieldsValue({
          street_address_1: getFieldValue("street_address"),
          apartment_1: getFieldValue("apartment"),
          country_1: getFieldValue("country"),
          city_1: getFieldValue("city"),
          state_1: getFieldValue("state"),
          zip_code_1: getFieldValue("zip_code"),
          county_1: getFieldValue("county"),
        });
      }
    });
  };

  phoneNumberValidate = (rule, value, callback) => {
    if (value?.toString().length < 10) callback("minimum digits should be 10");
    else callback();
  };

  checkDisable = () => {
    if (this.state.vendor && this.state.main && this.state.billing) {
      return false;
    } else {
      return true;
    }
  };

  onCollapseChange = activeKey => {
    console.log(activeKey, "active")
    // if (this.state.activeKey.find(i => i != activeKey))
    // //     this.setState(prevState => {
    // //         return {activeKey: [...prevState.activeKey, activeKey]}
    // //     });
    this.setState(prevState => {
      return { activeKey: activeKey }
    })
  }

  handleClose = () => {
    this.setState({ activeKey: ["1"] })
    this.props.onClose()
  }

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

  handleEinChange = e => {
    let value = formatEin(e.target.value);
    this.setState({ ein: value }, () => {
      this.formRef.current.setFieldsValue({ ein: this.state.ein });
    });
  };

  componentDidMount() {
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
    this.mainRef.current.setFieldsValue({
      state: null,
    })
    const getState = this.state.county.filter(item => item.county === e)
    this.setState({ updateMainState: getState })
    if (getState?.length === 1) {
      this.mainRef.current.setFieldsValue({
        state: getState[0].state
      })

    }
  }

  handleBillingCountyChange = (e) => {
    this.mainRef.current.setFieldsValue({
      state_1: null,
    })
    const getState = this.state.county.filter(item => item.county === e)
    this.setState({ updateBillingState: getState })
    if (getState?.length === 1) {
      this.mainRef.current.setFieldsValue({
        state_1: getState[0].state
      })

    }
  }


  render() {
    const { editVendor } = this.props;
    let { county, updateMainState, updateBillingState } = this.state;
    return (
      <React.Fragment>
        <Drawer
          centered
          destroyOnClose={true}
          title={editVendor ? "Edit Vendor" : "Create Vendor"}
          visible={this.props.visible}
          onOk={this.props.onClose}
          afterVisibleChange={this.populateVendorData}
          closable={true}
          onClose={() => {
            (this.state.unSavedExit ? this.setState({ drawerVisible: true }) :
              this.handleClose());
          }}
          onCancel={() => {
            this.state.unSavedExit ? this.setState({ drawerVisible: true }) :
              this.handleClose()
          }
          }
          className="main-all-form-modal main-drawer-div internal-location drawer-update"
          width={"625px"}
          placement={"right"}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => {
                  this.state.unSavedExit
                    ? this.setState({ drawerVisible: true })
                    : this.props.onClose();
                }}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                disabled={this.checkDisable()}
                onClick={this.props.onClose}
              >
                Create Vendor
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row summary-info-inner-row">
                <div className="col-12">
                  <Collapse
                    // onChange={this.populateData}
                    // accordion
                    defaultActiveKey={["1"]}
                    onChange={this.onCollapseChange}
                    activeKey={this.state.activeKey}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>General Information *</span>
                            {/* <Button className="border-0 shadow-none p-0 bg-transparent text-uppercase">
                              required
                            </Button> */}
                          </div>
                        </div>
                      }
                      key="1"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <Form
                            ref={this.formRef}
                            onFinish={this.handleCreateVendor}
                            {...layout}
                            hideRequiredMark={true}
                            className="main-inner-form"
                          >
                            <div className="row mx-0">
                              <div className="col-12">
                                <Form.Item
                                  name="name"
                                  label={"Account Name *"}
                                  rules={[
                                    {
                                      required: false,
                                      message: "",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder={"Account Name"}
                                  />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="account_type"
                                  label={"Account Type *"}
                                >
                                  <Input disabled={true} placeholder="Vendor" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item name="ein" label={"EIN"} rules={[]}>
                                  <Input
                                    placeholder="00-0000000"
                                    onKeyPress={this.onNumberOnlyChange}
                                    maxLength={"10"}
                                    onChange={this.handleEinChange}
                                  />
                                </Form.Item>
                              </div>
                              <div className="col-12">
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

                              <div className="col-12">
                                <Form.Item name="account_1099" label={"1099"} rules={[]}>
                                  <Select placeholder='Select' >
                                    <Select.Option value="YES">
                                      Yes
                                    </Select.Option>
                                    <Select.Option value="NO">
                                      No
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                  <Button
                                    htmlType="submit"
                                    className="validate-btn-main"
                                  // onClick={() => {this.handleCheckVendor}}
                                  >
                                    Save and Continue
                                  </Button>
                                </Form.Item>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Panel>

                    <Panel
                      disabled={!this.state.vendor && !this.props.editVendorData}
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>Address Information *</span>
                            {/* <Button className="border-0 shadow-none p-0 bg-transparent text-uppercase">
                              required
                            </Button> */}
                          </div>
                        </div>
                      }
                      key="2"
                      forceRender={true}
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <div {...layout} className="main-inner-form">
                            <div className="row mx-0">
                              <Form
                                {...layout}
                                ref={this.mainRef}
                                onFinish={this.handleSubmit}
                                className="main-inner-form w-100"
                              >
                                <div className="row mx-0">
                                  <div className="col-12">
                                    <h5 className="mt-3">Main Address</h5>
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
                                      <Input placeholder="Street Address" />
                                    </Form.Item>
                                  </div>
                                  <div className="col-6">
                                    <Form.Item
                                      name="apartment"
                                      label={"Apartment, Suite, etc"}
                                      rules={[
                                        {
                                          required: false,
                                          message: "",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Apartment, Suite, etc" />
                                    </Form.Item>
                                  </div>
                                  <div className="col-6">
                                    {/* <Form.Item
                                      name="county"
                                      label={"County"}
                                      rules={[
                                        {
                                          required: false,
                                          message: "",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="County" />
                                    </Form.Item> */}
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
                                        {county.map((c) => (
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
                                          message: "please input your city",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Apartment, Suite, etc" />
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
                                      >
                                        {(uniqBy(orderBy(updateMainState, "state"), 'state')).map((c) => (
                                          <Select.Option key={c.id} value={c.state}>
                                            {c.state}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <Form.Item
                                      name="zip_code"
                                      label={"ZIP/Postal Code *"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "please input your zip",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="ZIP/Postal Code" />
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <Form.Item
                                      name="country"
                                      label={"Country *"}
                                      initialValue={'US'}
                                      rules={[
                                        {
                                          required: true,
                                          message: "please select your Country",
                                        },
                                      ]}
                                    >
                                      <Select
                                      // placeholder="Select"

                                      >
                                        {countries.map((i) => {
                                          return (
                                            <Option value={i.code} key={i.code}>
                                              {i.name}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                  <div className="col-12">
                                    <Form.Item
                                      name="phone_number"
                                      label={"Phone Number *"}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "please input your phone number",
                                        },
                                        { validator: this.phoneNumberValidate },
                                      ]}
                                    >
                                      <InputNumber
                                        formatter={(value) =>
                                          `${value}`
                                            .match(/\d*/g)
                                            .join("")
                                            .match(
                                              /(\d{0,3})(\d{0,3})(\d{0,4})/
                                            )
                                            .slice(1)
                                            .join("-")
                                            .replace(/-*$/g, "")
                                        }
                                        maxLength={12}
                                        parser={(value) =>
                                          value.replace(/\$\s?|(-*)/g, "")
                                        }
                                        placeholder="Phone Number"
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
                                          message: "please input your Email",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Email Address" />
                                    </Form.Item>
                                  </div>
                                  <div className="hr-line col-12" />
                                  <div className="col-12">
                                    <div className="row mx-0 my-3 align-items-center justify-content-between">
                                      <h5 className="m-0">Billing Address</h5>
                                      <Form.Item name="is_same_main_address">
                                        <Checkbox
                                          checked={this.state.checked}
                                          onChange={(e) =>
                                            this.handleCheckbox(e)
                                          }
                                        >
                                          Same as Main Address
                                        </Checkbox>
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <Form.Item
                                      name="street_address_1"
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
                                  <div className="col-6">
                                    <Form.Item
                                      name="apartment_1"
                                      label={"Apartment, Suite, etc"}
                                      rules={[
                                        {
                                          required: false,
                                          message: "",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Apartment, Suite, etc" />
                                    </Form.Item>
                                  </div>
                                  <div className="col-6">
                                    {/* <Form.Item
                                      name="county_1"
                                      label={"County"}
                                      rules={[
                                        {
                                          required: false,
                                          message: "",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="County" />
                                    </Form.Item> */}

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
                                      label={"City *"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "please input your city",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="Apartment, Suite, etc" />
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    {/* <Form.Item
                                      name="state_1"
                                      label={"State *"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "please select your state",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="State" />
                                    </Form.Item> */}
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
                                        {(uniqBy(orderBy(updateBillingState, "state"), 'state')).map((c) => (
                                          <Select.Option key={c.id} value={c.state}>
                                            {c.state}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <Form.Item
                                      name="zip_code_1"
                                      label={"ZIP/Postal Code *"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "please input your zip",
                                        },
                                      ]}
                                    >
                                      <Input placeholder="ZIP/Postal Code" />
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <Form.Item
                                      name="country_1"
                                      label={"Country *"}
                                      initialValue={'US'}
                                      rules={[
                                        {
                                          required: true,
                                          message: "please select your Country",
                                        },
                                      ]}
                                    >
                                      <Select>
                                        {countries.map((i) => {
                                          return (
                                            <Option value={i.code} key={i.code}>
                                              {i.name}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 validate-div-col text-md-right">
                                    <Form.Item>
                                      <Button
                                        htmlType="submit"
                                        className="validate-btn-main"
                                      >
                                        Save and continue
                                      </Button>
                                    </Form.Item>
                                  </div>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </div>
          </div >
        </Drawer >

        <DrawerRequiredSuccessModal
          visible={this.state.requiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          onOK={() => {
            this.showRequiredSuccessModal(false);
          }}
          okText={"Continue"}
        />
        <DrawersUnsavedExitModal
          visible={this.state.drawerVisible}
          title="You haven't added all of the required information."
          cancelText="Continue"
          okText="Exit"
          onOK={() => {
            this.props.onClose();
            this.setState({ drawerVisible: false, activeKey: ['1'], vendor: null });
          }}
          onCancel={() => {
            this.setState({ drawerVisible: false });
          }}
        />
        {/*<CommonConfirmationModal heading={"You’ve successfully created this Contact!"}*/}
        {/*                         subHeading={<p className="mb-0">To view this Contact, select View Contact</p>}*/}
        {/*                         okTitle={"View Contact"}*/}
        {/*                         okAction={() => {*/}
        {/*                             this.showConfirmModal(false);*/}
        {/*                             this.props.onClose()*/}
        {/*                         }}*/}
        {/*                         visible={this.state.visibleConfirm}*/}
        {/*                         onClose={() => {*/}
        {/*                             this.showConfirmModal(false);*/}
        {/*                             this.props.onClose()*/}
        {/*                         }}/>*/}
      </React.Fragment >
    );
  }
}

export default CreateVendor;

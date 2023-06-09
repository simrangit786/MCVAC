import React, { Component } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Select,
} from "antd";
import { Image as Images } from "../../../../Images";
import {
  createOwnerSites,
  getOwnerSites,
  removeOwnerSites,
  updateOwnerSites,
} from "../../../../../Controller/api/ownerAccountServices";
import { formatPhone } from "../../../../../Controller/utils";
import { withRouter } from "react-router-dom";
import { countries } from "../../../../../Controller/country";
import { orderBy, uniqBy } from "lodash";
import { getAccountCounty } from '../../../../../Controller/api/customerAccountServices';
import { handleError } from '../../../../../Controller/Global';

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class SitesInfo extends Component {
  state = {
    selectedSite: null,
    sites: [],
    county: [],
    updateMainState: null,
    checked: false
  };
  formRef = React.createRef();

  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleRemove(item)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button
          onClick={() => this.handleEdit(item)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleEdit = (item) => {
    this.setState({ selectedSite: item });
    this.formRef.current.setFieldsValue({ ...item });
  };
  handleRemove = (item) => {
    removeOwnerSites(item.id)
      .then((res) => {
        message.success("Site Removed Successfully");
        this.fetchSites();
        if (item.id === this.state.selectedSite.id) {
          this.formRef.current.resetFields();
          this.setState({ selectedSite: null });
        }
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  fetchSites = () => {
    if (this.props.match.params.id) {
      getOwnerSites({ account: this.props.match.params.id })
        .then((res) => {
          this.setState({ sites: res.data.results }, () =>
            this.props.getSiteDetail(this.state.sites)
          );
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      getOwnerSites({ account: this.props.account.id })
        .then((res) => {
          this.setState({ sites: res.data.results }, () =>
            this.props.getSiteDetail(this.state.sites)
          );
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

  phoneNumberValidate = (rule, value, callback) => {
    if (value.toString().length < 10) callback("minimum digits should be 10");
    else callback();
  };

  componentDidMount() {
    // this.formRef.current.setFieldsValue({
    //   name: `${this.props.account.name} Site`
    // })
    if (this.props.match.params.id) {
      this.fetchSites();
    }
    if (!this.state.selectedSite) {
      this.formRef.current.setFieldsValue({
        country: "United States",
      });
    }
    // else {
    //     if (this.formRef.current) {
    //         this.formRef.current.setFieldsValue({
    //             country: 'United States'
    //         })
    //     }
    // }

    getAccountCounty({ ordering: 'county' })
      .then(response => {
        this.setState({ county: response.data })
        this.setState({ updateMainState: response.data })
      })
      .catch((err) => {
        handleError(err)
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

  handleCheckChange = (e) => {
    this.setState({ checked: e.target.checked }, () => {
      if (this.state.checked) {
        this.formRef.current.setFieldsValue({
          street_address:
            this.props.address?.main?.street_address,
          apartment: this.props.address?.main?.apartment,
          county: this.props.address?.main?.county,
          city: this.props.address?.main?.city,
          state: this.props.address?.main?.state,
          zip_code: this.props.address?.main?.zip_code,
          country: this.props.address?.main?.country || "United States",
          email: this.props.address?.main?.email,
          phone: this.props.address?.main?.phone,
        });
      }
    });
  };


  componentDidUpdate() {
    if (!this.state.selectedSite) {
      this.formRef.current.setFieldsValue({
        country: "United States",
      });
    }
  }

  onSubmit = (values) => {
    values.account = this.props.account.id;
    if (this.state.selectedSite) {
      updateOwnerSites(values, this.state.selectedSite.id)
        .then((res) => {
          message.success("Site Updated Successfully");
          this.setState({ selectedSite: null });
          this.formRef.current.resetFields();
          this.fetchSites();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      createOwnerSites(values)
        .then((res) => {
          message.success("Site Created Successfully");
          this.formRef.current.resetFields();
          this.fetchSites();
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

  handleSubmit = () => {
    message.success("Account Updated Successfully!");
    this.props.setAccount(this.props.account, 4);
  };

  render() {
    const { selectedSite, county, updateMainState } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">Please add all related sites here.</h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.onSubmit}
              ref={this.formRef}
              hideRequiredMark={true}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <Form.Item
                    name="name"
                    initialValue={`${this.props.account.name} Site`}
                    label={"Site Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input placeholder="Site Name "/>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="street_address"
                    label={
                      <div className="d-flex align-items-center justify-content-between">
                        Street Address *
                          <div className="checkbox-div-main position-absolute">
                    <Checkbox
                      onChange={(e) => this.handleCheckChange(e)}
                      // checked={checked}
                    >
                      Same as Main Address
                    </Checkbox>
                  </div>
                      </div>
                    }
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
                
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="apartment"
                    label={"Apartment, Suite, etc"}
                    rules={[
                      {
                        required: false,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input placeholder="Apartment, Suite, etc" />
                  </Form.Item>
                </div>
                {/* <div className="col-12 col-sm-6">
                                    <div className="row"> */}

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
                    >
                      {(uniqBy(orderBy(updateMainState, "state"), 'state')).map((c) => (
                        <Select.Option key={c.id} value={c.state}>
                          {c.state}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                {/* </div>
                                </div> */}
                <div className="col-12 col-sm-6">
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
                        {/* <Input placeholder="Country" /> */}
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
                        // defaultValue={selectedSite?.country ? selectedSite?.country : 'United States'}
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="email"
                    label={"Email Address "}
                  // rules={[{
                  //     required: true,
                  //     message: 'this field is required'
                  // }]}
                  >
                    <Input placeholder="Email Address" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="phone"
                    label={"Phone Number "}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                      // { validator: this.phoneNumberValidate }
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
                      maxLength={22}
                      parser={(value) => value.replace(/\$\s?|(-*)/g, "")}
                      placeholder="Phone Number"
                    />
                  </Form.Item>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button htmlType={"submit"} className="validate-btn-main">
                      {this.state.selectedSite ? "Edit" : "Add"}
                    </Button>
                  </Form.Item>
                </div>
                {this.state.sites.length > 0 ? (
                  <div className="col-12">
                    {this.state.sites.map((item) => (
                      <div style={{
                        minHeight: '102px'
                      }} key={item.id}
                        className="row site-details-row-card position-relative">
                        <div className="col-12 col-sm-3 bg-gray-main">
                          <div className="site-name-location">
                            <img
                              src={Images.location_black_icon}
                              alt=""
                              className="img-fluid"
                            />
                            <span className="text-capitalize">{item.name}</span>
                          </div>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">ADDRESS</h6>
                          <p className="mb-0">{`${item.street_address || ""} ${item.apartment || ""
                            } ${item.city || ""} ${item.state || ""} ${item.country || ""
                            }`}</p>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                          <p className="mb-0 text-elipsiss">{item.email || "-"}</p>
                        </div>
                        <div className="col-12 col-sm-3">
                          <h6 className="text-uppercase">PHONE NUMBER</h6>
                          <p className="mb-0">{formatPhone(item.phone) || ""}</p>
                        </div>
                        <Dropdown
                          overlayClassName="add-remove-dropdown-main"
                          overlay={this.menu(item)}
                          trigger={["click"]}
                        >
                          <Button
                            className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              src={Images.more_black}
                              alt=""
                              className="img-fluid"
                            />
                          </Button>
                        </Dropdown>
                      </div>
                    ))}
                  </div>)
                  :
                  (<div className="col-12">
                    <div className="row add-site-blank-row align-items-center">
                      <div className="col-12 text-center">
                        <img
                          src={Images.location_gray}
                          alt=""
                          className="img-fluid"
                        />
                        <h6>
                          No Sites
                        </h6>
                      </div>
                    </div>
                  </div>)
                }
                <div className="col-12 validate-div-col text-md-right">
                  {/* <Form.Item> */}
                  <Button
                    className="validate-btn-main"
                    onClick={this.handleSubmit}
                  >
                    Save and Continue
                  </Button>
                  {/* </Form.Item> */}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SitesInfo);

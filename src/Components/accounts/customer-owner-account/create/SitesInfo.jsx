import React, { Component } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Menu,
  Dropdown,
  message,
  InputNumber,
} from "antd";
import { Image as Images } from "../../../Images";
import {
  createOwnerSites,
  getOwnerSites,
  removeOwnerSites,
  updateOwnerSites,
} from "../../../../Controller/api/ownerAccountServices";
import { formatPhone } from "../../../../Controller/utils";
import { countries } from "../../../../Controller/country";
import { getAccountCounty } from '../../../../Controller/api/customerAccountServices';
import { handleError } from '../../../../Controller/Global';
import { uniqBy, orderBy } from "lodash";

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
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  componentDidMount() {
    this.formRef.current.setFieldsValue({
      country: "United States",
    });

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


  fetchSites = () => {
    getOwnerSites({ account: this.props.account.id })
      .then((res) => {
        this.setState({ sites: res.data.results }, () => {
          this.props.getSiteDetail(this.state.sites);
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

  render() {
    let { county, updateMainState } = this.state;

    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
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
                    label={"Site Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input placeholder="Site Name " />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
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
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="apartment"
                    label={"Apartment, Suite, etc"}
                    rules={[
                      {
                        required: false,
                        // message: 'this field is required'
                      },
                    ]}
                  >
                    <Input placeholder="Apartment, Suite, etc" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12 col-sm-4">
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
                    <div className="col-12 col-sm-4">
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

                    <div className="col-12 col-sm-4">
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
                  </div>
                </div>
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

                        {/* <Input placeholder="Country" /> */}
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
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
                    <Input placeholder="Email Address" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
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
                      minLength={10}
                      formatter={(value) =>
                        `${value}`
                          .match(/\d*/g)
                          .join("")
                          .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
                          .slice(1)
                          .join("-")
                          .replace(/-*$/g, "")
                      }
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
                {this.state.sites.length === 0 && (
                  <div className="col-12">
                    <div className="row add-site-blank-row align-items-center">
                      <div className="col-12 text-center">
                        <img
                          src={Images.location_gray}
                          alt=""
                          className="img-fluid"
                        />
                        <span className="d-inline-block w-100">
                          Added sites
                          <br />
                          will show up here
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {this.state.sites.map((item) => (
                  <div
                    key={item.id}
                    className="row site-details-row-card position-relative"
                  >
                    <div className="col-12 col-sm-3">
                      <div className="site-name-location">
                        <img
                          src={Images.location_gray}
                          alt=""
                          className="img-fluid"
                        />
                        <span>{item.name}</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">{`${item.street_address} ${item.apartment} ${item.city} ${item.state} ${item.country}`}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">{item.email}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">{formatPhone(item.phone)}</p>
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
                <div className="col-12 validate-div-col text-md-right">
                  <Button
                    className="validate-btn-main"
                    onClick={() =>
                      message.success(
                        "Billing, Site Manager Account Updated Successfully!"
                      )
                    }
                  >
                    Save and Continue
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SitesInfo;

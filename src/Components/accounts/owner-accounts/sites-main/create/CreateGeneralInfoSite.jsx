import React, { Component } from "react";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Select,
  Spin,
} from "antd";
import CreateSiteManagerAccountD from "../../../../drawers/site-manager-account/CreateSiteManagerAccountD";
import {
  getOneAccount,
  getAccount,
  updateCustomerAccount,
  getAccountCounty,
} from "../../../../../Controller/api/customerAccountServices";
import { handleError } from "../../../../../Controller/Global";
import { countries } from "../../../../../Controller/country";
import {
  createOwnerSites,
  getSingleOwnerSites,
  updateOwnerSites,
} from "../../../../../Controller/api/ownerAccountServices";
import { formatPhone, titleCase } from "../../../../../Controller/utils";
import TypeConversionModal from "./TypeConversionModal";
import { Image, Image as Images } from "../../../../Images";
import { withRouter } from "react-router";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import { uniqBy, orderBy } from "lodash";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateGeneralInfoSite extends Component {
  state = {
    visible: false,
    pagination: null,
    accounts: [],
    loading: false,
    selectedAccount: null,
    visibleModal: false,
    selectedSite: null,
    selectedValue: null,
    checked: false,
    visibleWarning: false,
    selectValue: null,
    disableField: false,
    county: [],
    updateMainState: null,
  };
  formRef = React.createRef();

  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
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
    this.setState({ selectedSite: item, disableField: false });
    this.formRef.current.setFieldsValue({ ...item });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getSingleSiteData();
    } else {
      this.formRef.current.setFieldsValue({
        country: "United States",
      });
    }
    this.fetchOwnerAccountData();

    getAccountCounty({ ordering: "county" })
      .then((response) => {
        this.setState({ county: response.data });
        this.setState({ updateMainState: response.data });
      })
      .catch((err) => {
        handleError(err);
      });
  }

  handleCountyChange = (e) => {
    this.formRef.current.setFieldsValue({
      state: null,
    });
    const getState = this.state.county.filter((item) => item.county === e);
    this.setState({ updateMainState: getState });
    if (getState?.length === 1) {
      this.formRef.current.setFieldsValue({
        state: getState[0].state,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.siteData != this.props.siteData) {
      this.setState({ disableField: true });
    }
  }

  getSingleSiteData = () => {
    this.setState({ fetching: true });
    getSingleOwnerSites(this.props.match.params.id)
      .then((res) => {
        console.log(res, "responseeeeee");
        this.setState(
          {
            selectedSite: res.data,
            selectedAccount: res.data.account,
            fetching: false,
          },
          () => {
            // const { site } = this.state.selectedSite
            // console.log(site,"site")
            if (
              this.state.selectedSite.account.main_address.street_address ===
                this.state.selectedSite.street_address &&
              this.state.selectedSite.account.main_address.apartment ===
                this.state.selectedSite.apartment &&
              this.state.selectedSite.account.main_address.county ===
                this.state.selectedSite.county &&
              this.state.selectedSite.account.main_address.city ===
                this.state.selectedSite.city &&
              this.state.selectedSite.account.main_address.state ===
                this.state.selectedSite.state &&
              this.state.selectedSite.account.main_address.zip_code ===
                this.state.selectedSite.zip_code &&
              this.state.selectedSite.account.main_address.country ===
                this.state.selectedSite.country &&
              this.state.selectedSite.account.main_address.email ===
                this.state.selectedSite.email &&
              this.state.selectedSite.account.main_address.phone ===
                this.state.selectedSite.phone
            ) {
              this.setState({ checked: true });
            }
          }
        );
        this.formRef.current.setFieldsValue({ ...res.data });
      })
      .catch((err) => {
        this.setState({ fetching: false });
        handleError(err);
      });
  };

  fetchOwnerAccountData = (params = {}) => {
    this.setState({ loading: true });
    getAccount(params)
      .then((res) => {
        this.setState({
          accounts: res.data.results,
          loading: false,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: res.data.count,
          },
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  handleChange = (value) => {
    console.log(value, "call");
    this.setState({ selectValue: value });
    getOneAccount(value)
      .then((res) => {
        console.log(res, "response");
        if (res.data.account_type === "CUSTOMER") {
          this.setState({ visibleModal: true, selectedValue: null });
        } else {
          this.setState({ selectedAccount: res.data }, () => {
            if (this.state.checked) {
              this.formRef.current.setFieldsValue({
                street_address:
            this.state.selectedAccount?.main_address?.street_address,
          apartment: this.state.selectedAccount?.main_address?.apartment,
          county: this.state.selectedAccount?.main_address?.county,
          city: this.state.selectedAccount?.main_address?.county,
          city: this.state.selectedAccount?.main_address?.city,
          state: this.state.selectedAccount?.main_address?.state,
          zip_code: this.state.selectedAccount?.main_address?.zip_code,
          country: this.state.selectedAccount?.main_address?.country,
          email: this.state.selectedAccount?.main_address?.email,
          phone: this.state.selectedAccount?.main_address?.phone,
              });
            }
            this.formRef.current.setFieldsValue({
              name: `${res.data.name} Site`,
            });
          });
        }
        
      })
      .catch((err) => {
        handleError(err);
      });
  };

  updateAccount = () => {
    updateCustomerAccount(this.state.selectValue, {
      account_type: "CUSTOMER_OWNER",
    })
      .then((res) => {
        this.setState(
          {
            selectedAccount: res.data,
            visibleModal: false,
            selectedValue: null,
          },
          () => {
            if (this.state.checked) {
              this.formRef.current.setFieldsValue({
                street_address:
                  this.state.selectedAccount?.main_address?.street_address,
                apartment: this.state.selectedAccount?.main_address?.apartment,
                county: this.state.selectedAccount?.main_address?.county,
                city: this.state.selectedAccount?.main_address?.county,
                city: this.state.selectedAccount?.main_address?.city,
                state: this.state.selectedAccount?.main_address?.state,
                zip_code: this.state.selectedAccount?.main_address?.zip_code,
                country: this.state.selectedAccount?.main_address?.country,
                email: this.state.selectedAccount?.main_address?.email,
                phone: this.state.selectedAccount?.main_address?.phone,
              });
            }
            this.formRef.current.setFieldsValue({
              name: `${this.state.selectedAccount.name} Site`,
            });
          }
        );
      })
      .catch((err) => {
        handleError(err);
      });
  };

  showManagerAccount = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  handleSubmit = (values) => {
    values.account = this.state.selectedAccount?.id;
    const Id = this.state.selectedSite?.id
      ? this.state.selectedSite?.id
      : this.props.match.params.id;
    if (Id) {
      updateOwnerSites(values, Id)
        .then((res) => {
          this.setState({ selectedSite: res.data }, () => {
            this.setState({ disableField: true });
          });
          message.success("Site Updated Successfully");
          // this.formRef.current.resetFields();
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createOwnerSites(values)
        .then((res) => {
          this.setState({ selectedSite: res.data }, () => {
            this.setState({ disableField: true });
          });
          message.success("Site Created Successfully");
          this.props.setSite(res.data, 2);
          // this.formRef.current.resetFields();
          // this.fetchSites()
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

  onClose = (visible) => {
    this.setState({
      visibleModal: visible,
      selectedAccount: null,
      selectedValue: null,
    });
  };

  handleCheckChange = (e) => {
    this.setState({ checked: e.target.checked }, () => {
      if (this.state.checked) {
        this.formRef.current.setFieldsValue({
          street_address:
            this.state.selectedAccount?.main_address?.street_address,
          apartment: this.state.selectedAccount?.main_address?.apartment,
          county: this.state.selectedAccount?.main_address?.county,
          city: this.state.selectedAccount?.main_address?.city,
          state: this.state.selectedAccount?.main_address?.state,
          zip_code: this.state.selectedAccount?.main_address?.zip_code,
          country: this.state.selectedAccount?.main_address?.country,
          email: this.state.selectedAccount?.main_address?.email,
          phone: this.state.selectedAccount?.main_address?.phone,
        });
      }
    });
  };

  callback = (selectedAccount) => {
    this.setState({ selectedAccount, visible: false }, () => {
      if (this.state.checked) {
        this.formRef.current.setFieldsValue({
          street_address:
            this.state.selectedAccount?.main_address?.street_address,
          apartment: this.state.selectedAccount?.main_address?.apartment,
          county: this.state.selectedAccount?.main_address?.county,
          city: this.state.selectedAccount?.main_address?.county,
          city: this.state.selectedAccount?.main_address?.city,
          state: this.state.selectedAccount?.main_address?.state,
          zip_code: this.state.selectedAccount?.main_address?.zip_code,
          country: this.state.selectedAccount?.main_address?.country,
          email: this.state.selectedAccount?.main_address?.email,
          phone: this.state.selectedAccount?.main_address?.phone,
        });
      }
    });
  };

  checkType = (account_type) => {
    switch (account_type) {
      case "CUSTOMER_OWNER":
        return "Site Manager / Billing Account";
      case "CUSTOMER":
        return "Billing Account";
      case "VENDOR":
        return "Vendor Account";
      default:
        return "Site Manager Account";
    }
  };
  showWarningModal = (visibleWarning) => {
    this.setState({ visibleWarning });
  };

  render() {
    const {
      accounts,
      selectedAccount,
      loading,
      selectedSite,
      fetching,
      checked,
      selectedValue,
      disableField,
      county,
      updateMainState,
    } = this.state;
    if (fetching) {
      return <div />;
    }
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">Please input general information here.</h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              {...layout}
              onFinish={this.handleSubmit}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 small-heading-in-form">
                  <h6>Site Manager</h6>
                </div>

                <div className="col-12">
                  <Form.Item
                    label={"Site Manager / Billing"}
                    rules={[
                      {
                        required: false,
                        //    message: 'this field is required'
                      },
                    ]}
                    className="position-relative remove-cross-icon search-overlap"
                  >
                    <Select
                      // mode="multiple"
                      showSearch={true}
                      filterOption={false}
                      // defaultOpen={true}
                      disabled={selectedAccount ? true : false}
                      value={selectedValue}
                      onFocus={this.fetchOwnerAccountData}
                      placeholder="Search"
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      onSearch={(value) =>
                        this.fetchOwnerAccountData({ search: value })
                      }
                      className="customer-contact"
                      onChange={this.handleChange}
                    >
                      {accounts.map((i) => {
                        return (
                          <Option value={i.id}>
                            <div className="row mx-0 custom-tree-row custom-tree-row-1 align-items-center justify-content-between">
                              <div className="common-select-option-row">
                                <div className="select-option-details d-flex">
                                  <div className={"select-option-icon"}>
                                    <img
                                      src={Images.account_black_icon}
                                      alt={""}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <h6 className="mb-0">
                                    {i.name}
                                    <br />
                                    <small
                                      style={{
                                        color: "#BDBDBD",
                                        fontSize: "11px",
                                        lineHeight: "8px",
                                      }}
                                    >
                                      {this.checkType(i.account_type)}
                                    </small>
                                  </h6>
                                </div>
                              </div>
                              <div className="text-green-tag select-text-tier">
                                {this.checkType(i.account_type)}
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                    <img
                      src={Image.search_small_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </Button>
                  <Button
                    onClick={() => this.showManagerAccount(true)}
                    className="create-btn-main position-absolute text-capitalize"
                    disabled={this.state.selectedAccount ? true : false}
                  >
                    + Create
                  </Button>
                </div>
                {selectedAccount ? (
                  <div className="col-12">
                    <div className="row mx-0 site-details-row-card no-data-card-row align-items-center position-relative">
                      <div className="col-12 col-sm-11 p-0">
                        <div className="row mx-0 align-items-center">
                          <div className="pl-3 pr-2">
                            <img
                              src={Image.person_black_icon}
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="customer-name">
                            <h5 className="text-capitalize mt-0">
                              {selectedAccount.name}
                            </h5>
                            <h6 className="mb-0">
                              {selectedAccount.account_type === "CUSTOMER_OWNER"
                                ? "Site Manager / Billing Account"
                                : selectedAccount.account_type === "SITE_OWNER"
                                ? "Site Manager Account"
                                : "Billing Account"}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-1 col-sm-1 p-0">
                        <div className="row mx-0 align-items-center justify-content-end h-100">
                          <Dropdown
                            overlayClassName="add-remove-dropdown-main"
                            // placement="bottomCenter"
                            overlay={
                              <Menu>
                                <Menu.Item
                                  onClick={() => this.showWarningModal(true)}
                                  key="0"
                                >
                                  <Button className="bg-transparent border-0 shadow-none p-0">
                                    Remove
                                  </Button>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                          >
                            <Button
                              className="bg-transparent p-0 border-0 elipsis-btn-card ant-dropdown-link"
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
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-12">
                    <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                      <div className="col-12 text-center">
                        <img
                          src={Image.no_account_icon}
                          alt=""
                          className="img-fluid"
                        />
                        <h6 className="mb-0">No Account</h6>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-12 small-heading-in-form">
                <h6>Site</h6>
              </div>

              <div className="row mx-0">
                <div className="col-12">
                  <div className="checkbox-div-main position-absolute">
                    <Checkbox
                      onChange={(e) => this.handleCheckChange(e)}
                      checked={checked}
                    >
                      Same as Main Address
                    </Checkbox>
                  </div>
                  <Form.Item
                    name={"name"}
                    label={"Site Name"}
                    rules={[
                      {
                        required: false,
                        //    message: 'this field is required'
                      },
                    ]}
                  >
                    <Input placeholder="Site Name" disabled={disableField} />
                  </Form.Item>
                </div>

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name={"street_address"}
                    label={"Street Address *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Street Address"
                      disabled={disableField}
                    />
                  </Form.Item>
                </div>

                <div className="col-12 col-sm-6">
                  <Form.Item
                    name={"apartment"}
                    label={"Apartment,Suite,etc"}
                    rules={[
                      {
                        required: false,
                        //                                                message: 'this field is required'
                      },
                    ]}
                  >
                    <Input
                      placeholder="Apartment,Suite,etc"
                      disabled={disableField}
                    />
                  </Form.Item>
                </div>

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
                    name={"city"}
                    label={"City *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input placeholder="Enter here" disabled={disableField} />
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
                      {uniqBy(orderBy(updateMainState, "state"), "state").map(
                        (c) => (
                          <Select.Option key={c.id} value={c.state}>
                            {c.state}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12 col-sm-6 pr-2">
                      <Form.Item
                        name={"zip_code"}
                        label={"ZIP/Postal Code *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter here"
                          disabled={disableField}
                        />
                      </Form.Item>
                    </div>

                    <div className="col-12 col-sm-6 pl-2">
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
                              src={Image.caret_down_small_select}
                              className="img-fluid"
                            />
                          }
                          placeholder="Please select Country"
                          disabled={disableField}
                          // defaultValue={'United States'}
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
                    label={"Email Address *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Email Address"
                      disabled={disableField}
                    />
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
                      maxLength={22}
                      disabled={disableField}
                      parser={(value) => value.replace(/\$\s?|(-*)/g, "")}
                      placeholder="Phone Number"
                    />
                  </Form.Item>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button htmlType={"submit"} className="validate-btn-main">
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
                {selectedSite && (
                  <div className="col-12 p-0">
                    <div className="row site-details-row-card position-relative">
                      <div className="col-12 col-sm-3 bg-gray-main">
                        <div className="site-name-location">
                          <img
                            src={Images.location_black_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <span className="text-capitalize">
                            {selectedSite.name}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 col-sm-3">
                        <h6 className="text-uppercase">ADDRESS</h6>
                        <p className="mb-0">{`${
                          selectedSite.street_address || ""
                        } ${selectedSite.apartment || ""} ${
                          selectedSite.city || ""
                        } ${selectedSite.state || ""} ${
                          selectedSite.country || ""
                        }`}</p>
                      </div>
                      <div className="col-12 col-sm-3">
                        <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                        <p className="mb-0 text-elipsiss">
                          {selectedSite.email || ""}
                        </p>
                      </div>
                      <div className="col-12 col-sm-3">
                        <h6 className="text-uppercase">PHONE NUMBER</h6>
                        <p className="mb-0">
                          {formatPhone(selectedSite.phone) || ""}
                        </p>
                      </div>
                      <Dropdown
                        overlayClassName="add-remove-dropdown-main"
                        overlay={this.menu(selectedSite)}
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
                  </div>
                )}
              </div>
            </Form>
          </div>
        </div>
        <CommonWarningModal
          visible={this.state.visibleWarning}
          onClose={() => this.showWarningModal(false)}
          heading={"Are you sure you want to remove this Account?"}
          subHeadingUOM={
            "If you choose to remove this account, this might cause issues."
          }
          common
          commonFunc={() => {
            this.setState({ selectedAccount: null, visibleWarning: false });
          }}
        />
        <CreateSiteManagerAccountD
          callback={this.callback}
          visible={this.state.visible}
          onClose={() => this.showManagerAccount(false)}
        />
        <TypeConversionModal
          visible={this.state.visibleModal}
          heading={
            "Selecting the Billing Account will make the account function as a billing and site manager account."
          }
          // subHeading={'please click on continue Button below!'}
          okAction={() => this.updateAccount()}
          onClose={() => this.onClose(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateGeneralInfoSite);

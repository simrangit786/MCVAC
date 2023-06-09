import React, { Component } from "react";
import { Drawer, Select, Input, message, Checkbox } from "antd";
import { Button } from "antd";
import { getAccountCounty } from "../../../Controller/api/customerAccountServices";
import { handleError } from "../../../Controller/Global";
import { Form } from "antd";
import { uniqBy } from "lodash";
import { orderBy } from "lodash";
import { Image as Images } from "../../Images";
import { countries } from "../../../Controller/country";
import { createOwnerSites } from "../../../Controller/api/ownerAccountServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateSiteDrawer extends Component {
  state = {
    sites: [],
    county: [],
    updateMainState: null,
    unsavedExit: false,
    requiredSuccessModalVisible: false,
    requiredWarningModalVisible: false,
    btnvisible: false,
  };
  formRef = React.createRef();

  getSiteDetail = (data) => {
    this.setState({ sites: data });
  };

  componentDidMount() {
    getAccountCounty({ ordering: "county" })
      .then((response) => {
        this.setState({ county: response.data });
        this.setState({ updateMainState: response.data });
      })
      .catch((err) => {
        handleError(err);
      });
      this.formRef.current.setFieldsValue({
          name: `${this.props.selectedAccounts[0]?.account?.name} Site`
      })
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

  phoneNumberValidate = (rule, value, callback) => {
    if (value.toString().length < 10) callback("minimum digits should be 10");
    else callback();
  };

  handleSubmit = (values) => {
    this.props.selectedAccounts.map((item) => {
      values["account"] = item.account.id;
      createOwnerSites(values)
        .then((res) => {
          message.success("Site Created Successfully");
          this.formRef.current.resetFields();
          this.props.callbackSite(res.data);
          this.setState({ btnvisible: true });
        })
        .catch((err) => {
          handleError(err);
        });
    });
  };

  handleCheckChange = (e) => {
    this.setState({ checked: e.target.checked }, () => {
      if (this.state.checked) {
        this.formRef.current.setFieldsValue({
          street_address:
            this.props.selectedAccounts[0].account?.main_address?.street_address,
          apartment: this.props.selectedAccounts[0].account?.main_address?.apartment,
          county: this.props.selectedAccounts[0].account?.main_address?.county,
          city: this.props.selectedAccounts[0].account?.main_address?.city,
          state: this.props.selectedAccounts[0].account?.main_address?.state,
          zip_code: this.props.selectedAccounts[0].account?.main_address?.zip_code,
          country: this.props.selectedAccounts[0].account?.main_address?.country || "United States",
          email: this.props.selectedAccounts[0].account?.main_address?.email,
          phone: this.props.selectedAccounts[0].account?.main_address?.phone,
        });
      }
    });
  };
  handleVisible = () => {
    if (this.formRef.current) {
    this.formRef.current.setFieldsValue({
        name: `${this.props.selectedAccounts[0]?.account?.name} Site`
    })
}
  }
  render() {
    const { county, updateMainState } = this.state;

    return (
      <>
        <Drawer
          centered
          destroyOnClose={true}
          afterVisibleChange={this.handleVisible}
          title="Create Site"
          visible={this.props.visible}
          width={"625px"}
          placement={"right"}
          maskClosable={false}
          forceRender={true}
          className="main-all-form-modal main-drawer-div drawer-update"
          onClose={() => this.props.onClose()}
          onCancel={() => this.props.onClose()}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => {
                  this.props.onClose();
                }}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                disabled={!this.state.btnvisible}
                onClick={() => {
                  this.props.onClose();
                }}
                type="primary"
              >
                Continue
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row summary-info-inner-row">
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      Below is the required information to create an account. To
                      add more information, please modify the account from the
                      Accounts & Contacts section.
                    </h6>
                  </div>
                  <div className="col-12 p-0">
                    <Form
                      onFinish={this.handleSubmit}
                      ref={this.formRef}
                      hideRequiredMark={true}
                      {...layout}
                      className="main-inner-form"
                    >
                      <div className="row">
                        <div className="col-12">
                          <Form.Item
                            name="name"
                            initialValue={`${this.props?.selectedAccounts[0]?.account?.name} Site`}
                            label={"Site Name *"}
                            rules={[
                              {
                                required: true,
                                message: "this field is required",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Site Name"
                              defaultValue={"Site"}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12 ">
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
                        <div className="col-12 ">
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
                        <div className="col-12 ">
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
                            >
                              {uniqBy(
                                orderBy(updateMainState, "state"),
                                "state"
                              ).map((c) => (
                                <Select.Option key={c.id} value={c.state}>
                                  {c.state}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>
                        <div className="col-12 ">
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
                                initialValue={"United States"}
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
                                  defaultValue={"United States"}
                                  suffixIcon={
                                    <img
                                      alt=""
                                      src={Images.caret_down_small_select}
                                      className="img-fluid"
                                    />
                                  }
                                  placeholder="Please select Country"
                                >
                                  {countries.map((c) => (
                                    <Select.Option value={c.name}>
                                      {c.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                  <Button
                                    htmlType={"submit"}
                                    className="validate-btn-main"
                                    // onClick={this.handleSubmit}
                                  >
                                    Save and Continue
                                  </Button>
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </>
    );
  }
}

export default CreateSiteDrawer;

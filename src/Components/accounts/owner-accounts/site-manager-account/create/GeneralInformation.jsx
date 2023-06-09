import React, { Component } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { Image as Images } from "../../../../Images";
import {
  createOwnerAccount,
  updateOwnerAccount,
  getOneOwnerAccount,
  getIndustries,
} from "../../../../../Controller/api/ownerAccountServices";
import { withRouter } from "react-router-dom";
import * as userType from "../../../../../Controller/userTypes";

const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class GeneralInformation extends Component {
  state = {
    buttonLoading: false,
    industry: [],
    page: 1,
  };
  formRef = React.createRef();

  onSubmit = (values) => {
    this.setState({ buttonLoading: true });
    const newValues = {
      ...values,
      industry: values.industry?.value,
      account_source: values.account_source ? values.account_source : null,
    };
    if (this.props?.account) {
      updateOwnerAccount(this.props?.account?.id, newValues)
        .then((res) => {
          message.success("Account Updated Successfully");
          this.props.setAccount(res.data, 2);
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
    } else {
      const createValues = {
        ...values,
        industry: values.industry ? values.industry.value : null,
        account_source: values.account_source ? values.account_source : null,
      };
      createOwnerAccount(createValues)
        .then((res) => {
          message.success("Account Created Successfully");
          this.props.setAccount(res.data, 2);
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
    }
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      let account = { ...this.props.account };
      getOneOwnerAccount(this.props.match.params.id).then((res) => {
        account.account_type = res.data.account_type;
      });
      if (account.account_type === userType.CUSTOMER_OWNER) {
        account.account_type = userType.CUSTOMER_OWNER;
      }
      this.formRef.current.setFieldsValue({
        ...account,
        industry: this.props.account?.industry
          ? {
              value: this.props.account?.industry?.id,
              label: `${this.props.account?.industry?.title}`,
            }
          : undefined,
      });
    }
    this.getIndustries();
  }

  getIndustries = () => {
    const params = {
      page: this.state.page,
    };
    getIndustries(params).then((res) => {
      if (this.state.page === 1) {
        this.setState({ industry: res.data.results });
      } else {
        this.setState((prevState) => {
          return { industry: [...prevState.industry, ...res.data.results] };
        });
      }
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.account !== this.props.account) {
      let account = { ...this.props.account };
      if (account.account_type === userType.CUSTOMER_OWNER)
        account.account_type = userType.CUSTOMER_OWNER;

      this.formRef.current.setFieldsValue({
        ...account,
        industry: account?.industry
          ? {
              value: this.props.account?.industry?.id,
              label: `${this.props.account?.industry?.title}`,
            }
          : undefined,
      });
    }
  }

  render() {
    let { buttonLoading } = this.state;
    let { account } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">Please input general information here. </h6>
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
                    initialValue={"SITE_OWNER"}
                    className="account-type-item"
                    name="account_type"
                    label={"Account Type *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
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
                      placeholder="Select Payment Term"
                    >
                      <Option value={"CUSTOMER"}>Billing</Option>
                      <Option value={"SITE_OWNER"}>Site Manager</Option>
                      <Option value={"CUSTOMER_OWNER"}>
                        Billing, Site Manager
                      </Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="industry"
                        label={"Industry"}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                        className="position-relative remove-padding-placeholder"
                      >
                        <Select
                          labelInValue
                          suffixIcon={
                            <img
                              alt=""
                              src={Images.caret_down_small_select}
                              className="img-fluid"
                            />
                          }
                          placeholder="Select"
                          onPopupScroll={(e) => {
                            e.persist();
                            let target = e.target;
                            if (
                              target.scrollTop + target.offsetHeight ===
                                target.scrollHeight &&
                              this.state.page < 3
                            ) {
                              this.setState({ page: this.state.page + 1 }, () =>
                                this.getIndustries()
                              );
                            }
                          }}
                        >
                          {" "}
                          {this.state.industry.map((i) => {
                            return <Option value={i.id}>{i.title}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="website"
                    label={"Website"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <Input placeholder="www.website.com" />
                  </Form.Item>
                </div>
                {/* account source try */}

                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="account_source"
                        label={"Account Source"}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                        className="position-relative remove-padding-placeholder account-source-div"
                      >
                        <Select
                          // labelInValue
                          suffixIcon={
                            <img
                              alt=""
                              src={Images.caret_down_small_select}
                              className="img-fluid"
                            />
                          }
                          placeholder="Select"
                        >
                          <Option value={"ADVERTISEMENT"}>Advertisement</Option>
                          <Option value={"CONSTRUCTCONNECT"}>
                            ConstructConnect
                          </Option>
                          <Option value={"WORD_OF_MOUTH"}>Word of Mouth</Option>
                          <Option value={"MARKETING_ASSISTANT"}>
                            Marketing Assistant
                          </Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <Form.Item
                    name="note"
                    label={"Note"}
                    rules={[
                      {
                        // required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="Type something"
                      rows={6}
                      style={{ height: "auto", paddingTop: 15 }}
                    />
                  </Form.Item>
                </div>
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

export default withRouter(GeneralInformation);

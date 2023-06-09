import React, { Component } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { Image as Images } from "../../../Images";
import {
  createCustomerAccount,
  updateCustomerAccount,
} from "../../../../Controller/api/customerAccountServices";
import { withRouter } from "react-router-dom";
import { getIndustries } from "../../../../Controller/api/ownerAccountServices";

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
  handleSubmit = (values) => {
    this.setState({ buttonLoading: true });
    const Id = this.props.match.params.id
      ? this.props.match.params.id
      : this.props?.account?.id;
    if (Id) {
      const newValues = {
        ...values,
        industry: values.industry?.value || null,
        account_source: values.account_source ? values.account_source : null,
        // account_type: 'CUSTOMER'
      };
      updateCustomerAccount(Id, newValues)
        .then((res) => {
          message.success("Billing Account Updated Successfully");
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
        // account_type: 'CUSTOMER'
      };
      createCustomerAccount(createValues)
        .then((res) => {
          message.success("Billing Account Created Successfully");
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
    const { account } = this.props;
    if (this.props.match.params.id) {
      // if(account?.account_type === userType.CUSTOMER_OWNER) {
      //     account.account_type = userType.userTypes.CUSTOMER_OWNER
      // }
      this.formRef.current.setFieldsValue({
        ...account,
        account_type: account?.account_type || "CUSTOMER",
        industry: account?.industry
          ? {
              value: account?.industry?.id || null,
              label: `${account?.industry?.title}` || "",
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

      // if (account.account_type === userType.CUSTOMER_OWNER)
      //     account.account_type = userType.userTypes.CUSTOMER_OWNER

      this.formRef.current.setFieldsValue({
        ...account,
        account_type: account?.account_type || "CUSTOMER",
        industry: account?.industry
          ? {
              value: account?.industry?.id,
              label: `${account?.industry?.title}`,
            }
          : undefined,
      });
    }
  }

  render() {
    const { buttonLoading } = this.state;
    const { account } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
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
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={"CUSTOMER"}
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
                  </div>
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

export default withRouter(GeneralInformation);

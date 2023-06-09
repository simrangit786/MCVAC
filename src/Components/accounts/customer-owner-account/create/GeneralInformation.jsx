import React, { Component } from "react";
import { Button, Dropdown, Form, Input, Menu, message, Select } from "antd";
import { Image as Images } from "../../../Images";
import {
  createCustomerAccount,
  getOneCustomerAccount,
  updateCustomerAccount,
} from "../../../../Controller/api/customerAccountServices";
import { userTypes, CUSTOMER_OWNER } from "../../../../Controller/userTypes";
import { getIndustries } from "../../../../Controller/api/ownerAccountServices";
import { handleError } from '../../../../Controller/Global';

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

  componentDidMount() {
    this.getIndustries();
  }

  handleSubmit = (values) => {
    this.setState({ buttonLoading: true });
    if (this.props.account) {
      const newValues = {
        ...values,
        industry: values.industry?.value || null,
        account_source: values.account_source ? values.account_source : null,
        // account_type: 'CUSTOMER'
      };
      updateCustomerAccount(this.props.account.id, newValues)
        .then((res) => {
          message.success("Billing, Site Manager Account Updated Successfully");
          this.props.setAccount(res.data,2);
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
          message.success("Billing, Site Manager Account Created Successfully");
          this.setState({ buttonLoading: false });
          this.props.setAccount(res.data,2);
        })
        .catch((err) => {
          handleError(err)
          this.setState({ buttonLoading: false });
        });
    }
  };

  getIndustries = () => {
    const params = {
      page: this.state.page,
    };
    getIndustries(params).then((res) => {
      if (this.state.page === 1) {
        this.setState({ industry: res.data?.results });
      } else {
        this.setState((prevState) => {
          return { industry: [...prevState.industry, ...res.data.results] };
        });
      }
    });
  };

  render() {
    const { buttonLoading } = this.state;
    const { account } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
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
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={CUSTOMER_OWNER}
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
                        <Select disabled={true} showArrow={false}>
                          <Option value={"CUSTOMER"}>Billing</Option>
                          <Option value={"SITE_OWNER"}>Site Manager</Option>
                          <Option value={"CUSTOMER_OWNER"}>
                            {userTypes.CUSTOMER_OWNER}
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

export default GeneralInformation;

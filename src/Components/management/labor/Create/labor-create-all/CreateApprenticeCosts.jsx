import React, { Component } from "react";
import { Button, Form, InputNumber, Menu, message, Select } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import {
  getContact,
  updateContact,
} from "../../../../../Controller/api/contactsServices";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateApprenticeCosts extends Component {
  state = {
    contacts: [],
    selectedContacts: [],
    fetching: false,
  };
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
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
    </Menu>
  );
  handleRemove = (item) => {
    let selectedContacts = this.state.selectedContacts.filter(
      (i) => i.id !== item.id
    );
    this.setState({ selectedContacts });
    this.formRef.current.setFieldsValue({
      contacts: this.formRef.current
        .getFieldValue("contacts")
        .filter((i) => i !== item.id),
    });
  };
  fetchContacts = (params = {}) => {
    this.setState({ fetching: true });
    getContact(params)
      .then((res) => {
        this.setState({ contacts: res.data.results, fetching: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
        this.setState({ fetching: false });
      });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      getContact({ account: this.props.match.params.id })
        .then((res) => {
          this.setState({
            selectedContacts: res.data.results,
            contacts: res.data.results,
          });
          let data = {};
          res.data.results.forEach((p) => {
            data[`role${p.id}`] = p.role;
          });
          data.contacts = res.data.results.map((i) => i.id);
          this.formRef.current.setFieldsValue({
            ...data,
          });
        })
        .catch((err) => {});
    }
  }

  handleSelect = (e) => {
    let selectedContacts = this.state.contacts.filter((i) => e.includes(i.id));
    this.setState({ selectedContacts });
  };

  handleSubmit = (values) => {
    values.contacts.map((item) => {
      let data = {
        account: this.props.account.id,
        role: values[`role${item}`],
      };
      updateContact(data, item)
        .then((res) => {
          message.success("Contact added successfully!");
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    });
  };

  render() {
    const { buttonLoading } = this.state;
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
                    name="region"
                    label={"Cost Type *"}
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
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Select cost type"
                    >
                      <Option value={"a"}>Select cost type</Option>
                      <Option value={"b"}>Select cost type</Option>
                    </Select>
                  </Form.Item>
                  <small className="small-text-main position-absolute">
                    Limit 1 cost per cost type
                  </small>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={" "}
                        name="base_rate"
                        label={"Base Rate *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <InputNumber placeholder={"$0.00"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={" "}
                        name="w_c"
                        label={"WC (7%)"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <InputNumber placeholder={"$0.00"} />
                      </Form.Item>
                      <small className="small-text-main position-absolute">
                        Automatically calculated from base rate
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={" "}
                        name="er_taxes"
                        label={"ER Taxes (7.65%)"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <InputNumber placeholder={"$0.00"} />
                      </Form.Item>
                      <small className="small-text-main position-absolute">
                        Automatically calculated from base rate
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={" "}
                        name="suta_futa"
                        label={"SUTA/FUTA (0.8%) *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <InputNumber placeholder={"$0.00"} />
                      </Form.Item>
                      <small className="small-text-main position-absolute">
                        Automatically calculated from base rate
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={" "}
                        name="benefits"
                        label={"Benefits *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <InputNumber placeholder={"$0.00"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        initialValue={" "}
                        name="health_care"
                        label={"Healthcare (per 40hr/week) *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <InputNumber placeholder={"$0.00"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 offset-sm-6">
                  <ul className="list-inline text-md-right">
                    <li className="list-inline-item">Per Hour Total:</li>
                    <li className="list-inline-item">$0.00</li>
                  </ul>
                  <ul className="list-inline text-md-right">
                    <li className="list-inline-item">Per Day Total:</li>
                    <li className="list-inline-item">$0.00</li>
                  </ul>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      loading={buttonLoading}
                      htmlType="submit"
                      className="validate-btn-main"
                    >
                      Add
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <div className="col-12">
            <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
              <div className="col-12 text-center">
                <img
                  src={Images.billing_gray_no_data_icon}
                  alt=""
                  className="img-fluid"
                />
                <h6 className="mb-0 color-gray-3">
                  Added costs will show up here
                </h6>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(CreateApprenticeCosts);

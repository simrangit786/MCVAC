import React, { Component } from "react";
import {
  Button,
  Collapse,
  Drawer,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Select,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../../../Images";
import {
  createContact,
  createContactEmail,
  createContactPhone,
  getContactEmails,
  getContactPhones,
  removeContactEmail,
  removeContactPhone,
  updateContact,
  updateContactEmail,
  updateContactPhone,
} from "../../../../../../Controller/api/contactsServices";
import { formatPhone } from "../../../../../../Controller/utils";
import CommonConfirmationModal from "../../../../../modals/CommonConfirmationModal";
import { withRouter } from "react-router-dom";

const { Panel } = Collapse;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateFacilityDrawer extends Component {
  state = {
    contact: null,
    emails: [],
    phones: [],
    buttonLoading: false,
    visibleConfirm: false,
  };
  formRef = React.createRef();
  emailRef = React.createRef();
  phoneRef = React.createRef();

  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
    });
    this.setState({ contact: null });
  };
  setContact = (contact) => {
    this.setState({ contact });
  };

  handleEdit = (item, type) => {
    if (type === "email") {
      this.emailRef.current.setFieldsValue({
        ...item,
      });
      this.setState({ selectedEmail: item });
    } else {
      this.phoneRef.current.setFieldsValue({
        ...item,
      });
      this.setState({ selectedPhone: item });
    }
  };

  handleRemove = (item, type) => {
    if (type === "email") {
      // removeContactEmail(item.id).then(res => {
      //     message.success("Email removed successfully!");
      //     this.fetchEmails()
      // }).catch(err => {
      //     if (err.response) {
      //         Object.keys(err.response.data).map((e) => {
      //             message.error(err.response.data[e])
      //         })
      //     }
      // })
    } else {
      // removeContactPhone(item.id).then(res => {
      //     message.success("Phone Number removed successfully!");
      //     this.fetchPhones()
      // }).catch(err => {
      //     if (err.response) {
      //         Object.keys(err.response.data).map((e) => {
      //             message.error(err.response.data[e])
      //         })
      //     }
      // })
    }
  };

  fetchEmails = () => {
    // getContactEmails({contact: this.state.contact.id}).then(res => {
    //     this.setState({emails: res.data.results})
    // }).catch(err => {
    //     if (err.response) {
    //         Object.keys(err.response.data).map((e) => {
    //             message.error(err.response.data[e])
    //         })
    //     }
    // })
  };
  fetchPhones = () => {
    // getContactPhones({contact: this.state.contact.id}).then(res => {
    //     this.setState({phones: res.data.results})
    // }).catch(err => {
    //     if (err.response) {
    //         Object.keys(err.response.data).map((e) => {
    //             message.error(err.response.data[e])
    //         })
    //     }
    // })
  };
  handleEmail = (values) => {
    values.contact = this.state.contact.id;
    if (this.state.selectedEmail) {
      // updateContactEmail(values, this.state.selectedEmail.id).then(res => {
      //     message.success("Email Updated Successfully!");
      //     this.setState({selectedEmail: null});
      //     this.emailRef.current.resetFields();
      //     this.fetchEmails()
      // }).catch(err => {
      //     if (err.response) {
      //         Object.keys(err.response.data).map((e) => {
      //             message.error(err.response.data[e])
      //         })
      //     }
      // })
    } else {
      // createContactEmail(values).then(res => {
      //     message.success("Email Created Successfully!");
      //     this.emailRef.current.resetFields();
      //     this.fetchEmails()
      // }).catch(err => {
      //     if (err.response) {
      //         Object.keys(err.response.data).map((e) => {
      //             message.error(err.response.data[e])
      //         })
      //     }
      // })
    }
  };

  handlePhone = (values) => {
    values.contact = this.state.contact.id;
    if (this.state.selectedPhone) {
      updateContactPhone(values, this.state.selectedPhone.id)
        .then((res) => {
          message.success("Phone Number updated Successfully");
          this.setState({ selectedPhone: null });
          this.phoneRef.current.resetFields();
          this.fetchPhones();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      createContactPhone(values)
        .then((res) => {
          message.success("Phone Number Created Successfully!");
          this.phoneRef.current.resetFields();
          this.fetchPhones();
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
  onSubmit = (values) => {
    this.setState({ buttonLoading: true });
    if (this.state.contact) {
      updateContact(values, this.state.contact.id)
        .then((res) => {
          message.success("Contact Updated Successfully");
          this.setContact(res.data);
          this.setState({ buttonLoading: false });
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      if (this.props.account) values["account"] = this.props.account.id;
      createContact(values)
        .then((res) => {
          message.success("Contact Created Successfully");
          this.setContact(res.data);
          this.setState({ buttonLoading: false });
          if (this.props.callbackContact) {
            this.props.callbackContact(res.data);
          }
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

  menu = (item, type) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleRemove(item, type)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button
          onClick={() => this.handleEdit(item, type)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  render() {
    let { contact, buttonLoading, phones, emails } = this.state;
    return (
      <React.Fragment>
        <Drawer
          centered
          destroyOnClose={true}
          title="Create Contact"
          visible={this.props.visible}
          onClose={() => this.props.onClose()}
          onCancel={() => this.props.onClose()}
          className="main-all-form-modal main-drawer-div bg-gray-main"
          width={"625px"}
          placement={"right"}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => this.props.onClose()}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                disabled={!contact}
                onClick={() => this.showConfirmModal(true)}
                type="primary"
              >
                {`${this.props.match.params.id ? "Update" : "Create"} Contact`}
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row summary-info-inner-row">
                <div className="col-12">
                  <Collapse
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>General Information</span>
                            <Button className="border-0 shadow-none p-0 bg-transparent text-uppercase">
                              required
                            </Button>
                          </div>
                        </div>
                      }
                      key="1"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <Form
                            ref={this.formRef}
                            onFinish={this.onSubmit}
                            {...layout}
                            hideRequiredMark={true}
                            className="main-inner-form"
                          >
                            <div className="row mx-0">
                              <div className="col-12">
                                <Form.Item
                                  name="salutation"
                                  label={"Salutation"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Mr.">
                                    <Select.Option value="MR.">
                                      MR.
                                    </Select.Option>
                                    <Select.Option value="MRS.">
                                      MRS.
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="first_name"
                                  label={"First Name *"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Input placeholder="First Name" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="middle_name"
                                  label={"Middle Name"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Middle Name" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="last_name"
                                  label={"Last Name *"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Last Name" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="suffix"
                                  label={"Suffix"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Jr.">
                                    <Select.Option value="JR">JR</Select.Option>
                                    <Select.Option value="SR">SR</Select.Option>
                                    <Select.Option value="I">I</Select.Option>
                                    <Select.Option value="II">II</Select.Option>
                                    <Select.Option value="III">
                                      III
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                  <Button
                                    loading={buttonLoading}
                                    htmlType="submit"
                                    className="validate-btn-main"
                                  >
                                    Validate
                                  </Button>
                                </Form.Item>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Panel>

                    <Panel
                      disabled={!contact}
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>Contact Information</span>
                            <Button className="border-0 shadow-none p-0 bg-transparent text-uppercase">
                              required
                            </Button>
                          </div>
                        </div>
                      }
                      key="2"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <div {...layout} className="main-inner-form">
                            <div className="row mx-0">
                              <Form
                                hideRequiredMark={true}
                                ref={this.emailRef}
                                onFinish={this.handleEmail}
                                {...layout}
                                className="main-inner-form w-100"
                              >
                                <div className="col-12">
                                  <Form.Item
                                    name="name"
                                    label={"Email Address Name"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "this field is required",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Email Address Name" />
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
                                    <Input placeholder="Email Address" />
                                  </Form.Item>
                                </div>
                                <div className="col-12 validate-div-col mt-0 text-md-right">
                                  <Form.Item>
                                    <Button
                                      htmlType="submit"
                                      className="validate-btn-main"
                                    >
                                      Add
                                    </Button>
                                  </Form.Item>
                                </div>
                              </Form>
                              <div className="col-12">
                                {emails.length > 0 ? (
                                  <div>
                                    {emails.map((item) => (
                                      <div key={item.id} className="col-12">
                                        <div className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main">
                                          <div className="col-12">
                                            <div className="user-icons-div">
                                              <img
                                                src={Images.email_inbox_icon}
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                            <div className="user-info-div">
                                              <h6>{item.name}</h6>
                                              <p className="mb-0">
                                                {item.email}
                                              </p>
                                            </div>
                                          </div>
                                          <Dropdown
                                            overlayClassName="add-remove-dropdown-main"
                                            overlay={this.menu(item, "email")}
                                            trigger={["click"]}
                                          >
                                            <Button
                                              className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
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
                                    ))}
                                  </div>
                                ) : (
                                  <div className="row mx-0 no-data-card-row no-data-card-row-2 align-items-center justify-content-center">
                                    <div className="col-12 text-center">
                                      <img
                                        alt={""}
                                        className="img-fluid"
                                        src={Images.email_inbox_icon}
                                      />
                                      <h6 className="mb-0">
                                        Added email addresses <br /> will show
                                        up here
                                      </h6>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Form
                                ref={this.phoneRef}
                                onFinish={this.handlePhone}
                                {...layout}
                                hideRequiredMark={true}
                                className="main-inner-form w-100"
                              >
                                <div className="col-12">
                                  <Form.Item
                                    name="name"
                                    label={"Phone Number Name"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "this field is required",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Phone Number Name" />
                                  </Form.Item>
                                </div>
                                <div className="col-12">
                                  <Form.Item
                                    name="phone_number"
                                    label={"Phone Number *"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "this field is required",
                                      },
                                    ]}
                                  >
                                    <InputNumber
                                      formatter={(value) =>
                                        `${value}`
                                          .match(/\d*/g)
                                          .join("")
                                          .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
                                          .slice(1)
                                          .join("-")
                                          .replace(/-*$/g, "")
                                      }
                                      parser={(value) =>
                                        value.replace(/\$\s?|(-*)/g, "")
                                      }
                                      placeholder="Phone Number"
                                    />
                                  </Form.Item>
                                </div>
                                <div className="col-12 validate-div-col mt-0 text-md-right">
                                  <Form.Item>
                                    <Button
                                      htmlType="submit"
                                      className="validate-btn-main"
                                    >
                                      Add
                                    </Button>
                                  </Form.Item>
                                </div>
                              </Form>
                              <div className="col-12">
                                {phones.length > 0 ? (
                                  <div>
                                    {phones.map((item) => (
                                      <div key={item.id} className="col-12">
                                        <div className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main">
                                          <div className="col-12">
                                            <div className="user-icons-div">
                                              <img
                                                src={Images.call_add_icon}
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                            <div className="user-info-div">
                                              <h6>{item.name}</h6>
                                              <p className="mb-0">
                                                {formatPhone(item.phone_number)}
                                              </p>
                                            </div>
                                          </div>
                                          <Dropdown
                                            overlayClassName="add-remove-dropdown-main"
                                            overlay={this.menu(item, "phone")}
                                            trigger={["click"]}
                                          >
                                            <Button
                                              className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
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
                                    ))}
                                  </div>
                                ) : (
                                  <div className="row mx-0 no-data-card-row no-data-card-row-2 align-items-center justify-content-center">
                                    <div className="col-12 text-center">
                                      <img
                                        alt={""}
                                        className="img-fluid"
                                        src={Images.call_add_icon}
                                      />
                                      <h6 className="mb-0">
                                        Added phone numbers <br /> will show up
                                        here
                                      </h6>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                  <Button
                                    htmlType="submit"
                                    className="validate-btn-main"
                                  >
                                    Validate
                                  </Button>
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
        <CommonConfirmationModal
          heading={"You’ve successfully created this Contact!"}
          subHeading={
            <p className="mb-0">To view this Contact, select View Contact</p>
          }
          okTitle={"View Contact"}
          okAction={() => {
            this.showConfirmModal(false);
            this.props.onClose();
          }}
          visible={this.state.visibleConfirm}
          onClose={() => {
            this.showConfirmModal(false);
            this.props.onClose();
          }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateFacilityDrawer);

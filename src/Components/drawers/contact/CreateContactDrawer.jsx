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
  Radio,
  Select,
  Spin,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../Images";
import {
  createContact,
  createContactAddress,
  createContactEmail,
  createContactPhone,
  getContactEmails,
  getContactPhones,
  getContactPositions,
  removeContactEmail,
  removeContactPhone,
  updateContact,
  updateContactAddress,
  updateContactEmail,
  updateContactPhone,
  updateDefaultEmail,
  updateDefaultPhone,
} from "../../../Controller/api/contactsServices";
import { formatPhone } from "../../../Controller/utils";
import CommonConfirmationModal from "../../modals/CommonConfirmationModal";
import { withRouter } from "react-router-dom";
import DrawersUnsavedExitModal from "../../modals/DrawersUnsavedExitModal";
import DrawerRequiredSuccessModal from "../../modals/DrawerRequiredSuccessModal";
import CommonWarningModal from "../../modals/CommonWarningModal";
import { countries } from "../../../Controller/country";
import { handleError } from "../../../Controller/Global";
import { uniqBy, orderBy } from "lodash";
import { getAccountCounty } from "../../../Controller/api/customerAccountServices";
const { Panel } = Collapse;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option } = Select;

class CreateContactDrawer extends Component {
  state = {
    contact: null,
    address: null,
    emails: [],
    phones: [],
    buttonLoading: false,
    visibleConfirm: false,
    unsavedExit: false,
    drawerrequiredSuccessModalVisible: false,
    activeKey: ["1"],
    visible: false,
    county: [],
    updateMainState: null,
    positions: [],
    fetching: false,
    page: 1,
  };
  formRef = React.createRef();
  emailRef = React.createRef();
  phoneRef = React.createRef();
  addRef = React.createRef();

  componentDidMount() {
    this.setState({ contact: null, address: null });

    getAccountCounty({ ordering: "county" })
      .then((response) => {
        this.setState({ county: response.data });
        this.setState({ updateMainState: response.data });
      })
      .catch((err) => {
        handleError(err);
      });
  }

  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
      contact: null,
    });
  };
  showRequiredSuccessModal = (visible) => {
    this.setState({
      drawerrequiredSuccessModalVisible: visible,
    });
  };
  setContact = (contact) => {
    this.setState({ contact });
  };
  setAddress = (address) => {
    this.setState({ address });
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
      removeContactEmail(item.id)
        .then(() => {
          const emails = this.state.emails.filter((i) => i.id != item.id);
          message.success("Email removed successfully!");
          if (!this.state.emails?.length) {
            this.setState({ unsavedExit: false });
          }
          if (emails.length > 0 && item.default_email) {
            this.handleDefaultEmail(emails[0]?.id);
          } else {
            this.fetchEmails();
          }
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      removeContactPhone(item.id)
        .then(() => {
          const phones = this.state.phones.filter((i) => i.id != item.id);
          message.success("Phone Number removed successfully!");
          if (!this.state.phones?.length) {
            this.setState({ unsavedExit: false });
          }
          if (phones.length > 0 && item.default_phone) {
            this.handleDefaultPhone(phones[0]?.id);
          } else {
            this.fetchPhones();
          }
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  handleCountyChange = (e) => {
    this.addRef.current.setFieldsValue({
      state: null,
    });
    const getState = this.state.county.filter((item) => item.county === e);
    this.setState({ updateMainState: getState });
    if (getState?.length === 1) {
      this.addRef.current.setFieldsValue({
        state: getState[0].state,
      });
    }
  };

  fetchEmails = () => {
    getContactEmails({ contact: this.state.contact.id })
      .then((res) => {
        this.setState({ emails: res.data.results });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };
  fetchPhones = () => {
    getContactPhones({ contact: this.state.contact.id })
      .then((res) => {
        this.setState({ phones: res.data.results });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };
  handleEmail = (values) => {
    values.contact = this.state.contact.id;
    if (this.state.selectedEmail) {
      updateContactEmail(values, this.state.selectedEmail.id)
        .then((res) => {
          message.success("Email Updated Successfully!");
          this.setState({ selectedEmail: null });
          this.emailRef.current.resetFields();
          this.fetchEmails();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      createContactEmail(values)
        .then((res) => {
          message.success("Email Created Successfully!");
          this.fetchEmails();
          this.emailRef.current.resetFields();
          if (this.state.emails.length == 0) {
            this.handleDefaultEmail(res.data.id);
          } else {
            this.fetchEmails();
          }

          // this.handleDefaultEmail(res.data.id).then(res => {
          //     this.setState({showDefault: res.data.default_email})
          // })
          if (this.state.phones?.length && this.state.address) {
            this.setState({ unsavedExit: false });
            this.showRequiredSuccessModal(true);
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
          if (this.state.emails?.length && this.state.address) {
            this.setState({ unsavedExit: false });
            this.showRequiredSuccessModal(true);
          }
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
          this.setState((prevState) => {
            return {
              buttonLoading: false,
              activeKey: [...prevState.activeKey, "3"],
            };
          });
          this.phoneRef.current.resetFields();
          if (this.state.phones.length == 0) {
            this.handleDefaultPhone(res.data.id);
          } else {
            this.fetchPhones();
          }
          // if(this.state.emails?.length && this.state.address) {
          //     this.setState({unsavedExit: false});
          //     this.showRequiredSuccessModal(true);
          // }
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

  onSubmitAccount = (values) => {
    console.log(values, "values");
    const newValues = {
      ...values,
      account: this.props.account?.id,
    };
    this.setState({ buttonLoading: true });
    if (this.state.contact) {
      updateContact(newValues, this.state.contact.id)
        .then((res) => {
          message.success("Account added successfully");
          this.setState({ buttonLoading: false });
        })
        .catch((err) => {
          handleError(err);
          this.setState({ buttonLoading: false });
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
          this.setState((prevState) => {
            return {
              buttonLoading: false,
              unsavedExit: false,
              activeKey: [...prevState.activeKey, "2"],
            };
          });

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

  handleSubmit = (values) => {
    let address = {
      ...values,
      country: values.country || "United States",
      contact: this.state.contact.id,
    };
    if (this.state.address) {
      updateContactAddress(this.state.address.id, address)
        .then((res) => {
          let address = res.data;
          this.setAddress(address);
          message.success("Address updated successfully");
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      createContactAddress(address)
        .then((res) => {
          let address = res.data;
          this.setAddress(address);
          message.success("Address created successfully");
          if (
            this.state.address &&
            this.state.phones?.length &&
            this.state.emails?.length
          ) {
            this.setState({ unsavedExit: false });
            this.showRequiredSuccessModal(true);
          }
          //  this.setState({ buttonLoading: false, unsavedExit: true});
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

  // this.handleRemove(item, type)

  handleDeleteModal = (item = null, type = null, visible) => {
    this.setState({ item, type, visible });
  };

  menu = (item, type) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.handleDeleteModal(item, type, true)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Delete
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

  handleClose = () => {
    this.setState({
      phones: [],
      email: [],
      address: null,
      contact: null,
      activeKey: ["1"],
    });
    this.props.onClose();
  };

  handleDefaultEmail = (e) => {
    updateDefaultEmail(this.state.contact.id, { email_id: e })
      .then(() => {
        this.fetchEmails();
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  handleDefaultPhone = (e) => {
    updateDefaultPhone(this.state.contact.id, { phone_id: e })
      .then(() => {
        this.fetchPhones();
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  phoneNumberValidate = (rule, value, callback) => {
    if (value?.toString().length < 10) callback("minimum digits should be 10");
    else callback();
  };

  fetchPositions = (val) => {
    const { page, search } = this.state;
    let params = {}
    if(val) {
       params = {
        search,
      };
    } else {
      params = {
        page,
      };
    }
    this.setState({ fetching: true });
    getContactPositions(params)
      .then((res) => {
        if (page === 1) {
          this.setState({
            positions: res.data.results,
            totalCount: res.data.count,
          });
        } else {
          this.setState((prevState) => {
            return { positions: [...prevState.positions, ...res.data.results] };
          });
        }
      })
      .catch((err) => {
        handleError(err);
      })
      .finally(() => {
        this.setState({ fetching: false });
      });
  };

  onCollapseChange = (activeKey) => {
    // if (this.state.activeKey.find(i => i != activeKey))
    //     this.setState(prevState => {
    //         return {activeKey: [...prevState.activeKey, activeKey]}
    //     });
    // this.setState({activeKey})
    this.setState({ activeKey: activeKey });
  };
  resetcontactFields = () => {
    if (this.state.unsavedExit) {
      this.setState({ drawerVisible: true });
    } else {
      this.props.onClose();
      this.setState({
        phones: [],
        emails: [],
        address: null,
        contact: null,
        activeKey: ["1"],
      });
    }
  };

  render() {
    let {
      contact,
      buttonLoading,
      phones,
      emails,
      activeKey,
      address,
      county,
      positions,
      fetching,
      totalCount,
      updateMainState,
    } = this.state;
    const defaultEmail = emails?.find((i) => i?.default_email === true)?.id;
    const defaultPhone = phones?.find((d) => d?.default_phone === true)?.id;

    return (
      <React.Fragment>
        <DrawersUnsavedExitModal
          visible={this.state.drawerVisible}
          title="You haven't added all of the required information."
          cancelText="Continue"
          okText="Exit"
          onOK={() => {
            this.props.onClose();
            this.setState({
              drawerVisible: false,
              phones: [],
              emails: [],
              address: null,
              contact: null,
              activeKey: ["1"],
            });
          }}
          onCancel={() => {
            this.setState({ drawerVisible: false });
          }}
        />
        <DrawerRequiredSuccessModal
          visible={this.state.drawerrequiredSuccessModalVisible}
          heading={"You've successfully added all of the required information."}
          onOK={() => {
            // this.setState({ phones: [], emails: [] })
            this.showRequiredSuccessModal(false);
          }}
          okText={"Continue"}
        />
        <Drawer
          centered
          destroyOnClose={true}
          title="Create Contact"
          visible={this.props.visible}
          onClose={() => {
            // this.props.onClose()
            this.state.unsavedExit
              ? this.setState({ drawerVisible: true })
              : this.handleClose();
          }}
          onCancel={() =>
            // this.props.onClose()
            {
              this.state.unsavedExit
                ? this.setState({ drawerVisible: true })
                : this.props.onClose();
            }
          }
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"625px"}
          placement={"right"}
          maskClosable={false}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => {
                  this.state.unsavedExit
                    ? this.setState({ drawerVisible: true })
                    : this.props.onClose();
                }}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                disabled={!contact}
                onClick={() => {
                  this.resetcontactFields();
                }}
                type="primary"
              >
                {/* {`${this.props?.match?.params?.id ? "Update" : "Create"}`} */}
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
                  <Collapse
                    // accordion
                    defaultActiveKey={["1"]}
                    onChange={this.onCollapseChange}
                    activeKey={activeKey}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>General Information *</span>
                            {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                          </div>
                        </div>
                      }
                      key="1"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <div className="row mx-0 info-gray-div align-items-center">
                            <h6 className="mb-0">
                              Please input general information here.
                            </h6>
                          </div>
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
                                      required: false,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Select">
                                    <Select.Option value="MR.">
                                      Mr.
                                    </Select.Option>
                                    <Select.Option value="MRS.">
                                      Mrs.
                                    </Select.Option>
                                    <Select.Option value="MS.">
                                      Ms.
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
                                      required: false,
                                      message: " ",
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
                                      required: false,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Select">
                                    <Select.Option value={null}>
                                      Select
                                    </Select.Option>
                                    <Select.Option value="JR">
                                      Jr.
                                    </Select.Option>
                                    <Select.Option value="SR">
                                      Sr.
                                    </Select.Option>
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
                      disabled={!contact}
                      header={
                        <div className="col-12">
                          <div className="row info-card-heading-row align-items-center justify-content-between">
                            <span>Contact Information <sup>*</sup></span>
                            {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                          </div>
                        </div>
                      }
                      key="2"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <div className="row mx-0 info-gray-div align-items-center">
                            <h6 className="mb-0">
                              Please add all emails and phone numbers related to
                              this contact.
                            </h6>
                          </div>
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
                                    label={"Email Address Type"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "this field is required",
                                      },
                                    ]}
                                  >
                                    {/* <Input placeholder="Email Address Name" /> */}
                                    <Select
                                      placeholder={"Select"}
                                      // defaultValue={"Select"}
                                      // value={{value: proposal.status?.id, label: proposal.status?.title}}
                                      // style={{ width: 250 }}
                                      suffixIcon={
                                        <img
                                          src={Images.caret_small_icon_select}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      }
                                    >
                                      <Option value={"WORK"}>Work</Option>
                                      <Option value={"PERSONAL"}>
                                        Personal
                                      </Option>
                                    </Select>
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
                                      {
                                        type: "email",
                                        message: "Valid Email is required",
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
                              <div className="col-12 p-0">
                                {emails.length > 0 ? (
                                  <div>
                                    <Radio.Group
                                      className={"w-100"}
                                      name="email"
                                      value={defaultEmail}
                                      onChange={(e) =>
                                        this.handleDefaultEmail(e.target.value)
                                      }

                                      //  defaultValue={defaultEmail && defaultEmail }
                                    >
                                      {emails.map((item) => (
                                        <div key={item.id} className="col-12">
                                          <div
                                            className={`row mx-0 pb-0 align-items-center user-info-div-main position-relative opportunity-info-div-main ${
                                              item.default_email && "active"
                                            }
                                                                                    `}
                                          >
                                            <div className="col-12 p-2">
                                              <div className="user-icons-div">
                                                <img
                                                  src={Images.email_inbox_icon}
                                                  alt=""
                                                  className="img-fluid"
                                                />
                                              </div>
                                              <div className="user-info-div">
                                                <h6>
                                                  {item.name.toLowerCase()}
                                                </h6>
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

                                            <div className="col-12 p-0 radio-btn-custom">
                                              {/* {console.log(item.id,'check')} */}
                                              <Radio
                                                className="active"
                                                value={item.id}
                                                checked={item.default_email}
                                                // onChange={() => this.handleDefaultEmail(item.id)}
                                              >
                                                Default Email
                                              </Radio>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </Radio.Group>
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
                                    label={"Phone Number Type *"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "this field is required",
                                      },
                                    ]}
                                  >
                                    {/* <Input placeholder="Phone Number Name" /> */}
                                    <Select
                                      placeholder={"Select"}
                                      // defaultValue={"Select"}
                                      // value={{value: proposal.status?.id, label: proposal.status?.title}}
                                      // style={{ width: 250 }}
                                      suffixIcon={
                                        <img
                                          src={Images.caret_small_icon_select}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      }
                                    >
                                      <Option value={"WORK_MAIN"}>
                                        Work (Main)
                                      </Option>
                                      <Option value={"WORK_DIRECT"}>
                                        Work (Direct)
                                      </Option>
                                      <Option value={"PERSONAL"}>
                                        Personal
                                      </Option>
                                      <Option value={"MOBILE"}>Mobile</Option>
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
                                      stringMode={true}
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
                              <div className="col-12 p-0">
                                {phones.length > 0 ? (
                                  <div>
                                    <Radio.Group
                                      name="phone"
                                      value={defaultPhone}
                                      onChange={(e) =>
                                        this.handleDefaultPhone(e.target.value)
                                      }
                                    >
                                      {phones.map((item) => (
                                        <div
                                          key={item.id}
                                          className="col-12 mb-3"
                                        >
                                          <div
                                            className={`row mx-0 pb-0 align-items-center user-info-div-main position-relative opportunity-info-div-main ${
                                              item.default_phone && "active"
                                            }
                                                                                    `}
                                          >
                                            <div className="col-12">
                                              <div className="user-icons-div">
                                                <img
                                                  src={Images.call_add_icon}
                                                  alt=""
                                                  className="img-fluid"
                                                />
                                              </div>
                                              <div className="user-info-div">
                                                {/* <h6>{item.name?.includes('_') ? item.name?.split('_').join(" ").toLowerCase() : item.name?.toLowerCase()}</h6> */}
                                                <h6>
                                                  {item.name === "WORK_MAIN"
                                                    ? "Work (Main)"
                                                    : item.name ===
                                                      "WORK_DIRECT"
                                                    ? "Work (Direct)"
                                                    : item.name?.toLowerCase()}
                                                </h6>
                                                <p className="mb-0">
                                                  {formatPhone(
                                                    item.phone_number
                                                  )}
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

                                            <div className="col-12 p-0 radio-btn-custom">
                                              <Radio
                                                className="active"
                                                value={item.id}
                                                // onChange={() => this.handleDefaultPhone(item.id)}
                                                checked={item.default_phone}
                                              >
                                                Default Phone Number
                                              </Radio>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </Radio.Group>
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
                                    Save and Continue
                                  </Button>
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Panel>

                    <Panel
                      disabled={!contact}
                      header={
                        <div className="col-12">
                          <div className="row info-card-heading-row align-items-center justify-content-between">
                            <span>Address Information <sup>*</sup></span>
                            {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                          </div>
                        </div>
                      }
                      key="3"
                    >
                      <div className="col-12">
                        <div className="row mx-0 info-gray-div align-items-center">
                          <h6 className="mb-0">
                            Please input main address and billing address.
                          </h6>
                        </div>
                        <Form
                          ref={this.addRef}
                          onFinish={this.handleSubmit}
                          {...layout}
                          hideRequiredMark={true}
                          className="main-inner-form"
                        >
                          <div className="row mx-0">
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
                            <div className="col-12 col-sm-6">
                              <Form.Item
                                name="apartment"
                                label={"Apartment, Suite, etc"}
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: "this field is required",
                                //     },
                                // ]}
                              >
                                <Input placeholder="Location Name" />
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
                            <div className="col-12">
                              <div className="row">
                                <div className="col-6">
                                  <Form.Item
                                    name="zip_code"
                                    label={"Zip/Postal Code *"}
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
                                <div className="col-6">
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
                                      // defaultValue={editData?.country ? editData?.country : 'United States'}
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
                            <div className="col-12 validate-div-col text-md-right">
                              <Form.Item>
                                <Button
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
                    </Panel>
                    <Panel
                      disabled={!contact}
                      header={
                        <div className="col-12">
                          <div className="row info-card-heading-row align-items-center justify-content-between">
                            <span>
                              Account <sup>*</sup>
                            </span>
                          </div>
                        </div>
                      }
                      key="4"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <div {...layout} className="main-inner-form">
                            <div className="row mx-0">
                              <Form
                                ref={this.formRef}
                                onFinish={this.onSubmitAccount}
                                {...layout}
                                hideRequiredMark={true}
                                className="main-inner-form w-100"
                              >
                                <div className="row">
                                  <div className="col-12">
                                    <div className="row mx-0 info-gray-div align-items-center">
                                      <h6 className="mb-0">
                                        Please choose one position for this
                                        contact.
                                      </h6>
                                    </div>
                                    <Form.Item
                                      name="role"
                                      label={"Position*"}
                                      rules={[
                                        {
                                          required: true,
                                          message: "this field is required",
                                        },
                                      ]}
                                    >
                                      {/* <Input placeholder="Email Address Name" /> */}
                                      <Select
                                        showSearch
                                        suffixIcon={
                                          <img
                                            src={Images.caret_down_small_select}
                                            alt=""
                                            className="img-fluid"
                                          />
                                        }
                                        placeholder={"Select"}
                                        filterOption={false}
                                        onSearch={(e) => this.setState({search: e},() => {
                                          this.fetchPositions(true)
                                        })}
                                        onFocus={() => this.fetchPositions()}
                                        dropdownRender={(options) => (
                                          <>
                                            {options}
                                            {fetching && (
                                              <div className="text-center">
                                                <Spin />
                                              </div>
                                            )}
                                          </>
                                        )}
                                        onPopupScroll={(e) => {
                                          // e.persist();
                                          let target = e.target;
                                          if (
                                            target.scrollTop +
                                              target.offsetHeight ===
                                              target.scrollHeight &&
                                            totalCount != positions.length
                                          ) {
                                            this.setState(
                                              { page: this.state.page + 1 },
                                              () => this.fetchPositions()
                                            );
                                          }
                                        }}
                                      >
                                        {positions.map((i, index) => {
                                          return (
                                            <Option
                                              value={i.name}
                                              key={`${i.name + index}`}
                                            >
                                              {i.name}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  </div>
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
        <CommonWarningModal
          newCommonModal
          // wageInfoDelete
          removeConFunc={() => {
            this.handleRemove(this.state.item, this.state.type);
            this.setState({
              item: null,
              type: null,
              visible: false,
            });
          }}
          heading={`Are you sure you want to remove this ${
            this.state.type === "email" ? "email" : "phone number"
          }?`}
          subHeadingUOM={" "}
          visible={this.state.visible}
          // commonFunc={() => }
          onClose={() => this.handleDeleteModal(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateContactDrawer);

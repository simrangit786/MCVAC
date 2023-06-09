import React, { Component } from "react";
import { Button, Dropdown, Form, Menu, message, Select, Spin } from "antd";
import { Image as Images } from "../../Images";
import {
  createContact,
  deleteContact,
  getContactAccount,
  getContacts,
  updateContact,
} from "../../../Controller/api/opportunityServices";
import { withRouter } from "react-router-dom";
import black_dots_elipsis from "../../../assets/images/icons/black-dots-elipsis.png";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class AccountsContacts extends Component {
  state = {
    contact_account: [],
    selectedContacts: [],
    fetching: false,
  };
  formRef = React.createRef();
  menu = (item, type) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.removeAccContact(item, type)}
          className="border-0 bg-transparent text-center p-0 w-100"
        >
          Remove
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button className="border-0 bg-transparent text-center p-0 w-100">
          Change
        </Button>
      </Menu.Item>
    </Menu>
  );

  fetchContacts = (search = {}) => {
    this.setState({ fetching: true });
    getContactAccount(search)
      .then((res) => {
        let newAcc = res.data.account.map((item) => {
          item.newId = item.id + "acc";
          item.newName = item.name + " - Account";
          item.type = "account";
          return item;
        });
        let newCon = res.data.contact.map((item) => {
          item.newId = item.id + "con";
          item.newName = `${item.first_name} ${item.last_name} - Contact`;
          item.type = "contact";
          return item;
        });
        this.setState({
          contact_account: [...newAcc, ...newCon],
          fetching: false,
        });
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

  fetchSelectedContacts = () => {
    getContacts({ opportunity: this.props.opportunity.id })
      .then((res) => {
        this.setState({ selectedContacts: res.data.results });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  removeAccContact = (item, type) => {
    if (
      (type === "account" && item.contact === null) ||
      (type === "contact" && item.account === null)
    ) {
      deleteContact(item.id)
        .then((res) => {
          this.fetchSelectedContacts();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      let data = {
        [type]: null,
        opportunity: this.props.opportunity.id,
      };
      updateContact(data, item.id)
        .then((res) => {
          this.fetchSelectedContacts();
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

  handleSubmit = (values) => {
    let data = this.state.contact_account.find((item) => item.newId === values);
    let params;
    if (data.type === "account") {
      params = {
        opportunity: this.props.opportunity.id,
        account: data.id,
        contact: null,
      };
    } else {
      params = {
        opportunity: this.props.opportunity.id,
        account: data.account ? data.account.id : null,
        contact: data.id,
      };
    }
    createContact(params)
      .then((res) => {
        this.formRef.current.resetFields();
        this.fetchSelectedContacts();
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
    if (this.props.match.params.id) {
      this.fetchContacts();
      this.fetchSelectedContacts();
    }
  }
  handleValidate = () => {
    this.props.setOpportunity(this.props.opportunity);
  };
  render() {
    const { fetching, selectedContacts, contact_account } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleValidate}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <div className="row mb-lg-5 mb-md-4 mb-sm-4 mb-lg-4 mb-sm-3">
                <div className="col-12">
                  <h4 className="mb-3">Accounts & Contacts</h4>
                </div>
                <div className="col-12 position-relative">
                  <Form.Item
                    name="account-contact"
                    label={"Accounts and Contacts *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative ant-select-single-placeholder"
                  >
                    <Select
                      showSearch
                      placeholder="Search Accounts and Contacts"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchContacts()}
                      onSearch={(e) => this.fetchContacts({ search: e })}
                      onChange={this.handleSubmit}
                    >
                      {contact_account.map((d) => (
                        <Option value={d.newId} key={d.newId}>
                          {d.newName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                    <img
                      src={Images.search_small_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </Button>
                </div>
                <div className="col-12 col-sm-12">
                  {selectedContacts.map((item, index) => (
                    <React.Fragment>
                      <div className="row">
                        <div className="col-12">
                          <div className="row mx-0 align-items-center customer-account-heading">
                            <h5 className="mb-0">{`Account ${index + 1}`}</h5>
                            <Button className="new-btn-main new-btn-main-create">
                              Create Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" key={item.id}>
                        {item.account ? (
                          <div className="row site-details-row-card no-data-card-row align-items-center position-relative">
                            <div className="col-11 col-sm-11 p-0">
                              <div className="row mx-0 align-items-center">
                                <div className="pl-3 pr-2">
                                  <img
                                    src={Images.person_black_icon}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="">
                                  <h5 className="text-capitalize">
                                    {item.account.name}
                                  </h5>
                                  <h6 className="mb-0">Billing Account</h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-1 col-sm-1 p-0">
                              <div className="row mx-0 align-items-center justify-content-end h-100">
                                <Dropdown
                                  overlayClassName="add-remove-dropdown-main"
                                  placement="bottomCenter"
                                  overlay={this.menu}
                                  trigger={["click"]}
                                >
                                  <Button
                                    className="bg-transparent p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={Images.black_dots_elipsis}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </Button>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                              <h6 className="mb-0">No Account</h6>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={"row"} key={item.id}>
                        <div className="col-12 col-sm-6">
                          {item.account ? (
                            <div>
                              <div className="row mx-0 align-items-center user-info-div-main position-relative">
                                <div className="col-12">
                                  <div className="user-icons-div">
                                    <img
                                      src={Images.person_black_icon}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{item.account.name}</h6>
                                    <p className="mb-0">Account Type</p>
                                  </div>
                                </div>
                                <Dropdown
                                  overlayClassName="add-remove-dropdown-main"
                                  placement="bottomCenter"
                                  overlay={this.menu(item, "account")}
                                  trigger={["click"]}
                                >
                                  <Button
                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={Images.black_dots_elipsis}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </Button>
                                </Dropdown>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                <h6 className="mb-0">No Account</h6>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-12 col-sm-6">
                          {item.contact ? (
                            <div>
                              <div className="row mx-0 align-items-center user-info-div-main position-relative">
                                <div className="col-12">
                                  <div className="user-icons-div">
                                    <img
                                      src={Images.contact_file_icon_black}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{`${item.contact.first_name} ${item.contact.last_name}`}</h6>
                                    <p className="mb-0">Contact Type</p>
                                  </div>
                                </div>
                                <Dropdown
                                  overlayClassName="add-remove-dropdown-main"
                                  overlay={this.menu(item, "contact")}
                                  placement="bottomCenter"
                                  trigger={["click"]}
                                >
                                  <Button
                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={Images.black_dots_elipsis}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </Button>
                                </Dropdown>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                <h6 className="mb-0">No Contact</h6>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <h4 className="mb-3">General Contacts</h4>
                </div>
                <div className="col-12 position-relative">
                  <Form.Item
                    name="account-contact"
                    label={"Contacts *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative ant-select-single-placeholder"
                  >
                    <Select
                      showSearch
                      placeholder="Search & Select Contacts"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchContacts()}
                      onSearch={(e) => this.fetchContacts({ search: e })}
                      onChange={this.handleSubmit}
                    >
                      {contact_account.map((d) => (
                        <Option value={d.newId} key={d.newId}>
                          {d.newName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                    <img
                      src={Images.search_small_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </Button>
                  <Button className="new-btn-main new-contact-account-btn position-absolute">
                    + Create
                  </Button>
                </div>
                <div className="col-12 col-sm-12">
                  {selectedContacts.map((item) => (
                    <React.Fragment>
                      <div className={"row"} key={item.id}>
                        <div className="col-12 col-sm-6">
                          {item.account ? (
                            <div>
                              <div className="row mx-0 align-items-center user-info-div-main position-relative">
                                <div className="col-12">
                                  <div className="user-icons-div">
                                    <img
                                      src={Images.person_black_icon}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{item.account.name}</h6>
                                    <p className="mb-0">Account Type</p>
                                  </div>
                                </div>
                                <Dropdown
                                  overlayClassName="add-remove-dropdown-main"
                                  placement="bottomCenter"
                                  overlay={this.menu(item, "account")}
                                  trigger={["click"]}
                                >
                                  <Button
                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={Images.black_dots_elipsis}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </Button>
                                </Dropdown>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                <h6 className="mb-0">No Account</h6>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-12 col-sm-6">
                          {item.contact ? (
                            <div>
                              <div className="row mx-0 align-items-center user-info-div-main position-relative">
                                <div className="col-12">
                                  <div className="user-icons-div">
                                    <img
                                      src={Images.contact_file_icon_black}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{`${item.contact.first_name} ${item.contact.last_name}`}</h6>
                                    <p className="mb-0">Contact Type</p>
                                  </div>
                                </div>
                                <Dropdown
                                  overlayClassName="add-remove-dropdown-main"
                                  overlay={this.menu(item, "contact")}
                                  placement="bottomCenter"
                                  trigger={["click"]}
                                >
                                  <Button
                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={Images.black_dots_elipsis}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </Button>
                                </Dropdown>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                                <h6 className="mb-0">No Contact</h6>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-12 validate-div-col text-md-right">
                  <Button className="validate-btn-main" htmlType={"submit"}>
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

export default withRouter(AccountsContacts);

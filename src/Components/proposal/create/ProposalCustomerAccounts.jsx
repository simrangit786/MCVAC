import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Menu,
  message,
  Modal,
  Radio,
  Select,
  Spin,
} from "antd";
import { Image as Images } from "../../Images";
import { withRouter } from "react-router-dom";
import { getCustomerAccount } from "../../../Controller/api/customerAccountServices";
import { getContact, updateContact } from "../../../Controller/api/contactsServices";
import {
  createProposalCustomerAccount,
  deleteProposalCustomerAccount,
  updateDefaultCustomerRecipient,
  updateProposalCustomerAccount,
} from "../../../Controller/api/proposalServices";
import { handleError } from "../../../Controller/Global";
import CommonWarningModal from "../../modals/CommonWarningModal";
import { debounce } from "lodash"
import CustomerAccountDrawer from "../../drawers/customer-account/CustomerAccountDrawer";
import CreateContactDrawer from "../../drawers/contact/CreateContactDrawer";
import { debounceEvent } from '../../../Controller/utils';
import AccountCreateTypeModal from "../../modals/AccountCreateTypeModal";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ProposalCustomerAccounts extends Component {
  formRef = React.createRef();
  contactRef = React.createRef();
  state = {
    selectedAccounts: [],
    accounts: [],
    loading: false,
    proposal: {},
    contactAccount: null,
    showContactModel: false,
    contactModalItem: null,
    contacts: [],
    removeVisible: false,
    contactDrwrVisible: false,
    deletableAccountId: null,
    createAccountType: null
  };

  handleOnSelect = (obj) => {
    this.formRef.current.setFieldsValue({
      customer_accounts: null,
    });
    const values = {
      proposal: this.props.proposal.id,
      account: obj.value,
      contact_id: [],
    };
    createProposalCustomerAccount(values).then(() => {
      this.props.fetchProposal(this.props.proposal.id);
    });
  };

  // handleOnDeselect = (obj) => {
  //     const customer_contact_accounts = this.props.proposal.customer_contact
  //     const account = customer_contact_accounts.find(i => i.account.id === obj.value)
  //     this.handleDeleteContactAccount(account.id)
  // }

  handleDeleteContactAccount = () => {
    deleteProposalCustomerAccount(this.state.deletableAccountId).then(() => {
      this.props.fetchProposal(this.props.proposal.id);
    });
  };

  handleContactSelect = (id) => {
    // this.contactRef.current.setFieldsValue({
    //     contact: null
    // })
    const { contactModalItem } = this.state;
    const { proposal } = this.props;
    const customer_contact_accounts = proposal.customer_contact;
    const accountIndex = customer_contact_accounts.findIndex(
      (i) => i.id === contactModalItem.id
    );
    const account = customer_contact_accounts[accountIndex];
    const contact = account.contact.map((i) => i.contact.id);
    const values = {
      contact_id: [...contact, id],
      contact: [],
    };
    updateProposalCustomerAccount(contactModalItem.id, values).then(() => {
      this.props.fetchProposal(this.props.proposal.id);
    });
  };

  
  showRemoveAccount = (visible, deletableAccountId = null) => {
    this.setState({
      removeVisible: visible,
      deletableAccountId,
    });
  };

  showRemoveContact = (visible, selectedItem, deletableContactId = null) => {
    // console.log(deletableContactId, "deletableContactId")
    this.setState({
      contactDrwrVisible: visible,
      selectedItem,
      deletableContactId,
    });
  };
  // handleContactDeselect = (id) => {
  //     this.handleDeleteContact(this.state.contactModalItem, id)
  // }

  handleDeleteContact = () => {
    const { proposal } = this.props;
    const customer_contact_accounts = proposal.customer_contact;
    const accountIndex = customer_contact_accounts.findIndex(
      (i) => i.id === this.state.selectedItem.id
    );
    const account = customer_contact_accounts[accountIndex];
    const contact = account.contact
      .filter((i) => i.id !== this.state.deletableContactId)
      .map((i) => i.contact.id);
    const values = {
      contact: [],
      contact_id: contact,
    };
    updateProposalCustomerAccount(this.state.selectedItem.id, values).then(
      (response) => {
        this.props.fetchProposal(this.props.proposal.id);
      }
    );
  };

  debounceEvent = (...args) => {
    this.debouncedEvent = debounce(...args);
    return (e) => {
      // e.persist();
      return this.debouncedEvent(e);
    };
  };

  onAccountsSearch = value => {
    this.getAllAccounts({ search: value })
  }

  getAllAccounts = (params = {}) => {
    this.setState({ loading: true });
    getCustomerAccount(params)
      .then((response) => {
        this.setState({ accounts: response.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  getAllContacts = (params) => {
    const { contactModalItem } = this.state;
    this.setState({ loading: true });
    getContact({ ...params,account: contactModalItem?.account?.id })
      .then((response) => {
        this.setState({ contacts: response.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  handleSubmit = () => {
    message.success("Billing Account Updated Successfully!");
    this.props.setProposal(this.props.proposal, 4);
  };

  handleContactModel = (contactModalItem, showContactModel) => {
    if (contactModalItem) {
      this.setState({ contactModalItem, showContactModel });
    }
    else {
      this.setState({ showContactModel });

    }
  };

  componentDidMount() {
    // if (this.props.proposal) {
    //     this.formRef.current.setFieldsValue({
    //         customer_accounts: this.props.proposal.customer_contact.map(value => {
    //             return {key: value.account?.id, label: value.account?.name}
    //         })
    //     })
    // }
    if (this.props.match.params.id) {
      this.getAllAccounts();
      this.props.fetchProposal()
    }
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //     if (this.props.proposal && prevProps.proposal.customer_contact !== this.props.proposal.customer_contact) {
  //         this.formRef.current.setFieldsValue({
  //             customer_accounts: this.props.proposal.customer_contact.map(value => {
  //                 return {key: value.account?.id, label: value.account?.name}
  //             })
  //         })
  //     }
  // }

  // handleCheckChange = id => {
  //     updateContact({opportunity_default: true}, id).then(res => {
  //       console.log(res);
  //     }).catch(err => {
  //       handleError(err)
  //     })
  //   }

  handleDefaultRecipient = (itemId, contactId) => {
    // console.log(contactId)
    updateDefaultCustomerRecipient(itemId, { default_contact_id: contactId })
      .then()
      .catch((err) => {
        handleError(err);
      });
  };

  callbackCustomerAccount = (data) => {
    const values = {
      proposal: this.props.proposal.id,
      account: data.id,
      contact: [],
    };
    createProposalCustomerAccount(values).then(() => {
      this.props.fetchProposal(this.props.proposal.id);
    });
  }

  showCustomerAccount = () => {
    this.setState({ customerModalVisible: false });
  };

  showContactAccount = () => {
    this.setState({ customerContactVisible: false })
  }

  callbackContact = (data) => {
    const { contactModalItem } = this.state;
    const { proposal } = this.props;
    const customer_contact_accounts = proposal.customer_contact;
    const accountIndex = customer_contact_accounts.findIndex(
      (i) => i.id === contactModalItem.id
    );
    const account = customer_contact_accounts[accountIndex];
    const contact = account.contact.map((i) => i.contact.id);
    const values = {
      contact_id: [...contact, data.id],
      contact: [],
    };
    updateProposalCustomerAccount(contactModalItem.id, values).then((res) => {
      this.props.fetchProposal(this.props.proposal.id);
      res.data.contact.map(item => {
        let data = {
          account: res.data?.account?.id,
        };
        updateContact(data, item.contact.id)
          .then(() => {
            // this.props.setAccount(this.props.account);
          })
          .catch((err) => {
            handleError(err)
          });
      })
    });
  
  };

  showAccountTypeModal = visibleAcTypeModal => {
    this.setState({visibleAcTypeModal})
  }

  setAccountTypeOrVisible = (createAccountType, customerModalVisible) => {
    this.setState({createAccountType, customerModalVisible})
  }

  render() {
    const { loading, accounts } = this.state;
    const { defaultRecepientId } = this.props;
    const selectedContactAccounts = this.props.proposal?.customer_contact || [];
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row mx-0 info-gray-div align-items-center">
              <h6 className="mb-0">
              Please add Billing Accounts. A proposal will be generated for each Billing Account that you add.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <div className="row" style={{ padding: "0px 25px" }}>
                <div className="col-12 p-0">
                  <Form.Item
                    name="customer_accounts"
                    label={"Billing Accounts *"}
                    rules={[
                      {
                        required: selectedContactAccounts.length == 0 ? true : false,
                        message: "Please select at least one billing account.",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      // mode="multiple"
                      labelInValue
                      removeIcon={""}
                      className="search-and-select-tag"
                      showSearch={true}
                      placeholder="Search"
                      filterOption={false}
                      onChange={this.handleOnSelect}
                      // onDeselect={this.handleOnDeselect}
                      onSearch={this.debounceEvent(this.onAccountsSearch, 1000)}
                      notFoundContent={loading ? <Spin size="small" /> : null}
                      disabled={!this.props.location.pathname?.includes('create') && selectedContactAccounts.length !== 0}
                      onFocus={() => this.getAllAccounts()}
                    >
                      {accounts.map((item, index) => (
                        <Select.Option key={index} value={item.id}>
                          <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                            <div className="common-select-option-row">
                              <div className="select-option-details d-flex align-items-center">
                                <div className={"select-option-icon"}>
                                  <img
                                    src={Images.account_black_icon}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <h6 className="mb-0">{item.name}</h6>
                              </div>
                            </div>
                            <div className="text-green-tag select-text-tier">
                              Billing Account
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button
                    className="search-icon bg-transparent border-0 p-0 position-absolute"
                    style={{ top: 43, left: 10 }}
                  >
                    <img
                      src={Images.search_small_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </Button>
                  <Button
                    disabled={!this.props.location.pathname?.includes('create') && selectedContactAccounts.length !== 0}
                    style={{
                      right: '5px'
                    }}
                    className="create-btn-main position-absolute text-capitalize"
                    // onClick={() => {
                    //   this.setState({ customerModalVisible: true });
                    // }}
                    onClick={() => this.showAccountTypeModal(true)}
                  >
                    + Create
                  </Button>
                </div>
                {/*when-data-available*/}
                {selectedContactAccounts.map((item, index) => (
                  <div className="col-12 col-sm-12" key={index}>
                    <div className={"row"}>
                      <div className="col-12">
                        <div className="row opportunity-proposal-account-main-row">
                          <div className="col-12">
                            <div className="row site-details-row-card no-data-card-row align-items-center position-relative">
                              <div className="col-11 col-sm-11">
                                <div className="row align-items-center">
                                  <div className="pl-3 pr-2">
                                    <img
                                      src={Images.person_black_icon}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </div>
                                  <div className="customer-name">
                                    <h5 className="text-capitalize mt-0">
                                      {" "}
                                      {item?.account?.name}{" "}
                                    </h5>
                                    <h6 className="mb-0">Billing Account</h6>
                                  </div>
                                </div>
                              </div>
                              {this.props.location.pathname?.includes('create') &&
                                <div className="col-1 col-sm-1 p-0 text-right">
                                  <Dropdown
                                    overlayClassName="add-remove-dropdown-main"
                                    placement="bottomCenter"
                                    overlay={
                                      <Menu>
                                        <Menu.Item
                                          onClick={() =>
                                            this.showRemoveAccount(true, item.id)
                                          }
                                          // onClick={() => this.handleDeleteContactAccount(item.id)}
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
                                        src={Images.black_dots_elipsis}
                                        alt=""
                                        className="img-fluid"
                                      />
                                    </Button>
                                  </Dropdown>
                                </div>
                              }
                            </div>
                          </div>
                          <div className="col-12 mb-3 mt-2 p-0">
                            <Button
                              className="edit-create-btn w-100 text-uppercase"
                              onClick={() =>
                                this.handleContactModel(item, true)
                              }
                            >
                              + Add Contact *
                            </Button>
                          </div>
                          {/* <div className="col-12">
                                                <div
                                                    className="row contact-green-small-heading position-relative">
                                                    <h5 className="mb-0 bg-white">Contacts</h5>
                                                </div>
                                            </div>
                                            */}
                          {item.contact && item.contact.length !== 0 ? (
                            <>
                              <div className="col-12 p-0">
                                {/* <div className="row"> */}
                                {/*{console.log(item.contact.find(n => n.default_customer_recipient === true)?.id), "test"}*/}
                                <Radio.Group
                                  className="w-100"
                                  defaultValue={
                                    item.contact.find(
                                      (n) =>
                                        n.default_customer_recipient === true
                                    )?.contact?.id
                                  }
                                >
                                  <div className="row w-100">
                                    {item.contact.map((contact, index) => (
                                      <div
                                        className="col-6 col-sm-6"
                                        key={index}
                                      >
                                        <div className="row mx-0 pb-0 align-items-center user-info-div-main opportunity-info-div-main mb-2">
                                          <div className="col-12 contact-col-12">
                                            <div className="user-icons-div">
                                              <img
                                                src={
                                                  Images.contact_file_icon_black
                                                }
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                            <div className="user-info-div">
                                              <h6 className="d-flex align-items-center">
                                                {contact.contact.first_name}{" "}
                                                {contact.contact.last_name}
                                                <small
                                                  style={{
                                                    borderLeft:
                                                      "1px solid #e0e0e0",
                                                    marginLeft: "5px",
                                                    paddingLeft: "5px",
                                                    fontWeight: "500",
                                                  }}
                                                >
                                                  {contact.contact.role}
                                                </small>
                                              </h6>
                                              <p className="mb-0">
                                                {contact.contact
                                                  .default_email &&
                                                  `${contact.contact.default_email?.email},`}
                                                &nbsp;
                                                {
                                                  contact.contact.default_phone
                                                    ?.phone_number
                                                }
                                              </p>
                                            </div>
                                            <Dropdown
                                              overlayClassName="add-remove-dropdown-main"
                                              placement="bottomCenter"
                                              overlay={
                                                <Menu>
                                                  <Menu.Item
                                                    // onClick={() => this.handleDeleteContact(item, contact.id)}
                                                    onClick={() =>
                                                      this.showRemoveContact(
                                                        true,
                                                        item,
                                                        contact?.id
                                                      )
                                                    }
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
                                                className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                                onClick={(e) =>
                                                  e.preventDefault()
                                                }
                                              >
                                                <img
                                                  src={
                                                    Images.black_dots_elipsis
                                                  }
                                                  alt=""
                                                  className="img-fluid"
                                                />
                                              </Button>
                                            </Dropdown>
                                          </div>
                                          {/* {console.log(contact.contact.id === defaultRecepientId,contact.contact.id, defaultRecepientId,'here is the problem is the')} */}
                                          <div className="col-12 p-0 radio-btn-custom">
                                            <Radio
                                              value={contact?.contact?.id}
                                              onChange={() =>
                                                this.handleDefaultRecipient(
                                                  item.id,
                                                  contact?.contact?.id
                                                )
                                              }
                                            >
                                              Proposal Recipient{" "}
                                              <small
                                                style={{
                                                  color: "#b4b4b4",
                                                  fontSize: "8px",
                                                }}
                                              >
                                                This contact will be addressed
                                                in the proposal.
                                              </small>
                                            </Radio>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </Radio.Group>
                              </div>
                              {/*
                                                    <div className="col-12 p-0">
                                                        <div className="row">
                                                            {item.contact.map((contact, index) =>
                                                                <div className="col-6 col-sm-6" key={index}>
                                                                    <div
                                                                        style={{height: '85px', minHeight: '85px'}}
                                                                        className="row mx-0 mb-0 align-items-center user-info-div-main opportunity-info-div-main mb-2">
                                                                        <div className="col-12 contact-col-12">
                                                                            <div className="user-icons-div">
                                                                                <img
                                                                                    src={Images.contact_file_icon_black}
                                                                                    alt=""
                                                                                    className="img-fluid"/>
                                                                            </div>
                                                                            <div className="user-info-div">
                                                                                <h6>{contact.first_name} {contact.last_name}</h6>
                                                                                <p className="mb-0">{contact.role}</p>
                                                                            </div>
                                                                            <Dropdown
                                                                                overlayClassName="add-remove-dropdown-main"
                                                                                placement="bottomCenter"
                                                                                overlay={<Menu>
                                                                                    <Menu.Item
                                                                                        onClick={() => this.handleDeleteContact(item, contact.id)}
                                                                                        key="0">
                                                                                        <Button
                                                                                            className="bg-transparent border-0 shadow-none p-0">Remove</Button>
                                                                                    </Menu.Item>
                                                                                </Menu>}
                                                                                trigger={['click']}>
                                                                                <Button
                                                                                    className="bg-transparent position-absolute p-0 border-0 elipsis-btn-card ant-dropdown-link"
                                                                                    onClick={e => e.preventDefault()}>
                                                                                    <img src={Images.black_dots_elipsis}
                                                                                         alt=""
                                                                                         className="img-fluid"/>
                                                                                </Button>
                                                                            </Dropdown>
                                                                        </div>
                                                                        <div className="col-12 p-0 radio-btn-custom">
                                      <Radio className="active">Default Phone Number</Radio>
                                    </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    */}
                            </>
                          ) : (
                            <div className="col-12">
                              <div className="row no-data-card-row align-items-center justify-content-center">
                                <div className="col-12 text-center">
                                  <img
                                    src={Images.contact_widget_icon}
                                    alt={"contact-icon"}
                                    className="img-fluid"
                                  />
                                  <h6
                                    className="mb-0"
                                  >
                                    No Contacts
                                  </h6>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/*when-data-not-available*/}
                {selectedContactAccounts.length === 0 && (
                  <div className="col-12">
                    <div className="row no-data-card-row align-items-center justify-content-center">
                      <div className="col-12 text-center">
                        <img
                          src={Images.Account_no_data_icon}
                          alt={"contact-icon"}
                          className="img-fluid"
                        />
                        <h6 className="mb-0">
                          No Billing Accounts
                        </h6>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-12 validate-div-col text-md-right">
                <Form.Item>
                  <Button className="validate-btn-main" htmlType="submit">
                    Save and Continue
                  </Button>
                </Form.Item>
                {/* <button onClick={()=>{deleteCustomer(3)}}> Delete </button> */}
              </div>
            </Form>
          </div>
        </div>

        <Modal
          className={"main-all-form-modal design-update-modal inner-modal-main"}
          title="Add contact"
          onOk={() => this.handleContactModel(null, false)}
          onCancel={() => this.handleContactModel(null, false)}
          destroyOnClose
          closable={true}
          footer={false}
          visible={this.state.showContactModel}
        >
          <div className="row mx-0 info-gray-div align-items-center">
            <h6 className="mb-0">
            Please use the search bar to search and select existing content, or click "Create" to create new content.
            </h6>
          </div>
          <Form className={"main-inner-form"} {...layout} ref={this.contactRef}>
            <div className="col-12 p-0">
              <Form.Item
                name="contact"
                label={"Contacts *"}
                rules={[
                  {
                    required: true,
                    message: "this field is required",
                  },
                ]}
                className="position-relative"
              >
                <Select
                  // mode="multiple"
                  dropdownClassName={"option-design-fix"}
                  className="search-and-select-tag dropdown-fixed"
                  showSearch={true}
                  placeholder="Search"
                  filterOption={false}
                  removeIcon={""}
                  onChange={this.handleContactSelect}
                  // onDeselect={this.handleContactDeselect}
                  notFoundContent={loading ? <Spin size="small" /> : 'No Associated Contact'}
                  onFocus={()=>this.getAllContacts()}
                  onSearch={debounceEvent(value => this.getAllContacts({ search: value }),300)}

                >
                  {this.state.contacts.map((item, index) => (
                    <Select.Option key={item.id} value={item.id}>
                      <div className="row mx-0 custom-tree-row custom-tree-row-1 align-items-center justify-content-between">
                        <div
                          className="common-select-option-row"
                          style={{ padding: "10px 0" }}
                        >
                          <div className="select-option-details d-flex align-items-center">
                            <div className={"select-option-icon"}>
                              <img
                                style={{
                                  height: "30px",
                                }}
                                src={Images.contact_icon_small}
                                alt={""}
                                className="img-fluid"
                              />
                            </div>
                            <h6 className="mb-0">
                              {item.full_name}
                              <br />
                              {item.role && (
                                <>
                                  {" "}
                                  <small
                                    style={{
                                      color: "#BDBDBD",
                                      fontSize: "11px",
                                      lineHeight: "8px",
                                    }}
                                  >
                                    {item.role || ""}
                                  </small>{" "}
                                  <br />
                                </>
                              )}
                              {item.account && (
                                <small
                                  style={{
                                    color: "#BDBDBD",
                                    fontSize: "11px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  {item.account?.name || ""}
                                </small>
                              )}
                            </h6>
                          </div>
                        </div>
                        <div className="text-green-tag select-text-tier">
                          Contact
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  className="search-icon bg-transparent border-0 p-0 position-absolute"
                  style={{ top: 6, left: 10 }}
                >
                  <img
                    src={Images.search_small_icon}
                    alt=""
                    className="img-fluid"
                  />
                </Button>
                <Button
                  style={{
                    top: '5px',
                    right: '5px'
                  }}
                  className="create-btn-main position-absolute text-capitalize"
                  onClick={() => {
                    this.setState({ customerContactVisible: true },
                      () => this.handleContactModel(false)
                    );
                  }}
                >
                  + Create
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>

        <CommonWarningModal
          common
          resourceWarning
          heading={"Are you sure you want to remove this Account? "}
          subHeadingUOM={
            "If you choose to remove this Billing Account, this might cause issues."
          }
          visible={this.state.removeVisible}
          commonFunc={() => {
            this.setState({ deletableAccountId: null, removeVisible: false });
            this.handleDeleteContactAccount();
          }}
          onClose={() => {
            this.showRemoveAccount(false);
          }}
        />
        <CommonWarningModal
          // newCommonModal
          wageInfoDelete
          removeItem={() => {
            this.setState({
              selectedItem: null,
              deletableContactId: null,
              contactDrwrVisible: false,
            });
            this.handleDeleteContact();
          }}
          heading={"Are you sure you want to remove this contact?"}
          subHeadingUOM={" "}
          visible={this.state.contactDrwrVisible}
          // commonFunc={() => }
          onClose={() => this.showRemoveContact(false)}
        />
        <AccountCreateTypeModal
            PARTIAL_BILLING
            setAccountType={this.setAccountTypeOrVisible}
            visible={this.state.visibleAcTypeModal}
            onClose={() => this.showAccountTypeModal(false)}
        />
        <CustomerAccountDrawer
          createAccountType={this.state.createAccountType}
          callbackCustomerAccount={this.callbackCustomerAccount}
          selectedContactAccounts={selectedContactAccounts}
          visible={this.state.customerModalVisible}
          onClose={() => this.showCustomerAccount(false)}
        />
        <CreateContactDrawer
          callbackContact={this.callbackContact}
          visible={this.state.customerContactVisible}
          selectedContactAccounts={selectedContactAccounts}
          onClose={() => this.showContactAccount(false)}
        />
      </React.Fragment>
    );
  }
}


export default withRouter(ProposalCustomerAccounts);

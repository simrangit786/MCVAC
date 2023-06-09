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
import { Image as Images } from "../../../Images";
import { withRouter } from "react-router-dom";
import {
  getOneOwnerAccount,
  getOwnerAccount,
  getOwnerSites,
} from "../../../../Controller/api/ownerAccountServices";
import { createProjectOwnerAccount, deleteProjectOwnerAccount, updatePrimarySite, updateProjectOwnerAccount } from "../../../../Controller/api/projectServices";
import { handleError } from "../../../../Controller/Global";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { userTypes } from "../../../../Controller/userTypes";
import { getContact, updateContact } from "../../../../Controller/api/contactsServices";
import SiteManagerAccountDrawer from "../../../drawers/site-manager/SiteManagerAccountDrawer";
import CreateContactDrawer from "../../../drawers/contact/CreateContactDrawer";
import CreateSiteDrawer from '../../../drawers/site-manager/CreateSiteDrawer';
import { debounceEvent } from '../../../../Controller/utils';
import AccountCreateTypeModal from "../../../modals/AccountCreateTypeModal";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ProjectsSiteManagerAccountCreate extends Component {
  formRef = React.createRef();
  contactRef = React.createRef();
  siteRef = React.createRef();
  state = {
    selectedAccounts: [],
    accounts: [],
    loading: false,
    project: {},
    contactAccount: null,
    showContactModel: false,
    contactModalItem: null,
    showSiteModel: false,
    siteModalItem: null,
    contacts: [],
    sites: [],
    removeVisible: false,
    deletableAccountId: null,
    contactDrawerVisible: false,
    siteDrawerVisible: false,
    createAccountType: null
  };

  showRemoveAccount = (visible, deletableAccountId = null) => {
    this.setState({
      removeVisible: visible,
      deletableAccountId,
    });
  };

  handleDefaultSelectAccount = (selectedAccounts) => {
    const { selectedContactAccounts } = this.state;
    return selectedAccounts.map((item) => {
      const defaultAccount = selectedContactAccounts.find(
        (i) => i.account.id === item.id
      );
      if (defaultAccount) {
        item.contacts = defaultAccount.contact;
        item.sites = defaultAccount.site;
      }
      return item;
    });
  };

  handleOnSelect = (obj) => {
    this.formRef.current.setFieldsValue({
      owner_accounts: null,
    });
    const values = {
      project: this.props.project.id,
      account: obj.value,
    };
    createProjectOwnerAccount(values).then(() => {
      this.props.fetchProject(this.props.project.id);
    });
  };

  handleOnDeselect = (obj) => {
    const customer_contact_accounts = this.props.project.project_owner_contact;
    const account = customer_contact_accounts.find(
      (i) => i.account.id === obj.value
    );
    this.handleDeleteOwnerAccount(account.id);
  };

  handleDeleteOwnerAccount = () => {
    deleteProjectOwnerAccount(this.state.deletableAccountId).then(() => {
      this.props.fetchProject(this.props.project.id);
    });
  };

  handleContactSelect = (id) => {
    this.contactRef.current.setFieldsValue({
      contact: null,
    });
    const { contactModalItem } = this.state;
    const { project } = this.props;
    const owner_contact_accounts = project.project_owner_contact;
    const accountIndex = owner_contact_accounts.findIndex(
      (i) => i.id === contactModalItem.id
    );
    const account = owner_contact_accounts[accountIndex];
    const contact = account.contact.map((i) => i.id);
    const values = {
      contact: [...contact, id],
    };
    updateProjectOwnerAccount(contactModalItem.id, values).then((response) => {
      this.props.fetchProject(this.props.project.id);
    });
  };
  handleContactDeselect = (id) => {
    this.handleDeleteContact(this.state.contactModalItem, id);
  };

  handleDeleteContact = () => {
    const item = this.state?.selectedItem;
    const id = this.state.deletableContactId;
    const { project } = this.props;
    const owner_contact_accounts = project.project_owner_contact;
    const accountIndex = owner_contact_accounts.findIndex(
      (i) => i.id === item.id
    );
    const account = owner_contact_accounts[accountIndex];
    const contact = account.contact.filter((i) => i.id !== id).map((i) => i.id);
    const values = {
      contact: contact,
    };
    updateProjectOwnerAccount(item.id, values).then(() => {
      this.props.fetchProject(this.props.project.id);
    });
  };
  handleSiteSelect = (id) => {
    this.siteRef.current.setFieldsValue({
      site: null,
    });
    const { siteModalItem } = this.state;
    const { project } = this.props;
    const owner_contact_accounts = project.project_owner_contact;
    const accountIndex = owner_contact_accounts.findIndex(
      (i) => i.id === siteModalItem.id
    );
    const account = owner_contact_accounts[accountIndex];
    const contact = account.site.map((i) => i.site.id);
    const values = {
      site_id: [...contact, id],
      site: [],
    };
    updateProjectOwnerAccount(siteModalItem.id, values).then(() => {
      if (account.site.length === 0) {
        this.handlePrimarySite(account.id, id);
      }
      this.props.fetchProject(this.props.project.id);
    });
  };
  handleSiteDeselect = (id) => {
    this.handleDeleteSite(this.state.siteModalItem, id);
  };
  handleDeleteSite = () => {
    const item = this.state?.selectedSite;
    const id = this.state.deletableSiteId
    const { project } = this.props;
    const owner_contact_accounts = project.project_owner_contact;
    const accountIndex = owner_contact_accounts.findIndex(
      (i) => i.id === item.id
    );
    const account = owner_contact_accounts[accountIndex];
    const contact = account?.site.filter((i) => i.site.id !== id).map((i) => i.site.id);
    const values = {
      site_id: contact,
    };
    updateProjectOwnerAccount(item.id, values).then(() => {
      this.props.fetchProject(this.props.project.id);
    });
  };

  getAllAccounts = (params = {}) => {
    this.setState({ loading: true });
    getOwnerAccount(params)
      .then((response) => {
        this.setState({ accounts: response.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  getAllSites = (params) => {
    const { siteModalItem } = this.state;
    this.setState({ loading: true });
    getOwnerSites({ ...params, account: siteModalItem.account.id })
      .then((response) => {
        this.setState({ sites: response.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  getAllContacts = (params = {}) => {
    const { contactModalItem } = this.state;
    this.setState({ loading: true });
    getContact({ ...params, account: contactModalItem?.account?.id })
      .then((response) => {
        this.setState({ contacts: response.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getAllAccounts();
      this.props.fetchProject()
    }
  }

  handleSubmit = () => {
    message.success("Site Manager Updated Successfully!");
    this.props.setProject(this.props.project, 5);
  };

  handleContactModel = (contactModalItem, showContactModel) => {
    if (contactModalItem) {
      this.setState({ contactModalItem, showContactModel });
    }
    else {
      this.setState({ showContactModel });

    }
  };
  handleSiteModel = (siteModalItem, showSiteModel) => {
    if (siteModalItem) {
      this.setState({ siteModalItem, showSiteModel });
    }
    else {
      this.setState({ showSiteModel });
    }
  };
  handlePrimarySite = (id, siteId) => {
    updatePrimarySite(id, { primary_site_id: siteId })
      .catch((err) => {
        handleError(err);
      });
  };


  removeContact = (visible, selectedItem, deletableContactId = null) => {
    this.setState({
      contactDrawerVisible: visible,
      selectedItem,
      deletableContactId
    })
  }

  handleRemoveSite = (visible, selectedSite, deletableSiteId = null) => {
    this.setState({
      siteDrawerVisible: visible,
      selectedSite,
      deletableSiteId
    })
  }

  showOwnerAccount = () => {
    this.setState({ ownerModalVisible: false });
  };
  showContactAccount = () => {
    this.setState({ ownerContactVisible: false })
  }
  showSites = () => {
    this.setState({ onwerSiteVisible: false })
  }

  callbackOwnerAccount = (data) => {
    const values = {
      project: this.props.project.id,
      account: data.id,
    };
    createProjectOwnerAccount(values).then(() => {
      this.props.fetchProject(this.props.project.id);
    });
  }

  callbackContact = (data) => {
    const { contactModalItem } = this.state;
    const { project } = this.props;
    const owner_contact_accounts = project.project_owner_contact;
    const accountIndex = owner_contact_accounts.findIndex(
      (i) => i.id === contactModalItem.id
    );
    const account = owner_contact_accounts[accountIndex];
    const contact = account.contact.map((i) => i.id);
    const values = {
      contact: [...contact, data.id],
    };
    updateProjectOwnerAccount(contactModalItem.id, values).then((res) => {
      this.props.fetchProject(this.props.project.id);
      res.data.contact.map(item => {
        let data = {
          account: res.data?.account.id,
        };
        updateContact(data, item.id)
          .then(() => {
            // this.props.setAccount(this.props.account);
          })
          .catch((err) => {
            handleError(err)
          });
      })

    }
    );
  };

  callbackSite = (data) => {
    const { siteModalItem } = this.state;
    const { project } = this.props;
    const owner_contact_accounts = project.project_owner_contact;
    const accountIndex = owner_contact_accounts.findIndex(
      (i) => i.id === siteModalItem.id
    );
    const account = owner_contact_accounts[accountIndex];
    const contact = account.site.map((i) => i.site.id);
    const values = {
      site_id: [...contact, data.id],
      site: [],
    };
    updateProjectOwnerAccount(siteModalItem.id, values).then(() => {
      this.props.fetchProject(this.props.project.id);
    });
  }

  showAccountTypeModal = visibleAcTypeModal => {
    this.setState({visibleAcTypeModal})
  }

  setAccountTypeOrVisible = (createAccountType, ownerModalVisible) => {
    this.setState({createAccountType, ownerModalVisible})
  }


  render() {
    const { loading, accounts, selectedAccount } = this.state;
    const selectedAccounts = this.props.project?.project_owner_contact || [];
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                You can choose one site manager account per project.
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
              <div className="row">
                <div className="col-12">
                  <Form.Item
                    dropdownClassName={"option-design-fix"}
                    name="owner_accounts"
                    label={"Site Manager Account *"}
                    rules={[
                      {
                        required: selectedAccounts?.length < 1 ? true : false,
                        message: "Please select at least one site manager account.",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      // mode="multiple"
                      labelInValue
                      className="search-and-select-tag"
                      showSearch={true}
                      disabled={selectedAccounts?.length >= 1 ? true : false}
                      placeholder="Search"
                      filterOption={false}
                      onChange={this.handleOnSelect}
                      // onDeselect={this.handleOnDeselect}
                      onSearch={value => this.getAllAccounts({ search: value })}
                      removeIcon={""}
                      notFoundContent={loading ? <Spin size="small" /> : null}
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
                              Site Manager Account
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Button
                    className="search-icon bg-transparent border-0 p-0 position-absolute"
                    style={{ top: 43, left: 25 }}
                  >
                    <img
                      src={Images.search_small_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </Button>
                  <Button
                    disabled={selectedAccounts?.length >= 1 ? true : false}

                    className="create-btn-main position-absolute text-capitalize"
                    // onClick={() => {
                    //   this.setState({ ownerModalVisible: true });
                    // }}
                    onClick={() => this.showAccountTypeModal(true)}
                  >
                    + Create
                  </Button>
                </div>
                {/*when-data-available*/}
                {selectedAccounts?.map((item, index) => (
                  <div className="col-12 col-sm-12" key={index}>
                    <div
                      className={
                        "row mx-0 opportunity-proposal-account-main-row"
                      }
                    >
                      <div className="col-12 p-0">
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
                              <div className="customer-name">
                                <h5 className="text-capitalize mt-0">
                                  {" "}
                                  {item.account?.name}{" "}
                                </h5>
                                <h6 className="mb-0">
                                  {userTypes[item.account?.account_type]}{" "}
                                  Account
                                </h6>
                              </div>
                            </div>
                          </div>
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
                                    // onClick={() => this.handleDeleteOwnerAccount(item.id)}
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
                        </div>
                      </div>
                      <div className="col-12 mb-3 mt-2 p-0">
                        {/*<div className="row mx-0 align-items-center customer-account-heading">*/}
                        {/*<h5 className="m-0 text-small-black">Customer {index + 1}</h5>*/}
                        <Button
                          className="edit-create-btn w-100 text-uppercase"
                          onClick={() => this.handleContactModel(item, true)}
                        >
                          + Add Contact
                        </Button>
                        {/*</div>*/}
                      </div>

                      {/*<div className="col-12">*/}
                      {/*    <div*/}
                      {/*        className="row contact-green-small-heading position-relative">*/}
                      {/*        <h5 className="mb-0 bg-white">Contacts</h5>*/}
                      {/*    </div>*/}
                      {/*</div>*/}
                      {item.contact && item.contact.length !== 0 ? (
                        <>
                          <div className="col-12 p-0">
                            <div className="row">
                              {item.contact.map((contact, index) => (
                                <div className="col-6 col-sm-6" key={index}>
                                  <div
                                    style={{
                                      minHeight: "100px",
                                    }}
                                    className="row mx-0 mb-0 align-items-center user-info-div-main opportunity-info-div-main mb-2"
                                  >
                                    <div className="col-12 contact-col-12">
                                      <div className="user-icons-div">
                                        <img
                                          src={Images.contact_file_icon_black}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </div>
                                      <div className="user-info-div">
                                        <h6 className="d-flex align-items-center">
                                          {contact.first_name}{" "}
                                          {contact.last_name}
                                          <small
                                            style={{
                                              borderLeft: "1px solid #e0e0e0",
                                              marginLeft: "5px",
                                              paddingLeft: "5px",
                                              fontWeight: "500",
                                              color: "#bdbdbd",
                                            }}
                                          >
                                            {contact.role}
                                          </small>
                                        </h6>
                                        <p className="mb-0">
                                          {contact.default_email &&
                                            `${contact.default_email?.email},`}
                                          &nbsp;{" "}
                                          {contact.default_phone?.phone_number}
                                        </p>
                                      </div>
                                      <Dropdown
                                        overlayClassName="add-remove-dropdown-main"
                                        placement="bottomCenter"
                                        overlay={
                                          <Menu>
                                            <Menu.Item
                                              onClick={() =>
                                                this.removeContact(
                                                  true,
                                                  item,
                                                  contact.id
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
                                    {/*<div className="col-12 p-0 radio-btn-custom">*/}
                                    {/*    <Radio className="active">Default Phone*/}
                                    {/*        Number</Radio>*/}
                                    {/*</div>*/}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
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
                      <div className="col-12 mb-3 mt-2 p-0">
                        {/*<div className="row mx-0 align-items-center customer-account-heading">*/}
                        {/*<h5 className="m-0 text-small-black">Customer {index + 1}</h5>*/}

                        <Button
                          className="edit-create-btn w-100 text-uppercase"
                          onClick={() => this.handleSiteModel(item, true)}
                        >
                          + Add Site
                        </Button>
                        {/*</div>*/}
                      </div>
                      {/*<div className="col-12" style={{padding: "15px 0px 0px"}}>*/}
                      {/*    <div className="row mx-0 contact-green-small-heading position-relative">*/}
                      {/*        <h5 className="mb-0">Sites</h5>*/}
                      {/*    </div>*/}
                      {/*</div>*/}
                      {item.site && item.site.length !== 0 ? (
                        <>
                          <div className="col-12">
                            <div className="row">
                              <Radio.Group
                                defaultValue={
                                  item.site.find((i) => i.primary === true)?.id
                                }
                              >
                                {item.site.map((siteItem, index) => (
                                  <div className="col-12" key={index}>
                                    <div className="row site-details-row-card position-relative">
                                      <div className="col-12 col-sm-3 bg-gray-main p-0">
                                        <div className="row mx-0 align-items-center pt-lg-3 pt-md-3 pt-3">
                                          <div className="col-12 col-sm-3 pr-lg-0 pr-md-0">
                                            <img
                                              src={Images.location_black_icon}
                                              alt=""
                                              className="img-fluid"
                                            />
                                          </div>
                                          <div className="col-12 col-sm-9 pl-lg-2">
                                            <h6
                                              style={{
                                                fontSize: "15px",
                                                color: "#4f4f4f",
                                                fontWeight: "500",
                                              }}
                                              className="text-capitalize mb-0"
                                            >
                                              {siteItem.site.name}
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12 col-sm-9 px-3 pt-2 pb-4">
                                        <div className="row pt-lg-3 pt-md-3 pt-3">
                                          <div className="col-12 col-sm-4">
                                            <h6 className="text-uppercase">
                                              ADDRESS
                                            </h6>
                                            <p className="mb-0">
                                              {siteItem.site.street_address || ""}{" "}
                                              {siteItem.site.apartment || ""}{" "}
                                              {siteItem.site.city || ""},{" "}
                                              {siteItem.site.state || ""}{" "}
                                              {siteItem.site.zip_code || ""} USA
                                            </p>
                                          </div>
                                          <div className="col-12 col-sm-4">
                                            <h6 className="text-uppercase">
                                              EMAIL ADDRESS
                                            </h6>
                                            <p
                                              className="mb-0"
                                              style={{ width: 100 }}
                                            >
                                              {siteItem.site.email}
                                            </p>
                                          </div>
                                          <div className="col-12 col-sm-3">
                                            <h6 className="text-uppercase">
                                              PHONE NUMBER
                                            </h6>
                                            <p className="mb-0">
                                              {siteItem.site.phone}
                                            </p>
                                          </div>
                                          <div className="col-12 col-sm-1 position-relative">
                                            <Dropdown
                                              overlayClassName="add-remove-dropdown-main"
                                              placement="bottomCenter"
                                              overlay={
                                                <Menu>
                                                  <Menu.Item
                                                    onClick={() =>
                                                      this.handleRemoveSite(
                                                        true,
                                                        item,
                                                        siteItem.site.id
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
                                                style={{
                                                  width: '20px'
                                                }}
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
                                      </div>
                                      <div className="col-12 p-0 radio-btn-custom">
                                        <Radio
                                          value={siteItem?.id}
                                          onChange={() =>
                                            this.handlePrimarySite(
                                              item.id,
                                              siteItem?.site.id
                                            )
                                          }
                                        >
                                          Primary Site
                                        </Radio>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </Radio.Group>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-12">
                          <div className="row no-data-card-row align-items-center justify-content-center">
                            <div className="col-12 text-center">
                              <img
                                src={Images.location_gray}
                                alt={"contact-icon"}
                                className="img-fluid"
                              />
                              <h6
                                className="mb-0"
                              >
                                No Sites
                              </h6>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/*when-data-not-available*/}
                {selectedAccounts?.length === 0 && (
                  <div className="col-12">
                    <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                      <div className="col-12 text-center">
                        <img
                          src={Images.Account_no_data_icon}
                          alt={"contact-icon"}
                          className="img-fluid"
                        />
                        <h6 className="mb-0">
                          No Site Manager Account
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
          className="main-all-form-modal design-update-modal inner-modal-main"
          closable={true}
          footer={false}
          title="Add contact"
          onOk={() => this.handleContactModel(null, false)}
          onCancel={() => this.handleContactModel(null, false)}
          destroyOnClose
          visible={this.state.showContactModel}
        >
          <div className="row mx-0 info-gray-div align-items-center">
            <h6 className="mb-0">
              Please use the search bar to search and select existing content, or click "Create" to create new content.
            </h6>
          </div>
          <div className="col-12 p-0">
            <Form
              className={"main-inner-form"}
              {...layout}
              ref={this.contactRef}
            >
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
                  dropdownClassName={"option-design-fix"}
                  // mode="multiple"
                  className="search-and-select-tag dropdown-fixed"
                  showSearch={true}
                  removeIcon={""}
                  placeholder="Search"
                  filterOption={false}
                  onChange={this.handleContactSelect}
                  // onDeselect={this.handleContactDeselect}
                  notFoundContent={loading ? <Spin size="small" /> : 'No Associated Contact'}
                  onSearch={debounceEvent(value => this.getAllContacts({ search: value }), 300)}
                  onFocus={() => this.getAllContacts()}
                >
                  {this.state.contacts.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
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
                    this.setState({ ownerContactVisible: true },
                      () => this.handleContactModel(false)
                    );
                  }}
                >
                  + Create
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          className={"main-all-form-modal design-update-modal inner-modal-main"}
          title="Add Sites"
          closable={true}
          footer={false}
          onOk={() => this.handleSiteModel(null, false)}
          onCancel={() => this.handleSiteModel(null, false)}
          destroyOnClose
          visible={this.state.showSiteModel}
        >
          <div className="row mx-0 info-gray-div align-items-center">
            <h6 className="mb-0">
              Please use the search bar to search and select existing content, or click "Create" to create new content.
            </h6>
          </div>
          <div className="col-12 p-0">
            <Form className={"main-inner-form"} {...layout} ref={this.siteRef}>
              <Form.Item
                name="site"
                label={"Site *"}
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
                  className="search-and-select-tag dropdown-fixed"
                  dropdownClassName={"option-design-fix"}
                  showSearch={true}
                  removeIcon={""}
                  placeholder="Search"
                  filterOption={false}
                  onChange={this.handleSiteSelect}
                  // onDeselect={this.handleSiteDeselect}
                  notFoundContent={loading ? <Spin size="small" /> : 'No Associated Site'}
                  onFocus={() => this.getAllSites()}
                  onSearch={debounceEvent((e) => this.getAllSites({ search: e }), 300)}
                >
                  {this.state.sites.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
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
                                src={Images.location_black_icon}
                                alt={""}
                                className="img-fluid"
                              />
                            </div>
                            <h6 className="mb-0">
                              {item.name}
                              <br />
                              {item.account && (
                                <small
                                  style={{
                                    color: "#BDBDBD",
                                    fontSize: "11px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  {item ? `${item?.street_address} ${item?.city}, ${item?.state} ${item?.zip_code}` : " "}
                                </small>
                              )}
                            </h6>
                          </div>
                        </div>
                        <div className="text-green-tag select-text-tier">
                          Site
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
                    this.setState({ onwerSiteVisible: true },
                      () => this.handleSiteModel(false)
                    );
                  }}
                >
                  + Create
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <CommonWarningModal
          commonInternalLocationPopup
          resourceWarning
          heading={"Are you sure you want to remove this Account?"}
          subHeadingUOM={
            "If you choose to remove this Site Manager Account, this might cause issues."
          }
          visible={this.state.removeVisible}
          showWarningModal2={() => {
            this.setState({ deletableAccountId: null, removeVisible: false });
            this.handleDeleteOwnerAccount();
          }}
          onClose={() => this.showRemoveAccount(false)}
        />
        <CommonWarningModal
          // newCommonModal
          wageInfoDelete
          removeItem={() => {
            this.setState({
              selectedItem: null,
              deletableContactId: null,
              contactDrawerVisible: false,
            });
            this.handleDeleteContact();
          }}
          heading={"Are you sure you want to remove this contact?"}
          subHeadingUOM={" "}
          visible={this.state.contactDrawerVisible}
          // commonFunc={() => }
          onClose={() => this.removeContact(false)}
        />
        <CommonWarningModal
          wageInfoDelete
          // newCommonModal
          removeItem={() => {
            this.setState({
              selectedSite: null,
              deletableSiteId: null,
              siteDrawerVisible: false,
            });
            this.handleDeleteSite();
          }}
          heading={"Are you sure you want to remove this site?"}
          subHeadingUOM={" "}
          visible={this.state.siteDrawerVisible}
          // commonFunc={() => }
          onClose={() => this.handleRemoveSite(false)}
        />

        <AccountCreateTypeModal
            PARTIAL_MANAGER
            setAccountType={this.setAccountTypeOrVisible}
            visible={this.state.visibleAcTypeModal}
            onClose={() => this.showAccountTypeModal(false)}
        />

        <SiteManagerAccountDrawer
          createAccountType={this.state.createAccountType}
          callbackOwnerAccount={this.callbackOwnerAccount}
          visible={this.state.ownerModalVisible}
          onClose={() => this.showOwnerAccount(false)}
        />

        <CreateContactDrawer
          callbackContact={this.callbackContact}
          visible={this.state.ownerContactVisible}
          onClose={() => this.showContactAccount(false)}
        />

        <CreateSiteDrawer
          callbackSite={this.callbackSite}
          visible={this.state.onwerSiteVisible}
          selectedAccounts={selectedAccounts}
          onClose={() => this.showSites(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ProjectsSiteManagerAccountCreate);

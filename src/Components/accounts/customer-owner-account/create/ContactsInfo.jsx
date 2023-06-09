import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Spin,
  message,
  Radio,
} from "antd";
import { Image as Images } from "../../../Images";
import {
  getContact,
  getContactPositions,
  updateContact,
} from "../../../../Controller/api/contactsServices";
import { withRouter } from "react-router-dom";
import CreateContactDrawer from "../../../drawers/contact/CreateContactDrawer";
import CommonWarningModal from "../../../modals/CommonWarningModal";
import { handleError } from "../../../../Controller/Global";
import CreatePositionDrawer from "../../../drawers/contact/CreatePositionDrawer";
import { debounce } from 'lodash';

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class ContactsInfo extends Component {
  state = {
    contacts: [],
    selectedContacts: [],
    fetching: false,
    visible: false,
    contact: [],
    modalVisible: false,
    visibleWarning: false,
    positionVisible: false,
    positions: [],
    page: 1,
    totalCount: 0,
    search: ""
  };
  formRef = React.createRef();

  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.showWarningModal(true, item)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleRemove = () => {
    const { item } = this.state;
    let selectedContacts = this.state.selectedContacts.filter(
      (i) => i.id !== item.id
    );
    let cont = this.state.contact.filter((i) => i !== item.id);
    this.setState({ selectedContacts, contact: cont });
    updateContact({ account: null }, item.id)
      .then((res) => {
        message.success("Contact removed successfully!");
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  // handleRemovefromSelect = (id) => {
  //     let selectedContacts = this.state.selectedContacts.drawer(i => i.id !== id);
  //     this.setState({ selectedContacts });
  //     this.formRef.current.setFieldsValue({
  //         contacts: this.formRef.current.getFieldValue('contacts').drawer(i => i !== id)
  //     })
  //     updateContact({ "account": null }, id).then(res => {
  //         // message.success('Contact removed successfully!')
  //     }).catch(err => {
  //         if (err.response) {
  //             Object.keys(err.response.data).map((e) => {
  //                 message.error(err.response.data[e])
  //             })
  //         }
  //     })
  // };

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
      this.getSelectedContacts()
    }
  }

  getSelectedContacts = () => {
    const {account} = this.props;
    getContact({ account: account?.id })
    .then((res) => {
      this.setState({
        selectedContacts: res.data.results,
        contacts: res.data.results,
        contact: res.data.results.map((r) => {
          return r.id;
        }),
      });
      let data = {};
      res.data.results.forEach((p) => {
        data[`role${p.id}`] = p.role;
      });
      data.contacts = res.data.results.map((i) => i.id);
      this.formRef.current.setFieldsValue({
        ...data,
        contacts: null,
      });
    })
    .catch((err) => {
      handleError(err)
      this.setState({ fetching: false });
    });
  }

  // componentDidMount() {
  //     if (this.props.match.params.id) {
  //         getContact({ account: this.props.match.params.id }).then(res => {
  //             this.setState({ selectedContacts: res.data.results, contacts: res.data.results, contact: res.data.results.map((r) => { return r.id }) })
  //             let data = {}
  //             res.data.results.forEach(p => {
  //                 data[`role${p.id}`] = p.role
  //             })
  //             data.contacts = res.data.results.map(i => i.id)
  //             this.formRef.current.setFieldsValue({
  //                 ...data,
  //                 contacts: null
  //             })
  //         }).catch(err => {
  //             if (err.response) {
  //                 Object.keys(err.response.data).map((e) => {
  //                     message.error(err.response.data[e])
  //                 })
  //             }
  //             this.setState({ fetching: false })
  //         })
  //     }
  // }

  handleSelect = (e) => {
    this.formRef.current.setFieldsValue({
      contacts: null,
    });
    // let selectedContacts = this.state.contacts.drawer(i => e==i.id);
    // this.setState({selectedContacts})
    const data = this.state.contacts.find(i => i.id == e)
    this.setState({accountPopup: data},() => {
      if(data.account && data.account?.id !== this.props.account.id) {
        this.setState({modalVisible: true})
      } else {
    const newArr = this.state.selectedContacts.map((i) => i.id);
    newArr.push(e);
    let selectedNewContacts = this.state.contacts.filter((i) =>
      newArr.includes(i.id)
    );
    let c = selectedNewContacts.map((contacts) => {
      return contacts.id;
    });
    this.setState({ contact: [...c], selectedContacts: selectedNewContacts, accountPopup: null });
  }
})
 }

  callbackContact = (data) => {
    let { selectedContacts } = this.state;
    selectedContacts = [...selectedContacts, data];
    let c = selectedContacts.map((contacts) => {
      return contacts.id;
    });
    this.setState({
      selectedContacts,
      contacts: selectedContacts,
      contact: [...c],
    });
    // this.formRef.current.setFieldsValue({
    //   contacts: selectedContacts.map((i) => i.id),
    // });
  };

  handleAccountChange =() => {
    updateContact({contact_account: true, insert_account: this.props?.account?.id}, this.state.accountPopup.id).then(() => {
      this.setState({modalVisible: false, accountPopup: null}, () => {
        this.getSelectedContacts()
      })
    }).catch((err) =>  handleError(err))
  }

  showWarningModal = (visible, item = null) => {
    this.setState({ visibleWarning: visible, item });
  };

  handleSubmit = (values) => {
    values.contacts = [...this.state.contact];
    values.contacts.map((item) => {
      let data = {
        account: this.props.account.id,
        role: values[`role${item}`],
      };
      updateContact(data, item)
        .then((res) => {
          message.success("Contact added successfully!");
          this.props.setAccount(this.props.account, 6);
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

  showContact = () => {
    this.setState({ visible: false });
  };

  fetchPositions = () => {
    const {page, search} = this.state;
    const params = {
         page, search
    }
    this.setState({fetching: true})
    getContactPositions(params).then(res => {
        if(page === 1) {
            this.setState({positions: res.data.results, totalCount: res.data.count})
        }
        else {
            this.setState(prevState => {
              return { positions: [...prevState.positions, ...res.data.results] }
            })
        }
    }).catch(err => {
        handleError(err)
    }).finally(() => {
        this.setState({fetching: false})
    })
  }


showPosition = (visible) =>{
  this.setState({
      positionVisible:visible
  })
}

debounceEvent = (...args) => {
  this.debouncedEvent = debounce(...args);
  return (e) => {
    return this.debouncedEvent(e);
  };
};

  render() {
    const { fetching, contacts, selectedContacts, positions, totalCount } = this.state;
    const { account } = this.props;

    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              hideRequiredMark={true}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="contacts"
                        label={"Contacts "}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                        className="position-relative remove-cross-icon"
                      >
                        <Select
                          // mode="multiple"
                          placeholder="Search"
                          notFoundContent={
                            fetching ? <Spin size="small" /> : null
                          }
                          filterOption={false}
                          onFocus={() => this.fetchContacts()}
                          onSearch={this.debounceEvent((e) => this.fetchContacts({ search: e }),1000)}
                          onSelect={this.handleSelect}
                          showSearch={true}
                          // onDeselect={this.handleRemovefromSelect}
                          className="customer-contact"
                        >
                         {contacts.map((d) => (
                            <Option key={d.id} value={d.id}>
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
                                      {d.full_name}
                                      <br />
                                      {d.account ?
                                        <>
                                          {" "}
                                          <small
                                            style={{
                                              color: "#BDBDBD",
                                              fontSize: "11px",
                                              lineHeight: "8px",
                                            }}
                                          >
                                            {d?.role || ""}
                                          </small>{" "}
                                          <br />
                                        <small
                                          style={{
                                            color: "#BDBDBD",
                                            fontSize: "11px",
                                            lineHeight: "8px",
                                          }}
                                        >
                                          {d.account?.name || ""}
                                        </small>
                                        </> :
                                        " "
  }
                                    </h6>
                                  </div>
                                </div>
                                <div className="text-green-tag select-text-tier">
                                  Contact
                                </div>
                              </div>
                            </Option>
                            // <Option key={d.id}
                            //     value={d.id}>{`${d.first_name} ${d.last_name}`}</Option>
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
                      <Button
                        className="create-btn-main position-absolute text-capitalize"
                        onClick={() => {
                          this.setState({ visible: true });
                        }}
                      >
                       + Create
                      </Button>
                    </div>
                    {selectedContacts.length === 0 && (
                      <div className="col-12">
                        <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                          <div className="col-12 text-center">
                            <img
                              src={Images.contact_union_icon}
                              alt=""
                              className="img-fluid"
                            />
                            <h6 className="mb-0">No Contacts</h6>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedContacts.map((item) => (
                      <div key={item.id} className="col-12">
                        <div className="row contact-row-line">
                          <div className="col-12 col-sm-6">
                            <div
                              style={{ height: "100px", minHeight: "100px" }}
                              className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main"
                            >
                              <div className="col-12">
                                <div className="user-icons-div">
                                  <img
                                    src={Images.contact_file_icon_black}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="user-info-div">
                                  <h6>{`${item.first_name} ${item.last_name}`}</h6>
                                  <p className="mb-0">{item?.default_phone && item?.default_email ? `${item?.default_phone?.phone_number || " "} | ${item?.default_email?.email || " "}` : item?.default_phone ? (item?.default_phone?.phone_number || " ") : (item?.default_email?.email || " ") || " "}</p>
                                </div>
                                <Dropdown
                                  overlayClassName="add-remove-dropdown-main"
                                  overlay={this.menu(item)}
                                  trigger={["click"]}
                                >
                                  <Button
                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={Images.more_black}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </Button>
                                </Dropdown>
                              </div>
                              {/*<div className="col-12 p-0 radio-btn-custom">*/}
                              {/*    <Radio className="active">Default Email</Radio>*/}
                              {/*</div>*/}
                            </div>
                          </div>
                          <div className="col-12 col-sm-6">
                            <Form.Item
                              name={`role${item.id}`}
                              label={"Position"}
                              rules={[
                                {
                                  required: true,
                                  message: "this field is required",
                                },
                              ]}
                            >
                              {/* <Input placeholder="Manager" /> */}
                              <Select
                                placeholder="Search and Select"
                                notFoundContent={null}
                                filterOption={false}
                                onSearch={(e) => {
                                  this.setState({page: 1, search: e}, () => {
                                    this.fetchPositions()
                                  })
                                }}
                                showSearch={true}
                                onFocus={() => this.fetchPositions()}
                                dropdownRender={options => (
                                    <>
                                    {options}
                                    {fetching && 
                                    <div className="text-center">
                                        <Spin />
                                    </div>}
                                    </>
                                )}
                                onPopupScroll={(e) => {
                                    e.persist();
                                    let target = e.target;
                                    if (
                                    target.scrollTop + target.offsetHeight ===
                                        target.scrollHeight && (totalCount != positions.length)
                                    ) {
                                    this.setState({ page: this.state.page + 1 }, () =>
                                        this.fetchPositions()
                                    );
                                    }
                                }}
                            >
                                {positions.map((i, index) => {
                                    return (
                                        <Option value={i.name} key={`${i.name + index}`}>{i.name}</Option>
                                    )
                                })}
                            </Select>
                            </Form.Item>
                            <Button
                                className="create-btn-main create-btn-main-update position-absolute"
                                onClick={() =>this.showPosition(true)}
                            >
                                + Create
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button htmlType="submit" className="validate-btn-main">
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <CreatePositionDrawer visible={this.state.positionVisible} onClose={()=>this.showPosition(false)}/>
        <CreateContactDrawer
          callbackContact={this.callbackContact}
          account={account}
          visible={this.state.visible}
          onClose={() => this.showContact(false)}
        />
        <CommonWarningModal
          visible={this.state.visibleWarning}
          onClose={() => this.showWarningModal(false)}
          heading={"Are you sure you want to remove this Contact?"}
          subHeadingUOM={
            "If you choose to remove this Contact, this might cause issues."
          }
          common
          commonFunc={() => {
            this.handleRemove();
            this.showWarningModal(false);
          }}
        />
        <CommonWarningModal
          changeAccountType
          visible={this.state.modalVisible}
          onClose={() => this.setState({modalVisible: false})}
          heading="Are you sure you want to change account for this contact?"
          subHeadingUOM=" This contact is already tied to an account. If you want to change the account for this contact, please select Yes, I want to change."
          cancelText="No, cancel this action"
          okText="Yes, I want to change"
          handleAccountChange= {this.handleAccountChange}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ContactsInfo);

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
} from "antd";
import { Image as Images } from "../../../../../Images";
import {
  getContact,
  updateContact,
} from "../../../../../../Controller/api/contactsServices";
import { withRouter } from "react-router-dom";
import CreateFacilityDrawer from "./CreateFacilityDrawer";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateFacility extends Component {
  state = {
    contacts: [],
    selectedContacts: [],
    fetching: false,
    visible: false,
  };
  formRef = React.createRef();

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
    // updateContact({"account": null}, item.id).then(res => {
    //     message.success('Contact removed successfully!')
    // }).catch(err => {
    //     if (err.response) {
    //         Object.keys(err.response.data).map((e) => {
    //             message.error(err.response.data[e])
    //         })
    //     }
    // })
  };

  fetchContacts = (params = {}) => {
    this.setState({ fetching: true });
    // getContact(params).then(res => {
    //     this.setState({contacts: res.data.results, fetching: false})
    // }).catch(err => {
    //     if (err.response) {
    //         Object.keys(err.response.data).map((e) => {
    //             message.error(err.response.data[e])
    //         })
    //     }
    //     this.setState({fetching: false})
    // })
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      // getContact({account: this.props.match.params.id}).then(res => {
      //     this.setState({selectedContacts: res.data.results, contacts: res.data.results})
      //     let data = {}
      //     res.data.results.forEach(p => {
      //         data[`role${p.id}`] = p.role
      //     })
      //     data.contacts = res.data.results.map(i => i.id)
      //     this.formRef.current.setFieldsValue({
      //         ...data
      //     })
      // }).catch(err => {
      // })
    }
  }

  handleSelect = (e) => {
    let selectedContacts = this.state.contacts.filter((i) => e.includes(i.id));
    this.setState({ selectedContacts });
  };

  callbackContact = (data) => {
    let { selectedContacts } = this.state;
    selectedContacts = [...selectedContacts, data];
    this.setState({ selectedContacts, contacts: selectedContacts });
    this.formRef.current.setFieldsValue({
      contacts: selectedContacts.map((i) => i.id),
    });
  };

  handleSubmit = (values) => {
    values.contacts.map((item) => {
      let data = {
        account: this.props.account.id,
        role: values[`role${item}`],
      };
      //     updateContact(data, item).then(res => {
      //         message.success('Contact added successfully!')
      //     }).catch(err => {
      //         if (err.response) {
      //             Object.keys(err.response.data).map((e) => {
      //                 message.error(err.response.data[e])
      //             })
      //         }
      //     })
    });
  };

  showContact = () => {
    this.setState({ visible: false });
  };

  render() {
    const { fetching, contacts, selectedContacts } = this.state;
    const { account } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
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
                        label={"Facility * "}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Select
                          mode="multiple"
                          placeholder="Search "
                          notFoundContent={
                            fetching ? <Spin size="small" /> : null
                          }
                          filterOption={false}
                          onFocus={() => this.fetchContacts()}
                          onSearch={(e) => this.fetchContacts({ search: e })}
                          onChange={this.handleSelect}
                        >
                          {contacts.map((d) => (
                            <Option
                              key={d.id}
                              value={d.id}
                            >{`${d.first_name} ${d.last_name}`}</Option>
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
                        className="create-btn-main position-absolute"
                        onClick={() => {
                          this.setState({ visible: true });
                        }}
                      >
                        Create
                      </Button>
                    </div>
                    {selectedContacts.length === 0 && (
                      <div className="col-12">
                        <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                          <h6 className="mb-0">No Location Name</h6>
                        </div>
                      </div>
                    )}
                    {selectedContacts.map((item) => (
                      <div key={item.id} className="col-12">
                        <div className="row contact-row-line">
                          <div className="col-12 col-sm-6">
                            <div className="row mx-0 align-items-center user-info-div-main position-relative opportunity-info-div-main">
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
                                  <p className="mb-0">{item.role}</p>
                                </div>
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
        <CreateFacilityDrawer
          callbackContact={this.callbackContact}
          account={account}
          visible={this.state.visible}
          onClose={() => this.showContact(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateFacility);

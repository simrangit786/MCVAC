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
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import CreateInternalLocationDrawer from "./CreateInternalLocationDrawer";
import {
  getInternalLocation,
  updateInternalLocation,
  updateEmployee,
} from "../../../../../Controller/api/labourServices";
import { formatPhone, LABOR } from "../../../../../Controller/utils";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import { handleError } from "../../../../../Controller/Global";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateInternalLocation extends Component {
  state = {
    contacts: [],
    selectedContacts: [],
    fetching: false,
    visible: false,
    warningVisible: false,
  };
  formRef = React.createRef();
  showWarningModal = (visible) => {
    this.setState({
      warningVisible: visible,
    });
  };

  menu = (item) => (
    <Menu>
      {/* <Menu.Item key="0">
                <Button onClick={() => this.handleEdit(item)}
                        className="border-0 p-0 shadow-none bg-transparent">Edit</Button>
            </Menu.Item> */}
      <Menu.Item key="0">
        <Button
          onClick={() => this.showWarningModal(true)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  // handleEdit = (item) => {
  //     this.setState({editData: item, visible: true})
  // }

  handleRemove = () => {
    this.setState({ selectedContacts: [] }, () => {
      this.formRef.current.setFieldsValue({
        internal_location: null,
      });
    });
  };

  fetchContacts = (params = {}) => {
    const data = {
      ...params,
      // type: LABOR,
      // employee_id: this.props.match.params.id
    };
    getInternalLocation(data)
      .then((res) => {
        this.setState({ contacts: res.data.results });
      })
      .catch((err) => {});
  };

  callbackContact = (data) => {
    this.setState({ selectedContacts: [data] });
    this.fetchContacts();
    // let {selectedContacts} = this.state;
    // selectedContacts = [ data]
    // this.setState({selectedContacts, contacts: selectedContacts})

    // this.formRef.current.setFieldsValue({
    //     internal_location: selectedContacts[0].id
    // })
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      const params = {
        employee_id: this.props.match.params.id,
        type: LABOR,
      };
      getInternalLocation(params)
        .then((res) => {
          this.setState({ selectedContacts: res.data.results });
          this.formRef.current.setFieldsValue({
            internal_location: null,
          });
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }

  handleSelect = (e) => {
    this.formRef.current.setFieldsValue({
      internal_location: null,
    });
    let selectedContacts = this.state.contacts.filter((i) => {
      return i.id == e;
    });
    this.setState({ selectedContacts });
  };

  handleSubmit = (values) => {
    let data = {
      // ...values,
      type: LABOR,
      internal_location: this.state.selectedContacts[0]?.id || null,
    };
    updateEmployee(this.props.employee.id, data)
      .then((res) => {
        this.props.setEmployee(res.data, 4);
        this.props.fetchEmployee();
        message.success("Employee updated successfully!");
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  showContact = () => {
    this.setState({ visible: false });
    // , editData: null})
  };

  render() {
    const { fetching, contacts, selectedContacts } = this.state;

    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                You can only choose one warehouse per employee.{" "}
              </h6>
            </div>
          </div>
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
                  <Form.Item
                    name="internal_location"
                    label={"Warehouse * "}
                    rules={[
                      {
                        required: false,
                        // message: 'this field is required'
                      },
                    ]}
                    className="position-relative search-overlap"
                  >
                    <Select
                      className={"custom-search-select"}
                      dropdownClassName={"custom-search-select"}
                      // mode="multiple"
                      placeholder="Search "
                      showSearch={true}
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      disabled={selectedContacts.length > 0 ? true : false}
                      // onFocus={() => this.fetchContacts({type: "LABOR"})}
                      onFocus={() => this.fetchContacts()}
                      onSearch={(e) => this.fetchContacts({ search: e })}
                      onChange={this.handleSelect}
                    >
                      {contacts.map((d) => {
                        return (
                          <Option key={d.id} value={d.id}>
                            <div className="row mx-0 custom-tree-row custom-tree-row-1 align-items-center justify-content-between">
                              <div className="common-select-option-row">
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
                                    {d.name}
                                    <br />
                                    <small
                                      style={{
                                        color: "#BDBDBD",
                                        fontSize: "11px",
                                        lineHeight: "8px",
                                      }}
                                    >
                                      {d.street_address || ""}, {d.city || ""},{" "}
                                      {d.state || ""},{d.zip || ""}{" "}
                                      {d.country || ""}
                                    </small>
                                  </h6>
                                </div>
                              </div>
                              <div className="text-green-tag select-text-tier">
                                Warehouse
                              </div>
                            </div>
                          </Option>
                        );
                      })}
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
                    className="create-btn-main position-absolute disabledBtnStyle"
                    onClick={() => {
                      this.setState({ visible: true });
                    }}
                    disabled={selectedContacts.length > 0 ? true : false}
                  >
                    + Create
                  </Button>
                </div>
              </div>
              {selectedContacts.length === 0 && (
                <div className="col-12">
                  <div className="row add-site-blank-row align-items-center">
                    <div className="col-12 text-center">
                      <img
                        src={Images.location_gray}
                        alt=""
                        className="img-fluid"
                      />
                      <h6 className="color-gray-3">
                        No Warehouse
                      </h6>
                    </div>
                  </div>
                </div>
              )}
              {selectedContacts.map((item) => (
                <div className="col-12" key={item.id}>
                  <div className="row site-details-row-card position-relative">
                    <div className="col-12 col-sm-3 title">
                      <div className="site-name-location">
                        <img
                          src={Images.location_gray}
                          alt=""
                          className="img-fluid"
                        />
                        <span>{item.name}</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">ADDRESS</h6>
                      <p className="mb-0">{`${item.street_address} ${item.name} ${item.city} ${item.state} ${item.country}`}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                      <p className="mb-0">{item.email}</p>
                    </div>
                    <div className="col-12 col-sm-3">
                      <h6 className="text-uppercase">PHONE NUMBER</h6>
                      <p className="mb-0">{formatPhone(item.phone)}</p>
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
              ))}
              <div className="col-12 validate-div-col text-md-right">
                <Form.Item>
                  <Button htmlType="submit" className="validate-btn-main">
                    Save and Continue
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
        <CreateInternalLocationDrawer
          callbackContact={this.callbackContact}
          fetchContacts={this.fetchContacts}
          //   editData={this.state.editData}
          visible={this.state.visible}
          onClose={(values) => this.showContact(false, values)}
        />
        <CommonWarningModal
          visible={this.state.warningVisible}
          onClose={() => this.showWarningModal(false)}
          heading={"Are you sure you want to remove this Warehouse?"}
          subHeadingUOM={
            "If you choose to remove this Warehouse, this might cause issues."
          }
          common
          commonFunc={() => {
            this.handleRemove();
            this.showWarningModal(false);
          }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateInternalLocation);

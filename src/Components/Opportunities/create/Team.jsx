import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Radio,
  Select,
  Spin,
} from "antd";
import { Image as Images } from "../../Images";
import {
  getOneOpportunities,
  updateOpportunity,
} from "../../../Controller/api/opportunityServices";
import { getUser } from "../../../Controller/api/authServices";
import { withRouter } from "react-router-dom";
import { getShortName } from "../../../Controller/utils";
import CommonWarningModal from "../../modals/CommonWarningModal";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { TextArea } = Input;
const types = {
  salesPerson: "salesperson",
  salesAssistant: "salesassistant",
  salesManager: "salesmanager",
};

const typeForm = {
  salesPerson: "sales_person",
  salesAssistant: "sales_assistant",
  salesManager: "sales_manager",
};

class Team extends Component {
  state = {
    salesPerson: [],
    salesAssistant: [],
    salesManager: [],
    salesPersonSelected: [],
    salesAssistantSelected: [],
    salesManagerSelected: [],
    fetching: false,
    buttonLoading: false,
    opportunity: {},
    visible: false,
  };
  showCommonRemove = (visible, item, type) => {
    if (visible) {
      this.setState({ item, type });
    }
    this.setState({
      visible: visible,
    });
  };
  formRef = React.createRef();

  menu = (item, type) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          // onClick={() => {this.removeUsers(item, type)}}
          onClick={() => this.showCommonRemove(true, item, type)}
          className="border-0 bg-transparent text-center p-0 w-100"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  removeUsers = () => {
    const { item, type } = this.state;
    this.setState({
      [`${type}Selected`]: this.state[`${type}Selected`].filter(
        (i) => i.id !== item.id
      ),
    });
    // this.formRef.current.setFieldsValue({
    //     [typeForm[type]]: this.formRef.current.getFieldValue(typeForm[type]).drawer(i => i !== item.id)
    // })
  };

  fetchUser = (type, search = {}) => {
    this.setState({ fetching: true });
    getUser(types[type], search)
      .then((res) => {
        // console.log("manager response", res);
        this.setState({
          [type]: res.data.results,
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

  handleSelect = (e, type) => {
    const { salesAssistantSelected, salesManagerSelected, salesPersonSelected } = this.state;
    if(salesManagerSelected.length == 0 &&
      salesPersonSelected.length == 0 && 
      salesAssistantSelected.length == 0) {
        this.handleUpdatePoc(e)
    }
    this.formRef.current.setFieldsValue({
      [typeForm[type]]: null,
    });
    let data = this.state[type].filter((i) => e === i.id);
    let newData = this.state[`${type}Selected`].find((n) => e === n.id);
    if (newData) {
      return null;
    } else {
      this.setState((prevState) => {
        return {
          [`${type}Selected`]: [...prevState[`${type}Selected`], ...data],
        };
      });
    }
  };

  handleSubmit = () => {
    const values = {
      sales_manager: this.state.salesManagerSelected.map((i) => i.id),
      sales_assistant: this.state.salesAssistantSelected.map((i) => i.id),
      sales_person: this.state.salesPersonSelected.map((i) => i.id),
    };
    this.setState({ buttonLoading: true });
    if (this.props.match.params.id) {
      updateOpportunity(this.props.match.params.id, values)
        .then((res) => {
          message.success("Team Updated Successfully!");
          this.props.setOpportunity(res.data, 3);
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
      updateOpportunity(this.state.opportunity.id, values)
        .then((res) => {
          message.success("Team added Successfully!");
          this.props.setOpportunity(res.data, 3);
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
    }
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      getOneOpportunities(id).then((res) => {
        this.setState({ buttonLoading: false });
        this.setState({
          salesPersonSelected: this.props.opportunity.sales_person,
          salesAssistantSelected: this.props.opportunity.sales_assistant,
          salesManagerSelected: this.props.opportunity.sales_manager,
        });
        this.fetchUser("salesManager");
        this.fetchUser("salesAssistant");
        this.fetchUser("salesPerson");
        // this.formRef.current.setFieldsValue({
        //     sales_person: this.props.opportunity.sales_person.map(i => i.id),
        //     sales_assistant: this.props.opportunity.sales_assistant.map(i => i.id),
        //     sales_manager: this.props.opportunity.sales_manager.map(i => i.id)
        // })
      });
    }

    if (this.props.opportunity) {
      this.setState({ opportunity: this.props.opportunity });
    }
  }

  // async componentDidUpdate(prevProps, prevState, snapshot) {
  //     if (prevProps.opportunity !== this.props.opportunity) {
  //         await this.fetchUser("salesPerson")
  //         await this.fetchUser("salesAssistant")
  //         await this.fetchUser("salesManager")

  //         await this.formRef.current.setFieldsValue({
  //             sales_person: this.props.opportunity.sales_person.map(i => i.id),
  //             sales_assistant: this.props.opportunity.sales_assistant.map(i => i.id),
  //             sales_manager: this.props.opportunity.sales_manager.map(i => i.id)
  //         })
  //         this.setState({
  //             salesPersonSelected: this.props.opportunity.sales_person,
  //             salesAssistantSelected: this.props.opportunity.sales_assistant,
  //             salesManagerSelected: this.props.opportunity.sales_manager

  //         })
  //     }
  // }

  handleUpdatePoc = (itemId) => {
    updateOpportunity(this.props.opportunity.id, { point_opportunity: itemId })
      .then((res) => {
        this.props.setOpportunity(res.data);
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };

  render() {
    const {
      fetching,
      salesPerson,
      salesAssistant,
      salesManager,
      salesPersonSelected,
      salesAssistantSelected,
      salesManagerSelected,
    } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row general-info">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                You can only choose one point of contact.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              requiredMark={false}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <Radio.Group
                value={this.props.opportunity?.point_opportunity}
              >
                <div className="row">
                  <div className="col-12 col-sm-12">
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          name="sales_manager"
                          label={"Sales Managers"}
                          rules={[
                            {
                              required: false,
                              message: "",
                            },
                          ]}
                          className="position-relative search-overlap"
                        >
                          <Select
                            dropdownClassName={"option-design-fix"}
                            // mode="multiple"
                            placeholder="Search"
                            showSearch={true}
                            filterOption={false}
                            notFoundContent={
                              fetching ? <Spin size="small" /> : null
                            }
                            onChange={(e) =>
                              this.handleSelect(e, "salesManager")
                            }
                            onFocus={() => this.fetchUser("salesManager")}
                            onSearch={(e) =>
                              this.fetchUser("salesManager", { search: e })
                            }
                            className="custom-search-select"
                          >
                            {salesManager.map((d) => (
                              <Option value={d.id} key={d.id}>
                                <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                  <div className="common-select-option-row">
                                    <div className="select-option-details d-flex align-items-center">
                                      <div className={"select-option-icon"}>
                                        <span className="text-uppercase user-name-tg">
                                          {getShortName(
                                            d.first_name,
                                            d.last_name
                                          )}
                                        </span>
                                      </div>
                                      <h6 className="mb-0">{`${d.first_name} ${d.last_name}`}</h6>
                                    </div>
                                  </div>
                                  <div className="text-green-tag select-text-tier">
                                    Sales Manager
                                  </div>
                                </div>
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
                        {/* <Button
                                            // onClick={() => this.showSalesManager(true)}
                                            className="create-btn-main position-absolute">
                                            <span>+ Create</span></Button> */}
                      </div>
                      {salesManagerSelected.length === 0 && (
                        <div className="col-12">
                          <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                            <div className="col-12 text-center">
                              <img
                                alt={""}
                                className="img-fluid"
                                src={Images.teams_labor_no_data_icon}
                              />
                              <h6 style={{ color: "#4F4F4F" }} className="mb-0">
                                No Sales Managers
                              </h6>
                            </div>
                          </div>
                        </div>
                      )}
                      {salesManagerSelected.map((i) => (
                        //  <Radio.Group
                        //   className="w-100"
                        //     // defaultValue={salesManagerSelected.find(n => n.default_customer_recipient === true)?.salesManagerSelected?.id}
                        //  >
                        <div className="col-12 col-sm-6">
                          <div className="row">
                            <div key={i.id} className="col-12">
                              <div className="row pb-0 align-items-center user-info-div-main opportunity-info-div-main mb-2">
                                <div className="col-12 contact-col-12">
                                  <div className="user-icons-div">
                                    <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                      {getShortName(i.first_name, i.last_name)}
                                    </span>
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{`${i.first_name} ${i.last_name}`}</h6>
                                    <p className="mb-0">Sales Manager</p>
                                  </div>
                                  <Dropdown
                                    overlayClassName="add-remove-dropdown-main"
                                    overlay={this.menu(i, "salesManager")}
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
                                <div className="col-12 p-0 radio-btn-custom">
                                  <Radio
                                    className="active"
                                    onChange={() => this.handleUpdatePoc(i.id)}
                                    value={i.id}
                                    // value={contact?.contact?.id}
                                    // onChange={() => this.handleDefaultRecipient(item.id, contact?.contact?.id)}
                                  >
                                    Point of Contact
                                    {/*Recipient <small style={{*/}
                                    {/*    color: '#b4b4b4', fontSize: '9px'*/}
                                    {/*}}>This contact will be*/}
                                    {/*    addressed in*/}
                                    {/*    the*/}
                                    {/*    proposal.</small>*/}
                                  </Radio>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        //    </Radio.Group>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-sm-12">
                    <div className="row">
                      <div className="col-12 position-relative">
                        <Form.Item
                          name="sales_person"
                          label={"Salespeople"}
                          rules={[
                            {
                              required: false,
                              message: "",
                            },
                          ]}
                          className="search-overlap"
                        >
                          <Select
                            dropdownClassName={"option-design-fix"}
                            // mode="multiple"
                            placeholder="Search"
                            notFoundContent={
                              fetching ? <Spin size="small" /> : null
                            }
                            showSearch={true}
                            filterOption={false}
                            onChange={(e) =>
                              this.handleSelect(e, "salesPerson")
                            }
                            onFocus={() => this.fetchUser("salesPerson")}
                            onSearch={(e) =>
                              this.fetchUser("salesPerson", { search: e })
                            }
                            className="custom-search-select"
                          >
                            {salesPerson.map((d) => (
                              <Option value={d.id} key={d.id}>
                                <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                  <div className="common-select-option-row">
                                    <div className="select-option-details d-flex align-items-center">
                                      <div className={"select-option-icon"}>
                                        <span className="text-uppercase user-name-tg">
                                          {getShortName(
                                            d.first_name,
                                            d.last_name
                                          )}
                                        </span>
                                      </div>
                                      <h6 className="mb-0">{`${d.first_name} ${d.last_name}`}</h6>
                                    </div>
                                  </div>
                                  <div className="text-green-tag select-text-tier">
                                    Salesperson
                                  </div>
                                </div>
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
                        {/* <Button
                                            // onClick={() => this.showSalesManager(true)}
                                            className="create-btn-main position-absolute">
                                            <span>+ Create</span></Button> */}
                      </div>
                      {salesPersonSelected.length === 0 && (
                        <div className="col-12">
                          <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                            <div className="col-12 text-center">
                              <img
                                alt={""}
                                className="img-fluid"
                                src={Images.teams_labor_no_data_icon}
                              />
                              <h6 style={{ color: "#4F4F4F" }} className="mb-0">
                                No Salespeople
                              </h6>
                            </div>
                          </div>
                        </div>
                      )}
                      {salesPersonSelected.map((i) => (
                        // <Radio.Group className="w-100"
                        //     // defaultValue={salesManagerSelected.find(n => n.default_customer_recipient === true)?.salesManagerSelected?.id}
                        // >
                        <div className="col-12 col-sm-6">
                          <div className="row">
                            <div key={i.id} className="col-12">
                              <div className="row pb-0 align-items-center user-info-div-main opportunity-info-div-main mb-2">
                                <div className="col-12 contact-col-12">
                                  <div className="user-icons-div">
                                    <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                    {getShortName(i.first_name, i.last_name)}
                                    </span>
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{`${i.first_name} ${i.last_name}`}</h6>
                                    <p className="mb-0">Salesperson</p>
                                  </div>
                                  <Dropdown
                                    overlayClassName="add-remove-dropdown-main"
                                    placement="bottomCenter"
                                    overlay={this.menu(i, "salesPerson")}
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
                                <div className="col-12 p-0 radio-btn-custom">
                                  <Radio
                                    className="active"
                                    onChange={() => this.handleUpdatePoc(i.id)}
                                    value={i.id}
                                    // value={contact?.contact?.id}
                                    // onChange={() => this.handleDefaultRecipient(item.id, contact?.contact?.id)}
                                  >
                                    Point of Contact
                                    {/*Recipient <small style={{*/}
                                    {/*    color: '#b4b4b4', fontSize: '9px'*/}
                                    {/*}}>This contact will be*/}
                                    {/*    addressed in*/}
                                    {/*    the*/}
                                    {/*    proposal.</small>*/}
                                  </Radio>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        // </Radio.Group>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-sm-12">
                    <div className="row">
                      <div className="col-12">
                        <Form.Item
                          name="sales_assistant"
                          label={"Sales Assistants "}
                          rules={[
                            {
                              required: false,
                              message: "",
                            },
                          ]}
                          className="position-relative search-overlap"
                        >
                          <Select
                            dropdownClassName={"option-design-fix"}
                            // mode="multiple"
                            placeholder="Search"
                            notFoundContent={
                              fetching ? <Spin size="small" /> : null
                            }
                            showSearch={true}
                            filterOption={false}
                            onChange={(e) =>
                              this.handleSelect(e, "salesAssistant")
                            }
                            onFocus={() => this.fetchUser("salesAssistant")}
                            onSearch={(e) =>
                              this.fetchUser("salesAssistant", { search: e })
                            }
                            className="custom-search-select"
                          >
                            {salesAssistant.map((d) => (
                              <Option value={d.id} key={d.id}>
                                <div className="row mx-0 custom-tree-row align-items-center justify-content-between">
                                  <div className="common-select-option-row">
                                    <div className="select-option-details d-flex align-items-center">
                                      <div className={"select-option-icon"}>
                                        <span className="text-uppercase user-name-tg">
                                          {getShortName(
                                            d.first_name,
                                            d.last_name
                                          )}
                                        </span>
                                      </div>
                                      <h6 className="mb-0">{`${d.first_name} ${d.last_name}`}</h6>
                                    </div>
                                  </div>
                                  <div className="text-green-tag select-text-tier">
                                    Sales Assistant
                                  </div>
                                </div>
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
                        {/* <Button
                                            // onClick={() => this.showSalesManager(true)}
                                            className="create-btn-main position-absolute">
                                            <span>+ Create</span></Button> */}
                      </div>
                      {salesAssistantSelected.length === 0 && (
                        <div className="col-12">
                          <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                            <div className="col-12 text-center">
                              <img
                                alt={""}
                                className="img-fluid"
                                src={Images.teams_labor_no_data_icon}
                              />
                              <h6 style={{ color: "#4F4F4F" }} className="mb-0">
                                No Sales Assistants
                              </h6>
                            </div>
                          </div>
                        </div>
                      )}
                      {salesAssistantSelected.map((i) => (
                        // <Radio.Group className="w-100"
                        //         // defaultValue={salesManagerSelected.find(n => n.default_customer_recipient === true)?.salesManagerSelected?.id}
                        //     >
                        <div className="col-12 col-sm-6">
                          <div className="row">
                            <div key={i.id} className="col-12">
                              <div className="row pb-0 align-items-center user-info-div-main opportunity-info-div-main mb-2">
                                <div className="col-12 contact-col-12">
                                  <div className="user-icons-div">
                                    <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                                    {getShortName(i.first_name, i.last_name)}
                                    </span>
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{`${i.first_name} ${i.last_name}`}</h6>
                                    <p className="mb-0">Sales Assistant</p>
                                  </div>
                                  <Dropdown
                                    overlayClassName="add-remove-dropdown-main"
                                    overlay={this.menu(i, "salesAssistant")}
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
                                <div className="col-12 p-0 radio-btn-custom">
                                  <Radio
                                    className="active"
                                    value={i.id}
                                    onChange={() => this.handleUpdatePoc(i.id)}
                                    // value={contact?.contact?.id}
                                    // onChange={() => this.handleDefaultRecipient(item.id, contact?.contact?.id)}
                                  >
                                    Point of Contact
                                    {/*Recipient <small style={{*/}
                                    {/*    color: '#b4b4b4', fontSize: '9px'*/}
                                    {/*}}>This contact will be*/}
                                    {/*    addressed in*/}
                                    {/*    the*/}
                                    {/*    proposal.</small>*/}
                                  </Radio>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        // </Radio.Group>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 validate-div-col text-md-right">
                    <Form.Item>
                      <Button
                        loading={this.state.buttonLoading}
                        htmlType={"submit"}
                        className="validate-btn-main"
                      >
                        Save and Continue
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Radio.Group>
            </Form>
          </div>
        </div>
        <CommonWarningModal
          heading={"Are you sure you want to remove this team member?"}
          subHeadingUOM={
            "If you choose to remove this Team Member, this might cause issues. "
          }
          commonInternalLocationPopup
          visible={this.state.visible}
          commonDO={"Yes, I do"}
          showWarningModal2={() => {
            this.removeUsers();
            this.showCommonRemove(false);
          }}
          onClose={() => this.showCommonRemove(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(Team);

import React, { Component } from "react";
import {
  Button,
  Dropdown,
  Form,
  Menu,
  Radio,
  Select,
  Spin,
  message,
  Checkbox,
} from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import {
  getLaborGroup,
  updateEmployee,
  getEmployeeById,
} from "../../../../../Controller/api/labourServices";
import { handleError } from "../../../../../Controller/Global";
import person_group_green_icon from "../../../../../assets/images/icons/person-group-green-icon-main.svg";
import CommonWarningModal from "../../../../modals/CommonWarningModal";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateNewEmployeesLabor extends Component {
  state = {
    id: null,
    groups: [],
    selectedGroups: [],
    selectedEmployeeGroups: [],
    value: 0,
    fetching: false,
    currentEmployee: [],
    isChecked: false,
    checkData: null,
    warningVisible: false,
    itemToBeDltd: null,
  };

  formRef = React.createRef();

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.showWarning(true, item)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleRemove = () => {
    const item = this.state.itemToBeDltd;
    let selectedGroups = this.state.selectedGroups.filter(
      (i) => i.id !== item.id
    );
    this.setState({ selectedGroups });
    // this.formRef.current.setFieldsValue({
    //     employee_labor: this.formRef.current.getFieldValue('employee_labor').drawer(i => i !== item.id),
    // })
    if (this.props.employee?.home_group) {
      if (item?.id === this.state.currentEmployee?.home_group?.id) {
        this.setState({ checkData: null });
      }
    }
  };

  fetchGroups = (params = {}) => {
    this.setState({ fetching: true });
    getLaborGroup(params)
      .then((res) => {
        this.setState({
          groups: res.data.results,
          fetching: false,
        });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.fetchGroups();
      let arr = this.props.employee.labors.map((i) => i.id);
      getLaborGroup()
        .then((res) => {
          this.setState({
            selectedGroups: res.data.results.filter((i) => arr.includes(i.id)),
            groups: res.data.results,
          });
          // this.formRef.current.setFieldsValue({
          //     employee_labor: arr,
          // })
        })
        .catch((err) => {});

      if (this.props.employee.home_group) {
        let group_type = this.props.employee.home_group.id;
        this.setState({ checkData: group_type });
      }
    }
  }

  handleSelect = (e) => {
    this.formRef.current.setFieldsValue({
      employee_labor: null,
    });
    let selectedGroups = () => {
      const findDuplicate = this.state.selectedGroups.find((n) => n.id === e);
      if (findDuplicate) {
        return [];
      } else {
        return this.state.groups.filter((i) => e === i.id);
      }
    };
    this.setState((prevState) => {
      return {
        selectedGroups: [...prevState.selectedGroups, ...selectedGroups()],
      };
    });
  };

  handleSubmit = (values) => {
    values.employee_labor = this.state.selectedGroups.map((i) => i.id);
    values.home_group = this.state.checkData;
    updateEmployee(this.props.employee.id, values)
      .then((res) => {
        this.props.setEmployee(res.data, 6);
        message.success("Employee updated successfully!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  checkboxchange = (e, id) => {
    if (this.state.isChecked == id) {
      this.setState({ checkData: null });
    } else {
      this.setState({
        isChecked: id,
        checkData: id,
      });
    }
  };

  showWarning = (warningVisible, itemToBeDltd = null) => {
    this.setState({ warningVisible, itemToBeDltd });
  };

  render() {
    const { buttonLoading, fetching, groups, value, selectedGroups } =
      this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please add all labor groups this employee belongs to.{" "}
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-12">
                  <Form.Item
                    name="employee_labor"
                    label={"Labor groups *"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      className={"custom-search-select"}
                      dropdownClassName={"custom-search-select"}
                      // mode="multiple"
                      placeholder="Search"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      showSearch
                      onFocus={() => this.fetchGroups()}
                      onSearch={(e) => this.fetchGroups({ search: e })}
                      onChange={this.handleSelect}
                    >
                      {groups.map((d) => {
                        return (
                          <Option key={d.id} value={d.id}>
                            <div className="row custom-tree-row custom-tree-row-1">
                              <div className="common-select-option-row col-12 d-flex align-items-center">
                                <div
                                  style={{
                                    width: "40px",
                                  }}
                                  className="float-left"
                                >
                                  <img
                                    style={{
                                      height: "30px",
                                    }}
                                    src={Images.person_group_green_icon}
                                    alt={""}
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="float-left warehouse-select-box">
                                  <h6 className="mb-0 w-100 d-inline-block">
                                    {d.labor_group_name}
                                  </h6>
                                </div>
                                <div
                                  style={{
                                    paddingTop: "15px",
                                    display: "inline-block",
                                  }}
                                  className="text-green-tag text-center select-text-tier"
                                >
                                  Labor Group
                                </div>
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
                </div>
                {selectedGroups.length === 0 && (
                  <div className="col-12">
                    <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                      <div className="col-12 text-center">
                        <img
                          src={Images.Labor_empty_state_icon}
                          alt={""}
                          className="img-fluid"
                        />
                        <h6 className="mb-0 color-gray-3">No Labor groups</h6>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <Form.Item
                    name="home_group"
                    rules={[
                      {
                        required: false,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    {/* <Radio.Group onChange={this.onChange} value={value}> */}
                    {selectedGroups.map((i) => (
                      <div className="row">
                        <div className="col-6 col-sm-6">
                          <div
                            style={{ minHeight: "85px", height: "85px" }}
                            className="row mx-0 align-items-center position-relative user-info-div-main opportunity-info-div-main"
                          >
                            <div className="col-11">
                              <div className="user-icons-div position-relative">
                                <img
                                  src={Images.person_group_black_icon}
                                  alt={""}
                                  className="img-fluid black-icon-emp"
                                />
                                <img
                                  src={Images.person_group_green_icon}
                                  alt={""}
                                  className="img-fluid green-icon-emp position-absolute"
                                />
                              </div>
                              <div className="user-info-div">
                                <h6>{i.labor_group_name}</h6>
                                <p className="mb-0">{i.region?.title}</p>
                              </div>
                            </div>
                            <div className="col-1 p-0">
                              <Dropdown
                                overlayClassName="add-remove-dropdown-main"
                                placement="bottomCenter"
                                overlay={this.menu(i)}
                                trigger={["click"]}
                              >
                                <Button
                                  className="bg-transparent p-0 border-0 ant-dropdown-link"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <img
                                    src={Images.eva_more_elisis}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </Button>
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 d-flex align-items-center">
                          {/* <Radio value={i.id} className="custom-radio-btn-group">
                                                            <div className='row mx-0'>
                                                                <div className="col-12">
                                                                    <h6>Home Labor Group</h6>
                                                                </div>
                                                            </div>
                                                        </Radio> */}
                          {/* <Form.Item name="home_group"
                                                    rules={[{
                                                        required: true,
                                                        message: 'this field is required'
                                                    }]} className="position-relative"> */}
                          <div className="name-id-details">
                            <Checkbox
                              name="myCheckbox"
                              checked={
                                this.state.checkData == i.id ? true : false
                              }
                              onChange={(e) => this.checkboxchange(e, i.id)}
                            >
                              Home Labor Group{" "}
                            </Checkbox>
                          </div>
                          {/* </Form.Item> */}
                        </div>
                      </div>
                    ))}
                    {/* </Radio.Group> */}
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
        <CommonWarningModal
          heading={"Are you sure you want to remove this Labor Group?"}
          subHeadingUOM={
            "If you choose to remove this Labor Group, and you already have service variants set up, this might cause issues."
          }
          visible={this.state.warningVisible}
          onClose={() => this.showWarning(false)}
          laborGroupModal
          resourceWarning
          commonFunc={() => {
            this.handleRemove();
            this.showWarning(false);
          }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateNewEmployeesLabor);

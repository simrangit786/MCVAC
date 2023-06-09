import React, { Component } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  message,
  Dropdown,
  Menu,
  Spin,
} from "antd";
import { withRouter } from "react-router-dom";
import {
  getEmployees,
  getEmployeeById,
} from "../../../../../Controller/api/labourServices";
import { handleError } from "../../../../../Controller/Global";
import { Image as Images } from "../../../../Images";
import { updateLaborGroup } from "../../../../../Controller/api/labourServices";
import CommonWarningModal from "../../../../modals/CommonWarningModal";
import { getShortName } from "../../../../../Controller/utils";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateEmployeesLabor extends Component {
  state = {
    employees: [],
    fetchemployees: [],
    fetching: false,
    selectedEmployee: [],
    visible: false,
  };
  formRef = React.createRef();

  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => {
            this.handleVisible(true, item);
            // this.handleRemove(item)
          }}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleRemove = (item) => {
    let selectedEmployee = this.state.selectedEmployee.filter(
      (i) => i.id !== item.id
    );
    this.setState({ selectedEmployee });
    // this.formRef.current.setFieldsValue({
    //     employee_labor: this.formRef.current.getFieldValue('employee_labor').drawer(i => i !== item.id),
    // })
  };

  fetchEmployees = (params = {}) => {
    this.setState({ fetching: true });
    getEmployees(params)
      .then((res) => {
        this.setState({
          employees: res.data.results,
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
      let arr = this.props.group.employees_attached.map((i) => i.id);
      getEmployees()
        .then((res) => {
          this.setState({
            selectedEmployee: res.data.results.filter((i) =>
              arr.includes(i.id)
            ),
            employees: res.data.results,
          });
          this.formRef.current.setFieldsValue({
            employee_labor: null,
          });
        })
        .catch((err) => {
          handleError(err);
        });
    }
  }
  handleSelect = (e) => {
    this.formRef.current.setFieldsValue({
      employee_labor: null,
    });
    let selectedEmployee = [...this.state.selectedEmployee];
    let alreadyExist = selectedEmployee.find((i) => i.id === e);
    if (!alreadyExist) {
      let foundItem = this.state.employees.find((i) => e === i.id);
      // if(selectedEmployee.find(i => i.id != e)) {
      selectedEmployee.push(foundItem);
    }
    this.setState({ selectedEmployee });
  };

  handleSubmit = (values) => {
    values.employee_labor = this.state.selectedEmployee.map((i) => i.id);
    updateLaborGroup(this.props.group.id, values)
      .then((res) => {
        this.props.setGroup(res.data, 3);
        message.success("Labor Group updated successfully!");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleVisible = (visible, item = null) => {
    this.setState({ visible, item });
  };

  render() {
    const { employees, selectedEmployee, fetching } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please add all employees belonging to this group.{" "}
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
                {/* {<div className="col-12 col-sm-12 mb-2 search-bar-div">
                                    <Form name="employee" className="position-relative">
                                        <Input onChange={e => this.fetchEmployees({search: e.target.value})}
                                               placeholder="Search"/>
                                        <Button
                                            className='search-btn position-absolute p-0 border-0 bg-transparent m-auto'>
                                            <img src={Images.search_icon_gray} className="img-fluid"
                                                 alt="search icon"/>
                                        </Button>
                                    </Form>
                                </div>} */}
                <div className="col-12 col-sm-12">
                  <Form.Item
                    name="employee_labor"
                    label={"Employees"}
                    rules={[
                      {
                        required: false,
                        // message: 'this field is required'
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      // mode="multiple"
                      // defaultOpen
                      dropdownClassName="option-design-fix"
                      className="custom-search-select"
                      placeholder="Search and Select Region"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      showSearch
                      onFocus={() => this.fetchEmployees()}
                      onSearch={(e) => this.fetchEmployees({ search: e })}
                      onChange={this.handleSelect}
                    >
                      {employees.map((d) => (
                        <Option key={d.id} value={d.id}>
                          {/* {d.first_name} */}
                          <div className="row custom-tree-row custom-tree-row-1">
                            <div className="common-select-option-row col-12 d-flex align-items-center">
                              <div
                                style={{
                                  width: "40px",
                                }}
                                className="float-left"
                              >
                                {/* <img style={{
                                                                height:'30px'
                                                            }} src={Images.person_group_green_icon} alt={""}
                                                                 className="img-fluid"/> */}
                                <span
                                  style={{
                                    background: "#7FD4BA",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    width: "35px",
                                    height: "35px",
                                  }}
                                  className="d-flex justify-content-center align-items-center"
                                >
                                  {getShortName(d.first_name, d.last_name)}
                                </span>
                              </div>
                              <div className="float-left warehouse-select-box">
                                <h6 className="mb-0 w-100 d-inline-block ml-1">
                                  {d.first_name} {d.last_name}
                                </h6>
                              </div>
                              <div
                                style={{
                                  display: "inline-block",
                                }}
                                className="text-green-tag text-center select-text-tier"
                              >
                                Employee
                              </div>
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
                </div>
                {selectedEmployee.length === 0 ? (
                  <div className="col-12">
                    <div className="row mx-0 no-data-card-row align-items-center justify-content-center">
                      <div className="col-12 text-center">
                        <img src={Images.Labor_empty_state_icon} alt="" className="img-fluid"/>
                        <h6 className="mb-0">No Employees</h6>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-12">
                    <div className="row">
                      {selectedEmployee.map((i) => (
                        <div className="col-6 col-sm-6">
                          <div
                            style={{ minHeight: "85px", height: "85px" }}
                            className="row mx-0 align-items-center position-relative user-info-div-main opportunity-info-div-main"
                          >
                            <div className="col-11 d-flex align-items-center">
                              <div className="user-icons-div">
                                <span className="d-flex align-items-center justify-content-center rounded-circle">
                                {getShortName(i.first_name, i.last_name)}
                                </span>
                              </div>
                              <div className="user-info-div">
                                <h6>{`${i.first_name} ${
                                  i.middle_name ? i.middle_name : ""
                                } ${i.last_name}`}</h6>
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
                      ))}
                    </div>
                    {/*<div*/}
                    {/*    className="row mx-0 no-data-card-row align-items-center justify-content-center">*/}
                    {/*    <div className="col-12 text-center">*/}
                    {/*        <img src={Images.staff_icon_gray} alt="" className="img-fluid"/>*/}
                    {/*        <h6 className="mb-0">No Employees</h6>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                  </div>
                )}

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
        <CommonWarningModal
          visible={this.state.visible}
          onClose={() => this.handleVisible(false)}
          wageInfoDelete
          empDelete
          apprenticeCost
          removeItem={() => {
            // this.removeItem()
            this.handleRemove(this.state.item);
            this.handleVisible(false);
          }}
          heading={"Are you sure you want to remove this Employee?"}
          subHeadingUOM={
            "If you choose to remove this employee, this might cause issues."
          }
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateEmployeesLabor);

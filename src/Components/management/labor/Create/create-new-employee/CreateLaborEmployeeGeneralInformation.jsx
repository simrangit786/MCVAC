import React, { Component } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import {
  createEmployee,
  updateEmployee,
} from "../../../../../Controller/api/labourServices";
import { handleError } from "../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateLaborEmployeeGeneralInformation extends Component {
  formRef = React.createRef();

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.employee !== this.props.employee) {
      this.formRef.current.setFieldsValue({
        ...this.props.employee,
      });
    }
  }

  handleSubmit = (values) => {
    if (this.props.employee) {
      updateEmployee(this.props.employee.id, values)
        .then((res) => {
          message.success("Employee Updated successfully!");
          this.props.setEmployee(res.data, 2);
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createEmployee(values)
        .then((res) => {
          message.success("Employee Created successfully!");
          this.props.setEmployee(res.data, 2);
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input employee’s general information.
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
                {/* <div className="col-12 col-sm-6">
                                    <Form.Item name="id" label={"Employee ID"}
                                         className="position-relative">
                                        <Input placeholder="0000000" disabled />
                                    </Form.Item>
                                </div> */}
                {/* <div className="col-12 col-sm-6"/> */}

                {/* <div className="col-12">
                                    <h6>Name</h6>
                                </div> */}
                {/* <div className="col-12 col-sm-6">
                  <Form.Item
                    name="salutation"
                    label={"Salutation"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select placeholder="Select">
                      <Select.Option value={"MR."}>Mr.</Select.Option>
                      <Select.Option value={"MRS."}>Mrs.</Select.Option>
                    </Select>
                  </Form.Item>
                </div> */}
                <div className="col-12 col-sm-6">
                  <div className="row">
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
                        className="position-relative"
                      >
                        <Input placeholder={"John"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="middle_name"
                        label={"Middle Name"}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Input placeholder={"Nicholas"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
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
                        className="position-relative"
                      >
                        <Input placeholder={"Doe"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="suffix"
                        label={"Suffix"}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Select placeholder="Select">
                          <Select.Option value={"JR"}>Jr</Select.Option>
                          <Select.Option value={"SR"}>Sr</Select.Option>
                          <Select.Option value="I">I</Select.Option>
                          <Select.Option value="II">II</Select.Option>
                          <Select.Option value="III">III</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="payroll_id"
                        label={"Payroll ID *"}
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                      >
                        <Input placeholder="Input" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="company_code"
                        label={"Company Code "}
                        rules={[
                          {
                            required: false,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Input placeholder={"Company Code"} />
                      </Form.Item>
                    </div>
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
      </React.Fragment>
    );
  }
}

export default withRouter(CreateLaborEmployeeGeneralInformation);

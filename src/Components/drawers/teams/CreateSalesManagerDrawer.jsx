import React, { Component } from "react";
import { Button, Collapse, Drawer, Form, Input, Select } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateSalesManagerDrawer extends Component {
  formRef = React.createRef();

  render() {
    return (
      <React.Fragment>
        <Drawer
          centered
          destroyOnClose={true}
          title="Create Sales Manager"
          visible={this.props.visible}
          onClose={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"625px"}
          placement={"right"}
          maskClosable={false}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button style={{ marginRight: 8 }}>Cancel</Button>
              <Button type="primary">Continue</Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row summary-info-inner-row">
                <div className="col-12">
                  <Collapse
                    accordion
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>General Information *</span>
                            {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                          </div>
                        </div>
                      }
                      key="1"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <Form
                            ref={this.formRef}
                            {...layout}
                            hideRequiredMark={true}
                            className="main-inner-form"
                          >
                            <div className="row mx-0">
                              <div className="col-12">
                                <Form.Item
                                  name="team_member_type"
                                  label={"Team Member Type"}
                                  rules={[
                                    {
                                      required: false,
                                      message: "",
                                    },
                                  ]}
                                >
                                  <Input disabled placeholder="Sales Manager" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="salutation"
                                  label={"Salutation"}
                                  rules={[
                                    {
                                      required: false,
                                      message: " ",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Ms., Mr., Mrs., etc" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="f_name"
                                  label={"First Name *"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Input placeholder="First Name" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="middle_name"
                                  label={"Middle Name"}
                                  rules={[
                                    {
                                      required: false,
                                      message: " ",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Middle Name" />
                                </Form.Item>
                              </div>
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
                                >
                                  <Input placeholder="Last Name" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="suffix"
                                  label={"Suffix"}
                                  rules={[
                                    {
                                      required: false,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Select placeholder="Select">
                                    <Select.Option value={null}>
                                      Select
                                    </Select.Option>
                                    <Select.Option value="JR">JR</Select.Option>
                                    <Select.Option value="SR">SR</Select.Option>
                                    <Select.Option value="I">I</Select.Option>
                                    <Select.Option value="II">II</Select.Option>
                                    <Select.Option value="III">
                                      III
                                    </Select.Option>
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                  <Button
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
                    </Panel>

                    <Panel
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>Contact Information *</span>
                            {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                          </div>
                        </div>
                      }
                      key="2"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <div {...layout} className="main-inner-form">
                            <div className="row mx-0">
                              <Form
                                hideRequiredMark={true}
                                ref={this.formRef}
                                {...layout}
                                className="main-inner-form w-100"
                              >
                                <div className="col-12">
                                  <Form.Item
                                    name="name"
                                    label={"Email Address *"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "this field is required",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Email Address Name" />
                                  </Form.Item>
                                </div>
                                <div className="col-12">
                                  <Form.Item
                                    name="phone"
                                    label={"Phone Number *"}
                                    rules={[
                                      {
                                        required: true,
                                        message: "this field is required",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Phone Number" />
                                  </Form.Item>
                                </div>
                                <div className="col-12 validate-div-col text-md-right">
                                  <Form.Item>
                                    <Button
                                      htmlType="submit"
                                      className="validate-btn-main"
                                    >
                                      Save and Continue
                                    </Button>
                                  </Form.Item>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default CreateSalesManagerDrawer;

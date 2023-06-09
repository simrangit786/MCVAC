import React, { Component } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, Spin } from "antd";
import { Image as Images } from "../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateContact extends Component {
  state = {
    data: [],
    value: [],
    fetching: false,
  };
  fetchUser = (value) => {
    // console.log("fetching user", value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch("https://randomuser.me/api/?results=5")
      .then((response) => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        const data = body.results.map((user) => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({ data, fetching: false });
      });
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <React.Fragment>
        <Modal
          centered
          title="Create Contact"
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-all-form-modal"
          cancelText={"Cancel"}
          okText={"Create Contact"}
          width={"575px"}
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form {...layout} className="main-inner-form">
                <div className="row">
                  <div className="col-12 small-heading-main">
                    <h6>General Information</h6>
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
                      <Input placeholder="John" />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="l_name"
                      label={"Last Name *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Doe" />
                    </Form.Item>
                  </div>
                  <div className="col-12 small-heading-main">
                    <h6>Contact Information</h6>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="email"
                      label={"Email"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="email@email.com" />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="Phone"
                      label={"Phone"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <InputNumber placeholder="000–000–0000" />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="mobile"
                      label={"Mobile"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <InputNumber placeholder="000–000–0000" />
                    </Form.Item>
                  </div>
                  <div className="col-12 small-heading-main">
                    <h6>Related Account / Lead</h6>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="r_a_o"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">
                            Related Account / Opportunity
                          </span>
                          <img
                            src={Images.info_small}
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      }
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
                        labelInValue
                        value={value}
                        placeholder="Search Accounts"
                        notFoundContent={
                          fetching ? <Spin size="small" /> : null
                        }
                        filterOption={false}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                      >
                        {data.map((d) => (
                          <Option key={d.value}>{d.text}</Option>
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
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CreateContact;

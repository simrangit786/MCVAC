import React, { Component } from "react";
import { Breadcrumb, Button, Drawer, Form, Input, Select, Spin } from "antd";
import { Image as Images, Image } from "../../Images";
import { Link } from "react-router-dom";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const Option = Select;
class FleetDrawer extends Component {
  state = {
    data: [],
    value: [],
    fetching: false,
  };
  fetchUser = (value) => {
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
    const { fetching, data, value, visible, item } = this.state;
    return (
      <Drawer
        className="main-drawer-div main-all-form-modal inline-item-drawer"
        title={
          <div className="d-flex align-items-center">
            <img alt="" className="img-fluid" src={Image.disposal_green_icon} />
            <span className="ml-3">Old Fridge Door Handle</span>
          </div>
        }
        centered
        width={700}
        closable={false}
        onClose={this.props.onClose}
        placement={"right"}
        visible={visible}
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button onClick={this.props.onClose} type="primary">
              Done
            </Button>
          </div>
        }
      >
        <div className="breadcrumb-inner-details inline-item-breadcrumb">
          <Breadcrumb
            separator={
              <img
                src={Image.arrow_small_breadcrumb}
                alt={""}
                className="img-fluid"
              />
            }
          >
            {item.breadcrumb.map((name) => {
              return (
                <Breadcrumb.Item key={name}>
                  <Link>Old Fridge Door Parts</Link>
                </Breadcrumb.Item>
              );
            })}
            <Breadcrumb.Item key={item.name}>
              <Link>Old Fridge Door Handle</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="row mx-0 inner-modal-main-row">
          <div className="col-12">
            <Form {...layout} className="main-inner-form">
              <div className="row">
                <div className="col-12">
                  <Form.Item
                    name="inventory_name"
                    label={<span>Inventory Item Name *</span>}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input placeholder={"Old Fridge Door Handle"} />
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="inventory_family"
                    label={<span>Inventory Family / Tier *</span>}
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
                      placeholder="Inventory Family / Tier"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={this.fetchUser}
                      onChange={this.handleChange}
                    >
                      {data.map((d) => (
                        <Option key={d.value}>{d.text}</Option>
                      ))}
                    </Select>
                    <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                      <img
                        src={Images.search_small_icon}
                        alt=""
                        className="img-fluid"
                      />
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default FleetDrawer;

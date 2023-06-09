import React, { Component } from "react";
import { Button, Drawer, Form, Select, Spin } from "antd";
import { Image as Images } from "../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const Option = Select;

class AddAccount extends Component {
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
    const { fetching, data, value } = this.state;
    return (
      <React.Fragment>
        <Drawer
          centered
          title={
            <div className="d-flex align-items-center justify-content-between">
              <div className="create-note-div d-flex align-items-center">
                <div className="create-note-heading-drawer bg-transparent p-0">
                  Add Account
                </div>
              </div>
            </div>
          }
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-drawer-div"
          width={"450px"}
          placement={"right"}
          closeIcon={false}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.props.onClose} type="primary">
                Add Account
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form {...layout} className="main-inner-form">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="contact"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Company</span>
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
                      <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                        <img
                          src={Images.search_small_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </Button>
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="contact"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Contacts</span>
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
                        placeholder="Search Contacts"
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
                      <Button className="search-icon bg-transparent border-0 p-0 position-absolute">
                        <img
                          src={Images.search_small_icon}
                          alt=""
                          className="img-fluid"
                        />
                      </Button>
                    </Form.Item>
                  </div>
                  <div className="col-12 contact-details-col">
                    <div className="row mx-0 align-items-center contact-name-info-row position-relative">
                      <div className="col-12 p-0">
                        <div className="contact-info-icon float-left">
                          <img
                            src={Images.contacts_icon_black}
                            alt="contact icon"
                            className="img-fluid"
                          />
                        </div>
                        <div className="contact-info-details float-left">
                          <h5>Contact Name</h5>
                          <h6 className="mb-0">
                            jsmith@email.com / (415) 891–3456
                          </h6>
                        </div>
                      </div>
                      <Button className="close-btn-contact h-auto bg-transparent border-0 position-absolute">
                        <img
                          src={Images.close_icon_gray}
                          alt="contact icon"
                          className="img-fluid"
                        />
                      </Button>
                    </div>
                  </div>
                  <div className="col-12 contact-details-col">
                    <div className="row mx-0 align-items-center contact-name-info-row position-relative">
                      <div className="col-12 p-0">
                        <div className="contact-info-icon float-left">
                          <img
                            src={Images.contacts_icon_black}
                            alt="contact icon"
                            className="img-fluid"
                          />
                        </div>
                        <div className="contact-info-details float-left">
                          <h5>Contact Name</h5>
                          <h6 className="mb-0">
                            jsmith@email.com / (415) 891–3456
                          </h6>
                        </div>
                      </div>
                      <Button className="close-btn-contact h-auto bg-transparent border-0 position-absolute">
                        <img
                          src={Images.close_icon_gray}
                          alt="contact icon"
                          className="img-fluid"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default AddAccount;

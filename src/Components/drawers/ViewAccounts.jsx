import React, { Component } from "react";
import { Button, Drawer, Form, Select, Spin } from "antd";
import { Image as Images } from "../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const Option = Select;

class ViewAccounts extends Component {
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
                  Accounts
                </div>
              </div>
              <Button className="delete-btn-drawer p-0 border-0 bg-transparent">
                <img
                  src={Images.delete_icon_drawer}
                  alt=""
                  className="img-fluid"
                />
              </Button>
            </div>
          }
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-drawer-div"
          width={"450px"}
          onClose={this.props.onClose}
          placement={"right"}
          closeIcon={
            <img
              src={Images.right_arrow_icon_drawer}
              alt=""
              className="img-fluid"
            />
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form {...layout} className="main-inner-form">
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="r_a_o"
                      label={false}
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
            <div className="col-12">
              <div className="row account-contact-card view-contact-row mx-0 w-100 position-relative">
                <div className="col-12 p-0">
                  <div className="info-icon-card-flag float-left">
                    <img
                      src={Images.dollor_file_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="info-icon-card-details float-left">
                    <h5 className="d-flex align-items-center mb-0">
                      Hudson Cleanup
                      <span className="text-uppercase text-primary">
                        Manager
                      </span>
                    </h5>
                    <p className="font-weight-normal">
                      123 State Street, New York, NY
                    </p>
                  </div>
                </div>
              </div>

              <div className="row account-contact-card view-contact-row mx-0 w-100 position-relative">
                <div className="col-12 p-0">
                  <div className="info-icon-card-flag float-left">
                    <img
                      src={Images.dollor_file_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="info-icon-card-details float-left">
                    <h5 className="d-flex align-items-center mb-0">
                      Hudson Cleanup
                      <span className="text-uppercase text-primary">
                        Manager
                      </span>
                    </h5>
                    <p className="font-weight-normal">
                      123 State Street, New York, NY
                    </p>
                  </div>
                </div>
              </div>

              <div className="row account-contact-card view-contact-row mx-0 w-100 position-relative">
                <div className="col-12 p-0">
                  <div className="info-icon-card-flag float-left">
                    <img
                      src={Images.dollor_file_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="info-icon-card-details float-left">
                    <h5 className="d-flex align-items-center mb-0">
                      Hudson Cleanup
                      <span className="text-uppercase text-primary">
                        Manager
                      </span>
                    </h5>
                    <p className="font-weight-normal">
                      123 State Street, New York, NY
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default ViewAccounts;

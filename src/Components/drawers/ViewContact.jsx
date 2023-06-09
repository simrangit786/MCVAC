import React, { Component } from "react";
import { Button, Drawer, Form, Select, Spin } from "antd";
import { Image as Images } from "../Images";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const Option = Select;

class ViewContact extends Component {
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
                  Contacts
                </div>
                <Button className="add-contact-btn">Add Contact</Button>
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
          placement={"right"}
          onClose={this.props.onClose}
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
            <div className="col-12">
              <div className="row account-contact-card view-contact-row mx-0 w-100 position-relative">
                <div className="col-12 p-0">
                  <div className="info-icon-card-flag float-left">
                    <img
                      src={Images.contact_union_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="info-icon-card-details float-left">
                    <h5 className="d-flex align-items-center mb-0">
                      Chris Borelli
                      <span className="text-uppercase text-secondary">
                        Manager
                      </span>
                    </h5>
                    <p className="font-weight-normal">Cborelli@email.com</p>
                    <p className="font-weight-normal mt-0">(415) 891-2345</p>
                  </div>
                </div>
                <Button className="contact-btn-small border-0 p-0 text-uppercase position-absolute">
                  Accounts{" "}
                </Button>
              </div>
              <div className="row account-contact-card view-contact-row mx-0 w-100 position-relative">
                <div className="col-12 p-0">
                  <div className="info-icon-card-flag float-left">
                    <img
                      src={Images.contact_union_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="info-icon-card-details float-left">
                    <h5 className="d-flex align-items-center mb-0">
                      Chris Borelli
                      <span className="text-uppercase text-secondary">
                        Manager
                      </span>
                    </h5>
                    <p className="font-weight-normal">Cborelli@email.com</p>
                    <p className="font-weight-normal mt-0">(415) 891-2345</p>
                  </div>
                </div>
                <Button className="contact-btn-small border-0 p-0 text-uppercase position-absolute">
                  Accounts{" "}
                </Button>
              </div>
              <div className="row account-contact-card view-contact-row mx-0 w-100 position-relative">
                <div className="col-12 p-0">
                  <div className="info-icon-card-flag float-left">
                    <img
                      src={Images.contact_union_icon}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="info-icon-card-details float-left">
                    <h5 className="d-flex align-items-center mb-0">
                      Chris Borelli
                      <span className="text-uppercase text-secondary">
                        Manager
                      </span>
                    </h5>
                    <p className="font-weight-normal">Cborelli@email.com</p>
                    <p className="font-weight-normal mt-0">(415) 891-2345</p>
                  </div>
                </div>
                <Button className="contact-btn-small border-0 p-0 text-uppercase position-absolute">
                  Accounts{" "}
                </Button>
              </div>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default ViewContact;

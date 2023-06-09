import React, { Component } from "react";
import { Button, Dropdown, Form, Input, Menu, Table } from "antd";
import { Image as Images } from "../../Images";
import { Link } from "react-router-dom";

class ContactsInfo extends Component {
  menu = (
    <Menu>
      <Menu.Item key="0">
        <Link className="d-flex align-items-center font-weight-bold" to={" "}>
          <img
            alt=""
            className="img-fluid mr-1"
            src={Images.close_icon_white}
          />{" "}
          Remove
        </Link>
      </Menu.Item>
    </Menu>
  );
  columns = [
    {
      title: "Contact Name",
      dataIndex: "contact_name",
      sorter: true,
    },
    {
      title: "Phone number",
      dataIndex: "phone_number",
    },
    {
      title: (
        <div className="position-relative">
          EMAIL
          <Button className="border-0 bg-transparent p-0 add-plus-icon email-plus-btn position-absolute">
            <img
              src={Images.add_plus_icon_green}
              className="img-fluid"
              alt="plus icon"
            />
          </Button>
        </div>
      ),
      dataIndex: "email",
    },
  ];
  data = [
    {
      key: "1",
      contact_name: <div>John Smith</div>,
      phone_number: <div>(999) 000–0000</div>,
      email: (
        <div className="d-flex align-items-center justify-content-between">
          <span>email@email.com</span>
          <Dropdown
            overlayClassName="create-dropdown-main remove-dropdown"
            overlay={this.menu}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <Button
              onClick={(e) => e.preventDefault()}
              className="border-0 p-0 ant-dropdown-link h-auto bg-transparent elipsis-remove-icon"
            >
              <img
                src={Images.more_table_elipsis_icon}
                alt="icon"
                className="img-fluid"
              />
            </Button>
          </Dropdown>
        </div>
      ),
    },
    {
      key: "2",
      contact_name: <div>John Smith</div>,
      phone_number: <div>(999) 000–0000</div>,
      email: (
        <div className="d-flex align-items-center justify-content-between">
          <span>email@email.com</span>
          <Dropdown
            overlayClassName="create-dropdown-main remove-dropdown"
            overlay={this.menu}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <Button
              onClick={(e) => e.preventDefault()}
              className="border-0 p-0 ant-dropdown-link h-auto bg-transparent elipsis-remove-icon"
            >
              <img
                src={Images.more_table_elipsis_icon}
                alt="icon"
                className="img-fluid"
              />
            </Button>
          </Dropdown>
        </div>
      ),
    },
    {
      key: "3",
      contact_name: <div>John Smith</div>,
      phone_number: <div>(999) 000–0000</div>,
      email: (
        <div className="d-flex align-items-center justify-content-between">
          <span>email@email.com</span>
          <Dropdown
            overlayClassName="create-dropdown-main remove-dropdown"
            overlay={this.menu}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <Button
              onClick={(e) => e.preventDefault()}
              className="border-0 p-0 ant-dropdown-link h-auto bg-transparent elipsis-remove-icon"
            >
              <img
                src={Images.more_table_elipsis_icon}
                alt="icon"
                className="img-fluid"
              />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row carpet-cleaning-mini-header">
              <div className="d-flex align-items-center">
                <div className="count-div-mini">3 Contacts</div>
                <div className="search-bar-div">
                  <Form className="position-relative">
                    <Input placeholder="Search Accounts" />
                    <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                      <img
                        src={Images.search_icon_gray}
                        className="img-fluid"
                        alt="search icon"
                      />
                    </Button>
                  </Form>
                </div>
                <div className="filters-div">
                  <Button className="filter-btn text-capitalize">
                    <img
                      alt=""
                      className="img-fluid"
                      src={Images.filter_icon}
                    />
                    Filter
                  </Button>
                </div>
                <div className="new-opportunity-btn-div">
                  <Button className="new-opportunity-btn text-capitalize">
                    Add Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 table-responsive main-table-div">
            <Table
              pagination={false}
              className="main-table-all carpet-cleaning-table"
              columns={this.columns}
              dataSource={this.data}
              size="middle"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ContactsInfo;

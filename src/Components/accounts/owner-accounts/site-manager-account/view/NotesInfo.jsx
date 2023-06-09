import React, { Component } from "react";
import { Button, Dropdown, Form, Input, Menu, Table } from "antd";
import { Image as Images } from "../../Images";
import CreateNote from "../../drawers/CreateNote";

class NotesInfo extends Component {
  state = {
    visibleCreateNoteRow: false,
  };
  showCreateNoteRow = (visible) => {
    this.setState({
      visibleCreateNoteRow: visible,
    });
  };
  menu = (
    <Menu>
      <Menu.Item key="0">
        <a className="d-flex align-items-center font-weight-bold" href="#">
          <img
            alt=""
            className="img-fluid mr-1"
            src={Images.close_icon_white}
          />{" "}
          Remove
        </a>
      </Menu.Item>
    </Menu>
  );
  columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "NOte",
      dataIndex: "note",
    },
    {
      title: "Created By",
      dataIndex: "created_by",
    },
    {
      title: <div className="position-relative">Last Modifiled</div>,
      dataIndex: "last_modify",
      sorter: true,
    },
  ];
  data = [
    {
      key: "1",
      title: <div className="name-id-details">Spoke to Owner</div>,
      note: (
        <div className="d-flex align-items-center">
          <div className="notes-div-main">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </div>
          <a href="#">Read More</a>
        </div>
      ),
      created_by: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      last_modify: (
        <div className="d-flex align-items-center justify-content-between">
          <span>Dec 01, 2019 11:21 AM</span>
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
      title: <div className="name-id-details">Spoke to Owner</div>,
      note: (
        <div className="d-flex align-items-center">
          <div className="notes-div-main">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </div>
          <a href="#">Read More</a>
        </div>
      ),
      created_by: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      last_modify: (
        <div className="d-flex align-items-center justify-content-between">
          <span>Dec 01, 2019 11:21 AM</span>
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
      title: <div className="name-id-details">Spoke to Owner</div>,
      note: (
        <div className="d-flex align-items-center">
          <div className="notes-div-main">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </div>
          <a href="#">Read More</a>
        </div>
      ),
      created_by: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      last_modify: (
        <div className="d-flex align-items-center justify-content-between">
          <span>Dec 01, 2019 11:21 AM</span>
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
      key: "4",
      title: <div className="name-id-details">Spoke to Owner</div>,
      note: (
        <div className="d-flex align-items-center">
          <div className="notes-div-main">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </div>
          <a href="#">Read More</a>
        </div>
      ),
      created_by: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      last_modify: (
        <div className="d-flex align-items-center justify-content-between">
          <span>Dec 01, 2019 11:21 AM</span>
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
      key: "5",
      title: <div className="name-id-details">Spoke to Owner</div>,
      note: (
        <div className="d-flex align-items-center">
          <div className="notes-div-main">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </div>
          <a href="#">Read More</a>
        </div>
      ),
      created_by: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      last_modify: (
        <div className="d-flex align-items-center justify-content-between">
          <span>Dec 01, 2019 11:21 AM</span>
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
      key: "6",
      title: <div className="name-id-details">Spoke to Owner</div>,
      note: (
        <div className="d-flex align-items-center">
          <div className="notes-div-main">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          </div>
          <a href="#">Read More</a>
        </div>
      ),
      created_by: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      last_modify: (
        <div className="d-flex align-items-center justify-content-between">
          <span>Dec 01, 2019 11:21 AM</span>
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
                <h6 className="mb-0">Notes</h6>
                <div className="count-div-mini">9 Notes</div>
                <div className="search-bar-div">
                  <Form className="position-relative">
                    <Input placeholder="Search Notes" />
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
                  <Dropdown
                    overlayClassName="create-dropdown-main"
                    overlay={this.menu}
                    trigger={["click"]}
                  >
                    <Button
                      onClick={(e) => e.preventDefault()}
                      className="ant-dropdown-link new-opportunity-btn text-capitalize"
                    >
                      New Note
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 table-responsive main-table-div">
            <Table
              pagination={false}
              className="main-table-all carpet-cleaning-table notes-info-table"
              columns={this.columns}
              dataSource={this.data}
              size="middle"
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    this.showCreateNoteRow(true);
                  },
                };
              }}
            />
          </div>
        </div>
        {/*no-data-screens*/}
        {/*<div className="h-100 w-100 align-items-center justify-content-center row mx-0">*/}
        {/*    <div className="col-12">*/}
        {/*        <div className="row no-data-upload-screens">*/}
        {/*            <div className="col-12 text-center">*/}
        {/*                <img src={Images.add_new_notes_icon} alt="cloud upload" className="img-fluid"/>*/}
        {/*                <h6 className="mb-0 mt-1">Add new note here</h6>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</div>*/}
        <CreateNote
          visible={this.state.visibleCreateNoteRow}
          onClose={() => this.showCreateNoteRow(false)}
        />
      </React.Fragment>
    );
  }
}

export default NotesInfo;

// https://www.figma.com/file/s5SZ8CYS4pCmFhGGhfgsge/Opportunities?node-id=1%3A4236

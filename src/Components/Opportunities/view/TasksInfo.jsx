import React, { Component } from "react";
import { Button, Checkbox, Dropdown, Form, Input, Menu, Table } from "antd";
import { Image as Images } from "../../Images";
import ViewTask from "../../drawers/ViewTask";
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
class TasksInfo extends Component {
  state = {
    visibleViewTasks: false,
  };
  showViewTasks = (visible) => {
    this.setState({
      visibleViewTasks: visible,
    });
  };
  columns = [
    {
      title: "Task",
      dataIndex: "task",
      sorter: true,
    },
    {
      title: "Linked to",
      dataIndex: "linked_to",
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
    },
    {
      title: <div className="position-relative">DUe Date</div>,
      dataIndex: "due_date",
      sorter: true,
    },
  ];
  data = [
    {
      key: "1",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      linked_to: <div>Proposal 12345</div>,
      assignee: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      due_date: <span className="main-status-btn approved-btn">Due Today</span>,
    },
    {
      key: "2",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      linked_to: <div>Proposal 12345</div>,
      assignee: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      due_date: <span className="main-status-btn text-red">Apr 12, 2020</span>,
    },
    {
      key: "3",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      linked_to: <div>Proposal 12345</div>,
      assignee: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      due_date: <span className="main-status-btn">Apr 12, 2020</span>,
    },
    {
      key: "4",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      linked_to: <div>Proposal 12345</div>,
      assignee: (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
      due_date: <span className="main-status-btn">Apr 12, 2020</span>,
    },
  ];

  menu = (
    <Menu>
      <Menu.Item key="0">
        <a className="d-flex align-items-center font-weight-bold" href="#">
          {" "}
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a className="d-flex align-items-center font-weight-bold" href="#">
          {" "}
        </a>
      </Menu.Item>
    </Menu>
  );

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row carpet-cleaning-mini-header">
              <div className="d-flex align-items-center">
                <h6 className="mb-0">Task</h6>
                <div className="count-div-mini">8 Tasks</div>
                <div className="search-bar-div">
                  <Form className="position-relative">
                    <Input placeholder="Search Tasks" />
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
                      New Task
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 table-responsive main-table-div">
            <Table
              className="main-table-all carpet-cleaning-table"
              pagination={false}
              columns={this.columns}
              dataSource={this.data}
              size="middle"
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    this.showViewTasks(true);
                  },
                };
              }}
            />
          </div>
        </div>
        {/*no-data-screens*/}
        {/*    <div className="h-100 w-100 align-items-center justify-content-center row mx-0">*/}
        {/*        <div className="col-12">*/}
        {/*            <div className="row no-data-upload-screens">*/}
        {/*                <div className="col-12 text-center">*/}
        {/*                    <img src={Images.tasks_add} alt="cloud upload" className="img-fluid"/>*/}
        {/*                    <h6 className="mb-0 mt-1">Add a task here</h6>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}

        <ViewTask
          visible={this.state.visibleViewTasks}
          onClose={() => this.showViewTasks(false)}
        />
      </React.Fragment>
    );
  }
}

export default TasksInfo;

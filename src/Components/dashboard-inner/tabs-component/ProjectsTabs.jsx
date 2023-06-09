import React, { Component } from "react";
import { Button, Table } from "antd";
import { Image as Images } from "../../Images";

class ProjectsTabs extends Component {
  columns = [
    {
      title: "PROJECT NAME",
      dataIndex: "project_name",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: <div className="position-relative">Last Activity Date</div>,
      dataIndex: "last_activity_date",
      sorter: true,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      sorter: true,
    },
    {
      title: "Profit",
      dataIndex: "profit",
      sorter: true,
    },
  ];
  data = [
    {
      key: "1",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn progress-btn border-0 bg-transparent">
          Onboarding
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
    {
      key: "2",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn progress-btn border-0 bg-transparent">
          Onboarding
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
    {
      key: "3",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn progress-btn border-0 bg-transparent">
          Onboarding
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
    {
      key: "4",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Completed
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
    {
      key: "5",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Completed
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
    {
      key: "6",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Completed
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
    {
      key: "7",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Completed
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
    {
      key: "8",
      project_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Completed
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
      revenue: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$12,035.35</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
      profit: (
        <div className="add-team-div d-flex align-items-center">
          <span className="mr-1">$1,203.45</span>
          <img
            src={Images.arrow_green_small_upload}
            alt=""
            className="img-fluid"
          />
        </div>
      ),
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 table-responsive main-table-div">
            <Table
              className="main-table-all project-table"
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

export default ProjectsTabs;

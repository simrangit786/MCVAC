import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../Images";

class ViewProposalAcitivity extends Component {
  state = {
    activity: [],
  };
  activityColumns = [
    {
      title: "date",
      dataIndex: "activity_date",
      render: () => <div>Dec 01, 2019 11:21 AM</div>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => <div>Created Work Order : 123-4567-890</div>,
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employee",
      render: () => (
        <div className="d-flex align-items-center">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            MM
          </span>
          Mike Malone
        </div>
      ),
    },
  ];
  render() {
    const { activity } = this.state;
    const { viewAll } = this.props;
    return (
      <div className={`col-12 ${!viewAll ? "mt-30" : ""}`}>
        <div
          className={`row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
            !viewAll ? "border-1" : ""
          }`}
        >
          <div className="search-bar-div d-flex align-items-center">
            <Form className="position-relative">
              <Input placeholder="Search" />
              <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                <img
                  src={Images.search_icon_gray}
                  className="img-fluid"
                  alt="search icon"
                />
              </Button>
            </Form>
          </div>
          {viewAll && (
            <Button
              onClick={() => this.props.onTabChange("7")}
              className="view-all-btn text-uppercase"
            >
              VIEW ALL{" "}
            </Button>
          )}
        </div>
        {activity.length > 0 ? (
          <div className="col-12 p-0 mt-3 mx-0">
            <div className="col-12 table-responsive main-table-div">
              <Table
                className="main-table-all carpet-cleaning-table border-0"
                columns={this.activityColumns}
                pagination={false}
                dataSource={activity}
                size="middle"
              />
            </div>
          </div>
        ) : (
          <div className="row mx-0 mt-3 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
            <div className="col-12 text-center cursor-pointer">
              <img
                src={Images.time_activity_add}
                className="img-fluid"
                alt="search icon"
              />
              <h6 className="mb-0 text-gray-tag">No Activity</h6>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ViewProposalAcitivity;

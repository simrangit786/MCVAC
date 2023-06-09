import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../Images";

class WorkOrdersInfo extends Component {
  workOrdersColumns = [
    {
      title: "Work order id",
      dataIndex: "work_order_id",
      sorter: true,
    },
    {
      title: "project",
      dataIndex: "project",
      sorter: true,
    },
    {
      title: "Site",
      dataIndex: "site",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "Truck(S)",
      dataIndex: "truck",
      sorter: true,
    },
    {
      title: <div className="position-relative">Service date</div>,
      dataIndex: "service_date",
      sorter: true,
    },
  ];
  workOrdersData = [
    {
      key: "1",
      work_order_id: (
        <div className="d-flex align-items-center">Project Name</div>
      ),
      project: <div className="font-weight-normal">15 KB</div>,
      site: <div className="font-weight-normal">.docx</div>,
      status: <div className="font-weight-normal">.docx</div>,
      truck: <div className="font-weight-normal">.docx</div>,
      service_date: <div className="font-weight-normal">.docx</div>,
    },
    {
      key: "2",
      work_order_id: (
        <div className="d-flex align-items-center">Project Name</div>
      ),
      project: <div className="font-weight-normal">15 KB</div>,
      site: <div className="font-weight-normal">.docx</div>,
      status: <div className="font-weight-normal">.docx</div>,
      truck: <div className="font-weight-normal">.docx</div>,
      service_date: <div className="font-weight-normal">.docx</div>,
    },
    {
      key: "3",
      work_order_id: (
        <div className="d-flex align-items-center">Project Name</div>
      ),
      project: <div className="font-weight-normal">15 KB</div>,
      site: <div className="font-weight-normal">.docx</div>,
      status: <div className="font-weight-normal">.docx</div>,
      truck: <div className="font-weight-normal">.docx</div>,
      service_date: <div className="font-weight-normal">.docx</div>,
    },
    {
      key: "4",
      work_order_id: (
        <div className="d-flex align-items-center">Project Name</div>
      ),
      project: <div className="font-weight-normal">15 KB</div>,
      site: <div className="font-weight-normal">.docx</div>,
      status: <div className="font-weight-normal">.docx</div>,
      truck: <div className="font-weight-normal">.docx</div>,
      service_date: <div className="font-weight-normal">.docx</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0 mt-30 no-data-card-row-new">
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
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
              {/* <div className="new-opportunity-btn-div">
                <Button className="new-opportunity-btn text-capitalize">
                  CREATE
                </Button>
              </div> */}
            </div>
          </div>
          {/*<div className="col-12 table-responsive main-table-div">*/}
          {/*    <Table pagination={false} className="main-table-all border-0 carpet-cleaning-table"*/}
          {/*           columns={this.workOrdersColumns}*/}
          {/*           dataSource={this.workOrdersData} size="middle"/>*/}
          {/*</div>*/}
          {/*no-data-screens*/}
          <div className="col-12">
            <div className="row no-data-upload-screens">
              <div className="col-12 text-center">
                <img
                  src={Images.work_setting}
                  alt="cloud upload"
                  className="img-fluid"
                />
                <h6 className="text-gray-tag">No Work Order</h6>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default WorkOrdersInfo;

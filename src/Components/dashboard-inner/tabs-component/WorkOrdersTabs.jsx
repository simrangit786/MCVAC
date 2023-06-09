import React, { Component } from "react";
import { Button, Table } from "antd";
import { Image as Images } from "../../Images";

class WorkOrdersTabs extends Component {
  columns = [
    {
      title: "Work order id",
      dataIndex: "order_id",
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
      title: "Payment Status",
      dataIndex: "payment_status",
      sorter: true,
    },
    {
      title: "Truck(S)",
      dataIndex: "truck",
      sorter: true,
    },
    {
      title: "Service date",
      dataIndex: "service_date",
      sorter: true,
    },
  ];
  data = [
    {
      key: "1",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">WO67555</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">Central Park</div>
      ),
      status: (
        <Button className="main-status-btn border-0 text-center gray-bg-btn">
          Ready
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Needs Invoice
        </Button>
      ),
      truck: <div>VAC 1234</div>,
      service_date: <div>Dec 2, 2019</div>,
    },
    {
      key: "2",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Service Request</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">
          BMW of Huntington
        </div>
      ),
      status: (
        <Button className="main-status-btn border-0 progress-btn text-center orange-bg-btn">
          Service Request
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Needs Invoice
        </Button>
      ),
      truck: (
        <Button className="bg-transparent border-0 p-0">
          <img src={Images.truck_icon_plus} alt="" className="img-fluid" />
        </Button>
      ),
      service_date: <div>Dec 2, 2019</div>,
    },
    {
      key: "3",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">WO67555</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">
          North end of Central...
        </div>
      ),
      status: (
        <Button className="main-status-btn text-red border-0 text-center red-bg-btn">
          Missing Truck
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Needs Invoice
        </Button>
      ),
      truck: (
        <Button className="bg-transparent border-0 p-0">
          <img src={Images.truck_icon_plus} alt="" className="img-fluid" />
        </Button>
      ),
      service_date: <div>Dec 2, 2019</div>,
    },
    {
      key: "4",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_work_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">WO67555</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">
          WIlliamson Road P.S.
        </div>
      ),
      status: (
        <Button className="main-status-btn text-primary border-0 text-center primary-bg-btn">
          Ongoing
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Needs Invoice
        </Button>
      ),
      truck: <div>S-125-Jet</div>,
      service_date: <div>Apr 24, 2020</div>,
    },
    {
      key: "5",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">WO67555</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">
          Highway 101 Mckenzi..
        </div>
      ),
      status: (
        <Button className="main-status-btn pur-po-al-btn text-center border-0">
          Waiting for Validation
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Invoiced
        </Button>
      ),
      truck: <div>3 Trucks</div>,
      service_date: <div>Dec 2, 2019</div>,
    },
    {
      key: "6",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_work_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Service Request</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">Jim’s Backyard</div>
      ),
      status: (
        <Button className="main-status-btn orange-bg-btn progress-btn border-0 text-center">
          Service Request
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Needs Invoice
        </Button>
      ),
      truck: (
        <Button className="bg-transparent border-0 p-0">
          <img src={Images.truck_icon_plus} alt="" className="img-fluid" />
        </Button>
      ),
      service_date: <div>Apr 24, 2020</div>,
    },
    {
      key: "7",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Service Request</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">Central Park</div>
      ),
      status: (
        <Button className="main-status-btn approved-btn approved-bg-btn text-center border-0">
          Ready to bill
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Needs Invoice
        </Button>
      ),
      truck: (
        <Button className="bg-transparent border-0 p-0">
          <img src={Images.truck_icon_plus} alt="" className="img-fluid" />
        </Button>
      ),
      service_date: <div>Dec 2, 2019</div>,
    },
    {
      key: "8",
      order_id: (
        <div className="d-flex align-items-center">
          <div className="name-id-details">Service Request</div>
        </div>
      ),
      project: <div>Hudson Cleanup</div>,
      site: (
        <div className="project_name d-inline-block w-100">
          Brooklyn Botanical Gar...
        </div>
      ),
      status: (
        <Button className="main-status-btn border-0 gray-bg-btn text-center">
          Billed / Closed
        </Button>
      ),
      payment_status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Needs Invoice
        </Button>
      ),
      truck: (
        <Button className="bg-transparent border-0 p-0">
          <img src={Images.truck_icon_plus} alt="" className="img-fluid" />
        </Button>
      ),
      service_date: <div>Apr 24, 2020</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 table-responsive main-table-div">
            <Table
              className="main-table-all work-order-table"
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

export default WorkOrdersTabs;

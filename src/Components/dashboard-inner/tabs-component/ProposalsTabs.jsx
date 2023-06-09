import React, { Component } from "react";
import { Button, Table } from "antd";
import { Image as Images } from "../../Images";

class ProposalsTabs extends Component {
  columns = [
    {
      title: "Proposal name",
      dataIndex: "proposal_name",
      sorter: true,
    },
    {
      title: "Bill to",
      dataIndex: "bill_to",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: <div>Last Activity Date</div>,
      dataIndex: "last_activity_date",
      sorter: true,
    },
  ];
  data = [
    {
      key: "1",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Hudson Cleanup</div>
        </div>
      ),
      bill_to: (
        <div className="font-weight-bold project_name">Oil Service LTD</div>
      ),
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Inactive
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "2",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">North Shore Spill Mar. 2020</div>
        </div>
      ),
      bill_to: (
        <div className="font-weight-bold project_name">
          Long Island Railroad - North Shore
        </div>
      ),
      status: (
        <Button className="main-status-btn approved-btn border-0 bg-transparent">
          Approved
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "3",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Helix Covid-19 Disinfection</div>
        </div>
      ),
      bill_to: <div className="font-weight-bold project_name">Helix Corp.</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Inactive
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "4",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Rykers Waste Removal</div>
        </div>
      ),
      bill_to: (
        <div className="font-weight-bold project_name">Oil Service LTD</div>
      ),
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Inactive
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "5",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">
            Rockefeller Covid-19 Disinfectio...
          </div>
        </div>
      ),
      bill_to: (
        <div className="font-weight-bold project_name">General Electric</div>
      ),
      status: (
        <Button className="main-status-btn approved-btn border-0 bg-transparent">
          Approved
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "6",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">
            Dylan’s Candy Bar Covid-19 Dis...
          </div>
        </div>
      ),
      bill_to: (
        <div className="font-weight-bold project_name">Dylan’s Candy Bar</div>
      ),
      status: (
        <Button className="main-status-btn approved-btn border-0 bg-transparent">
          Approved
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "7",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Hudson Cleanup Jan 2020</div>
        </div>
      ),
      bill_to: <div className="font-weight-bold project_name" />,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Template
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
    {
      key: "8",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Central Park Waste Disposal</div>
        </div>
      ),
      bill_to: <div className="font-weight-bold project_name">NYC Parks</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Inactive
        </Button>
      ),
      last_activity_date: <div className="date-div-td">Dec 2, 2019</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 table-responsive main-table-div">
            <Table
              className="main-table-all proposals-table-main"
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

export default ProposalsTabs;

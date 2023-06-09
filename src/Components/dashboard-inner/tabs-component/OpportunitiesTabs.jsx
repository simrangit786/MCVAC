import React, { Component } from "react";
import { Button, Table } from "antd";

class OpportunitiesTabs extends Component {
  columns = [
    {
      title: "Company Name",
      dataIndex: "company_name",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "contact",
      dataIndex: "contact",
      sorter: true,
    },
    {
      title: "salesperson",
      dataIndex: "sales_person",
      sorter: true,
    },
    {
      title: <div className="position-relative">Last Activity Date</div>,
      dataIndex: "last_activity_date",
      sorter: true,
    },
  ];
  data = [
    {
      key: "1",
      company_name: <div className="name-id-details">Albertson’s </div>,
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line" />
            <span className="status-line " />
            <span className="status-line" />
            <span className="status-line" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Prospect
          </Button>
        </div>
      ),
      contact: <div>O.G. Anunobe</div>,
      sales_person: <div>David Lee</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "2",
      company_name: <div className="name-id-details">Waste Management</div>,
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Contacted
          </Button>
        </div>
      ),
      contact: <div>Brian Anderson</div>,
      sales_person: <div>Alphonso Mourardy</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "3",
      company_name: (
        <div className="name-id-details">Clyde’s Carpet Cleaners</div>
      ),
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line" />
            <span className="status-line" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Nurturing
          </Button>
        </div>
      ),
      contact: <div>Augustus McIntyre</div>,
      sales_person: <div>Mackenzie Devins</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "4",
      company_name: <div className="name-id-details">1-800 Got Junk</div>,
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Prospect
          </Button>
        </div>
      ),
      contact: <div>Tyson Chandler</div>,
      sales_person: <div>Mackenzie Devins</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "5",
      company_name: <div className="name-id-details">College Pro Painters</div>,
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Negotiating
          </Button>
        </div>
      ),
      contact: <div>Sofia Chambers</div>,
      sales_person: <div>James Hardaway</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "6",
      company_name: (
        <div className="name-id-details">Pat’s Window Cleaners </div>
      ),
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
            <span className="status-line" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Prospect
          </Button>
        </div>
      ),
      contact: <div>Diane Lee</div>,
      sales_person: <div>Alexandra Banks</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "7",
      company_name: <div className="name-id-details">Spirro’s Mechanics </div>,
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line line-closed active" />
            <span className="status-line line-closed active" />
            <span className="status-line line-closed active" />
            <span className="status-line line-closed active" />
            <span className="status-line line-closed active" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Closed / Dead
          </Button>
        </div>
      ),
      contact: <div>Crystal Parks</div>,
      sales_person: <div>Whitney Fullerton</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "8",
      company_name: (
        <div className="name-id-details">Dylan’s Rent-a-Truck </div>
      ),
      status: (
        <div className="status-progress-btn d-flex align-items-center">
          <div className="status-bar-main">
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line active" />
            <span className="status-line active" />
          </div>
          <Button className="main-status-btn font-weight-normal border-0 bg-transparent">
            Converted
          </Button>
        </div>
      ),
      contact: <div>O.G. Anunobe</div>,
      sales_person: <div>Cameron Stills</div>,
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 table-responsive main-table-div">
            <Table
              className="main-table-all opportunities-table"
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

export default OpportunitiesTabs;

import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../../Images";

class OpportunitiesInfo extends Component {
  opportunitiesColumns = [
    {
      title: "OPPORTUNITY NAME",
      dataIndex: "opportunity_name",
      sorter: true,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "OPPORTUNITY SOURCE",
      dataIndex: "opportunity_source",
      sorter: true,
    },
    {
      title: <div className="position-relative">LAST ACIVITY DATE</div>,
      dataIndex: "last_activity_date",
    },
  ];
  opportunitiesData = [
    {
      key: "1",
      opportunity_name: (
        <div className="d-flex align-items-center">Albertson’s</div>
      ),
      status: <div className="font-weight-normal">Prospect</div>,
      opportunity_source: (
        <div className="font-weight-normal">O.G. Anunobe</div>
      ),
      last_activity_date: (
        <div className="font-weight-normal">Dec 2, 2019, 1:23 PM</div>
      ),
    },
    {
      key: "2",
      opportunity_name: (
        <div className="d-flex align-items-center">Albertson’s</div>
      ),
      status: <div className="font-weight-normal">Prospect</div>,
      opportunity_source: (
        <div className="font-weight-normal">O.G. Anunobe</div>
      ),
      last_activity_date: (
        <div className="font-weight-normal">Dec 2, 2019, 1:23 PM</div>
      ),
    },
    {
      key: "3",
      opportunity_name: (
        <div className="d-flex align-items-center">Albertson’s</div>
      ),
      status: <div className="font-weight-normal">Prospect</div>,
      opportunity_source: (
        <div className="font-weight-normal">O.G. Anunobe</div>
      ),
      last_activity_date: (
        <div className="font-weight-normal">Dec 2, 2019, 1:23 PM</div>
      ),
    },
    {
      key: "4",
      opportunity_name: (
        <div className="d-flex align-items-center">Albertson’s</div>
      ),
      status: <div className="font-weight-normal">Prospect</div>,
      opportunity_source: (
        <div className="font-weight-normal">O.G. Anunobe</div>
      ),
      last_activity_date: (
        <div className="font-weight-normal">Dec 2, 2019, 1:23 PM</div>
      ),
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12 p-0">
            <div className="row mx-0 new-opportunity-header-row carpet-cleaning-mini-header">
              <div className="d-flex align-items-center">
                <h6 className="mb-0">Opportunities</h6>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search Opportunities" />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
            </div>
          </div>
          <div className="col-12 table-responsive main-table-div">
            <Table
              pagination={true}
              className="main-table-all border-0 carpet-cleaning-table"
              columns={this.opportunitiesColumns}
              dataSource={this.opportunitiesData}
              size="middle"
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default OpportunitiesInfo;

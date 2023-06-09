import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../Images";

class ProposalsInfo extends Component {
  columns = [
    {
      title: "Proposal name",
      dataIndex: "proposal_name",
    },
    {
      title: "Customer",
      dataIndex: "customer",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: <div className="position-relative">LAST ACTIVITY DATE</div>,
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
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "2",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "3",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            {/*<img src={Images.related_show_icon} alt="" className="img-fluid"/>*/}
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "4",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <div className="row mx-0">
          <div className="col-12 p-0">
            <div className="row mx-0 new-opportunity-header-row carpet-cleaning-mini-header">
              <div className="d-flex align-items-center">
                <h6 className="mb-0">Proposal</h6>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search Proposals" />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              <div className="new-opportunity-btn-div">
                <Button className="new-opportunity-btn text-capitalize">
                  ADD
                </Button>
              </div>
            </div>
          </div>
          {/*<div className="col-12 table-responsive main-table-div">*/}
          {/*    <Table*/}
          {/*        className="main-table-all carpet-cleaning-table border-0"*/}
          {/*        columns={this.columns}*/}
          {/*        dataSource={this.data}*/}
          {/*        size="middle"*/}
          {/*        pagination={false}*/}
          {/*        onRow={(record, rowIndex) => {*/}
          {/*            return {*/}
          {/*                onClick: event => {this.showViewProposal(true)},*/}
          {/*            };*/}
          {/*        }}*/}
          {/*    />*/}
          {/*</div>*/}
        </div>
        {/*no-data-screens*/}
        <div className="h-100 w-100 align-items-center justify-content-center row mx-0">
          <div className="col-12">
            <div className="row no-data-upload-screens">
              <div className="col-12 text-center">
                <img
                  src={Images.proposals_tab_icon}
                  alt="cloud upload"
                  className="img-fluid"
                />
                <h6 className="mb-0 mt-1">Coming Soon</h6>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ProposalsInfo;

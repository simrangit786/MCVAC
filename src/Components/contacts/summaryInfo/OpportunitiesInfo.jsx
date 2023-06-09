import React, { Component } from "react";
import { Button, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../Images";
import { getOpportunities } from "../../../Controller/api/opportunityServices";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { getContactOppotunity } from '../../../Controller/api/contactsServices';

class OpportunitiesInfo extends Component {
  state = {
    opportunities: [],
    pagination: {
      current: 1,
      pageSize: 15,
    },
    loading: false,
  };
  opportunitiesColumns = [
    {
      title: "OPPORTUNITY ID",
      // dataIndex: "id",
      sorter: true,
      render: (data) => <div>{data?.opportunity.id}</div>
      
    },
    {
      title: "Opportunity name",
      // dataIndex: "name",
      sorter: true,
      render: (data) => <div>{data?.opportunity.name}</div>
      ,
    },
    {
      title: "Status",
      // dataIndex: "status",
      sorter: true,
      render: (data) => <div>{data?.opportunity.status.title}</div>,
    },
    {
      title: "OPPORTUNITY SOURCE",
      // dataIndex: "source",
      sorter: true,
      render: (data) => <div>{data?.opportunity.source.name}</div>,
    },
    {
      title: "Last Activity Date",
      // dataIndex: "modified",
      sorter: true,
      render: (data) => <div>{moment(data?.opportunity.modified).format("MMM DD,YYYY hh:mm A")}</div>,
    },
  ];

  componentDidMount() {
    this.fetchOpportunity();
  }

  fetchOpportunity = (params = {}) => {
    // params.contact = this.props.match.params.id
    // console.log(params,"aa")
    // getContactOppotunity(params)
    // .then(res=>{
    //   console.log(res.data)
    //   this.setState({opportunities:res.data.results})
    // })
          const opportunity = this.props.contact?.contact_opportunity || []
    this.setState({opportunities:opportunity})
  };
  onSearch = (e) => {
    // this.fetchOpportunity({ search: e.target.value, page: 1 });
  };

  render() {
    let { pagination, opportunities, loading } = this.state;
    if (!this.props.pagination) {
      pagination = false;
    }
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          {/* {!this.props.hideSearch && */}
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input placeholder="Search" onChange={this.onSearch} />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              {this.props?.hideSearch && (
                <Button
                  onClick={() => this.props.tabChange("4")}
                  className="view-all-btn text-uppercase ml-auto"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
          {/* } */}
          {opportunities?.length > 0 ? (
            <div className="col-12 mt-2 table-responsive width-160-id main-table-div">
              <Table
                pagination={pagination}
                className="main-table-all border-0 carpet-cleaning-table"
                columns={this.opportunitiesColumns}
                rowKey={(record) => record.id}
                loading={loading}
                dataSource={opportunities}
                size="middle"
                // locale={{emptyText:
                //         (<div style={{textAlign: "center"}}>
                //             <img  src={Images.leads_icon_black} className="img-fluid" alt={"icon"} style={{width:40, opacity:0.5}}/>
                //             <p style={{textAlign:"center", color:"#38BC94"}}> Add Opportunity </p>
                //         </div>
                //         )}}
              />
            </div>
          ) : (
            <div className="col-12">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                  <img
                    src={Images.no_opportunities_icon}
                    alt="logo"
                    className="img-fluid"
                  />
                  <h6 className="mb-0 text-gray-tag">No Opportunities</h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(OpportunitiesInfo);

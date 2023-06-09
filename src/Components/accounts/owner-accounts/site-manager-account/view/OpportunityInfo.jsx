import React, { Component } from "react";
import { Button, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../../../Images";
import moment from "moment";
import { getOpportunities } from "../../../../../Controller/api/opportunityServices";
import { withRouter } from "react-router-dom";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/src";
import { routes } from "../../../../../Controller/Routes";

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
      dataIndex: "id",
      sorter: true,
    },
    {
      title: "OPPORTUNITY NAME",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      render: data => data?.title || "-"
    },
    {
      title: "OPPORTUNITY SOURCE",
      dataIndex: "source",
      sorter: true,
      render: (data) => <div>{data.name}</div>,
    },
    {
      title: "LAST ACTIVITY DATE",
      dataIndex: "modified",
      render: (data) => <div>{moment(data).format("MMM DD,YYYY hh:mm A")}</div>,
      sorter: true,
    },
  ];

  componentDidMount() {
    this.fetchOpportunity();
  }

  fetchOpportunity = (params = {}) => {
    this.setState({ loading: true });
    getOpportunities({owner_account : this.props.owner ? this.props.owner.id : this.props.match.params.id, ...params })
      .then((res) => {
        this.setState({ opportunities: res.data.results, loading: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
      });
  };
  onSearch = (e) => {
    this.fetchOpportunity({ search: e.target.value, page: 1 });
  };

  render() {
    let { pagination, opportunities, loading } = this.state;
    // if (!this.props.pagination) {
    //   pagination = false;
    // }
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          {!this.props.hideSearch && (
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
                {this.props.hideTitle && (
                  <Button
                    onClick={() => this.props.tabChange("7")}
                    className="view-all-btn text-uppercase ml-auto"
                  >
                    VIEW ALL{" "}
                  </Button>
                )}
              </div>
            </div>
          )}
          {opportunities.length > 0 ? (
            <div className="col-12 table-responsive width-160-id main-table-div">
              <Table
                pagination={pagination}
                className="border-0 carpet-cleaning-table"
                columns={this.opportunitiesColumns}
                rowKey={(record) => record.id}
                //    locale={{
                //        emptyText: <div className="col-12">
                //            <div className="row no-data-upload-screens no-data-second m-0 border-0">
                //                <div className="col-12 text-center">
                //                    <img src={Images.leads_icon_black} alt="logo"
                //                         className="img-fluid" style={{opacity: "0.5"}}/>
                //                    <h6 className="mb-0 approved-btn" style={{color: "rgb(56, 188, 148)"}}>Add
                //                        Opportunity</h6>
                //                </div>
                //            </div>
                //        </div>
                //    }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      history.push(
                        reverse(routes.dashboard.opportunities.view, {
                          id: record.id,
                        })
                      );
                    },
                  };
                }}
                loading={loading}
                dataSource={opportunities}
                size="middle"
              />
            </div>
          ) : (
            <div className="col-12">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                  <img
                    src={Images.Opportunity_empty_state_icon}
                    alt="logo"
                    className="img-fluid"
                  />
                  <h6 className="text-gray-tag">No Opportunities</h6>
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

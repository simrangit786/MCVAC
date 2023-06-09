import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../../Images";
import ViewProposal from "../../../../drawers/View.Proposal";
import { withRouter } from "react-router-dom";
import { getProposals } from "../../../../../Controller/api/proposalServices";
import { handleError } from "../../../../../Controller/Global";

class ProposalsInfo extends Component {
  state = {
    visibleProposal: false,
    proposals: [],
  };
  columns = [
    {
      title: "Proposal name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Associated project",
      dataIndex: "project",
      sorter: true,
      render: (project) =>
        Object.keys(project).map(function (type, i) {
          return <span key={i}>{project[type].name}</span>;
        }),
    },
    {
      title: "Billing Account",
      dataIndex: "customer_contact",
      sorter: true,
      render: (customer) =>
        Object.keys(customer).map(function (type, i) {
          return <span key={i}>{customer[type].account.name}</span>;
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => <div className="text-capitalize">{data}</div>,
      sorter: true,
    },
  ];

  showViewProposal = (visible) => {
    this.setState({
      visibleProposal: visible,
    });
  };

  componentDidMount() {
    this.fetchProposals();
  }

  fetchProposals = (params = {}) => {
    getProposals({ opportunity: this.props.match.params.id, ...params })
      .then((res) => {
        this.setState({ proposals: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  onSearch = (e) => {
    this.fetchProposals({ search: e.target.value });
  };

  render() {
    let { proposals } = this.state;
    const { hideTitle } = this.props;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between  carpet-cleaning-mini-header">
              <div className="search-bar-div d-flex align-items-center">
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
                <div className="new-opportunity-btn-div">
                  <Button className="add-btn-collapse text-capitalize">
                    ADD
                  </Button>
                </div>
              </div>
              {hideTitle && (
                <Button
                  onClick={() => this.props.onTabChange("4")}
                  className="view-all-btn text-uppercase"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
          {proposals.length > 0 ? (
            <div className="col-12 table-responsive main-table-div">
              <Table
                className="main-table-all carpet-cleaning-table border-0"
                columns={this.columns}
                dataSource={proposals}
                size="middle"
                pagination={false}
                locale={{
                  emptyText: (
                    <div className="col-12">
                      <div className="row no-data-upload-screens no-data-second m-0 border-0">
                        <div className="col-12 text-center">
                          <img
                            src={Images.propsal_icon_add}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 text-gray-tag">No proposal</h6>
                        </div>
                      </div>
                    </div>
                  ),
                }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      this.showViewProposal(true);
                    },
                  };
                }}
              />
            </div>
          ) : (
            <div className="col-12">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                  <img
                    src={Images.propsal_icon_add}
                    alt="proposal_icon_add"
                    className="img-fluid"
                  />
                  <h6 className="mb-0 mt-1 text-gray-tag">No proposal</h6>
                </div>
              </div>
            </div>
          )}
        </div>
        <ViewProposal
          visible={this.state.visibleProposal}
          onClose={() => this.showViewProposal(false)}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(ProposalsInfo);

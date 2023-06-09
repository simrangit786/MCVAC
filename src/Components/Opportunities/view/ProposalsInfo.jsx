import React, { useState, useEffect } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../Images";
import ViewProposal from "../../drawers/View.Proposal";
import { getProposals } from "../../.././Controller/api/proposalServices";
import { handleError } from "../../.././Controller/Global";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { routes } from "../../../Controller/Routes";
import { reverse } from "named-urls/src";
import { history } from "../../../Controller/history";

const ProposalsInfo = props => {
  const [visibleProposal, setVisible] = useState(false)
  const [proposals, setProposals] = useState([])
  const columns = [
    {
      title: "Proposal Id",
      dataIndex: "id",
      sorter: true,
      width: '10%'
    },
    {
      title: "Proposal name",
      dataIndex: "name",
      sorter: true,
      width: '40%'
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => <div className="text-capitalize">{data?.title || "-"}</div>,
      sorter: true,
      width: '40%'
    },
    {
      title:"Associated Opportunity",
      dataIndex:"opportunity",
      sorter: true,
      width: '40%',
      render: (data) => <div>{data?.name || "-"}</div>
    },
    {
      title: "Billing Account",
      dataIndex: "customer_contact",
      sorter: true,
      width: '40%',
      render: (customer) =>
        Object.keys(customer).map(function (type, i) {
          return <span key={i}>{customer[type].account.name}</span>;
        }),
    },
    {
      title: "Associated project",
      dataIndex: "project",
      width: '40%',
      sorter: true,
      render: (project) => <p>-</p>
        // Object.keys(project).map(function (type, i) {
        //   return <span key={i}>{project[type].name || "-"}</span>;
        // }),
    },
    {
      title: "LAST ACTIVITY DATE",
      dataIndex: "modified",
      render: (data) => <div>{moment(data).format("MMM DD,YYYY hh:mm A")}</div>,
      sorter: true,
    }
  ];

  const showViewProposal = (visible) => {
    setVisible(visible)
  };

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = (params = {}) => {
    getProposals({ opportunity: props.match.params.id, ...params })
      .then((res) => {
        setProposals(res.data.results)
      })
      .catch((err) => {
        handleError(err);
      });
  };

  const onSearch = (e) => {
    fetchProposals({ search: e.target.value });
  };

    const { hideTitle } = props;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12">
            <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between  carpet-cleaning-mini-header">
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
                  <Input placeholder="Search" onChange={onSearch} />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
                {/*<div className="new-opportunity-btn-div">
                    <Button className="add-btn-collapse text-capitalize">
                     ADD
                    </Button>
                </div>*/}
              </div>
              {hideTitle && (
                <Button
                  onClick={() => props.onTabChange("4")}
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
                className="main-table-all sorter-design-fix border-0"
                columns={columns}
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
                onRow={(record) => {
                  return {
                    onClick: (event) => {
                      history.push(
                        reverse(routes.dashboard.sales.proposal.view, {
                          id: record.id,
                        })
                      );
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
                    src={Images.proposal_empty_state_icon}
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
          visible={visibleProposal}
          onClose={() => showViewProposal(false)}
        />
      </React.Fragment>
    );
  }

export default withRouter(ProposalsInfo);

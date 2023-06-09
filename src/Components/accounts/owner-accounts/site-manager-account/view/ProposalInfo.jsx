import React, { Component, useState,useEffect } from "react";
import { Button, Form, Input, message, Table } from "antd";
import { Image as Images } from "../../../../Images";
import moment from "moment";
import { getProposals } from "../../../../../Controller/api/proposalServices";
import { withRouter } from "react-router-dom";
import { routes } from "../../../../../Controller/Routes";
import { reverse } from "named-urls/src";
import { history } from "../../../../../Controller/history";

const ProposalInfo = props => {
    const [proposal,setProposal] = useState([]);
    const [loading,setLoading] = useState(false);
    const [pagination,setPagination] = useState({
        current: 1,
        pageSize: 15,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    })
    const [search,setSearch] = useState({
        search: null,
        page: 1
    });
    
   const proposalsColumns = [
        {
          title: "PROPOSAL ID",
          dataIndex: "id",
          sorter: true,
        },
        {
          title: "PROPOSAL NAME",
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
          title: "ASSOCIATED OPPORTUNITY",
          dataIndex: "opportunity",
          sorter: true,
          render: (data) => <div>{data?.name || "-"}</div>,
        },
        {
            title: "Billing Account",
            dataIndex: "customer_contact",
            sorter: true,
            render: (customer) =>
              Object.keys(customer).map(function (type, i) {
                return (
                  <span key={i}>
                    {customer[type].account && customer[type].account.name}
                  </span>
                );
              }),
            key: "account",
          },
        {
          title: "LAST ACTIVITY DATE",
          dataIndex: "modified",
          render: (data) => <div>{moment(data).format("MMM DD,YYYY hh:mm A")}</div>,
          sorter: true,
        },
      ];

    useEffect(() => {
        fetchProposal({ ...search })
    },[search])

    const handleChange = (pagination) => {
        setSearch({...search,page:pagination.current})
        setPagination({...pagination,current:pagination.current})
    
      }

   const fetchProposal = (params = {}) => {
        setLoading(true);
        getProposals({owner_account : props.owner ? props.owner.id : props.match.params.id, ...params })
          .then((res) => {
            setProposal(!props.viewAll ? res.data.results.slice(0,10) : res.data.results);
            setLoading(false);
            setPagination({...pagination, total: !props.viewAll ? 10 : res.data.count})
            // this.setState({ opportunities: res.data.results, loading: false });
          })
          .catch((err) => {
            // if (err.response) {
            //   Object.keys(err.response.data).map((e) => {
            //     message.error(err.response.data[e]);
            //   });
            // }
          });
      };

      const onSearch = (e) => {
        // console.log(e.target.value,"e value")
        setSearch({search:e.target.value,page:1})
      };

      return (
        <React.Fragment>
          <div
            className={`row mx-0 ${
              !props.hideTitle ? "mt-30 no-data-card-row-new" : ""
            }`}
          >
            {!props.hideSearch && (
              <div className="col-12">
                <div className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
                  <div className="search-bar-div">
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
                  </div>
                  {props.hideTitle && (
                    <Button
                      onClick={() => props.tabChange("12")}
                      className="view-all-btn text-uppercase ml-auto"
                    >
                      VIEW ALL{" "}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {proposal.length > 0 ? (
              <div className="col-12 table-responsive width-160-id main-table-div">
                <Table
                  pagination={props.viewAll == false ? false : pagination}
                  className="border-0 carpet-cleaning-table"
                  columns={proposalsColumns}
                  rowKey={(record) => record.id}
                  loading={loading}
                  onRow= {(record,rowIndex) => {
                    return {
                      onClick : (event) =>
                        history.push(
                          reverse(routes.dashboard.sales.proposal.view, {
                            id: record.id,
                          })
                        )
                    }
                  }}
                  dataSource={proposal}
                  onChange={handleChange}
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
                    <h6 className="text-gray-tag">No Proposals</h6>
                  </div>
                </div>
              </div>
            )}
          </div>
        </React.Fragment>
      );
  
}
export default withRouter(ProposalInfo);
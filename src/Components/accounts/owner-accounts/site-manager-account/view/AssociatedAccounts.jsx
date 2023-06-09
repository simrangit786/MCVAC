import React, { Component } from "react";
import { Button, Drawer, Form, Input, message } from "antd";
import { Image, Image as Images } from "../../../../Images";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { getAssociatedAccounts } from "../../../../../Controller/api/ownerAccountServices";
import CommonTable from "../../../../common/CommonTable";

class AssociatedAccounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      accountsList: [],
      loading: false,
      visible: false,
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    let symbol = "";
    if (sorter.order === "descend") symbol = "-";
    let params = {
      page: pagination.current,
    };
    if (sorter.columnKey) {
      params.ordering = `${symbol}${sorter.columnKey}`;
    }
  };

  componentDidMount() {
    this.fetchAssociatedAccounts();
  }

  showWorkList = (item) => {
    this.setState({ visible: true, workHistory: item });
  };

  columns = [
    {
      title: "ACCOUNT NAME",
      key: "name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a - b,
      },
      // render: (data) => <div className="d-flex align-items-center"><span className="account-type-name font-weight-bold">{`${data.name}`}</span>{`(${data.account_type == "CUSTOMER_OWNER" ? "Billing, Site Manager" : "Billing"})`}</div>
    },
    {
      title: "ACCOUNT TYPE",
      // key: 'name',
      // dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.account_type - b.account_type,
      },
      render: (data) => (
        <div className="d-flex align-items-center">
          {data.account_type == "CUSTOMER_OWNER"
            ? "Billing, Site Manager"
            : data.account_type === "SITE_OWNER"
            ? "Site Manager"
            : "Billing"}
        </div>
      ),
    },
    {
      title: "WORK HISTORY ",
      dataIndex: "type",
      // key: 'type',
      sorter: {
        compare: (a, b) => console.log(a, b),
      },
      render: (name) => (
        <div className="d-flex align-items-center">
          {name &&
            (name.opportunity.length > 0 ? (
              <div className="d-flex align-items-center associated-history-div">
                <span className="associated-history">{`${name.opportunity[0]}`}</span>{" "}
                <span>(Opportunity)</span>
              </div>
            ) : (
              <div className="d-flex align-items-center associated-history-div">
                <span className="associated-history">{`${name.proposal[0]}`}</span>{" "}
                <span>(Proposal)</span>
              </div>
            ))}
          {name.opportunity.length + name.proposal.length > 1 && (
            <span className="d-inline-block count-div-tag">
              and{" "}
              <span
                onClick={() => this.showWorkList(name)}
                className="more-text cursor-pointer"
              >
                {name.opportunity.length + name.proposal.length - 1} more
              </span>
            </span>
          )}
        </div>
      ),
    },
    // , {
    //     title: 'CREATION DATE',
    //     dataIndex: 'created',
    //     sorter: {
    //         compare: Sorter.DATE
    //     },
    //     render: (created) => <div
    //         className="font-weight-normal">{moment(created).format('MMM DD,YYYY hh:mm A')}</div>
    // }, {
    //     title: 'LAST ACTIVITY DATE',
    //     dataIndex: 'modified',
    //     sorter: {
    //         compare: Sorter.DATE
    //     },
    //     // sorter: true,
    //     render: (modified) => <div
    //         className="font-weight-normal">{moment(modified).format('MMM DD,YYYY hh:mm A')}</div>
    // },
  ];

  onClose = () => {
    this.setState({ visible: false });
  };

  fetchAssociatedAccounts = (params = {}) => {
    this.setState({ loading: true });
    if (this.props.hideTitle) {
      params.page = 1;
    }
    getAssociatedAccounts(this.props.match.params.id, { ...params })
      .then((response) => {
        this.setState({ accounts: response.data.results });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).forEach((e) => {
            message.error(err.response.data[e]);
          });
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  onSearch = (e) => {
    this.fetchAssociatedAccounts({ search: e.target.value });
  };

  render() {
    const { pagination, hideTitle } = this.props;
    const { loading, accounts, visible, workHistory } = this.state;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            !this.props.hideTitle ? "mt-30 no-data-card-row-new" : ""
          }`}
        >
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
              {hideTitle && (
                <Button
                  onClick={() => this.props.tabChange("6")}
                  className="view-all-btn text-uppercase ml-auto"
                >
                  VIEW ALL{" "}
                </Button>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="row associated-table my-3">
              {accounts.length > 0 ? (
                <CommonTable
                  data={accounts}
                  loading={loading}
                  pagination={pagination}
                  columns={this.columns}
                />
              ) : (
                <div className="col-12">
                  <div
                    className="no-data-wrapper row d-flex"
                    style={{ alignItems: "center" }}
                  >
                    <div className="col-12">
                      <img src={Image.Account_no_data_icon} alt="No Data" />
                      <h6 className="text-gray-tag">No Associated Accounts</h6>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {visible && (
            <Drawer
              title="Work History"
              placement="right"
              className="main-all-form-modal main-drawer-div"
              width={500}
              closable={true}
              onClose={this.onClose}
              visible={visible}
              getContainer={false}
              footer={
                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  {/*<Button onClick={this.props.onClose} style={{marginRight: 8}}>*/}
                  {/*    Close*/}
                  {/*</Button>*/}
                  <Button onClick={this.onClose} type="primary">
                    Close
                  </Button>
                </div>
              }
            >
              <div className="row account-history-heading">
                <div className="col-12">
                  <h5 className="mb-0 d-flex align-items-center">
                    <img
                      src={Images.account_black_icon}
                      alt={""}
                      className="img-fluid"
                    />
                    <span className="heading-tag-history">
                      {this.props.customer.name}
                    </span>
                    <span className="title-details">
                      (
                      {this.props.customer.account_type == "CUSTOMER_OWNER"
                        ? "Billing, Site Manager"
                        : "Billing"}
                      )
                    </span>
                  </h5>
                </div>
              </div>
              <div className="row opportunity-db-table work-history-table">
                <div className="col-12 table-responsive main-table-all">
                  <table className="table">
                    <thead className="ant-table-thead">
                      <tr>
                        <th className="ant-table-cell">Work History</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workHistory &&
                        workHistory.opportunity &&
                        workHistory.opportunity.map((i) => {
                          return (
                            <tr className="ant-table-row ant-table-row-level-0">
                              <td className="ant-table-cell font-weight-bold">
                                {i}{" "}
                                <span className="font-weight-normal">
                                  (Opportunity)
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      {workHistory &&
                        workHistory.proposal &&
                        workHistory.proposal.map((i) => {
                          return (
                            <tr className="ant-table-row ant-table-row-level-0">
                              <td className="ant-table-cell font-weight-bold">
                                {i}{" "}
                                <span className="font-weight-normal">
                                  (Proposal)
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Drawer>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AssociatedAccounts);

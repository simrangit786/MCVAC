import React, {Component} from "react";
import {Menu, Switch, Table} from "antd";
import {history} from "../../Controller/history";
import {Link} from "react-router-dom";
import moment from "moment";
import {reverse} from "named-urls";
import {routes} from "../../Controller/Routes";
import {checkOpportunityFieldsRequired, formatDate} from "../../Controller/utils";

function onChange(checked) {
}

class OpportunitiesTableDashboard extends Component {
    menu = (
        <Menu>
            <Menu.Item key="0">
                <Link className="d-flex align-items-center font-weight-bold" to={""}>
                    <Switch defaultChecked onChange={onChange}/>
                    <span>Salesperson</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="1">
                <Link className="d-flex align-items-center font-weight-bold" to={""}>
                    <Switch onChange={onChange}/>
                    <span>Sales Manager</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link className="d-flex align-items-center font-weight-bold" to={""}>
                    <Switch onChange={onChange}/>
                    <span>Sales Assistant</span>
                </Link>
            </Menu.Item>
        </Menu>
    );

    columns = [
        {
            title: "Opportunity Id",
            dataIndex: "id",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "id",
        },
        {
            title: "Opportunity name",
            // dataIndex: "name",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            key: "name",
            sorter: true,
            render: data => {
                return (
                    <div>
                        <p>{data.name || "-"}</p>
                        {checkOpportunityFieldsRequired(data)
                            && (
                                <p className="red-text-disposal">
                                    Please complete all required information to avoid issues.
                                </p>
                            )
                        }
                    </div>
                )
            },
            // key: "name",
        },
        {
            title: "Status",
            dataIndex: "status",
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "status",
            render: (data) => (data?.title || "-"),
        },
        {
            title: "Primary Team Member",
            dataIndex: "point_opportunity",
            render: (data) => <div>{data|| "-"}</div>,
            // sorter: {
            //     compare: (a, b) => a.name.localeCompare(b.name)
            // },
            sorter: true,
            key: "point_opportunity",
          },
        {
            title: "OPPORTUNITY SOURCE",
            dataIndex: "source",
            render: (data) => <div>{data.name}</div>,
            // sorter: {
            //     compare: Sorter.DEFAULT
            // },
            sorter: true,
            key: "source",
        },
        {
            title: "Billing Account",
            dataIndex: "customer_contact_accounts",
            sorter: true,
            render: (customer) => (customer?.length > 0 ?
              Object.keys(customer).map(function (type, i) {
                return (
                  <span key={i}>
                    {customer[type].account && customer[type].account.name} {customer.length >1 && ","}
                  </span>
                );
              }) : "-"
            ),
            key: "customer_contact_accounts",
          },
          {
            title: "Site Manager Account",
            dataIndex: "owner_contact_accounts",
            render: (data) => <div>{data?.length &&data[0]?.account?.name || "-"}</div>,
            // sorter: {
            //     compare: (a, b) => a.name.localeCompare(b.name)
            // },
            sorter: true,
            key: "owner_contact_accounts",
          },
          {
            title: "Total Bid Value",
            dataIndex: "bid_value",
            sorter: true,
            render: (data) => <div>{data ? `$${data}` : "-"}</div>,
            key: "bid_value",
          },
          {
            title: "Bid Date",
            dataIndex: "bid_date",
            render: (data) => <div>{formatDate(data)|| "-"}</div>,
            // sorter: {
            //     compare: (a, b) => a.name.localeCompare(b.name)
            // },
            sorter: true,
            key: "bid_date",
          },
        {
            title: <div className="position-relative">Last Activity Date</div>,
            dataIndex: "modified",
            render: (data) => <div>{formatDate(data)}</div>,
            // sorter: {
            //     compare: Sorter.DATE
            // },
            sorter: true,
            key: "modified",
        },
    ];

    handleTableChange = (pagination, filters, sorter) => {
        // this.props.fetchTableData({
        //     // sortField: sorter.field,
        //     // sortOrder: sorter.order,
        //     page: pagination.current,
        //     // ...filters,
        // });
        let symbol = "";
        if (sorter.order === "descend") symbol = "-";
        let params = {
            page: pagination.current,
        };
        if (sorter.columnKey) {
            params.ordering = `${symbol}${sorter.columnKey}`;
        } else {
            params.ordering = "-modified";
        }
        this.props.fetchTableData(params);
    };

    render() {
        const {pagination, loading, data,locale} = this.props;
        return (
            <React.Fragment>
                <div className="col-12 table-responsive main-table-div opportunity-db-table">
                    <Table
                        scroll={{ y: 500 ,x:1300}}
                        className="main-table-all"
                        columns={this.columns}
                        loading={loading}
                        dataSource={data}
                        locale={locale}
                        size="middle"
                        onChange={this.handleTableChange}
                        pagination={pagination}
                        rowKey={(record) => record.id}
                        rowClassName={(record) => {
                            if (checkOpportunityFieldsRequired(record)) {
                                return "is-required";
                            }
                        }}
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
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default OpportunitiesTableDashboard;

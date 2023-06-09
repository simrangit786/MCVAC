import React, { Component } from "react";
import { history } from "../../Controller/history";
import { reverse } from "named-urls";
import { routes } from "../../Controller/Routes";
import moment from "moment";
import { Table } from "antd";

class ContactMainTable extends Component {
    setacctype = (e) => {
        if (e === "CUSTOMER_OWNER") {
            return "Billing, Site Manager"
        } else if (e === "SITE_OWNER") {
            return "Site Manager"
        } else if (e == "VENDOR") {
            return "Vendor"
        } else {
            return "Billing"
        }
    }
    columns = [
        {
            title: "Contact Name",
            dataIndex: "full_name",
            render: (item) => <div className="name-id-details">{item}</div>,
            key: "first_name",
            // sorter: {
            //     compare: Sorter.DEFAULT,
            // },
            defaultSortOrder: 'ascend',
            sorter: true,
        },
        {
            title: "Account Type",
            dataIndex: "account",
            render: (data) => <div>{this.setacctype(data?.account_type)}
            </div>,
            sorter: true,
            key: "account",
        },
        {
            title: "Email",
            dataIndex: "default_email",
            render: (data) => <div>{data?.email || "-"}</div>,
            sorter: true,
            key: "default_phone",
        },
        {
            title: "Phone",
            dataIndex: "default_phone",
            render: (data) => <div>{data?.phone_number || "-"}</div>,
            sorter: true,
            key: "default_phone",
        },
        {
            title: "CITY",
            dataIndex: "contact_address",
            render: (data) => <div>{data?.city || "-"}</div>,
            sorter: true,
            key: "contact_address",
        },
        {
            title: "STATE",
            dataIndex: "contact_address",
            render: (data) => <div>{data?.state || "-"}</div>,
            sorter: true,
            key: "contact_address",
        },
        {
            title: "Last Activity Date",
            dataIndex: "modified",
            render: (modified) => (
                <div className="font-weight-normal">
                    {moment(modified).format("MMM DD,YYYY hh:mm A")}
                </div>
            ),
            // sorter: {
            //     compare: Sorter.DATE,
            // },
            key: "modified",
            sorter: true,
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
        const { pagination, loading, data, locale } = this.props;
        return (
            <React.Fragment>
                <div className="col-12 table-responsive main-table-div opportunity-db-table customer-account-table">
                    <Table
                        scroll={{ y: 500, x: 1200 }}
                        className="main-table-all"
                        columns={this.columns}
                        dataSource={data}
                        size="middle"
                        locale={locale}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: (event) => {
                                    history.push(
                                        reverse(routes.dashboard.contacts.view, { id: record.id })
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

export default ContactMainTable;


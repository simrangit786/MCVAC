import React, { Component } from "react";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import VendorAccountMinHeader from "../../../Components/min-header/vendorAccountMinHeader"
import { debounceEvent } from "../../../Controller/utils";
import { Table } from "antd";
import moment from "moment";
import { handleError } from "../../../Controller/Global";
import { getVendorAccount } from "../../../Controller/api/vendorAccountServices";
import { routes } from "../../../Controller/Routes";
import { reverse } from "named-urls/src";
import { history } from "../../../Controller/history";

class vendorAccountsMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendorAccounts: [],
            loading: false,
            search: "",
            pagination: {
                current: 1,
                pageSize: 15,
                showSizeChanger: false,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
            },
            date: {
                start: "",
                end: "",
                start_modified: "",
                end_modified: ""
            }
        }
    }

    columns = [
        {
            title: "Account Name",
            dataIndex: "name",
            render: (name) => <div className="name-id-details">{name}</div>,
            defaultSortOrder: 'ascend',
            sorter: true,
            key: "name",
        },
        {
            title: "Last Activity Date",
            dataIndex: "modified",
            render: (modified) => (
              <div className="font-weight-normal">
                {moment(modified).format("MMM DD,YYYY hh:mm A")}
              </div>
            ),
            sorter: true,
            key: "modified",
          },
    ]

    fetchTableData = (params) => {
        const {search, date} = this.state;
        this.setState({loading: true})
        getVendorAccount({...params,page: params?.page || 1, search,...date}).then(res => {
            this.setState(prevState => {
                return {vendorAccounts: res.data.results, loading: false, 
                pagination: {
                ...prevState.pagination,
                current: params?.page || 1,
                total: res.data.count
            }
        }})
        }).catch(err => {
            this.setState({loading: false})
            handleError(err)
        })
    }
    componentDidMount() {
        let arr = [{
            title: "Vendor Accounts", url: "",
        }];
        this.props.setBreadcrumb(arr);
        this.fetchTableData()
    }

    handleTableChange = (pagination, filters, sorter) => {
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

        this.fetchTableData(params);
    };

    onSearch = e => {
        this.setState({search: e.target.value}, () => {
            this.fetchTableData()
        })
    }

    handleDateFilter = data => {
        this.setState({date: {...data}},() => {
            this.fetchTableData()
        })
    }
    render() {
        const {vendorAccounts, pagination, loading} = this.state;
        return (
                <>
                 <div className="main-content-div">
                    <VendorAccountMinHeader
                        onSearch={debounceEvent(this.onSearch, 1000)}
                        fetchData={(data) => this.handleDateFilter(data)}
                    />
                    <div className="row mx-0 opportunities-table-main-dashboard">
                    <div className="col-12 table-responsive main-table-div opportunity-db-table">
                    <Table
                        scroll={{ y: 450}}
                        className="main-table-all"
                        columns={this.columns}
                        dataSource={vendorAccounts}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        size="middle"
                        loading={loading}
                        //   locale={props.locale}
                        rowKey={(record) => record.id}
                        onRow={(record, rowIndex) => {
                            return {
                            onClick: (event) => {
                                history.push(
                                reverse(routes.dashboard.vendor_account.view, {
                                    id: record.id,
                                })
                                );
                            },
                            };
                        }}
                    />
                    </div>
                        {/* <Table
                            loading={loading}
                            columns={this.columns}
                            dataSource={vendorAccounts}
                            // locale={!loading ? {emptyText: getLoa()} : {emptyText: " "}}
                            pagination={pagination}
                        /> */}
                    </div>
                </div>
                </>
        )
    }
}

export default connect(null, {setBreadcrumb})(vendorAccountsMain);
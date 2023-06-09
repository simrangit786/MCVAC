import React, { Component } from 'react';
import {Menu, Switch, Table} from "antd";
import {Link} from "react-router-dom";
import {checkOpportunityFieldsRequired, formatDate} from "../../../Controller/utils";
import {history} from "../../../Controller/history";
import {reverse} from "named-urls";
import {routes} from "../../../Controller/Routes";
import { getInvoices } from '../../../Controller/api/invoiceServices';
import { setBreadcrumb } from '../../../Store/actions/breadcrumbAction';
import { handleError } from '../../../Controller/Global';
import { connect } from 'react-redux';
import moment from 'moment/moment';

class InvoicingTableMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Invoice: []
        }
    }

    componentDidMount() {
            let arr = [
              {
                title: "Invoice",
                // url: routes.dashboard.sales.proposal.self,
              },
            ];
            this.props.setBreadcrumb(arr);
        
        this.fetchAllInvoice()
    }


    fetchAllInvoice = () => {
     getInvoices().then(res => {
        this.setState({Invoice: res.data.results})
     }).catch((err) => {
        handleError(err)
     })

    }

    menu = (
        <Menu>
            <Menu.Item key="0">
                <Link className="d-flex align-items-center font-weight-bold" to={""}>
                    <Switch/>
                    <span>Salesperson</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="1">
                <Link className="d-flex align-items-center font-weight-bold" to={""}>
                    <Switch/>
                    <span>Sales Manager</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link className="d-flex align-items-center font-weight-bold" to={""}>
                    <Switch/>
                    <span>Sales Assistant</span>
                </Link>
            </Menu.Item>
        </Menu>
    );

    columns = [
        {
            title: "Associated Project",
            dataIndex: "project",
            sorter: true,
            key: "project",
            render:(project)=><div className="font-weight-500">{project?.name}</div>
        },
        {
            title: "Invoice ID",
            key: "id",
            dataIndex: "id",
            sorter: true,
            render: (id) => <div>{id}</div>
        },
       {
            title: "Billing Account",
            key: "billing_account",
            dataIndex: "invoice_customer_contact",
            sorter: true,
            render: (data) => <div>{data.length ? data.map(i => {
                return (
                    <>{i.account ? i.account.name : "-"}</>
                )
       }) : "-"
                }
              </div>
        },
        {
            title: "Status",
            dataIndex: "status",
            sorter: true,
            key: "status",
            render: (status) => <div>{status?.title}</div>,
        },
        {
            title: <div className="position-relative">Last Activity Date</div>,
            dataIndex: "modified",
            render: (modified) => <div className="text-capitalize">{modified ? moment(modified).format("MMM DD,YYYY") : "-"}</div>,
            sorter: true,
            key: "modified",
        },
    ];
//    data = [{
//         key:'1',
//        associated_project:'',
//        id:'',
//        billing_account:'',
//        status:'',
//        modified:''
//    },
//    {
//         key:'1',
//        associated_project:'',
//        id:'',
//        billing_account:'',
//        status:'',
//        modified:''
//    },]

   render(){
    const { Invoice } = this.state
    return (
            <React.Fragment>
                <div className="col-12 table-responsive main-table-div opportunity-db-table">
                    <Table
                        scroll={{ y: 500}}
                        className="main-table-all"
                        columns={this.columns}
                        loading={false}
                        dataSource={Invoice}
                        size="middle"
                        // onChange={this.handleTableChange}
                        pagination={true}
                        rowKey={(record) => record.id}
                        // rowClassName={(record) => {
                        //     if (checkOpportunityFieldsRequired(record)) {
                        //         return "is-required";
                        //     }
                        // }}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    history.push(
                                        reverse(routes.dashboard.accounting.invoicing.view, {
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
};

export default connect(null, { setBreadcrumb })(InvoicingTableMain);
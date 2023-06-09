import React, { Component } from 'react';
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../Images";
import moment from 'moment';

class ProjectsWorkOrderView extends Component {
    state = {
        workOrder: [],

    }
    workOrdersColumns = [
        {
            title: "Work order id",
            dataIndex: "id",
            sorter: true,
            render: (id) => <div className="font-weight-bold">{id}</div>,
        }, {
            title: "Associated Project",
            dataIndex: "project",
            sorter: true,
            render: () => <div>{this.props?.project?.name}</div>
        }, {
            title: "Status",
            dataIndex: "status",
            sorter: true,
            render: (status) => <div>
                <span style={{ color: '#F2994A' }}>{(status?.split("_")?.join(" ")) || "-"}</span>
            </div>
        }, {
            title: "Site",
            dataIndex: "site",
            sorter: true,
            render: (data) => <div className="text-uppercase">{data?.length ? `${data[0]?.street_address} ${data[0]?.city} ${data[0]?.country} ${data[0]?.state} ${data[0]?.zip_code}` : '-'}</div>
        }, {
            title: <div>Service date</div>,
            dataIndex: "service_date",
            sorter: true,
            render: (data) => <div>{data ? moment(data).format("MMM DD, YYYY hh:mm A") : '-'}</div>
        },
    ];

    getLocateData = () => {
        return (<div className="col-12 no-data-card-row-new-table">
            <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                    <img src={Images.empty_work_order_keys_icon} alt="" className="img-fluid" />
                    <h6 className="no-data-main-tg mb-0">No Work Orders</h6>
                </div>
            </div>
        </div>)
    }

    render() {
        const { work_order } = this.props?.project
        return (<React.Fragment>
            <div className="row mx-0 no-data-card-row-new">
                <div className="col-12">
                    <div
                        className="row new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center  carpet-cleaning-mini-header">
                        <div className="search-bar-div">
                            <Form className="position-relative">
                                <Input placeholder="Search" />
                                <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                    <img
                                        src={Images.search_icon_gray}
                                        className="img-fluid"
                                        alt="search icon"
                                    />
                                </Button>
                            </Form>
                        </div>
                        {/* <div className="new-opportunity-btn-div">
                                <Button className="new-opportunity-btn text-capitalize">
                                    CREATE
                                </Button>
                            </div> */}
                    </div>
                </div>
                <div className="col-12 table-responsive main-table-div">
                    <Table pagination={false} className="main-table-all work-order-table-inner border-0 pt-3"
                        columns={this.workOrdersColumns}
                        dataSource={work_order}
                        size="middle"
                        locale={{ emptyText: this.getLocateData() }}
                    />
                </div>
                {/*no-data-screens*/}
                {/*<div className="col-12">
                        <div className="row no-data-upload-screens">
                            <div className="col-12 text-center">
                                <img
                                    src={Images.work_setting}
                                    alt="cloud upload"
                                    className="img-fluid"
                                />
                                <h6 className="text-gray-tag">No Work Order</h6>
                            </div>
                        </div>
                    </div>*/}
            </div>
        </React.Fragment>);
    }
}

export default ProjectsWorkOrderView;
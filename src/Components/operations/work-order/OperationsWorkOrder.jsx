import React, { Component } from 'react';
import { Image as Images } from "../../Images";
import OperationsHeader from "../OperationsHeader";
import { Table } from "antd";
import { routes } from "../../../Controller/Routes";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls";
import { connect } from 'react-redux';
import { setBreadcrumb } from '../../../Store/actions/breadcrumbAction';
import { getWorkOrders } from '../../../Controller/api/workOrderServices';
import { handleError } from '../../../Controller/Global';
import ManagementHeader from '../../management/ManagementHeader';
import { debounceEvent } from '../../../Controller/utils';
import moment from 'moment';

class OperationsWorkOrder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      workOrders: [],
      fetching: false,
      pagination: {
        current: 1,
        pageSize: 15,
        showSizeChanger: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`
      },
      search: "",
      date: {
        start: "",
        end: "",
        start_modified: "",
        end_modified: ""
      },
    }
  }
  columns = [{
    title: "Associated Project",
    dataIndex: "project",
    sorter: true,
    key: "project",
    render: (project) => <div>{project?.name}</div>,
  }, {
    title: "Work Order id",
    dataIndex: "id",
    sorter: true,
    key: "id",
    render: (id) => <div className="font-weight-bold">{id} </div>,
  }, {
    title: "Site",
    dataIndex: "work_owner_contact",
    sorter: true,
    key: "site",
    render: (data) => <div>{data.map(i => {
      if (i.site.length) {
        return (
          i.site.map(d => {
            return (
              <>{`${d.site?.street_address}${d.site?.city}${d.site?.country}${d.site?.state}${d.site?.zip_code}`}</>
            )
          }
          )
        )
      } else {
        return "-"
      }
    }
    )}</div>,
  }, 
  {
    title: "Billing Account",
    dataIndex: "work_customer_contact",
    sorter: true,
    key: "billing_account",
    render: (data) => <div>{data.map(i =>{
      return ( i.account?.name)
     
    })}</div>
     
  },
  {
    title: "Dispatch/Warehouse",
    dataIndex: "workorder_warehouse",
    width:"210px",
    sorter: true,
    key: "dispatch_warehouse",
    render: (data) => <div>{data.map(i =>{
      return ( i.warehouse.name)
     
    })}</div>
     
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: true,
    key: "status",
    render: (status) => <div className="text-capitalize text-primary">{(status?.split("_")?.join(" "))?.toLowerCase() || "-"}</div>,
  }, {
    title: "SERVICE DATE",
    dataIndex: "service_date",
    sorter: true,
    key: "service_date",
    render: (service_date) => <div className="text-capitalize">{service_date ? moment(service_date).format("MMM DD,YYYY") : "-"}</div>,
  }, {
    title: "SERVICE TIME",
    dataIndex: "",
    sorter: true,
    key: "service_time",
    render: (workOrder) => <div className="text-capitalize">
      {/* {workOrder?.start_time && workOrder?.end_time ?  */}
      {`${workOrder?.start_time ? moment(workOrder?.start_time, "H:mm").format('H:mm A') : ""} - ${workOrder?.end_time ? moment(workOrder?.end_time, "H:mm").format('H:mm A') : ""}`}
      {/* :{}
          "-"}</div>, */}
    </div>
  },];

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

  componentDidMount() {
    let arr = [
      {
        title: "Work Orders",
        // url: routes.dashboard.sales.proposal.self,
      },
    ];
    this.props.setBreadcrumb(arr);
    this.fetchWorkOrders();
  }

  fetchWorkOrders = (params) => {
    const { date, search } = this.state;
    this.setState({ fetching: true })
    getWorkOrders({ ...params, page: params?.page || 1, search, ...date }).then(res => {
      this.setState(prevState => {
        return { workOrders: res.data.results, pagination: { ...prevState.pagination, current: params?.page || 1, total: res.data.count } }
      })

    }).catch(err => {
      handleError(err)
    }).finally(() => {
      this.setState({ fetching: false })
    })
  }

  handleFilterData = (data) => {
    if (data) {
      this.setState({ date: { ...this.state.date, ...data } }, () => {
        this.fetchWorkOrders();
      })
    }
    else {
      this.setState({ date: null }, () => {
        this.fetchWorkOrders()
      })
    }
  }

  onSearch = (e) => {
    this.setState({ search: e.target.value }, () => {
      this.fetchWorkOrders();
    })
  };

  handleTableChange = (pagination, filters, sorter) => {
    let symbol = "";
    if (sorter.order === "descend") symbol = "-";
    let params = {
      page: pagination.current,
    };
    if (sorter.columnKey) {
      params.ordering = `${symbol}${sorter.columnKey}`;
    } else {
      params.ordering = "name";
    }
    this.setState({ loading: true });
    this.fetchWorkOrders(params);
  };

  render() {
    const { fetching, workOrders, pagination } = this.state;
    return (<div className="main-content-div">
      <ManagementHeader
        buttonLink={routes.dashboard.operations.work_order.create}
        buttonName={"+ Create Work Order"}
        onSearch={debounceEvent(this.onSearch, 1000)}
        fetchData={(data) => this.handleFilterData(data)}
      />
      <div className="row mx-0 width-160-id opportunities-table-main-dashboard">
        <div className="col-12 table-responsive main-table-div proposals-main-table opportunity-db-table">
          <Table
            scroll={{ y: 500 }}
            loading={fetching}
            className="main-table-all sorter-design-fix"
            columns={this.columns}
            dataSource={workOrders}
            onChange={this.handleTableChange}
            pagination={pagination}
            size="middle"
            locale={!fetching ? { emptyText: this.getLocateData() } : { emptyText: " " }}
            // rowClassName={(record) => {
            //     if (checkProposalFieldsRequired(record)) {
            //         return "is-required";
            //     }
            // }}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  history.push(reverse(routes.dashboard.operations.work_order.view
                    , { id: record.id }
                  ));
                },
              };
            }}
          />
        </div>
      </div>
    </div>);
  }
}

export default connect(null, { setBreadcrumb })(OperationsWorkOrder);
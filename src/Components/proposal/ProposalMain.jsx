import React, { Component } from "react";
import ManagementHeader from "../management/ManagementHeader";
import { history } from "../../Controller/history";
import { reverse } from "named-urls";
import { routes } from "../../Controller/Routes";
import { getProposals } from "../../Controller/api/proposalServices";
import { handleError } from "../../Controller/Global";
import { setBreadcrumb } from "../../Store/actions/breadcrumbAction";
import { connect } from "react-redux";
import { Spin, Table } from "antd";
import { checkProposalFieldsRequired } from "../../Controller/utils";
import { debounce } from "lodash";
import {Image as Images} from "../Images";

class ProposalMain extends Component {
  state = {
    proposals: [],
    pagination: {
      search: "",
      current: 1,
      pageSize: 15,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    },
    date: {
      start: "",
      end: "",
      start_modified: "",
      end_modified: ""
    },
    loading: true,
  };
  columns = [
    {
      title: "Proposal Id",
      dataIndex: "id",
      // sorter: {
      //     compare: Sorter.DEFAULT
      // },
      sorter: true,
      key: "id",
    },
    {
      title: "Proposal name",
      // dataIndex: "name",
      // sorter: {
      //     compare: Sorter.DEFAULT
      // },
      sorter: true,
      // key: "name",
      render: data => {
        // console.log(data, "dsfs")
        return (<div>
                <p>{data.name || "-"}</p>
                {checkProposalFieldsRequired(data)
                 && (
                  <p className="red-text-disposal">
                     Please complete all required information to view and send the proposal PDF.
                  </p>
                  )
                }
                </div>)
      }
    },
    {
      title: "Primary Team Member",
      dataIndex: "point_proposal",
      render: (data) => <div>{data|| "-"}</div>,
      // sorter: {
      //     compare: (a, b) => a.name.localeCompare(b.name)
      // },
      sorter: true,
      key: "point_proposal",
    },
    {
      title: "Associated opportunity",
      dataIndex: "opportunity",
      render: (data) => <div>{data?.name || "-"}</div>,
      // sorter: {
      //     compare: (a, b) => a.name.localeCompare(b.name)
      // },
      sorter: true,
      key: "opportunity",
    },
    {
      title: "Associated project",
      dataIndex: "project",
      render: (project) => (project.length > 0 ?
        Object.keys(project).map(function (type, i) {
          return <span key={i}>{project[type].name}</span>;
        }) : "-"
      ),
    },
    {
      title: "Billing Account",
      dataIndex: "customer_contact",
      // sorter: {
      //     compare: (a, b) => a[0]?.id || 1 - b[0]?.id || 1
      // },
      sorter: true,
      render: (customer) => (customer.length > 0 ?
        Object.keys(customer).map(function (type, i) {
          return (
            <span key={i}>
              {customer[type].account && customer[type].account.name}
            </span>
          );
        }) : "-"
        ),
      key: "account",
    },
    {
      title: "Site Manager Account",
      dataIndex: "owner_contact",
      render: (data) => <div>{data?.length &&data[0]?.account?.name || "-"}</div>,
      // sorter: {
      //     compare: (a, b) => a.name.localeCompare(b.name)
      // },
      sorter: true,
      key: "owner_contact",
    },
    {
      title: "Estimated Total",
      dataIndex: "estimated_revenue",
      render: (data) => <div>{data&&'$'}{data|| "-"}</div>,
      // sorter: {
      //     compare: (a, b) => a.name.localeCompare(b.name)
      // },
      sorter: true,
      key: "estimated_revenue",
    },
    {
      title: "Status",
      dataIndex: "status",
      // sorter: {
      //     compare: Sorter.DEFAULT
      // },
      sorter: true,
      key: "status",
      render: (data) => <div className="text-capitalize">{data?.title}</div>,
    },
  ];

  componentDidMount() {
    let arr = [
      {
        title: "Proposals",
        url: routes.dashboard.sales.proposal.self,
      },
    ]; 
    this.props.setBreadcrumb(arr );
    this.fetchProposals();
  } 

  fetchProposals = (params = {}) => {
    const {search,date} = this.state;
    getProposals({...params,page:params.page || 1, search,...date})
      .then((res) => {
        this.setState({
          proposals: res.data.results,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: res.data.count,
          },
          loading: false,
        });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };

  debounceEvent = (...args) => {
    this.debouncedEvent = debounce(...args);
    return (e) => {
      e.persist();
      return this.debouncedEvent(e);
    };
  };

  onSearch = (e) => {
    this.setState({search: e.target.value}, () => {
      this.fetchProposals();
    })
  };

  handleTableChange = (pagination, filters, sorter) => {
    // this.fetchProposals({ page: pagination.current });
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
    this.fetchProposals(params);
  };
getLocateData = () =>{
  return(
      <div className="col-12 no-data-card-row-new-table">
            <div className="row no-data-upload-screens no-data-second m-0 border-0">
                <div className="col-12 text-center">
                    <img src={Images.propsal_icon_add} alt="" className="img-fluid"/>
                    <h6 className="no-data-main-tg mb-0">No Proposals</h6>
                </div>
            </div>
        </div>
  )
}

handleFilterData = (data) => {
  if(data) { 
  this.setState({date:{...this.state.date,...data}},() => {
    this.fetchProposals();
  })
  }
  else {
    this.setState({date: null}, () => {
      this.fetchProposals();
    })
  }
}
  render() {
    let { proposals, pagination, loading } = this.state;
    return (
      <div className="main-content-div">
        <ManagementHeader
          buttonLink={routes.dashboard.sales.proposal.create}
          buttonName={"+ Create Proposal"}
          onSearch={this.debounceEvent(this.onSearch,1000)}
          fetchData={(data) => this.handleFilterData(data)}
        />
        <div className="row mx-0 width-160-id opportunities-table-main-dashboard">
          <div className="col-12 table-responsive main-table-div proposals-main-table opportunity-db-table">
            <Table
                scroll={{y: 500 , x:1300}}
                loading={loading}
                className="main-table-all sorter-design-fix"
              columns={this.columns}
              dataSource={proposals}
              onChange={this.handleTableChange}
              pagination={pagination}
              size="middle"
              locale={!loading ? {emptyText:this.getLocateData()}: {emptyText:" "}}
              rowClassName={(record) => {
                if(checkProposalFieldsRequired(record)) {
                  return "is-required";
                }
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
        </div>
      </div>
    );
  }
}

export default connect(null, { setBreadcrumb })(ProposalMain);

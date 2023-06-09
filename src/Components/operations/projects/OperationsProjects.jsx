import React, { Component } from "react";
// import ManagementHeader from "../management/ManagementHeader";
import { history } from "../../../Controller/history";
import { reverse } from "named-urls";
import { routes } from "../../../Controller/Routes";
import { handleError } from "../../../Controller/Global";
// import { setBreadcrumb } from "../../Store/actions/breadcrumbAction";
import { connect } from "react-redux";
import { Table } from "antd";
import { debounce } from "lodash";
import { Image as Images } from "../../Images";
import { getProjects } from "../../../Controller/api/projectServices";
import ManagementHeader from "../../management/ManagementHeader";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { formatDate } from '../../../Controller/utils';

class OperationsProhects extends Component {
  state = {
    projects: [],
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
      title: "Project Id",
      dataIndex: "id",
      // sorter: {
      //     compare: Sorter.DEFAULT
      // },
      sorter: true,
      key: "id",
    },
    {
      title: "Project name",
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
          {/* {checkProposalFieldsRequired(data)
                 && (
                  <p className="red-text-disposal">
                     Please complete all required information to view and send the proposal PDF.
                  </p>
                  )
                } */}
        </div>)
      }
    },
    {
      title: "Primary Team Member",
      dataIndex: "point_project",
      render: (data) => <div>{data|| "-"}</div>,
      // sorter: {
      //     compare: (a, b) => a.name.localeCompare(b.name)
      // },
      sorter: true,
      key: "point_project",
    },
    {
      title: "Associated proposal",
      dataIndex: "proposal",
      // render: (proposal) =>
      //   Object.keys(proposal).map(function (type, i) {
      //     return <span key={i}>{proposal[type].name}</span>;
      //   }),
      render: (data) => <div className=""> {data?.name||'-'}</div>
    },
    
    {
      title: "Billing Account",
      dataIndex: "project_customer_contact",
      render: (data) => <div>{data?.length &&data[0]?.account?.name || "-"}</div>,
      // sorter: {
      //     compare: (a, b) => a.name.localeCompare(b.name)
      // },
      sorter: true,
      key: "project_customer_contact",
    },
    {
      title: "Site Manager Account",
      dataIndex: "project_owner_contact",
      render: (data) => <div>{data?.length &&data[0]?.account?.name || "-"}</div>,
      // sorter: {
      //     compare: (a, b) => a.name.localeCompare(b.name)
      // },
      sorter: true,
      key: "project_owner_contact",
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
    {
      title: "LAST ACTIVITY DATE",
      dataIndex: "modified",
      // sorter: {
      //     compare: (a, b) => a[0]?.id || 1 - b[0]?.id || 1
      // },
      sorter: true,
      key: "modified",
      render: (data) => <div className="text-capitalize">{formatDate(data)}</div>,
    },
  ];

  componentDidMount() {
    let arr = [
      {
        title: "Projects",
        // url: routes.dashboard.sales.proposal.self,
      },
    ];
    this.props.setBreadcrumb(arr);
    this.fetchProjects();
  }

  fetchProjects = (params = {}) => {
    const { search, date } = this.state;
    getProjects({ ...params, page: params.page || 1, search, ...date })
      .then((res) => {
        this.setState({
          projects: res.data.results,
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
    this.setState({ search: e.target.value }, () => {
      this.fetchProjects();
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
    this.fetchProjects(params);
  };
  getLocateData = () => {
    return (
      <div className="col-12 no-data-card-row-new-table">
        <div className="row no-data-upload-screens no-data-second m-0 border-0">
          <div className="col-12 text-center">
            <img src={Images.propsal_icon_add} alt="" className="img-fluid" />
            <h6 className="no-data-main-tg mb-0">No Projects</h6>
          </div>
        </div>
      </div>
    )
  }

  handleFilterData = (data) => {
    if(data) {
    this.setState({ date: { ...this.state.date, ...data } }, () => {
      this.fetchProjects();
    })
  }
  else {
    this.setState({ date: null}, () => {
      this.fetchProjects()
    })
  }
  }
  render() {
    let { projects, pagination, loading } = this.state;
    // console.log(projects, "projects")
    return (
      <div className="main-content-div">
        <ManagementHeader
          buttonLink={routes.dashboard.operations.projects.create}
          buttonName={"+ Create Project"}
          onSearch={this.debounceEvent(this.onSearch, 1000)}
          fetchData={(data) => this.handleFilterData(data)}
        />
        <div className="row mx-0 width-160-id opportunities-table-main-dashboard">
          <div className="col-12 table-responsive main-table-div proposals-main-table opportunity-db-table">
            <Table
              scroll={{ y: 500 , x:1300 }}
              loading={loading}
              className="main-table-all sorter-design-fix"
              columns={this.columns}
              dataSource={projects}
              onChange={this.handleTableChange}
              pagination={pagination}
              size="middle"
              locale={!loading ? { emptyText: this.getLocateData() } : { emptyText: " " }}
              rowClassName={(record) => {
                // if(checkProposalFieldsRequired(record)) {
                //   return "is-required";
                // }
              }}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    history.push(
                      reverse(routes.dashboard.operations.projects.view, {
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

export default connect(null, { setBreadcrumb })(OperationsProhects);

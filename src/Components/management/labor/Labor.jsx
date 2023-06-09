import React, { Component } from "react";
import CommonTable from "../../common/CommonTable";
import ManagementHeader from "../ManagementHeader";
import { Tabs } from "antd";
import { routes } from "../../../Controller/Routes";
import {
  getEmployees,
  getLaborGroup,
} from "../../../Controller/api/labourServices";
import { handleError } from "../../../Controller/Global";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../Store/actions/breadcrumbAction";
import { getTabValue , checkLaborFieldRequired} from "../../../Controller/utils";
import { getShortName } from "../../../Controller/utils";
import moment from "moment";
import { debounce } from "lodash";
import { debounceEvent } from "../../../Controller/utils";
import {Image as Images} from "../../Images";

const { TabPane } = Tabs;

class Labor extends Component {
  state = {
    groups: [],
    employees: [],
    loading: false,
    key: "1",
    pagination: {
      current: 1,
      pageSize: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    },
    laborDate: {
      start: "",
      end: "",
      start_modified: "",
      end_modified: "",
    },
  };
  laborColumns = [
    {
      title: "Labor Group Name",
      sorter: true,
      key: "name",
      render: (data) => {
        return (
          <div>
            <p>{data.labor_group_name}</p>
            {checkLaborFieldRequired(data) && (
              <p className="red-text-disposal">
                Please complete all required information to avoid issues
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "union_type",
      sorter: true,
      key: "type",
      render: (data) => (
        <div className="text-capitalize">
          {data?.split("_").join(" ").toLowerCase() || "-"}
        </div>
      ),
    },
    {
      title: "Region",
      dataIndex: "region",
      render: (data) => data.title,
      sorter: true,
      key: "region",
    },
    {
      title: "Employees",
      dataIndex: "employee",
      sorter: true,
    },
    {
      title: "Last Activity Date",
      dataIndex: "modified",
      sorter: true,
      key: "modified",
      render: (data) => (
        <div>{moment(data).format("MMM DD,YYYY hh:mm A") || "-"}</div>
      ),
    },
  ];
  employeeColumns = [
    {
      title: "Employee Id",
      dataIndex: "id",
      sorter: true,
      key: "id",
    },
    {
      title: "Company Code",
      dataIndex: "company_code",
      sorter: true,
      key: "company_code",
      render: (data) => <div>{data ? data : "-"}</div>
    },
    {
      title: "Employee Name",
      sorter: true,
      render: (record) => (
        <div className="d-flex align-items-center">
          {
            <div
              style={{
                width: "40px",
              }}
              className="float-left"
            >
              {/* <img style={{
                            height:'30px'
                        }} src={Images.person_group_green_icon} alt={""}
                             className="img-fluid"/> */}
              <span
                style={{
                  background: "#7FD4BA",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                }}
                className="d-flex justify-content-center align-items-center"
              >
                {getShortName(record.first_name, record.last_name)}
              </span>
            </div>
          }
          {`${record.first_name || ""} ${record.middle_name || ""} ${
            record.last_name || ""
          }`}
        </div>
      ),
    },
    {
      title: "WAREHOUSE",
      dataIndex: "internal_location",
      sorter: true,
      render: (data) => <div>{data ? data.name : "-"}</div>

    },
    {
      title: "Home Labor Group",
      dataIndex: "home_group",
      sorter: true,
      render: (data) => <div>{data ? data.labor_group_name: "-"}</div>

    },
    // {
    //     title: 'Base Rate',
    //     dataIndex: 'base_rate',
    //     // sorter: {
    //     //     compare: Sorter.DEFAULT
    //     // },
    //     sorter: true,
    //     key: "base_rate",
    //     render: (data) => <div>{data ? data : "-"}</div>

    // },
    // {
    //     title: 'Home Labor Group',
    //     dataIndex: 'home_group',
    //     render: (data) => <div>{data ? data.labor_group_name : "-"}</div>
    // },
    {
      title: "Phone Number",
      dataIndex: "phone",
      render: (data) => <div>{data ? data : "-"}</div>,
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (data) => <div>{data ? data : "-"}</div>,
      sorter: true,
    },
  ];
  fetchLaborGroups = (params = {}) => {
    const { search, laborDate} = this.state
    if (!params.ordering) {
      params.ordering = "-modified";
    }
    this.setState({ loading: true });
    getLaborGroup({...params,page: params.page || 1,search,...laborDate})
      .then((res) => {
        this.setState({
          groups: res.data.results,
          pagination: {
            ...this.state.pagination,
            current: params.page || 1,
            total: res.data.count,
          },
          loading: false,
        });
        // console.log()
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };

  fetchEmployees = (params = {}) => {
    const { search,laborDate } = this.state
    this.setState({ loading: true });
    if (!params.ordering) {
      params.ordering = "id";
    }
    getEmployees({...params,page: params.page || 1,search,...laborDate})
      .then((res) => {
        this.setState({
          employees: res.data.results,
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

  tabChange = (key) => {
    this.setState({ key ,search:"", pagination: {
      ...this.state.pagination,
      current: 1,
      pageSize: 15,
    },laborDate: {
      start:"",
      end:"",
      start_modified:"",
      end_modified:""
    }},() => {
    switch (key) {
      case "1":
        let arr = [
          {
            title: "Labor",
            url: routes.dashboard.management.labor.self,
          },
          {
            title: "Labor Groups",
            url: routes.dashboard.management.labor.self,
          },
        ];
        this.props.setBreadcrumb(arr);
        this.fetchLaborGroups();
        break;
      case "2":
        let arr2 = [
          {
            title: "Labor",
            url: routes.dashboard.management.labor.self,
          },
          {
            title: "Employees",
            url: routes.dashboard.management.labor.self,
          },
        ];
        this.props.setBreadcrumb(arr2);
        this.fetchEmployees();
        break;
      default:
    }
  })
    // this.setState({
    //   pagination: {
    //     ...this.state.pagination,
    //     current: 1,
    //     pageSize: 15,
    //   },
    // });
  };

  componentDidMount() {
    let arr = [
      {
        title: "Labor",
        url: routes.dashboard.management.labor.self,
      },
      {
        title: "Labor Groups",
        url: routes.dashboard.management.labor.self,
      },
    ];
    this.props.setBreadcrumb(arr);
    this.fetchLaborGroups();
    this.tabChange(getTabValue());
  }

  // debounceEvent = (...args) => {
  //   this.debouncedEvent = debounce(...args);
  //   return (e) => {
  //     return this.debouncedEvent(e);
  //   };
  // };

  onSearch = (e) => {
    this.setState({search:e.target.value},() => {
    this.fetchLaborGroups();
    })
  };
  onLaborSearch = (e) => {
    this.setState({search:e.target.value},() => {
    this.fetchEmployees();
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
      params.ordering = "-modified";
    }
    this.fetchLaborGroups(params);
    // this.fetchLaborGroups({ page: pagination.current })
  };
  handleEmployeeTableChange = (pagination, filters, sorter) => {
    let symbol = "";
    if (sorter.order === "descend") symbol = "-";
    let params = {
      page: pagination.current,
    };
    if (sorter.columnKey) {
      params.ordering = `${symbol}${sorter.columnKey}`;
    } else {
      params.ordering = "id";
    }
    this.fetchEmployees(params);
    // this.fetchEmployees({ page: pagination.current })
  };
  getLocaleData = (EMPLOYEE) =>{
      return(
          <div className="col-12 no-data-card-row-new-table">
              <div className="row no-data-upload-screens no-data-second m-0 border-0">
                  <div className="col-12 text-center">
                      <img src={Images.teams_labor_no_data_icon} alt="" className="img-fluid"/>
                      <h6 className="mb-0 no-data-main-tg">{EMPLOYEE ? 'No Employees' : 'No Labor Groups'}</h6>
                  </div>
              </div>
          </div>
      )
  }

  handleFilterLabor = (data) => {
    if(data) {
      this.setState({ laborDate: { ...this.state.laborDate, ...data } }, () => {
        this.fetchLaborGroups();
      })
    }
    else {
      this.setState({ laborDate: null}, () => {
        this.fetchLaborGroups()
      })
    }
  }

  handleFilterEmployee = (data) => {
    if(data) {
      this.setState({ laborDate: { ...this.state.laborDate, ...data } }, () => {
        this.fetchEmployees();
      })
    }
    else {
      this.setState({ laborDate: null}, () => {
        this.fetchEmployees()
      })
    }
  }
  render() {
    let { loading, employees, groups, pagination } = this.state;
    return (
      <div className="main-content-div">
        <Tabs
          onChange={this.tabChange}
          className="carpet-cleaning-main-common-tab"
          activeKey={this.state.key}
        >
          <TabPane tab="Labor Groups" key="1">
            <ManagementHeader
              buttonLink={routes.dashboard.management.labor.labor_group.create}
              buttonName={"+ Create Labor Group"}
              onSearch={debounceEvent(this.onSearch,1000)}
              fetchData={(data) => this.handleFilterLabor(data)}
            />
            <div className="row mx-0 opportunities-table-main-dashboard">
              <div className="col-12">
                <div className="row">
                  <CommonTable
                    checkLaborRequired
                    data={groups}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={this.handleTableChange}
                    rowLink={routes.dashboard.management.labor.labor_group.view}
                    columns={this.laborColumns}
                    locale={!loading ? {emptyText:this.getLocaleData()} : {emptyText: " "}}
                  />
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Employees" key="2">
            <ManagementHeader
              buttonLink={routes.dashboard.management.labor.employee.create}
              buttonName={"+ Create Employee"}
              onSearch={debounceEvent(this.onLaborSearch,1000)}
              fetchData={(data) => this.handleFilterEmployee(data)}
            />
            <div className="row mx-0 opportunities-table-main-dashboard">
              <div className="col-12">
                <div className="row vehicle-table-text-center width-160-id base-rate-center">
                  <CommonTable
                    data={employees}
                    loading={loading}
                    pagination={pagination}
                    onTableChange={this.handleEmployeeTableChange}
                    rowLink={routes.dashboard.management.labor.employee.view}
                    columns={this.employeeColumns}
                    locale={!loading ? {emptyText:this.getLocaleData(true)} : {emptyText: " "}}
                  />
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(null, { setBreadcrumb })(Labor);

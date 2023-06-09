import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../Controller/Routes";
import { Image as Images } from "../../../Images";
import { withRouter } from "react-router-dom";
import { getEmployees } from "../../../../Controller/api/labourServices";
import { handleError } from "../../../../Controller/Global";

class EmployeesView extends Component {
  state = {
    employees: [],
    view: false,
    page: 1,
    total: null,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  },
  };

  employeeColumns = [
    {
      title: "EMPLOYEE ID",
      dataIndex: "id",
      sorter: "true",
      width: "30%"
    },
    {
      title: "EMPLOYEE NAME",
      dataIndex: "",
      sorter: true,
      render: (employee) => (
        <div className="d-flex align-items-center text-capitalize">
          <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
            {employee.first_name.split("")[0]}
            {employee.last_name.split("")[0]}
          </span>
          {employee.first_name}&nbsp;{employee.last_name}
        </div>
      ),
      width:"30%"
    },
    {
      title: "WAREHOUSE",
      dataIndex: "internal_location",
      sorter: true,
      render: (location) => (
        <div className="d-flex align-items-center">
          <span>{location?.name}</span>
        </div>
      ),
      width:"30%"
    },
    {
      title: "HOME LABOR GROUP",
      dataIndex: "home_group",
      sorter: true,
      render: (homegroup) => (
        <div className="d-flex align-items-center">
          <span>{homegroup && homegroup.labor_group_name}</span>
        </div>
      ),

    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone",
      sorter: true
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      width: "30%"
    },
  ];

  componentDidMount() {
    this.fetchEmployees();
    window.addEventListener("scroll", this.handleScroll);
  }

   handleScroll = () => {
    let userScrollHeight = window.innerHeight + window.scrollY;
    let windowBottomHeight = document.documentElement.offsetHeight;
    if (userScrollHeight >= windowBottomHeight) {
      if(this.state.page <= Math.floor(this.state.total/this.state.pagination.pageSize)) {
        this.setState({ page: this.state.page + 1 }, () =>
        this.getEmployees()
      );
      } 
}
};

getEmployees = () => {
  const params = {
    page: this.state.page,
  };
  
  getEmployees({...params,page: params?.page || this.state.page, group: this.props.match.params.id}).then((res) => {
    if (this.state.page === 1) {
      this.setState({ employees: res.data.results,  loading: false});
    } else {
      this.setState((prevState) => {
        return { employees: [...prevState.employees, ...res.data.results] };
      });
    }
  })
  .catch((err) => {
    handleError(err)
  })
};

  fetchEmployees = (params = {}) =>{
    this.setState({loading: true})
    getEmployees({ ...params,page: params?.page || this.state.page, group: this.props.match.params.id })
      .then((res) => {
        this.setState(prevState => {
          return {employees: res.data.results, total: res.data.count, loading: false, pagination : {
            ...prevState.pagination,
            current: params?.page || 1,
            total: res.data.count,
          },
          }
          })
      })
      .catch((err) => {
        handleError(err)
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  handleChange = (pagination) => {
    this.fetchEmployees({ page: pagination.current })

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
}


  render() {
    let { employees, total } = this.state;
    return (
      <React.Fragment>
        <div className="row mx-0 px-3 mt-30 no-data-card-row-new">
          <div className="col-12">
            <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input
                    onChange={(e) =>
                      this.fetchEmployees({ search: e.target.value })
                    }
                    placeholder="Search"
                  />
                  <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                    <img
                      src={Images.search_icon_gray}
                      className="img-fluid"
                      alt="search icon"
                    />
                  </Button>
                </Form>
              </div>
              <div className="d-flex align-items-center grid-system-div">
                <ul className="mb-0 list-inline">
                  <li className="list-inline-item w-auto">
                    Total : {total}
                  </li>
                  <li className="list-inline-item w-auto">
                    <Button
                      className={`${this.state.view ? "active" : ""}`}
                      onClick={() => this.setState({ view: true })}
                    >
                      <img
                        src={Images.list_view_icon}
                        className="img-fluid img-gray"
                        alt="list view"
                      />
                      <img
                        src={Images.list_view_icon_active}
                        className="img-fluid img-active"
                        alt="list view"
                      />
                    </Button>
                  </li>
                  <li className="list-inline-item w-auto">
                    <Button
                      className={`${!this.state.view ? "active" : ""}`}
                      onClick={() => this.setState({ view: false })}
                    >
                      <img
                        src={Images.grid_view_icon}
                        className="img-fluid img-gray"
                        alt="grid view"
                      />
                      <img
                        src={Images.grid_view_icon_active}
                        className="img-fluid img-active"
                        alt="grid view"
                      />
                    </Button>
                  </li>
                </ul>
                <Button
                  // onClick={() =>
                  //   history.push(
                  //     reverse(
                  //       routes.dashboard.management.labor.labor_group.edit,
                  //       { id: this.props.match.params.id }
                  //     )
                  //   )
                  // }
                  onClick={() =>
                    history.push({
                      pathname: reverse(routes.dashboard.management.labor.labor_group.edit,
                        { id: this.props.match.params.id }
                      ),
                      editTab: "3"
                    })
                  }
                  className="edit-btn-summary"
                >
                  <img src={Images.pencil_green} alt="" className="img-fluid" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
          <div className="col-12">
            {employees.length > 0 ? (
              !this.state.view ? (
                <div className="row px-0 summary-collapse-inner-row-main">
                  {employees.map((e) => (
                    <div
                      className="col-6 col-sm-6"
                      onClick={() =>
                        history.push(
                          reverse(
                            routes.dashboard.management.labor.employee.view,
                            { id: e.id }
                          )
                        )
                      }
                    >
                      <div className="row mx-0 align-items-center position-relative user-info-div-main opportunity-info-div-main">
                        <div className="col-12">
                          <div className="user-icons-div">
                            <span className="d-flex align-items-center justify-content-center rounded-circle text-uppercase">
                              {e.first_name.split("")[0]}
                              {e.last_name.split("")[0]}
                            </span>
                          </div>
                          <div className="user-info-div">
                            <h6>{`${e.first_name} ${e.last_name}`}</h6>
                            {/* <p className="mb-0">Operator</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-12 table-responsive main-table-div">
                  <Table
                    className="main-table-all"
                    columns={this.employeeColumns}
                    dataSource={employees}
                    size="middle"
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleChange}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          if (record) {
                            history.push(
                              reverse(
                                routes.dashboard.management.labor.employee.view,
                                { id: record.id }
                              )
                            );
                          }
                        },
                      };
                    }}
                    //  loading={loading}
                  />
                </div>
              )
            ) : (
              <div className="row mx-0 mt-3 no-data-card-row align-items-center justify-content-center">
                <div className="col-12 text-center">
                  <img
                    src={Images.staff_icon_gray}
                    alt=""
                    className="img-fluid"
                  />
                  <h6 className="mb-0 color-gray-3">No Employees</h6>
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(EmployeesView);

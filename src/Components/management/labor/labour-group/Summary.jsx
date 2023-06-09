import React, { Component } from "react";
import { Button, Collapse, Form, Input, Table } from "antd";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../Controller/Routes";
import { Image as Images } from "../../../Images";
import { withRouter } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import { getEmployees } from "../../../../Controller/api/labourServices";
import { handleError } from "../../../../Controller/Global";
import WageInfoTableMain from "../Create/labor-create-all/WageInfoTableMain";
import { getShortName } from "../../../../Controller/utils";

const { Panel } = Collapse;

class Summary extends Component {
  state = {
    employees: [],
    view: false,
  };

  employeeColumns = [
    {
      title: "EMPLOYEE ID",
      dataIndex: "id",
      sorter: true,
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
      title:"WAREHOUSE",
      dataIndex:"internal_location",
      sorter:true,
      render:(location) => (
        <div className="d-flex align-items-center text-capitalize">
          {location?.name}
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
      width:"30%"
    },

    {
      title: "PHONE NUMBER",
      dataIndex: "phone",
      sorter: true,
      width: "30%"
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
  ];

  componentDidMount() {
    this.fetchEmployees();
  }

  fetchEmployees = (params) => {
    getEmployees({ ...params, group: this.props.match.params.id })
      .then((res) => {
        this.setState({ employees: res.data.results , total: res.data.count});
        // console.log(this.state.employees, "employee data");
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { group } = this.props;
    return (
      <React.Fragment>
        <div className="col-12 mt-30">
          <div className="row mx-0 summary-info-inner-row">
            <div className="col-12">
              <Collapse
                // accordion
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        General Information <sup>*</sup>
                      </span>
                      <Button
                        // onClick={() =>
                        //   history.push(
                        //     reverse(
                        //       routes.dashboard.management.labor.labor_group
                        //         .edit,
                        //       { id: this.props.match.params.id }
                        //     )
                        //   )
                        // }
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.management.labor.labor_group.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "1"
                          })

                        }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="1"
                >
                  <div className="row summary-collapse-inner-row-main">
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">Region</h6>
                      <h5>{group.region.title}</h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">User Group Name</h6>
                      <h5 className="mb-0">{group.labor_group_name}</h5>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                      <h6 className="text-uppercase">Type</h6>
                      <h5 className="mb-0 text-capitalize">
                        {group.union_type.split('_').join(" ").toLowerCase()}
                      </h5>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Wage Information</span>
                      <Button
                           onClick={() =>
                            history.push({
                              pathname: reverse(routes.dashboard.management.labor.labor_group.edit,
                                { id: this.props.match.params.id }
                              ),
                              editTab: "2"
                            })
                          }
                        className="edit-btn-summary"
                      >
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="2"
                >
                  <div className="row mt-3 mb-3">
                    <div className="col-12 col-sm-12 col-md-11 mx-auto">
                      <WageInfoTableMain viewOnly labors={group.table_data} />
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Employees</span>
                      <Button
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
                        <img
                          src={Images.pencil_green}
                          alt=""
                          className="img-fluid"
                        />
                        Edit
                      </Button>
                    </div>
                  }
                  key="3"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="search-bar-div">
                        <Form className="position-relative">
                          <Input
                            onChange={(e) =>
                              this.fetchEmployees({ search: e.target.value })
                            }
                            placeholder="Search Employees"
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
                            Total : {this.state.total}
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
                          onClick={this.props.tabChange}
                          className="view-all-btn text-uppercase"
                        >
                          VIEW ALL{" "}
                        </Button>
                      </div>
                    </div>
                    {this.state.employees.length > 0 ? (
                      !this.state.view ? (
                        <div className="row summary-collapse-inner-row-main px-0">
                          {this.state.employees.map((item) => {
                           const isHomeGroup =  item.labors?.find((i) => i.id === item.home_group?.id);
                            return (
                            <div
                              className="col-6 col-sm-6"
                              onClick={() =>
                                history.push(
                                  reverse(
                                    routes.dashboard.management.labor.employee
                                      .view,
                                    { id: item.id }
                                  )
                                )
                              }
                            >
                              <div className={`row mx-0 align-items-center position-relative user-info-div-main opportunity-info-div-main ${isHomeGroup && "active"}`}>
                                <div className="col-12 d-flex">
                                  <div className="user-icons-div">
                                    <span className="assign-tag-card d-flex align-items-center justify-content-center text-uppercase rounded-circle">
                                      {getShortName(item.first_name, item.last_name)}
                                    </span>
                                  </div>
                                  <div className="user-info-div d-flex align-items-center">
                                    <h6>{`${item.first_name} ${item.last_name}`}</h6>
                                    {isHomeGroup &&
                                    <p>
                                      <span className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
                                        Home labor group 
                                      </span>
                                    </p>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )})}
                        </div>
                      ) : (
                        <div className="col-12 table-responsive main-table-div">
                          <Table
                            className="main-table-all"
                            columns={this.employeeColumns}
                            dataSource={this.state.employees}
                            size="middle"
                            pagination={false}
                            onRow={(record) => {
                              return {
                                onClick: () => {
                                  if (record) {
                                    history.push(
                                      reverse(
                                        routes.dashboard.management.labor
                                          .employee.view,
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
                      <div className="row mx-0 no-data-card-row mt-3 align-items-center justify-content-center">
                        <div className="col-12 text-center">
                          <img
                            src={Images.Labor_empty_state_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 color-gray-3">No Employees</h6>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Summary);

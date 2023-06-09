import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../Controller/Routes";
import { Image as Images } from "../../../Images";
import { withRouter } from "react-router-dom";
import {
  getEmployeeById,
  getLaborGroup,
} from "../../../../Controller/api/labourServices";
import { handleError } from "../../../../Controller/Global";
import moment from "moment";

class EmpLaborGroups extends Component {
  state = {
    labor: [],
    employee: [],
    laborGroup: [],
    view: false,
  };

  laborGroupColumns = [
    {
      title: "LABOR GROUP NAME",
      dataIndex: "labor_group_name",
      sorter: true,
      render: (laborGroup, record) => (
        <div className="d-flex align-items-center">
          {laborGroup}
          <span className="point-details font-weight-bold position-absolute m-auto d-flex align-items-center">
            {record.id === this.state.employee.home_group.id
              ? "(HOME LABOR GROUP)"
              : ""}
          </span>
        </div>
      ),
    },
    {
      title: "TYPE",
      dataIndex: "union_type",
      sorter: true,
    },
    {
      title: "REGION",
      dataIndex: "region",
      sorter: true,
      render: (region) => (
        <div className="d-flex align-items-center">
          <span>{region.title}</span>
        </div>
      ),
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employee",
      sorter: true,
    },
    {
      title: "LAST ACTIVITY DATE",
      dataIndex: "modified",
      sorter: true,
      render: (modified) => (
        <div className="d-flex align-items-center">
          {moment(modified).format("MMM DD YYYY hh:mm A")}
        </div>
      ),
    },
  ];

  componentDidMount() {
    getEmployeeById(this.props.match.params.id)
      .then((res) => {
        this.setState({ labor: res.data.labors, employee: res.data });
      })
      .catch((err) => {
        handleError(err);
      });
    this.fetchLaborGroups();
  }

  fetchLaborGroups = (params) => {
    getLaborGroup({ ...params, employee: this.props.match.params.id })
      .then((res) => {
        this.setState({ laborGroup: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    const { employee, labor } = this.state;
    return (
      <React.Fragment>
        <div className="row mx-0 pt-0 pb-0 summary-collapse-inner-row-main">
          <div className="col-12 mt-30">
            <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ">
              <div className="search-bar-div">
                <Form className="position-relative">
                  <Input
                    placeholder="Search"
                    onChange={(e) =>
                      this.fetchLaborGroups({ search: e.target.value })
                    }
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
                    Total : {this.state.laborGroup.length}
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
                  onClick={() =>
                    history.push({
                      pathname: reverse(
                        routes.dashboard.management.labor.employee.edit,
                        { id: this.props.match.params.id }
                      ),
                      editTab: "5",
                    })
                  }
                  className="edit-btn-summary ml-2"
                >
                  <img src={Images.pencil_green} alt="" className="img-fluid" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="row summary-collapse-inner-row-main">
            {/* {labor.map(item => ( */}
            {!this.state.view ? (
              this.state.laborGroup.map((item) => (
                <div className="col-6 col-sm-6">
                  <div
                    className={`row mx-0 align-items-center position-relative user-info-div-main  opportunity-info-div-main ${
                      employee?.home_group?.id === item?.id ? "isActive" : ""
                    }`}
                  >
                    <div className="col-12">
                      <div className="user-icons-div position-relative">
                        <img
                          src={
                            employee.home_group
                              ? employee.home_group.id === item.id
                                ? Images.person_group_green_icon
                                : Images.person_group_black_icon
                              : Images.person_group_black_icon
                          }
                          alt={""}
                          className="img-fluid black-icon-emp"
                        />
                        <img
                          src={Images.person_group_green_icon}
                          alt={""}
                          className="img-fluid green-icon-emp position-absolute"
                        />
                      </div>
                      <div className="user-info-div">
                        <h6>{item.labor_group_name}</h6>
                        <p className="mb-0">{item.region.title}</p>
                      </div>
                    </div>
                    {employee.home_group ? (
                      employee.home_group.id === item.id ? (
                        <div className="home-labor-group home-labor-group-2 text-capitalize position-absolute">
                          Home Labor group
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 table-responsive main-table-div mt-3">
                <Table
                  className=" border-0 carpet-cleaning-table"
                  columns={this.laborGroupColumns}
                  dataSource={this.state.laborGroup}
                  size="middle"
                  pagination={true}
                  //  loading={loading}
                />
              </div>
            )}
          </div>
          {/*<div*/}
          {/*    className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">*/}
          {/*    <div className="col-12 text-center">*/}
          {/*        <img src={Images.billing_gray_no_data_icon} alt="" className="img-fluid"/>*/}
          {/*        <h6 className="mb-0 color-gray-3">Labor Group Name</h6>*/}
          {/*    </div>*/}
          {/*</div>*/}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(EmpLaborGroups);

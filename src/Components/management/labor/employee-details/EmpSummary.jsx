import React, { Component } from "react";
import {
  Button,
  Collapse,
  Form,
  Input,
  Select,
  Spin,
  Table,
  Upload,
} from "antd";
import { withRouter } from "react-router-dom";
import { history } from "../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../Controller/Routes";
import { Image as Images } from "../../../Images";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  createEmployeeDoc,
  getEmployeeById,
  getEmployeeDoc,
  getLaborGroup,
} from "../../../../Controller/api/labourServices";
import { handleError } from "../../../../Controller/Global";
import { formatFileSize, formatPhone } from "../../../../Controller/utils";
import WageInfoTableMain from "../Create/labor-create-all/WageInfoTableMain";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../Store/actions/breadcrumbAction";
import moment from "moment";

const { Panel } = Collapse;
const { Option, OptGroup } = Select;

class EmpSummary extends Component {
  state = {
    data: [],
    files: [],
    employee: null,
    view: false,
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
    laborGroup: [],
  };
  docsColumns = [
    {
      title: "name",
      dataIndex: "name",
      sorter: true,
      render: (data) => (
        <div>
          <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          <span className="ml-2">{data}</span>
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      sorter: true,
      render: (data) => <div>{formatFileSize(data)}</div>,
    },
    {
      title: "FILE Format",
      dataIndex: "format",
      sorter: true,
    },
  ];

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
    if (this.props.match.params.id) {
      getEmployeeById(this.props.match.params.id)
        .then((res) => {
          let arr = [
            {
              title: "Labor",
              url: routes.dashboard.management.labor.self,
            },
            {
              title: "Employee",
              url: routes.dashboard.management.labor.self,
            },
            { title: `${res.data.first_name} ${res.data.last_name}`, url: "#" },
          ];
          this.props.setBreadcrumb(arr);
          this.setState({ employee: res.data });
        })
        .catch((err) => {
          handleError(err);
        });
      this.getFiles();
      this.fetchLaborGroups();
    }
  }

  getFiles = (params = {}) => {
    getEmployeeDoc({ ...params, employee: this.props.match.params.id })
      .then((res) => {
        this.setState({ files: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  uploadFile = (data) => {
    let file = data.file;
    let form_data = new FormData();
    form_data.append("employee", this.props.match.params.id);
    form_data.append("document", file);
    createEmployeeDoc(form_data)
      .then((res) => {
        this.getFiles();
      })
      .catch((err) => {
        handleError(err);
      });
  };

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
    let { employee } = this.state;
    if (!employee) {
      return (
        <div className="text-center my-4">
          <Spin />
        </div>
      );
    }
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
                      <span>General Information</span>
                      <Button
                        // onClick={() =>
                        //   history.push(
                        //     reverse(
                        //       routes.dashboard.management.labor.employee.edit,
                        //       { id: this.props.match.params.id }
                        //     )
                        //   )
                        // }
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.management.labor.employee.edit,
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
                    <div className="col-12">
                      {/* <div className="row">
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-15-bt">
                                                    <h6 className="text-uppercase">Base rate</h6>
                                                    <h5>{employee.base_rate}</h5>
                                                </div>
                                            </div> */}
                      <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <h6 className="text-uppercase">EMPLOYEE ID</h6>
                          <h5>{employee.id}</h5>
                        </div>
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <h6 className="text-uppercase">payroll ID</h6>
                          <h5>{employee.payroll_id}</h5>
                        </div>
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <h6 className="text-uppercase">Company Code</h6>
                          <h5>{employee.company_code || "-"}</h5>
                        </div>
                                {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                  <h6 className="text-uppercase">Salutation</h6>
                                  <h5 className="mb-0">{employee.salutation}</h5>
                                </div> */}
                            </div>
                            <div className="row">
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
                          <h6 className="text-uppercase">FIRST NAME</h6>
                          <h5 className="mb-0">{employee.first_name}</h5>
                        </div>
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
                          <h6 className="text-uppercase">Middle NAME</h6>
                          <h5 className="mb-0">{employee.middle_name || "-"}</h5>
                        </div>
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
                          <h6 className="text-uppercase">Last Name</h6>
                          <h5 className="mb-0">{employee.last_name}</h5>
                        </div>
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
                          <h6 className="text-uppercase">Suffix</h6>
                          <h5 className="mb-0">{employee.suffix || "-"}</h5>
                        </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Address & Contact Information <sup>*</sup>
                      </span>
                      <Button
                       onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.management.labor.employee.edit,
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
                  <div className="row summary-collapse-inner-row-main">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                          <h6 className="text-uppercase">ADDRESS</h6>
                          <h5 className="mb-0">{`${employee.street || ""} ${
                            employee.apartment || ""
                          } ${employee.city || ""} ${employee.state || ""} ${
                            employee.zip_code || ""
                          } ${employee.country || ""}`}</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                          <h5 className="mb-0">{employee.email}</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                          <h6 className="text-uppercase">PHONE NUMBER</h6>
                          <h5 className="mb-0">
                            {formatPhone(employee.phone)}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Warehouse <sup>*</sup>
                      </span>

                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.management.labor.employee.edit,
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
                  <div className="row mx-0">
                    <div className="col-12">
                      <div className="row summary-collapse-inner-row-main px-0">
                        <div className="col-12">
                          {employee.internal_location ? (
                            <div className="row site-details-row-card position-relative">
                              <div className="col-12 col-sm-3 title">
                                <div className="site-name-location">
                                  <img
                                    src={Images.location_gray}
                                    alt=""
                                    className="img-fluid"
                                  />
                                  <span>{employee.internal_location.name}</span>
                                </div>
                              </div>
                              <div className="col-12 col-sm-3">
                                <h6 className="text-uppercase">ADDRESS</h6>
                                <p className="mb-0">{`${employee.internal_location.street_address} ${employee.internal_location.city}
                                                                 ${employee.internal_location.state} ${employee.internal_location.zip} ${employee.internal_location.country}`}</p>
                              </div>
                              <div className="col-12 col-sm-3">
                                <h6 className="text-uppercase">
                                  EMAIL ADDRESS
                                </h6>
                                <p className="mb-0">
                                  {employee.internal_location.email}
                                </p>
                              </div>
                              <div className="col-12 col-sm-3">
                                <h6 className="text-uppercase">PHONE NUMBER</h6>
                                <p className="mb-0">
                                  {formatPhone(
                                    employee.internal_location.phone
                                  )}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="row mx-0 no-data-card-row align-items-center bg-transparent justify-content-center">
                              <div className="col-12 text-center">
                                <img
                                  alt={""}
                                  className="img-fluid"
                                  src={Images.location_gray}
                                />
                                <h6 className="mb-0">No Warehouse</h6>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                          pathname: reverse(routes.dashboard.management.labor.employee.edit,
                            { id: this.props.match.params.id }
                          ),
                          editTab: "4"
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
                  key="4"
                >
                  {employee.table_data ? (
                    <div className="col-12">
                      <div className="row mx-0">
                        <div className="col-12">
                          <WageInfoTableMain
                            viewOnly
                            labors={employee.table_data || []}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-12">
                      <div className="row mx-0 no-data-card-row align-items-center bg-transparent justify-content-center">
                        <div className="col-12 text-center">
                          <img
                            src={Images.billing_empty_state_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 color-gray-3">
                            No Wage Information
                          </h6>
                        </div>
                      </div>
                    </div>
                  )}
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Labor Groups</span>
                      <Button
                       onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.management.labor.employee.edit,
                            { id: this.props.match.params.id }
                          ),
                          editTab: "5"
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
                  key="5"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
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
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item">
                            Total : {this.state.laborGroup.length}
                          </li>
                          <li className="list-inline-item">
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
                          <li className="list-inline-item">
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
                          onClick={() => this.props.tabChange("2")}
                          className="view-all-btn text-uppercase"
                        >
                          VIEW ALL{" "}
                        </Button>
                      </div>
                    </div>
                    {/* {employee.labors.length > 0 ? */}
                    {this.state.laborGroup.length > 0 ? (
                      !this.state.view ? (
                        <div className="row summary-collapse-inner-row-main px-0 summary-collapse-inner-row-main-scroll">
                          {this.state.laborGroup.map((e) => (
                            /* {employee.labors.map(e => ( */
                            <div className={"col-6 col-sm-6"}>
                              <div
                                // add active in class name to show active div
                                className={
                                  employee.home_group
                                    ? employee.home_group.id === e.id
                                      ? "row mx-0 align-items-center position-relative user-info-div-main  opportunity-info-div-main home-group-row-div-bg"
                                      : "row mx-0 align-items-center position-relative user-info-div-main  opportunity-info-div-main"
                                    : "row mx-0 align-items-center position-relative user-info-div-main  opportunity-info-div-main"
                                }
                              >
                                <div className="col-12">
                                  <div className="user-icons-div position-relative">
                                    <img
                                      src={
                                        employee.home_group
                                          ? employee.home_group.id === e.id
                                            ? Images.person_group_green_icon
                                            : Images.person_group_black_icon
                                          : Images.person_group_black_icon
                                      }
                                      alt={""}
                                      className="img-fluid black-icon-emp"
                                    />
                                    {/* <img src={Images.person_group_green_icon} alt={""}
                                                                        className="img-fluid green-icon-emp position-absolute" /> */}
                                  </div>
                                  <div className="user-info-div">
                                    <h6>{e.labor_group_name}</h6>
                                    <p className="mb-0">{e.region.title}</p>
                                  </div>
                                </div>
                                {employee.home_group ? (
                                  employee.home_group.id === e.id ? (
                                    <div className="home-labor-group position-absolute home-labor-group-employee-view">
                                      Home Labor Group
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
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
                      )
                    ) : (
                      <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                        <div className="col-12 text-center">
                          <img
                            src={Images.Labor_empty_state_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 color-gray-3">
                            No Labor Groups
                          </h6>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Documents</span>
                    </div>
                  }
                  key="6"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="search-bar-div d-flex align-items-center">
                        <Form className="position-relative">
                          {/* <Input /> */}
                          <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                            <img
                              src={Images.search_icon_gray}
                              className="img-fluid"
                              alt="search icon"
                            />
                          </Button>
                        </Form>
                        <Upload
                          showUploadList={false}
                          customRequest={this.uploadFile}
                        >
                          <Button className="add-btn-collapse ml-2 text-capitalize">
                            + Upload
                          </Button>
                        </Upload>
                      </div>
                      <Button
                        onClick={() => this.props.tabChange("3")}
                        className="view-all-btn text-uppercase"
                      >
                        VIEW ALL{" "}
                      </Button>
                    </div>
                    <div className="row summary-collapse-inner-row-main px-0 pb-0">
                      <div className="col-12 table-responsive main-table-div">
                        {this.state.files.length > 0 ? (
                          <Table
                            pagination={true}
                            loading={this.state.loading}
                            className="main-table-all"
                            columns={this.docsColumns}
                            dataSource={this.state.files}
                            size="middle"
                            // locale={{
                            //     emptyText:
                            //         (<div style={{textAlign: "center"}}>
                            //                 <img src={Images.cloud_upload_icon} alt={"cloud icon"}
                            //                      style={{width: 40}}/>
                            //                 <p style={{textAlign: "center", color: "#38BC94"}}> Upload
                            //                     Document </p>
                            //             </div>
                            //         )
                            // }}
                          />
                        ) : (
                          <div className="documents-upload-height d-flex align-items-center justify-content-center w-100">
                            <Upload
                              showUploadList={false}
                              customRequest={this.uploadFile}
                            >
                              <Button className="bg-transparent border-0 p-0 shadow-none h-auto">
                                <img
                                  src={Images.cloud_upload_24}
                                  alt={"cloud icon"}
                                  className={"img-fluid"}
                                />
                                <p
                                  style={{
                                    textAlign: "center",
                                    color: "#38BC94",
                                  }}
                                >
                                  {" "}
                                  Upload Document{" "}
                                </p>
                              </Button>
                            </Upload>
                          </div>
                        )}
                      </div>
                    </div>
                    {/*<div*/}
                    {/*    className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">*/}
                    {/*    <div className="col-12 text-center">*/}
                    {/*        <img src={Images.staff_icon_gray} alt="" className="img-fluid"/>*/}
                    {/*        <h6 className="mb-0 color-gray-3">No Employees</h6>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
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

export default withRouter(connect(null, { setBreadcrumb })(EmpSummary));

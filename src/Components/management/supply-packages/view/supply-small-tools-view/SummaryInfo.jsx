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
import { Image as Images } from "../../../../Images";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  createSupplyDoc,
  getSupplyById,
  getSupplyDoc,
  getSupplyGroupById,
} from "../../../../../Controller/api/supplyServices";
import { handleError } from "../../../../../Controller/Global";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";
import { history } from "../../../../../Controller/history";
import {
  formatFileSize,
  formatMoney,
  formatPhone,
} from "../../../../../Controller/utils";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";

const { Panel } = Collapse;
const { Option, OptGroup } = Select;

class SummaryInfo extends Component {
  state = {
    supply: null,
    group: null,
    loading: true,
    files: [],
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
      render: (data) => <div>{formatFileSize(data)}</div>,
      sorter: true,
    },
    {
      title: "FILE Format",
      dataIndex: "format",
      sorter: true,
    },
  ];

  componentDidMount() {
    this.setState({ loading: true });
    if (this.props.match.params.id) {
      getSupplyById(this.props.match.params.id)
        .then((res) => {
          let arr = [
            {
              title: "Supply/Small Tools",
              url: routes.dashboard.management.supply_tools.self,
            },
            {
              title: "Supply/Small Tools",
              url: routes.dashboard.management.supply_tools.self,
            },
            {
              title: res.data.name,
              url: "#",
            },
          ];
          this.props.setBreadcrumb(arr);
          let calculated = {
            per_day_dpr: (
              res.data.purchase_price /
                res.data.estimate_life /
                res.data.estimate_days || 0
            ).toFixed(2),
            insurance_per_day: (
              res.data.annual_insurance_premium / res.data.estimate_days || 0
            ).toFixed(2),
            // fuel_per_day: ((res.data.annual_premium / res.data.average_gallon) || 0).toFixed(2),
            reg_per_day: (
              res.data.annual_registration_fee / res.data.estimate_days || 0
            ).toFixed(2),
            permit_per_day: (
              res.data.annual_permit_fee / res.data.estimate_days || 0
            ).toFixed(2),
            maintenance_per_day: (
              res.data.maintenance_per_year / res.data.estimate_days || 0
            ).toFixed(2),
            other_cost_per_day: (
              res.data.other_cost_per_year / res.data.estimate_days || 0
            ).toFixed(2),
          };
          let total = Object.keys(calculated)
            .reduce((sum, key) => sum + parseFloat(calculated[key] || 0), 0)
            .toFixed(2);
          getSupplyGroupById(res.data.supply_group).then((response) => {
            this.setState({
              supply: { ...res.data, ...calculated },
              total,
              loading: false,
              group: response.data,
            });
          });
          // this.setState({supply: res.data})
        })
        .catch((err) => {
          handleError(err);
          this.setState({ loading: false });
        });
      this.getFiles();
    }
  }

  getFiles = (params = {}) => {
    getSupplyDoc({ ...params, supply: this.props.match.params.id })
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
    form_data.append("supply", this.props.match.params.id);
    form_data.append("document", file);
    createSupplyDoc(form_data)
      .then((res) => {
        this.getFiles();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { supply, loading } = this.state;
    if (loading) {
      return (
        <div className="row">
          <div className="col-12 text-center">
            <Spin />
          </div>
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="col-12">
          <div className="row mx-0 summary-info-inner-row ">
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
                        //       routes.dashboard.management.supply_tools
                        //         .supply_tools.edit,
                        //       { id: this.props.match.params.id }
                        //     )
                        //   )
                        // }
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.management.supply_tools.supply_tools.edit,
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
                      <div className="row">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                          <h6 className="text-uppercase">supply ID</h6>
                          <h5 className="mb-0">{supply.id}</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                          <h6 className="text-uppercase">
                            supply / small tool name
                          </h6>
                          <h5 className="mb-0">{supply.name}</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                          <h6 className="text-uppercase">supply group</h6>
                          <h5 className="mb-0">{supply.supply_group.name}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Supply/Small Tools Calculations <sup>*</sup>
                      </span>
                      <Button
                       onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.management.supply_tools.supply_tools.edit,
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
                  key="2"
                >
                  <div className="col-12 p-0">
                    <div className="row mx-0 new-opportunity-header-row border-left-0 border-right-0 account-tabs-min summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header ">
                      <div className="col-12">
                          <div className="row pt-2 pb-1">
                              <div className="total_cost_per">Total Cost per Day</div>
                              <div className="total_cost_per_count">
                                  {formatMoney(this.state.total)}
                              </div>
                          </div>
                      </div>
                      <div className="col-12">
                          <div className="row pt-1 pb-2">
                              <div className="total_cost_per">Total Cost Per Hour</div>
                              <div className="total_cost_per_count">
                                  {
                                 `$ ${parseFloat(formatMoney(this.state.total / supply?.average_hours).slice(1)).toFixed(2)}
  `}
                              </div>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row summary-collapse-inner-row-main">
                      <div className="col-12">
                        <div className="row summary-view-row-vehicle">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h5>Per Day Depreciation</h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">Per Day Depr</h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.per_day_dpr || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                            <h6 className="text-uppercase">
                              Estimated Days of use per Year
                            </h6>
                            <h5 className="mb-0">
                              {supply.estimate_days || "-"}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt offset-lg-4">
                            <h6 className="text-uppercase">
                              Estimated Life (Years)
                            </h6>
                            <h5 className="mb-0">
                              {supply.estimate_life || "-"}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                            <h6 className="text-uppercase">
                              Average Hours Per Day
                            </h6>
                            <h5 className="mb-0">
                              {supply.average_hours || "-"}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                            <h6 className="text-uppercase">Purchase Cost</h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.purchase_price || "0")}
                            </h5>
                          </div>
                        </div>

                        <div className="row summary-view-row-vehicle">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h5>Insurance Cost</h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Insurance Per Day
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.insurance_per_day || "-")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Annual Insurance Premium
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(
                                supply.annual_insurance_premium || "-"
                              )}
                            </h5>
                          </div>
                        </div>
                        <div className="row summary-view-row-vehicle">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h5>Registration Cost</h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Registration Per Day
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.reg_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Annual Registration Fee
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(
                                supply.annual_registration_fee || "-"
                              )}
                            </h5>
                          </div>
                        </div>
                        <div className="row summary-view-row-vehicle">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h5>Permit Cost</h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">Permit Per Day</h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.permit_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Annual Permit Fee
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.annual_permit_fee || "-")}
                            </h5>
                          </div>
                        </div>
                        <div className="row summary-view-row-vehicle">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h5>Maintenance Cost</h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Maintenance Per Day
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.maintenance_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Maintenance Per Year
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.maintenance_per_year || "-")}
                            </h5>
                          </div>
                        </div>
                        <div className="row summary-view-row-vehicle border-0">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h5>Other Cost</h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">Other Per Day</h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.other_cost_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">Other Per Year</h6>
                            <h5 className="mb-0">
                              {formatMoney(supply.other_cost_per_year || "0")}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Warehouse</span>

                      <Button
                       onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.management.supply_tools.supply_tools.edit,
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
                  key="3"
                >
                  <div className="row mx-0">
                    <div className="col-12">
                      <div className="row summary-collapse-inner-row-main px-3">
                        <div className="col-12">
                          {supply.internal_location ? (
                            <div className="row site-details-row-card position-relative">
                              <div className="col-12 col-sm-3 title">
                                <div className="site-name-location">
                                  <img
                                    src={Images.location_gray}
                                    alt=""
                                    className="img-fluid"
                                  />
                                  <span>{supply.internal_location.name}</span>
                                </div>
                              </div>
                              <div className="col-12 col-sm-3">
                                <h6 className="text-uppercase">ADDRESS</h6>
                                <p className="mb-0">{`${supply.internal_location.street_address} ${supply.internal_location.city} 
                                                                    ${supply.internal_location.state} ${supply.internal_location.zip} ${supply.internal_location.country}`}</p>
                              </div>
                              <div className="col-12 col-sm-3">
                                <h6 className="text-uppercase">
                                  EMAIL ADDRESS
                                </h6>
                                <p className="mb-0">
                                  {supply.internal_location.email}
                                </p>
                              </div>
                              <div className="col-12 col-sm-3">
                                <h6 className="text-uppercase">PHONE NUMBER</h6>
                                <p className="mb-0">
                                  {formatPhone(supply.internal_location.phone)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="row mx-0 no-data-card-row no-data-card-row-2 align-items-center justify-content-center">
                              <div className="col-12 text-center">
                                <img
                                  alt={""}
                                  className="img-fluid"
                                  src={Images.location_gray}
                                />
                                <h6 className="mb-0">No Internal Locations</h6>
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
                      <span>Documents</span>
                    </div>
                  }
                  key="5"
                >
                  <div className="col-12">
                    <div className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="search-bar-div d-flex align-items-center">
                        <Form className="position-relative">
                          <Input
                            onChange={(e) =>
                              this.getFiles({ search: e.target.value })
                            }
                            placeholder="Search "
                          />
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
                        onClick={() => this.props.tabChange("2")}
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
                                  className="img-fluid"
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

export default connect(null, { setBreadcrumb })(withRouter(SummaryInfo));

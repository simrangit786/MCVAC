import React, { Component } from "react";
import { Breadcrumb, Button, Collapse, Form, Input, Spin, Table } from "antd";
import { Image as Images, Image } from "../../../../Images";
import { CaretRightOutlined } from "@ant-design/icons";
import { handleError } from "../../../../../Controller/Global";
import {
  getSupply,
  getSupplyGroupById,
} from "../../../../../Controller/api/supplyServices";
import { Link, withRouter } from "react-router-dom";
import { history } from "../../../../../Controller/history";
import { routes } from "../../../../../Controller/Routes";
import { reverse } from "named-urls";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../Store/actions/breadcrumbAction";
import {
  formatMoney,
  supplyTotalCostCalculation,
  checkSupplyFieldRequired,
} from "../../../../../Controller/utils";

const { Panel } = Collapse;

class SupplySummary extends Component {
  state = {
    data: null,
    loading: true,
    view: false,
    supply: [],
    total: 0,
    requiredFields: true
  };

  supplyColumns = [
    {
      title: "SUPPLY ID",
      dataIndex: "id",
      sorter: true,
    },
    {
      title: "SUPPLY NAME",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "WAREHOUSE",
      dataIndex: "internal_location",
      sorter: true,
      render: (location) => (
          <div className="d-flex align-items-center">
          <span>{location?.name}</span>
      </div> 
      )
  },
    {
      title: "SUPPLY GROUP",
      dataIndex: "supply_group",
      sorter: true,
      render: (supply) => (
        <div className="d-flex align-items-center">
          <span>{supply.name}</span>
        </div>
      ),
    },
    {
      title: "TOTAL COST/DAY",
      dataIndex: "",
      sorter: true,
      render: (data) => supplyTotalCostCalculation(data),
    },
  ];

  componentDidMount() {
    this.setState({ loading: true });
    getSupplyGroupById(this.props.match.params.id)
      .then((res) => {
        let arrGrp = [
          {
            title: "Supply/Small Tools",
            url: routes.dashboard.management.supply_tools.self,
          },
          {
            title: "Supply Groups",
            url: routes.dashboard.management.supply_tools.self,
          },
          { title: res.data.name, url: "#" },
        ];
        this.props.setSupplyGroup(res.data)
        this.props.setBreadcrumb(arrGrp);
        let calculated = {
          per_day_dpr: (
            res.data.purchase_price /
              res.data.estimate_life /
              res.data.estimated_days || 0
          ).toFixed(2),
          insurance_per_day: (
            res.data.annual_premium / res.data.estimated_days || 0
          ).toFixed(2),
          // fuel_per_day: ((res.data.annual_premium / res.data.average_gallon) || 0).toFixed(2),
          reg_per_day: (
            res.data.annual_registration_fee / res.data.estimated_days || 0
          ).toFixed(2),
          permit_per_day: (
            res.data.annual_permit_fee / res.data.estimated_days || 0
          ).toFixed(2),
          maintenance_per_day: (
            res.data.maintenance_per_year / res.data.estimated_days || 0
          ).toFixed(2),
          other_cost_per_day: (
            res.data.other_cost_per_year / res.data.estimated_days || 0
          ).toFixed(2),
        };
        let total = Object.keys(calculated)
          .reduce((sum, key) => sum + parseFloat(calculated[key] || 0), 0)
          .toFixed(2);
        this.setState({
          data: { ...res.data, ...calculated },
          total: total,
          loading: false,
          },() => {
            this.setState({requiredFields: checkSupplyFieldRequired(this.state.data)})
          }
        );
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
    this.fetchSupplyTools();
  }

  fetchSupplyTools = (params = {}) => {
    getSupply({ ...params, supply_group: this.props.match.params.id })
      .then((res) => {
        this.setState({ supply: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let { data, loading } = this.state;
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
       <div className="col-12 mt-30">
          <div className="row mx-0 summary-info-inner-row"> 
          {/* {this.state.requiredFields && (
              <div className="row mx-0 info-gray-div info-red-div align-items-center">
                <h6 className="mb-0">
                  Please complete all required information to avoid issues
                </h6>
                </div>
            )}  */}
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
                        //         .supply_groups.edit,
                        //       { id: this.props.match.params.id }
                        //     )
                        //   )
                        // }
                        onClick={() =>
                          history.push({
                            pathname: reverse(routes.dashboard.management.supply_tools.supply_groups.edit,
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
                        <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                          <h6 className="text-uppercase">Supply Group Name</h6>
                          <h5 className="mb-0">{data?.name}</h5>
                        </div>
                        {/* <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                                                    <h6 className="text-uppercase">Unit of measurement</h6>
                                                    <h5 className="mb-0 text-capitalize">{data.measurement_unit?.toLowerCase() || "-"}</h5>
                                                </div> */}
                        <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                          <h6 className="text-uppercase">
                            Supply Family / tier
                          </h6>
                          {/* <h5 className="mb-0">{data.parent.name}</h5> */}
                          {
                            <Breadcrumb
                              separator={
                                <img
                                  src={Image.arrow_small_breadcrumb}
                                  alt={""}
                                  className="img-fluid"
                                />
                              }
                            >
                              {data.breadcrumb.map((name) => {
                                return (
                                  <Breadcrumb.Item key={name}>
                                    <Link>{name}</Link>
                                  </Breadcrumb.Item>
                                );
                              })}
                              <Breadcrumb.Item key={data.name}>
                                <Link>{data.name}</Link>
                              </Breadcrumb.Item>
                            </Breadcrumb>
                          }
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                           <h6 className="text-uppercase">Margin</h6>
                           <h5 className="mb-0 text-capitalize">{data?.margin ? `${data?.margin}%` : "-"}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        Supply Group Calculations <sup>*</sup>
                      </span>
                      <Button
                       onClick={() =>
                        history.push({
                          pathname: reverse(routes.dashboard.management.supply_tools.supply_groups.edit,
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
                                  {`$ ${parseFloat(formatMoney((this.state.total / data?.average_hours) || "0").slice(1)).toFixed(2)}`}
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
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                            <h6 className="text-uppercase">Per Day Depr</h6>
                            <h5 className="mb-0">
                              {formatMoney(data.per_day_dpr || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                            <h6 className="text-uppercase">
                              Estimated Days of use per Year
                            </h6>
                            <h5 className="mb-0">
                              {data.estimated_days || "-"}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt offset-lg-4">
                            <h6 className="text-uppercase">
                              Estimated Life (Years)
                            </h6>
                            <h5 className="mb-0">
                              {data.estimate_life || "-"}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                            <h6 className="text-uppercase">
                              Average Hours Per Day
                            </h6>
                            <h5 className="mb-0">
                              {data.average_hours || "-"}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                            <h6 className="text-uppercase">Purchase Cost</h6>
                            <h5 className="mb-0">
                              {formatMoney(data.purchase_price || "-")}
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
                              {formatMoney(data.insurance_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Annual Auto Insurance Premium
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(data.annual_premium || "-")}
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
                              {formatMoney(data.reg_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Annual Registration Fee
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(data.annual_registration_fee || "-")}
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
                              {formatMoney(data.permit_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Annual Permit Fee
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(data.annual_permit_fee || "-")}
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
                              {formatMoney(data.maintenance_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">
                              Maintenance Per Year
                            </h6>
                            <h5 className="mb-0">
                              {formatMoney(data.maintenance_per_year || "-")}
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
                              {formatMoney(data.other_cost_per_day || "0")}
                            </h5>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                            <h6 className="text-uppercase">Other Per Year</h6>
                            <h5 className="mb-0">
                              {formatMoney(data.other_cost_per_year || "0")}
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
                      <span>
                        Supplies/Small Tools
                        {/*<aside>({this.state.supply.length})</aside>*/}
                      </span>
                    </div>
                  }
                  key="3"
                >
                  <div className="col-12">
                    <div className="row mb-4 new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                      <div className="search-bar-div d-flex align-items-center">
                        <Form className="position-relative">
                          <Input
                            onChange={(e) =>
                              this.fetchSupplyTools({ search: e.target.value })
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
                        {/*<Button className="add-btn-collapse ml-2 text-uppercase">Add</Button>*/}
                      </div>
                      <div className="d-flex align-items-center grid-system-div">
                        <ul className="mb-0 list-inline">
                          <li className="list-inline-item w-auto">
                            Total : {this.state.supply.length}
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
                          onClick={() => this.props.handleViewAll()}
                          className="view-all-btn text-uppercase"
                        >
                          VIEW ALL{" "}
                        </Button>
                      </div>
                    </div>
                    {this.state.supply.length > 0 ? (
                      !this.state.view ? (
                        <div className="row mx-0">
                          {this.state.supply.map((v, k) => (
                            <div key={k} className="col-12 col-sm-6">
                              <div
                                className="row mx-0 add-vehicles-main-row align-items-center position-relative"
                                onClick={() =>
                                  history.push(
                                    reverse(
                                      routes.dashboard.management.supply_tools
                                        .supply_tools.view,
                                      { id: v.id }
                                    )
                                  )
                                }
                              >
                                <div className="add-vehicles-img float-left">
                                  <img
                                    src={Images.supply_gear_icon_black}
                                    alt={""}
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="add-vehicles-content float-left">
                                  <h6>{v.name}</h6>
                                  <p className="mb-0">{data.name}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="col-12 table-responsive main-table-div">
                          <Table
                            className="main-table-all"
                            columns={this.supplyColumns}
                            dataSource={this.state.supply}
                            size="middle"
                            pagination={true}
                            onRow={(record) => {
                              return {
                                onClick: () => {
                                  if (record) {
                                    history.push(
                                      reverse(
                                        routes.dashboard.management.supply_tools
                                          .supply_tools.view,
                                        { id: record.id }
                                      )
                                    );
                                  }
                                },
                              };
                            }}
                          />
                        </div>
                      )
                    ) : (
                      <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                        <div
                          // onClick={() => history.push(routes.dashboard.management.supply_tools.supply_tools.create)}
                          className="col-12 text-center cursor-pointer"
                        >
                          <img
                            src={Images.line_items_empty_state_icon}
                            alt=""
                            className="img-fluid"
                          />
                          <h6 className="mb-0 text-gray-tag">
                            No Supplies/Small Tools
                          </h6>
                        </div>
                      </div>
                    )}
                    {/*<div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">*/}
                    {/*    <div className="col-12 text-center cursor-pointer">*/}
                    {/*        <img src={Images.line_items_gray_small} alt="" className="img-fluid"/>*/}
                    {/*        <h6 className="mb-0 text-green-tag">No Supplies/Small Tools</h6>*/}
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

export default connect(null, { setBreadcrumb })(withRouter(SupplySummary));

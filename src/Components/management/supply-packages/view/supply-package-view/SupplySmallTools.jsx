import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";
import { getSupply } from "../../../../../Controller/api/supplyServices";
import { routes } from "../../../../../Controller/Routes";
import { reverse } from "named-urls/src";
import { history } from "../../../../../Controller/history";
import { supplyTotalCostCalculation } from "../../../../../Controller/utils";

class SupplySmallTools extends Component {
  state = {
    supply: [],
    loading: false,
    view: false,
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
          <span>{location.name}</span>
        </div>
      ),

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
    this.fetchSupply();
  }

  fetchSupply = (params = {}) => {
    this.setState({ loading: true });
    params.supply_group = this.props.match.params.id;
    getSupply(params)
      .then((res) => {
        this.setState({ supply: res.data.results, loading: false });
        // console.log(res.data.results);
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };

  render() {
    let { supply, loading, view } = this.state;
    return (
      <React.Fragment>
        <div className="row mt-30 no-data-card-row-new">
          <div className="col-12">
            <div className="row mx-0 summary-collapse-inner-row-main pt-0">
              <div className="col-12">
                <div className="row mx-0 new-opportunity-header-row account-tabs-min summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ">
                  <div className="search-bar-div d-flex align-items-center">
                    <Form className="position-relative">
                      <Input
                        onChange={(e) =>
                          this.fetchSupply({ search: e.target.value })
                        }
                        placeholder="Search Supplies"
                      />
                      <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                        <img
                          src={Images.search_icon_gray}
                          className="img-fluid"
                          alt="search icon"
                        />
                      </Button>
                    </Form>
                    {/*<Button*/}
                    {/*    onClick={() => history.push(routes.dashboard.management.supply_tools.supply_tools.create)}*/}
                    {/*    className="add-btn-collapse ml-2 text-uppercase">Add</Button>*/}
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
                    {/*<Button className="view-all-btn text-uppercase">VIEW*/}
                    {/*    ALL </Button>*/}
                  </div>
                </div>
              </div>
            </div>
            {supply.length > 0 ? (
              !view ? (
                <div className="row mx-0 px-4 summary-collapse-inner-row-main">
                  {supply.map((v) => (
                    <div
                      className="col-12 col-sm-6"
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
                      <div className="row mx-0 add-vehicles-main-row align-items-center position-relative">
                        <div className="add-vehicles-img float-left">
                          <img
                            src={Images.supply_gear_icon_black}
                            alt={""}
                            className="img-fluid"
                          />
                        </div>
                        <div className="add-vehicles-content float-left">
                          <h6>{v.name}</h6>
                          <p className="mb-0">{supply.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row mx-0 px-5">
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
                </div>
              )
            ) : (
              <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                <div
                  // onClick={() => history.push(routes.dashboard.management.supply_tools.supply_tools.create)}
                  className="col-12 text-center"
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SupplySmallTools);

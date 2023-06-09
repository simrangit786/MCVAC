import React, { Component } from "react";
import { Button, Form, Input, Table } from "antd";
import { Image as Images } from "../../../../../Images";
import { getVehicle } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import { withRouter } from "react-router-dom";
import { history } from "../../../../../../Controller/history";
import { routes } from "../../../../../../Controller/Routes";
import AddVehicles from "../../../../../drawers/vehicles/AddVehicles";
import { reverse } from "named-urls/src";

class VehiclesView extends Component {
  state = {
    vehicle: [],
    loading: false,
    visible: false,
    view: false,
  };

  vehicleColumns = [
    {
      title: "VEHICLE ID",
      dataIndex: "id",
      sorter: true,
    },
    {
      title: "VEHICLE NAME",
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
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "VEHICLE GROUP",
      dataIndex: "fleet_group",
      sorter: true,
      render: (fleet) => (
        <div className="d-flex align-items-center">
          <span>{fleet.name}</span>
        </div>
      ),
    },
  ];
  showAddVehicles = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  componentDidMount() {
    this.fetchVehicle();
  }

  fetchVehicle = (params = {}) => {
    this.setState({ loading: true });
    params.fleet_group = this.props.match.params.id;
    getVehicle(params)
      .then((res) => {
        this.setState({ vehicle: res.data.results, loading: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ loading: false });
      });
  };

  render() {
    let { vehicle, loading } = this.state;
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
                          this.fetchVehicle({ search: e.target.value })
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
                    <Button
                      onClick={() => this.showAddVehicles(true)}
                      className="add-btn-collapse ml-2 text-uppercase"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="d-flex align-items-center grid-system-div">
                    <ul className="mb-0 list-inline">
                      <li className="list-inline-item w-auto">
                        Total : {this.state.vehicle.length}
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
            {vehicle.length > 0 ? (
              !this.state.view ? (
                <div className="row mx-0 px-5  summary-collapse-inner-row-main">
                  {vehicle.map((v, index) => (
                    <div
                      key={index}
                      className="col-12 col-sm-6"
                      onClick={() =>
                        history.push(
                          reverse(
                            routes.dashboard.management.fleet.vehicle.view,
                            { id: v.id }
                          )
                        )
                      }
                    >
                      <div
                        style={{ minHeight: "85px", height: "85px" }}
                        className="row mx-0 add-vehicles-main-row align-items-center position-relative"
                      >
                        <div className="add-vehicles-img float-left">
                          <img
                            src={Images.truck_icon_black}
                            alt={""}
                            className="img-fluid"
                          />
                        </div>
                        <div className="add-vehicles-content float-left">
                          <h6>{v.name}</h6>
                          <p className="mb-0 text-capitalize">
                            {v.status.toLowerCase()}
                          </p>
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
                      columns={this.vehicleColumns}
                      dataSource={this.state.vehicle}
                      size="middle"
                      pagination={true}
                      onRow={(record) => {
                        return {
                          onClick: () => {
                            if (record) {
                              history.push(
                                reverse(
                                  routes.dashboard.management.fleet.vehicle
                                    .view,
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
              <div className="row mx-0 bg-transparent border-0 mt-3 no-data-card-row align-items-center justify-content-center">
                <div
                  // onClick={() =>
                  //   history.push(
                  //     routes.dashboard.management.fleet.vehicle.create
                  //   )
                  // }
                  className="col-12 text-center"
                >
                  <img src={Images.Truck_empty_state_icon} alt="" className="img-fluid" />
                  <h6 className="mb-0">
                    No Vehicles
                  </h6>
                </div>
              </div>
            )}
            <AddVehicles
              visible={this.state.visible}
              onClose={() => this.showAddVehicles(false)}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(VehiclesView);

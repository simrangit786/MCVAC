import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../../../Images";
import { getVehicle } from "../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";
import { history } from "../../../../../Controller/history";
import { routes } from "../../../../../Controller/Routes";
import { reverse } from "named-urls/dist/index.es";

class VendorsView extends Component {
  state = {
    vehicle: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchVehicle();
  }

  fetchVehicle = (params = {}) => {
    this.setState({ loading: true });
    params.vehicle_package_item = this.props.match.params.id;
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
        <div className="row mx-0">
          <div className="col-12">
            <div className="opportunity_info-collapse account-summary-header d-flex align-items-center justify-content-between">
              <span>Vendors</span>
              <Button
                className="edit-btn-summary"
                onClick={() =>
                  history.push({
                    pathname: reverse(
                      routes.dashboard.management.inventory.inventory_items
                        .edit,
                      { id: this.props.match.params.id }
                    ),
                    editTab: "6",
                  })
                }
              >
                <img src={Images.pencil_green} alt="" className="img-fluid" />
                Edit
              </Button>
            </div>
          </div>
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
                  // onClick={() => history.push(routes.dashboard.management.fleet.vehicle.create)}
                  className="add-btn-collapse ml-2 text-uppercase"
                >
                  Add
                </Button>
              </div>
              {/*<Button className="view-all-btn text-uppercase">VIEW*/}
              {/*    ALL </Button>*/}
            </div>
          </div>
        </div>
        {vehicle.length > 0 ? (
          <div className="row mx-0 summary-collapse-inner-row-main">
            {vehicle.map((v, index) => {
              return (
                <div key={index} className="col-12 col-sm-6">
                  <div className="row mx-0 add-vehicles-main-row align-items-center position-relative">
                    <div className="add-vehicles-img float-left">
                      <img
                        src={Images.truck_icon_black}
                        alt={""}
                        className="img-fluid"
                      />
                    </div>
                    <div className="add-vehicles-content float-left">
                      <h6>{v.vehicle_id}</h6>
                      <p className="mb-0 text-capitalize">
                        {v.status.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
            <div
              onClick={() =>
                history.push(
                  routes.dashboard.management.inventory.inventory_items.create
                )
              }
              className="col-12 text-center cursor-pointer"
            >
              <img src={Images.truck_icon_plus} alt="" className="img-fluid" />
              <h6 className="mb-0 text-gray-tag">Add Vendors</h6>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(VendorsView);

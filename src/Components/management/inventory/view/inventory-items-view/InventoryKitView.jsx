import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image, Image as Images } from "../../../../Images";
import { getVehicle } from "../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";
import { getInventoryKit } from "../../../../../Controller/api/inventoryServices";

class InventoryKitView extends Component {
  state = {
    kits: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchVehicle();
  }

  fetchVehicle = (params = {}) => {
    this.setState({ loading: true });
    params.item = this.props.match.params.id;
    getInventoryKit(params)
      .then((res) => {
        this.setState({ kits: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="col-12">
          <div
            className={`row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
              this.props.editBtn ? "design-update-bar" : ""
            }`}
          >
            <div className="search-bar-div d-flex align-items-center">
              <Form className="position-relative">
                <Input
                  placeholder="Search"
                  onChange={(e) =>
                    this.fetchVehicle({ search: e.target.value })
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
            <ul className="mb-0 d-flex align-items-center list-inline">
              <li className="list-inline-item">
                {!this.props.editBtn && (
                  <Button
                    className="view-all-btn text-uppercase"
                    onClick={() => this.props.tabChange("5")}
                  >
                    VIEW ALL{" "}
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12">
          <div
            className={`row mt-4 ${
              this.props.editBtn ? "no-data-card-row-new" : ""
            }`}
          >
            {this.state.kits.length == 0 ? (
              <div className="col-12 mb-3">
                <div
                  className="no-data-wrapper row d-flex"
                  style={{ alignItems: "center" }}
                >
                  <div className="col-12">
                    <img className="img-fluid" src={Image.inventory_empty} alt="No Data" />
                    <h6 className="color-gray-3">No Inventory Kit</h6>
                  </div>
                </div>
              </div>
            ) : (
              this.state.kits.map((kit) => (
                <div className="col-12 col-sm-6">
                  <div className="row mx-0 add-vehicles-main-row align-items-center position-relative">
                    <div className="add-vehicles-img float-left">
                      <img
                        src={Images.inventory_set_box_icons_green}
                        alt={""}
                        className="img-fluid"
                      />
                    </div>
                    <div className="add-vehicles-content d-flex align-items-center justify-content-between float-left">
                      <div>
                        <h6>{kit.name}</h6>
                        <p className="mb-0 text-capitalize"> QTY: {kit.qty || 1}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(InventoryKitView);

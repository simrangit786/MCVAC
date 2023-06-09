import React, { Component } from "react";
import { Image as Images } from "../Images";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../Store/actions/breadcrumbAction";

class Management extends Component {
  changeUrl = (url) => {
    history.push(url);
  };

  componentDidMount() {
    let arr = [
      {
        title: "Management",
        url: routes.dashboard.management.self,
      },
    ];
    this.props.setBreadcrumb(arr);
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-content-div">
          <div className="row mt-4 mx-0 opportunities-table-main-dashboard">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 cursor-pointer">
                  <div className="shade-card-main-div row mx-0">
                    <div
                      className="col-12 p-0"
                      onClick={() =>
                        this.changeUrl(routes.dashboard.management.service.self)
                      }
                    >
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.lineItem}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Services</h5>
                            <h6 className="mb-0">
                              Service Families, Services, and Service Variants
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 cursor-pointer">
                  <div className="shade-card-main-div row mx-0">
                    <div
                      className="col-12 p-0"
                      onClick={() =>
                        this.changeUrl(routes.dashboard.management.labor.self)
                      }
                    >
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.Labor}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Labor</h5>
                            <h6 className="mb-0">Labor Groups and Employees</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 cursor-pointer">
                  <div className="shade-card-main-div mx-0 row">
                    <div
                      className="col-12 p-0"
                      onClick={() =>
                        this.changeUrl(routes.dashboard.management.fleet.self)
                      }
                    >
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.Fleet}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Fleet</h5>
                            <h6 className="mb-0">
                              Fleet Families, Fleet Groups, and Vehicles
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 cursor-pointer">
                  <div className="shade-card-main-div row mx-0">
                    <div
                      className="col-12 p-0"
                      onClick={() =>
                        this.changeUrl(
                          routes.dashboard.management.supply_tools.self
                        )
                      }
                    >
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.Equipment}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Supplies/Small Tools</h5>
                            <h6 className="mb-0">
                              Supply Families, Supply Groups, and Supplies/Small Tools
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 cursor-pointer">
                  <div className="shade-card-main-div row mx-0">
                    <div
                      className="col-12 p-0"
                      onClick={() =>
                        this.changeUrl(
                          routes.dashboard.management.inventory.self
                        )
                      }
                    >
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img src={Images.Supplies} className="img-fluid" />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Inventory</h5>
                            <h6 className="mb-0">
                            Inventory and Disposal Inventory Families, Inventory, Disposal
                            Inventory, and Inventory Kits
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 cursor-pointer">
                  <div className="shade-card-main-div row mx-0">
                    <div
                      className="col-12 p-0"
                      onClick={() =>
                        this.changeUrl(
                          routes.dashboard.management.disposal.self
                        )
                      }
                    >
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.disposal_sidebar}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Disposal</h5>
                            <h6 className="mb-0">
                              Disposal Families and Disposal
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(Management);

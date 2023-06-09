import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import { Image as Images } from "../../../../../Images";
import { withRouter } from "react-router-dom";

class FleetKitsItemsView extends Component {
  state = {
    items: [],
  };



  render() {
    const { fleetData } = this.props;
    return (
      <React.Fragment>
        <div
          className={`row mx-0 ${
            this.props.editBtn ? "custom-summary no-data-card-row-new" : ""
          }`}
        >
          <div className="col-12">
            <div
              className={`row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
                this.props.editBtn ? "design-update-bar" : ""
              }`}
            >
              <div className="search-bar-div d-flex align-items-center">
                <Form className="position-relative">
                  <Input
                    // onChange={(e) => this.fetchKits({ search: e.target.value })}
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
              </div>
              <ul className="mb-0 list-inline">
                <li className="list-inline-item">
                  {this.props.editBtn ? null : (
                    <Button
                      className="view-all-btn text-uppercase"
                      onClick={this.props.onTabChange}
                    >
                      VIEW ALL{" "}
                    </Button>
                  )}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 pb-3">
             <div className="col-12">
                    {fleetData ? (
                      <div className="col-12 fleet-kit-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>TYPE</th>
                              <th>Name / Info</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Fleet Kit</td>
                              <td>
                                {/* Vac Truck Kit */}
                                {fleetData?.name}
                                {/* <Dropdown
                                  className="custoom-dropdown"
                                  overlay={" "}
                                  trigger={["click"]}
                                >
                                  <a onClick={(e) => e.preventDefault()}>
                                    <img
                                      src={Images.black_dots_elipsis}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </a>
                                </Dropdown> */}
                              </td>
                            </tr>
                            {fleetData?.fleet_group && fleetData?.fleet_group.map((i) => {
                              return (
                                <tr>
                                  <td>Fleet Group </td>
                                  <td className="position-relative">
                                    <span className='rectangle-icon-div rectangle-icon-update position-absolute'>
                                        <img src={Images.rectangle_gray_icon} alt={''} className='img-fluid'/>
                                    </span>
                                    <div className="branch-tree-div">
                                      {i.name}
                                    </div>
                                    {/* <Dropdown
                                      className="custoom-dropdown"
                                      overlay={" "}
                                      trigger={["click"]}
                                    >
                                      <a onClick={(e) => e.preventDefault()}>
                                        <img
                                          src={Images.black_dots_elipsis}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </a>
                                    </Dropdown> */}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="col-12 mt-3">
                        <div className="row no-data-card-row align-items-center justify-content-center">
                          <img
                            src={Images.truck_empty}
                            alt={""}
                            className="img-fluid"
                          />
                          <h6 className="mb-0">No Fleet Group</h6>
                        </div>
                      </div>
                    )}
                  </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(FleetKitsItemsView);

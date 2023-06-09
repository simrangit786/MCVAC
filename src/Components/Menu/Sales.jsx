import React, { Component } from "react";
import { Image as Images } from "../Images";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../Store/actions/breadcrumbAction";

class Sales extends Component {
  componentDidMount() {
    let arr = [
      {
        title: "Sales",
        url: routes.dashboard.sales.self,
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
                <div
                  onClick={() =>
                    history.push(routes.dashboard.opportunities.self)
                  }
                  className="col-12 col-sm-12 col-md-6 cursor-pointer"
                >
                  <div className="shade-card-main-div mx-0 row">
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.Opportunities}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Opportunities</h5>
                            <h6 className="mb-0">Potential Jobs/Services</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() =>
                    history.push(routes.dashboard.sales.proposal.self)
                  }
                  className="col-12 col-sm-12 col-md-6 cursor-pointer"
                >
                  <div className="shade-card-main-div row mx-0">
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.Proposals}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Proposals</h5>
                            <h6 className="mb-0">Proposed Jobs/Services</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() =>
                    history.push(routes.dashboard.sales.price_lookup.self)
                  }
                  className="col-12 col-sm-12 col-md-6 cursor-pointer"
                >
                  <div className="shade-card-main-div row mx-0">
                    <div className="col-12 p-0">
                      <div className="shade-img-section float-left d-flex align-items-center justify-content-center">
                        <img
                          src={Images.price_lookup}
                          alt={""}
                          className="img-fluid"
                        />
                      </div>
                      <div className="card-content-section float-left">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="mb-0">Price Lookup</h5>
                            <h6 className="mb-0">Lookup Service Variants’ Prices</h6>
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

export default connect(null, { setBreadcrumb })(Sales);

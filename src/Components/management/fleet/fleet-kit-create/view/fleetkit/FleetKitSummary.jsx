import React, { Component } from "react";
import { Button, Collapse, Form, Input, Select, Spin } from "antd";
import { Image as Images } from "../../../../../Images";
// import {CaretRightOutlined} from "@ant-design/icons";
// import {getVehicleById} from "../../../../../Controller/api/vehicleServices";
// import {handleError} from "../../../../../Controller/Global";
import { withRouter } from "react-router-dom";
import { history } from "../../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../../Controller/Routes";
import { connect } from "react-redux";
import { setBreadcrumb } from "../../../../../../Store/actions/breadcrumbAction";
import { getFleetKitById } from "../../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../../Controller/Global";
import FleetKitsItemsView from "./FleetKitsItemsView";
// import {formatMoney, formatPhone} from "../../../../../Controller/utils";
// import VehicleDocs from "./VehicleDocs";

const { Panel } = Collapse;
const { Option, OptGroup } = Select;

class FleetKitSummary extends Component {
  state = {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 15,
    },
    visible: false,
    vehicle: null,
  };
  showAddVehicles = (visible) => {
    this.setState({
      visible: visible,
    });
  };

  // componentDidMount() {
  //   if (this.props.match.params.id) {
  //     getFleetKitById(this.props.match.params.id)
  //       .then((res) => {
  //         this.setState({ fleetData: res.data });
  //         let arrVehicle = [
  //           {
  //             title: "Fleet kit",
  //             url: routes.dashboard.management.fleet.self,
  //           },
  //           // {
  //           //     title: "Vehicles",
  //           //     url: routes.dashboard.management.fleet.self,
  //           // },
  //           // {
  //           //     title: res.data.name,
  //           //     url: "#",
  //           // },
  //         ];
  //         this.props.setBreadcrumb(arrVehicle);
  //       })
  //       .catch((err) => {
  //         handleError(err);
  //       });
  //   }
  // }

  render() {
    const { fleetData } = this.props;
    return (
      <React.Fragment>
        <div className="col-12 mt-30">
          <div className="row mx-0 summary-info-inner-row">
            <div className="col-12">
              <Collapse
              defaultActiveKey={["1"]}
              >
                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>
                        General Information <sup>*</sup>
                      </span>
                      <Button
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.management.fleet.kit.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "1",
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
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <h6 className="text-uppercase">Fleet kit name<sup>*</sup></h6>
                          {/* <h5 className="mb-0">{vehicle?.status || "-"}</h5> */}
                          <h5 className="mb-0">{this.props.fleetData?.name}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel
                  header={
                    <div className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                      <span>Fleet Group</span>
                      <Button
                        // }
                        onClick={() =>
                          history.push({
                            pathname: reverse(
                              routes.dashboard.management.fleet.kit.edit,
                              { id: this.props.match.params.id }
                            ),
                            editTab: "2",
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
                  <FleetKitsItemsView fleetData = {this.props.fleetData}/>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, { setBreadcrumb })(withRouter(FleetKitSummary));
